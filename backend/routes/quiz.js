// routes/quiz.js - AI MCQ Question Generation
// Generates multiple choice questions from study content

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

// ─── POST /api/quiz ───
// Generates MCQ questions from provided content/topic
router.post('/', requireAuth, attachUserId, async (req, res) => {
  try {
    const { content, topic, num_questions = 5 } = req.body;
    
    if (!content && !topic) {
      return res.status(400).json({ error: 'Please provide content or a topic' });
    }
    
    // Cap at 10 questions max to avoid token overflow
    const questionCount = Math.min(parseInt(num_questions) || 5, 10);
    
    const prompt = `You are an expert teacher creating a multiple choice quiz.
    
${content ? `Study Content:\n${content.substring(0, 3000)}` : `Topic: ${topic}`}

Create exactly ${questionCount} multiple choice questions based on the above.

IMPORTANT: Respond ONLY with valid JSON, no extra text or markdown.

{
  "topic": "${topic || 'Study Quiz'}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Brief explanation why this is correct"
    }
  ]
}

Rules:
- Each question must have exactly 4 options
- The "answer" field must exactly match one of the options
- Questions should be clear and unambiguous
- Mix easy, medium, and hard questions
- Cover different aspects of the content`;

    const result = await mainModel.generateContent(prompt);
    const rawContent = result.response.text();
    if (!rawContent) {
      console.error('Quiz generation error: empty AI response', response);
      return res.status(500).json({ error: 'AI returned empty result. Please try again.' });
    }

    // Parse the JSON response
    let quizData;
    try {
      quizData = parseAssistantJson(rawContent);
    } catch (parseError) {
      console.error('Quiz JSON parse error:', parseError.message, 'rawResponse:', rawContent);
      return res.status(500).json({ error: 'AI returned invalid format. Please try again.' });
    }
    
    // Validate structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return res.status(500).json({ error: 'Invalid quiz format received' });
    }
    
    res.json({
      success: true,
      topic: quizData.topic || topic || 'Quiz',
      questions: quizData.questions,
      total: quizData.questions.length
    });
    
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

module.exports = router;
