// routes/summary.js - AI Notes Summary Generation
// Handles: image OCR, PDF text extraction, plain text, YouTube mock

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');
const { requireAuth, attachUserId } = require('../middleware/auth');

// Configure Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mainModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Configure Multer for file uploads (stores in /uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename to avoid conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

// ─── Helper: Extract text from image using Tesseract OCR ───
async function extractTextFromImage(filePath) {
  console.log('🔍 Running OCR on image...');
  const result = await Tesseract.recognize(filePath, 'eng', {
    logger: m => {
      if (m.status === 'recognizing text') {
        process.stdout.write(`\rOCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    }
  });
  console.log('\n✅ OCR complete');
  return result.data.text;
}

// ─── Helper: Extract text from PDF ───
async function extractTextFromPDF(filePath) {
  console.log('📄 Extracting text from PDF...');
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// ─── Helper: Mock YouTube transcript extraction ───
// In a real app, you'd use youtube-transcript package or YouTube API
function extractYouTubeTranscript(url) {
  // Mock implementation - returns a placeholder
  // To implement real: use 'youtube-transcript' npm package
  return `[YouTube Transcript Mock for: ${url}]
  
  This is a mock transcript. In production, integrate with:
  1. youtube-transcript npm package
  2. YouTube Data API v3
  
  The video appears to discuss educational content that would be
  summarized here. Replace this with actual transcript extraction
  using: npm install youtube-transcript
  
  Then use: const { YoutubeTranscript } = require('youtube-transcript');
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);`;
}

// ─── Helper: Generate AI Summary ───
async function generateSummary(text, topic = 'Study Notes') {
  const prompt = `You are an expert study assistant. Analyze the following study notes and create a comprehensive summary.

Topic: ${topic}

Content:
${text.substring(0, 4000)} // Limit to avoid token overflow

Please provide your response in the following JSON format:
{
  "summary": ["bullet point 1", "bullet point 2", "bullet point 3", ...],
  "revision_points": ["key point 1", "key point 2", ...],
  "key_concepts": ["concept 1", "concept 2", ...],
  "estimated_read_time": "X minutes"
}

Make the summary clear, concise, and student-friendly. Extract the most important information.`;

  const result = await mainModel.generateContent(prompt);
  const content = result.response.text();
  
  // Parse JSON response - handle cases where AI adds extra text
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      summary: [content],
      revision_points: ['See summary above'],
      key_concepts: [],
      estimated_read_time: '5 minutes'
    };
  }
}

// ─── POST /api/summary ───
// Main endpoint: accepts file upload or text, returns AI summary
router.post('/', requireAuth, attachUserId, upload.single('file'), async (req, res) => {
  try {
    let extractedText = '';
    const { text, youtube_url, topic } = req.body;
    
    // Determine input source and extract text
    if (req.file) {
      const filePath = req.file.path;
      const mimeType = req.file.mimetype;
      
      if (mimeType.startsWith('image/')) {
        // Image: use Tesseract OCR
        extractedText = await extractTextFromImage(filePath);
      } else if (mimeType === 'application/pdf') {
        // PDF: use pdf-parse
        extractedText = await extractTextFromPDF(filePath);
      }
      
      // Clean up uploaded file after processing
      fs.unlinkSync(filePath);
      
    } else if (youtube_url) {
      // YouTube: mock transcript extraction
      extractedText = extractYouTubeTranscript(youtube_url);
      
    } else if (text) {
      // Plain text: use directly
      extractedText = text;
      
    } else {
      return res.status(400).json({ error: 'Please provide a file, text, or YouTube URL' });
    }
    
    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ error: 'Could not extract enough text. Please try a different input.' });
    }
    
    // Generate AI summary
    const summaryData = await generateSummary(extractedText, topic || 'Study Notes');
    
    // Save to database
    const [result] = await db.execute(
      'INSERT INTO summaries (user_id, topic, original_text, summary, revision_points) VALUES (?, ?, ?, ?, ?)',
      [
        req.userId,
        topic || 'Untitled',
        extractedText.substring(0, 5000), // Store first 5000 chars
        JSON.stringify(summaryData.summary),
        JSON.stringify(summaryData.revision_points)
      ]
    );
    
    res.json({
      success: true,
      summary_id: result.insertId,
      extracted_text: extractedText.substring(0, 500) + '...', // Preview
      ...summaryData
    });
    
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate summary' });
  }
});

module.exports = router;
