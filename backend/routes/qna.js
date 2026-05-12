// routes/qna.js - AI Q&A Question Generation
// Generates open-ended questions for written answers

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { requireAuth, attachUserId } = require('../middleware/auth');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mainModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Helper: safely extract JSON object from an AI text response
function parseAssistantJson(rawText) {
  if (typeof rawText !== 'string') {
    throw new Error('No response text to parse');
  }

  const firstBrace = rawText.indexOf('{');
  if (firstBrace === -1) {
    throw new Error('No JSON object found in AI response');
  }

  let depth = 0;
  let endIndex = -1;
  for (let i = firstBrace; i < rawText.length; i++) {
    if (rawText[i] === '{') depth++;
    if (rawText[i] === '}') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    throw new Error('Could not locate matching closing brace for JSON');
  }

  const candidate = rawText.slice(firstBrace, endIndex + 1);
  return JSON.parse(candidate);
}

// ─── POST /api/qna ───
// Generates open-ended Q&A questions
router.post('/', requireAuth, attachUserId, async (req, res) => {
  try {
    const { content, topic, num_questions = 5 } = req.body;
    
    if (!content && !topic) {
      return res.status(400).json({ error: 'Please provide content or a topic' });
    }
    
    const questionCount = Math.min(parseInt(num_questions) || 5, 8);
    
    const prompt = `You are an expert teacher creating a written Q&A test.

${content ? `Study Content:\n${content.substring(0, 3000)}` : `Topic: ${topic}`}

Create exactly ${questionCount} open-ended questions based on the above.

IMPORTANT: Respond ONLY with valid JSON, no extra text or markdown.

{
  "topic": "${topic || 'Q&A Test'}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "model_answer": "A comprehensive model answer that would get full marks",
      "key_points": ["key point 1", "key point 2", "key point 3"],
      "difficulty": "easy|medium|hard"
    }
  ]
}

Rules:
- Questions should require thoughtful written answers (not yes/no)
- Model answers should be 2-4 sentences
- Include 2-4 key points per question
- Questions should test understanding, not just memorization`;

    const result = await mainModel.generateContent(prompt);
    const rawContent = result.response.text();
    if (!rawContent) {
      console.error('QnA generation error: empty AI response', response);
      return res.status(500).json({ error: 'AI returned empty result. Please try again.' });
    }

    let qnaData;
    try {
      qnaData = parseAssistantJson(rawContent);
    } catch (parseError) {
      console.error('QnA JSON parse error:', parseError.message, 'rawResponse:', rawContent);
      return res.status(500).json({ error: 'AI returned invalid format. Please try again.' });
    }

    if (!qnaData.questions || !Array.isArray(qnaData.questions)) {
      console.error('QnA format invalid:', qnaData);
      return res.status(500).json({ error: 'Invalid Q&A format received' });
    }
    
    res.json({
      success: true,
      topic: qnaData.topic || topic || 'Q&A Test',
      questions: qnaData.questions,
      total: qnaData.questions.length
    });
    
  } catch (error) {
    console.error('QnA generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate Q&A' });
  }
});

module.exports = router;
