-- ============================================
-- AI Study Planner - Database Schema
-- Run this in your MySQL client to set up the DB
-- ============================================

CREATE DATABASE IF NOT EXISTS ai_study_planner;
USE ai_study_planner;

-- Tests table: stores each quiz/qna attempt
CREATE TABLE IF NOT EXISTS tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,         -- Clerk user ID
  subject VARCHAR(255) NOT NULL,          -- Topic/subject of the test
  test_type ENUM('mcq', 'qna') NOT NULL, -- Type of test
  score DECIMAL(5,2) DEFAULT 0,          -- Score achieved
  total_questions INT DEFAULT 0,          -- Total questions in test
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table: stores individual questions per test
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,                   -- Links to tests table
  question_text TEXT NOT NULL,            -- The question
  correct_answer TEXT NOT NULL,           -- Correct answer
  user_answer TEXT,                       -- What the user answered
  is_correct BOOLEAN DEFAULT FALSE,       -- Was the answer correct?
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Summaries table: stores generated summaries
CREATE TABLE IF NOT EXISTS summaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  topic VARCHAR(255),
  original_text TEXT,
  summary TEXT,
  revision_points TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Sample indexes for performance
-- ============================================
CREATE INDEX idx_tests_user_id ON tests(user_id);
CREATE INDEX idx_questions_test_id ON questions(test_id);
CREATE INDEX idx_summaries_user_id ON summaries(user_id);
