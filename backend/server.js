// server.js - Main Express Server
// Entry point for the backend API

require('dotenv').config({ path: __dirname + '/.env' }); // Load .env variables from current directory
require('express-async-errors'); // Auto-catch async errors

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
// CORS: Allow requests from the React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true // Allow cookies/auth headers
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/summary', require('./routes/summary'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/qna', require('./routes/qna'));
app.use('/api/evaluate', require('./routes/evaluate'));
app.use('/api/history', require('./routes/history'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Study Planner API is running',
    timestamp: new Date().toISOString()
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  // Handle Clerk auth errors
  if (err.status === 401 || err.message === 'Unauthorized') {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  
  // Handle Multer file errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  
  // Generic error
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong on the server' 
  });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `The requested path ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/summary',
      'POST /api/quiz', 
      'POST /api/qna',
      'POST /api/evaluate',
      'GET /api/history'
    ]
  });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 AI Study Planner Backend          ║
  ║   Running on http://localhost:${PORT}    ║
  ╚════════════════════════════════════════╝
  `);
  console.log('📚 Routes:');
  console.log('  POST /api/summary   - Generate AI summary');
  console.log('  POST /api/quiz      - Generate MCQ quiz');
  console.log('  POST /api/qna       - Generate Q&A test');
  console.log('  POST /api/evaluate  - Evaluate answers');
  console.log('  GET  /api/history   - Get test history');
  console.log('  GET  /api/health    - Health check\n');
});

module.exports = app;
