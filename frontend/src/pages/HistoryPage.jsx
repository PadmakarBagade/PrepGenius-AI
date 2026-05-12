// pages/HistoryPage.jsx - Test History Page
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Clock, Trophy, Target, TrendingUp, RefreshCw, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { createAuthApi } from '../utils/api.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{label}</p>
        <p style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

export default function HistoryPage() {
  const { getToken } = useAuth()
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const api = createAuthApi(getToken)
      const [histRes, statsRes] = await Promise.all([
        api.get('/api/history'),
        api.get('/api/history/stats/summary')
      ])
      setHistory(histRes.data.history || [])
      setStats(statsRes.data.stats || {})
    } catch (err) {
      setError(err.message || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => { fetchHistory() }, [])
  useEffect(() => {
  setHistory([])
  setStats({})
  setLoading(false)
}, [])

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)'
    if (score >= 50) return 'var(--accent-amber)'
    return 'var(--error)'
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  // Prepare chart data from last 10 tests
  const chartData = history.slice(0, 10).reverse().map((t, i) => ({
    name: `T${i+1}`,
    score: Math.round(t.score),
    subject: t.subject
  }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="bg-mesh">
      <Navbar />
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem' }}>Test History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your learning progress over time</p>
        </motion.div>

        {loading ? (
          <LoadingSpinner message="Loading your history..." />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchHistory} className="btn btn-primary">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '4rem 2rem' }}
          >
            <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No tests yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Take your first practice test to start tracking your progress!
            </p>
            <Link to="/test" className="btn btn-primary">Start a Test</Link>
          </motion.div>
        ) : (
          <>
            {/* Stats cards */}
            {stats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}
              >
                {[
                  { label: 'Total Tests', value: stats.total_tests || 0, icon: <Target size={18} />, color: 'var(--accent-teal)' },
                  { label: 'Average Score', value: `${Math.round(stats.avg_score || 0)}%`, icon: <TrendingUp size={18} />, color: 'var(--accent-amber)' },
                  { label: 'Best Score', value: `${Math.round(stats.best_score || 0)}%`, icon: <Trophy size={18} />, color: 'var(--success)' },
                  { label: 'Questions Done', value: stats.total_questions_answered || 0, icon: <BookOpen size={18} />, color: 'var(--accent-purple)' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card"
                    style={{ textAlign: 'center' }}
                  >
                    <div style={{ color: stat.color, marginBottom: '0.5rem' }}>{stat.icon}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: stat.color }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Score trend chart */}
            {chartData.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="card"
                style={{ marginBottom: '2rem' }}
              >
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>📈 Score Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone" dataKey="score"
                      stroke="var(--accent-teal)" strokeWidth={2.5}
                      dot={{ fill: 'var(--accent-teal)', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* History list */}
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Recent Tests</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((test, i) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card"
                  style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.1rem 1.5rem' }}
                >
                  {/* Score circle */}
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    border: `3px solid ${getScoreColor(test.score)}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: '0.9rem', color: getScoreColor(test.score)
                  }}>
                    {Math.round(test.score)}%
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.2rem', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {test.subject}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span className={`badge ${test.test_type === 'mcq' ? 'badge-teal' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                        {test.test_type?.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {formatDate(test.date)}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {test.total_questions} questions
                      </span>
                    </div>
                  </div>
                  
                  {/* Mini progress bar */}
                  <div style={{ width: '80px', flexShrink: 0 }}>
                    <div className="progress-bar" style={{ height: '6px' }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${test.score}%`, background: getScoreColor(test.score) }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
