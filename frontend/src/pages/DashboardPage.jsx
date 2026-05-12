// pages/DashboardPage.jsx - Main User Dashboard
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Zap, Clock, TrendingUp, ArrowRight, BookOpen, Star } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName || 'Student'
  
  const mainOptions = [
    {
      to: '/summary',
      icon: <FileText size={32} />,
      color: 'var(--accent-teal)',
      dim: 'var(--accent-teal-dim)',
      title: 'AI Notes Summary',
      desc: 'Upload notes (image, PDF, text) and get AI-generated summaries with key revision points.',
      badge: 'Option 1',
      badgeClass: 'badge-teal',
      action: 'Start Summarizing →'
    },
    {
      to: '/test',
      icon: <Zap size={32} />,
      color: 'var(--accent-amber)',
      dim: 'var(--accent-amber-dim)',
      title: 'AI Practice Mode',
      desc: 'Generate MCQ or Q&A tests from your content. Get scored and receive personalised feedback.',
      badge: 'Option 2',
      badgeClass: 'badge-amber',
      action: 'Start Practicing →'
    }
  ]
  
  const quickLinks = [
    { to: '/history', icon: <Clock size={18} />, label: 'Test History', color: 'var(--accent-purple)' },
    { to: '/summary', icon: <BookOpen size={18} />, label: 'New Summary', color: 'var(--accent-teal)' },
    { to: '/test', icon: <Star size={18} />, label: 'Quick Test', color: 'var(--accent-amber)' },
  ]

  const tips = [
    '📸 Upload a photo of handwritten notes for instant OCR extraction',
    '🎯 Start with 5 MCQ questions to gauge your understanding',
    '📊 Check your History page to track improvement over time',
    '🧠 Q&A mode gives deeper AI feedback than MCQ mode',
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="bg-mesh">
      <Navbar />
      
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            Welcome back 👋
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Hello, {firstName}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            What would you like to do today?
          </p>
        </motion.div>

        {/* Main 2 options */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}
        >
          {mainOptions.map((opt, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Link to={opt.to} style={{ textDecoration: 'none', display: 'block' }}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(0,0,0,0.4)` }}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid var(--border)`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = opt.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  {/* Background glow */}
                  <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '150px', height: '150px',
                    borderRadius: '50%',
                    background: opt.dim,
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                  }} />
                  
                  <span className={`badge ${opt.badgeClass}`} style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
                    {opt.badge}
                  </span>
                  
                  <div style={{
                    width: '60px', height: '60px',
                    background: opt.dim,
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: opt.color,
                    marginBottom: '1.25rem'
                  }}>
                    {opt.icon}
                  </div>
                  
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                    {opt.title}
                  </h2>
                  
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                    {opt.desc}
                  </p>
                  
                  <span style={{ color: opt.color, fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {opt.action}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick links row */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}
        >
          {quickLinks.map((link, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Link
                to={link.to}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.1rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '99px',
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = link.color
                  e.currentTarget.style.borderColor = link.color
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                <span style={{ color: link.color }}>{link.icon}</span>
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pro Tips
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.9rem 1.1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
