// pages/TestPage.jsx - AI Practice Mode (MCQ + Q&A)
import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Brain, MessageSquare, ChevronRight, ChevronLeft, Send, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { createAuthApi } from '../utils/api.js'

const STAGES = { SETUP: 'setup', LOADING: 'loading', TEST: 'test', SUBMITTING: 'submitting' }

export default function TestPage() {
  const { getToken } = useAuth()
  const navigate = useNavigate()
  
  const [stage, setStage] = useState(STAGES.SETUP)
  const [testType, setTestType] = useState('mcq')
  const [topic, setTopic] = useState('')
  const [content, setContent] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(0)

  const generateTest = async () => {
    if (!topic.trim() && !content.trim()) return toast.error('Please enter a topic or some content')
    
    setStage(STAGES.LOADING)
    try {
      const api = createAuthApi(getToken)
      const endpoint = testType === 'mcq' ? '/api/quiz' : '/api/qna'
      const { data } = await api.post(endpoint, { topic, content, num_questions: numQuestions })
      
      setQuestions(data.questions)
      setUserAnswers({})
      setCurrentQ(0)
      setStage(STAGES.TEST)
      toast.success(`${data.questions.length} questions generated!`)
    } catch (err) {
      toast.error(err.message || 'Failed to generate test')
      setStage(STAGES.SETUP)
    }
  }

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({ ...prev, [currentQ]: answer }))
  }

  const handleSubmitTest = async () => {
    const answeredCount = Object.keys(userAnswers).length
    if (answeredCount < questions.length) {
      const unanswered = questions.length - answeredCount
      if (!window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return
    }

    setStage(STAGES.SUBMITTING)
    try {
      const api = createAuthApi(getToken)
      const answersArray = questions.map((_, i) => userAnswers[i] || '')
      
      const { data } = await api.post('/api/evaluate', {
        test_type: testType,
        topic,
        questions,
        user_answers: answersArray
      })
      
      // Navigate to result page with data
      navigate('/result', { state: { result: data, topic, testType, questions, userAnswers: answersArray } })
    } catch (err) {
      toast.error(err.message || 'Failed to evaluate answers')
      setStage(STAGES.TEST)
    }
  }

  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0
  const answeredSoFar = Object.keys(userAnswers).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="bg-mesh">
      <Navbar />
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '760px' }}>

        {/* Setup Stage */}
        {stage === STAGES.SETUP && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-amber" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>Option 2</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI Practice Mode</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Generate AI-powered tests from your content</p>

            {/* Test type selection */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ marginBottom: '0.75rem', display: 'block' }}>Select Test Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { id: 'mcq', icon: <Brain size={24} />, label: 'MCQ Test', desc: 'Multiple choice with 4 options' },
                  { id: 'qna', icon: <MessageSquare size={24} />, label: 'Q&A Test', desc: 'Written answers, AI evaluated' },
                ].map(mode => (
                  <motion.button
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTestType(mode.id)}
                    style={{
                      background: testType === mode.id ? 'var(--accent-amber-dim)' : 'var(--bg-card)',
                      border: `2px solid ${testType === mode.id ? 'var(--accent-amber)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ color: testType === mode.id ? 'var(--accent-amber)' : 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                      {mode.icon}
                    </div>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>
                      {mode.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{mode.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label>Topic / Subject *</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Photosynthesis, Pythagoras Theorem..." />
            </div>

            {/* Content */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label>Study Content (optional - improves question quality)</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={5}
                placeholder="Paste your notes here for more targeted questions..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Number of questions */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label>Number of Questions: <strong style={{ color: 'var(--accent-amber)' }}>{numQuestions}</strong></label>
              <input
                type="range" min={3} max={10} value={numQuestions}
                onChange={e => setNumQuestions(parseInt(e.target.value))}
                style={{ padding: '0.5rem 0', background: 'transparent', border: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>3 (quick)</span><span>10 (thorough)</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateTest}
              className="btn btn-amber"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            >
              🧠 Generate {testType.toUpperCase()} Test
            </motion.button>
          </motion.div>
        )}

        {/* Loading */}
        {stage === STAGES.LOADING && (
          <LoadingSpinner message="Generating your test..." subMessage="AI is crafting personalised questions" />
        )}

        {/* Test Stage */}
        {(stage === STAGES.TEST || stage === STAGES.SUBMITTING) && questions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Question {currentQ + 1} of {questions.length}</span>
                <span style={{ color: 'var(--accent-amber)' }}>{answeredSoFar} answered</span>
              </div>
              <div className="progress-bar">
                <motion.div className="progress-fill" animate={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Question dots */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              {questions.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCurrentQ(i)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    border: `2px solid ${i === currentQ ? 'var(--accent-amber)' : userAnswers[i] !== undefined ? 'var(--success)' : 'var(--border)'}`,
                    background: i === currentQ ? 'var(--accent-amber-dim)' : userAnswers[i] !== undefined ? 'rgba(34,197,94,0.1)' : 'transparent',
                    color: i === currentQ ? 'var(--accent-amber)' : userAnswers[i] !== undefined ? 'var(--success)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.75rem', fontWeight: 600
                  }}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card"
                style={{ marginBottom: '1.5rem', borderColor: 'var(--border-glow)' }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <span style={{
                    background: 'var(--accent-amber-dim)', color: 'var(--accent-amber)',
                    borderRadius: '8px', padding: '0.3rem 0.6rem',
                    fontSize: '0.8rem', fontWeight: 700, flexShrink: 0
                  }}>
                    Q{currentQ + 1}
                  </span>
                  <p style={{ fontWeight: 600, lineHeight: 1.6, fontSize: '1rem' }}>
                    {questions[currentQ]?.question}
                  </p>
                </div>

                {/* MCQ Options */}
                {testType === 'mcq' && questions[currentQ]?.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {questions[currentQ].options.map((option, i) => {
                      const isSelected = userAnswers[currentQ] === option
                      return (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAnswer(option)}
                          style={{
                            background: isSelected ? 'var(--accent-teal-dim)' : 'var(--bg-secondary)',
                            border: `2px solid ${isSelected ? 'var(--accent-teal)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '0.9rem 1.1rem',
                            cursor: 'pointer', textAlign: 'left',
                            color: isSelected ? 'var(--accent-teal)' : 'var(--text-primary)',
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            transition: 'all 0.15s', fontFamily: 'var(--font-body)', fontSize: '0.92rem'
                          }}
                        >
                          <span style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            border: `2px solid ${isSelected ? 'var(--accent-teal)' : 'var(--border)'}`,
                            background: isSelected ? 'var(--accent-teal)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                            color: isSelected ? 'var(--bg-primary)' : 'var(--text-muted)'
                          }}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          {option}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {/* Q&A Answer */}
                {testType === 'qna' && (
                  <div>
                    <label>Your Answer</label>
                    <textarea
                      value={userAnswers[currentQ] || ''}
                      onChange={e => handleAnswer(e.target.value)}
                      rows={5}
                      placeholder="Type your answer here..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="btn btn-secondary"
              >
                <ChevronLeft size={18} /> Previous
              </button>

              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(currentQ + 1)}
                  className="btn btn-primary"
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitTest}
                  disabled={stage === STAGES.SUBMITTING}
                  className="btn btn-amber"
                  style={{ padding: '0.7rem 1.5rem' }}
                >
                  {stage === STAGES.SUBMITTING
                    ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Evaluating...</>
                    : <><Send size={16} /> Submit Test</>
                  }
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
