// routes/evaluate.js - AI Answer Evaluation & Scoring
// Evaluates user answers and generates feedback + recommendations

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');
const { requireAuth, attachUserId } = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mainModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// ─── Helper: Evaluate MCQ (simple comparison) ───
function evaluateMCQ(questions, userAnswers) {
  let correct = 0;
  const results = questions.map((q, index) => {
    const userAns = userAnswers[index] || '';
    const isCorrect = userAns.trim().toLowerCase() === q.answer.trim().toLowerCase();
    if (isCorrect) correct++;
    return {
      question: q.question,
      user_answer: userAns,
      correct_answer: q.answer,
      is_correct: isCorrect,
      explanation: q.explanation || ''
    };
  });

  return { results, correct, total: questions.length };
}

// ─── Helper: Evaluate QnA with AI ───
async function evaluateQnA(questions, userAnswers) {
  // Build evaluation prompt for all answers at once (efficient)
  const evaluationPairs = questions.map((q, i) => ({
    question: q.question,
    model_answer: q.model_answer,
    key_points: q.key_points || [],
    user_answer: userAnswers[i] || '(no answer provided)'
  }));

  const prompt = `You are a strict but fair teacher evaluating student answers.

Evaluate these ${questions.length} Q&A responses:

${JSON.stringify(evaluationPairs, null, 2)}

For each answer, evaluate on a scale of 0-10 based on:
- Accuracy (covers correct information)
- Completeness (addresses key points)
- Understanding (shows comprehension)

IMPORTANT: Respond ONLY with valid JSON.

{
  "evaluations": [
    {
      "question_index": 0,
      "score": 7,
      "feedback": "Good answer, but missed the point about...",
      "is_correct": true
    }
  ],
  "total_score": 35,
  "max_score": ${questions.length * 10},
  "overall_feedback": "Overall performance feedback here",
  "weak_areas": ["topic 1", "topic 2"],
  "improvement_tips": ["tip 1", "tip 2", "tip 3"]
}`;

  const result = await mainModel.generateContent(prompt);
  const rawContent = result.response.text();
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
}

// ─── POST /api/evaluate ───
// Main evaluation endpoint
router.post('/', requireAuth, attachUserId, async (req, res) => {
  try {
    const { test_type, topic, questions, user_answers } = req.body;

    if (!questions || !user_answers || !test_type) {
      return res.status(400).json({ error: 'Missing required fields: test_type, questions, user_answers' });
    }

    let evaluationResult;
    let score;
    let totalQuestions = questions.length;

    if (test_type === 'mcq') {
      // MCQ: direct comparison
      const { results, correct, total } = evaluateMCQ(questions, user_answers);
      score = (correct / total) * 100;

      // Get AI recommendations for MCQ too
      const weakTopics = results.filter(r => !r.is_correct).map(r => r.question);

      let recommendations = { weak_areas: [], improvement_tips: [] };
      if (weakTopics.length > 0) {
        const recPrompt = `Student got these MCQ questions wrong: ${JSON.stringify(weakTopics)}
        Topic: ${topic}
        
        Respond ONLY with JSON:
        {
          "weak_areas": ["area 1", "area 2"],
          "improvement_tips": ["tip 1", "tip 2", "tip 3"],
          "overall_feedback": "Encouragement and advice"
        }`;


        const recResult = await mainModel.generateContent(recPrompt);
        const recRawContent = recResult.response.text();
        const recJsonMatch = recRawContent.match(/\{[\s\S]*\}/);
        const recJson = recJsonMatch ? recJsonMatch[0] : recRawContent;
        recommendations = JSON.parse(recJson);
      }

      evaluationResult = {
        results,
        score: Math.round(score),
        correct,
        total,
        percentage: Math.round(score),
        ...recommendations
      };

    } else if (test_type === 'qna') {
      // QnA: AI evaluation
      const aiEval = await evaluateQnA(questions, user_answers);

      // Map evaluations back to questions
      const results = questions.map((q, i) => {
        const eval_item = aiEval.evaluations?.find(e => e.question_index === i) || {};
        return {
          question: q.question,
          user_answer: user_answers[i] || '',
          correct_answer: q.model_answer,
          score: eval_item.score || 0,
          feedback: eval_item.feedback || '',
          is_correct: (eval_item.score || 0) >= 6 // 6+ out of 10 = correct
        };
      });

      score = ((aiEval.total_score || 0) / (aiEval.max_score || totalQuestions * 10)) * 100;

      evaluationResult = {
        results,
        score: Math.round(score),
        total_score: aiEval.total_score || 0,
        max_score: aiEval.max_score || totalQuestions * 10,
        percentage: Math.round(score),
        overall_feedback: aiEval.overall_feedback || '',
        weak_areas: aiEval.weak_areas || [],
        improvement_tips: aiEval.improvement_tips || []
      };
    }

    // Save test result to database
    const [testResult] = await db.execute(
      'INSERT INTO tests (user_id, subject, test_type, score, total_questions) VALUES (?, ?, ?, ?, ?)',
      [req.userId, topic || 'General', test_type, evaluationResult.score, totalQuestions]
    );

    const testId = testResult.insertId;

    // Save individual questions to database
    if (evaluationResult.results && evaluationResult.results.length > 0) {
      for (const r of evaluationResult.results) {
        await db.execute(
          'INSERT INTO questions (test_id, question_text, correct_answer, user_answer, is_correct) VALUES (?, ?, ?, ?, ?)',
          [testId, r.question, r.correct_answer, r.user_answer, r.is_correct ? 1 : 0]
        );
      }
    }

    res.json({
      success: true,
      test_id: testId,
      ...evaluationResult
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate answers' });
  }
});

module.exports = router;



