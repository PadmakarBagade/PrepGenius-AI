// pages/ResultPage.jsx - Test Results & AI Feedback
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Trophy, Target, RefreshCw, ArrowLeft, TrendingUp, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

function ScoreCircle({ score }) {
  const pct = Math.round(score)
  const color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--accent-amber)' : 'var(--error)'
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (pct / 100) * circumference
  
  return (
    <div style={{ position: 'relative', width: '140px', height: '140px' }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
        <motion.circle
          cx="70" cy="70" r="54" fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color }}>
          {pct}%
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>score</span>
      </div>
    </div>
  )
}

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, topic, testType, questions, userAnswers } = location.state || {}
  
  if (!result) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No result data found.</p>
          <Link to="/test" className="btn btn-primary">Take a Test</Link>
        </div>
      </div>
    )
  }
  
  const score = result.percentage || result.score || 0
  const grade = score >= 90 ? { label: 'Excellent!', emoji: '🏆', color: 'var(--success)' }
    : score >= 75 ? { label: 'Great Job!', emoji: '⭐', color: 'var(--accent-teal)' }
    : score >= 50 ? { label: 'Good Try!', emoji: '💪', color: 'var(--accent-amber)' }
    : { label: 'Keep Practicing', emoji: '📚', color: 'var(--error)' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="bg-mesh">
      <Navbar />
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '860px' }}>
        
        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
            width: '200px', height: '200px', borderRadius: '50%',
            background: score >= 50 ? 'rgba(0,229,204,0.06)' : 'rgba(239,68,68,0.06)',
            filter: 'blur(40px)', pointerEvents: 'none'
          }} />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '2rem', marginBottom: '1rem' }}
          >
            {grade.emoji}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: grade.color }}
          >
            {grade.label}
          </motion.h1>
          
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {topic} · {testType?.toUpperCase()} Test
          </p>
          
          {/* Score circle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <ScoreCircle score={score} />
          </div>
          
          {/* Stats row */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {testType === 'mcq' ? (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>
                    {result.correct}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Correct</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--error)', fontFamily: 'var(--font-display)' }}>
                    {result.total - result.correct}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Wrong</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-teal)', fontFamily: 'var(--font-display)' }}>
                    {result.total_score}/{result.max_score}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Points</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
              </>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-display)' }}>
                {result.total || questions?.length || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Questions</div>
            </div>
          </div>
        </motion.div>
        
        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
          style={{ marginBottom: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 600 }}>Overall Performance</span>
            <span style={{ color: score >= 80 ? 'var(--success)' : score >= 50 ? 'var(--accent-amber)' : 'var(--error)', fontWeight: 700 }}>
              {score}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: '12px' }}>
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </motion.div>
        
        {/* AI Feedback */}
        {result.overall_feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
            style={{ marginBottom: '1.5rem', borderColor: 'rgba(0,229,204,0.3)' }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <TrendingUp size={20} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--accent-teal)' }}>AI Feedback</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.92rem' }}>{result.overall_feedback}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Weak areas & tips */}
        {((result.weak_areas?.length > 0) || (result.improvement_tips?.length > 0)) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {result.weak_areas?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="card"
                style={{ borderColor: 'rgba(239,68,68,0.2)' }}
              >
                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} /> Weak Areas
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.weak_areas.map((area, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--error)' }}>•</span> {area}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {result.improvement_tips?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="card"
                style={{ borderColor: 'rgba(255,179,0,0.2)' }}
              >
                <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} /> Improvement Tips
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.improvement_tips.map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--accent-amber)' }}>→</span> {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}

        {/* Question review */}
        {result.results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
              📝 Question Review
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="card"
                  style={{
                    borderColor: r.is_correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)',
                    background: r.is_correct ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    {r.is_correct
                      ? <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      : <XCircle size={18} color="var(--error)" style={{ flexShrink: 0, marginTop: '3px' }} />
                    }
                    <p style={{ fontWeight: 600, fontSize: '0.92rem', lineHeight: 1.5 }}>Q{i+1}: {r.question}</p>
                  </div>
                  
                  <div style={{ marginLeft: '1.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>Your answer:</span>
                      <span style={{ color: r.is_correct ? 'var(--success)' : 'var(--error)' }}>
                        {r.user_answer || '(no answer)'}
                      </span>
                    </div>
                    {!r.is_correct && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>Correct:</span>
                        <span style={{ color: 'var(--success)' }}>{r.correct_answer}</span>
                      </div>
                    )}
                    {testType === 'qna' && r.feedback && (
                      <div style={{ marginTop: '0.4rem', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                        💬 {r.feedback}
                      </div>
                    )}
                    {testType === 'mcq' && r.explanation && (
                      <div style={{ marginTop: '0.4rem', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        ℹ️ {r.explanation}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}
        >
          <button onClick={() => navigate('/test')} className="btn btn-primary" style={{ flex: 1 }}>
            <RefreshCw size={16} /> Try Another Test
          </button>
          <Link to="/history" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
            <Trophy size={16} /> View History
          </Link>
          <Link to="/dashboard" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
