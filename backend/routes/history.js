// routes/history.js - Test History
// Fetches past test attempts for the logged-in user

const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, attachUserId } = require('../middleware/auth');

// ─── GET /api/history ───
// Returns all past tests for the current user
router.get('/', requireAuth, attachUserId, async (req, res) => {
  try {
    // Get all tests for this user, newest first
    const [tests] = await db.execute(
      `SELECT id, subject, test_type, score, total_questions, date 
       FROM tests 
       WHERE user_id = ? 
       ORDER BY date DESC 
       LIMIT 50`, // Limit to last 50 tests
      [req.userId]
    );
    
    res.json({
      success: true,
      history: tests,
      total: tests.length
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ─── GET /api/history/:testId ───
// Returns detailed results for a specific test
router.get('/:testId', requireAuth, attachUserId, async (req, res) => {
  try {
    const { testId } = req.params;
    
    // Get test details (verify it belongs to this user)
    const [tests] = await db.execute(
      'SELECT * FROM tests WHERE id = ? AND user_id = ?',
      [testId, req.userId]
    );
    
    if (tests.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    // Get questions for this test
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE test_id = ?',
      [testId]
    );
    
    res.json({
      success: true,
      test: tests[0],
      questions
    });
    
  } catch (error) {
    console.error('Test detail error:', error);
    res.status(500).json({ error: 'Failed to fetch test details' });
  }
});

// ─── GET /api/history/stats/summary ───
// Returns stats: total tests, average score, improvement trend
router.get('/stats/summary', requireAuth, attachUserId, async (req, res) => {
  try {
    const [stats] = await db.execute(
      `SELECT 
        COUNT(*) as total_tests,
        AVG(score) as avg_score,
        MAX(score) as best_score,
        MIN(score) as lowest_score,
        SUM(total_questions) as total_questions_answered
       FROM tests 
       WHERE user_id = ?`,
      [req.userId]
    );
    
    // Get recent 5 scores for trend chart
    const [recentScores] = await db.execute(
      `SELECT subject, score, date 
       FROM tests 
       WHERE user_id = ? 
       ORDER BY date DESC 
       LIMIT 5`,
      [req.userId]
    );
    
    res.json({
      success: true,
      stats: stats[0],
      recent_scores: recentScores.reverse() // Oldest to newest for chart
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
