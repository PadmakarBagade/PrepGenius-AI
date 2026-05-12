// pages/HomePage.jsx - Public Landing Page
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Zap, Brain, FileText, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
}

export default function HomePage() {
  const features = [
    {
      icon: <FileText size={22} />,
      color: 'var(--accent-teal)',
      dim: 'var(--accent-teal-dim)',
      title: 'AI Notes Summary',
      desc: 'Upload images, PDFs, or paste text. Our AI extracts key concepts and generates bullet-point summaries instantly.'
    },
    {
      icon: <Brain size={22} />,
      color: 'var(--accent-amber)',
      dim: 'var(--accent-amber-dim)',
      title: 'MCQ Practice Tests',
      desc: 'AI generates unique multiple choice questions from your notes. Get instant feedback and explanations.'
    },
    {
      icon: <Zap size={22} />,
      color: 'var(--accent-purple)',
      dim: 'var(--accent-purple-dim)',
      title: 'Q&A Deep Dive',
      desc: 'Written answer tests evaluated by AI. Get personalised scores, feedback, and improvement suggestions.'
    },
    {
      icon: <Clock size={22} />,
      color: 'var(--accent-teal)',
      dim: 'var(--accent-teal-dim)',
      title: 'Test History',
      desc: 'Track your progress over time. See your scores, identify weak areas, and watch yourself improve.'
    }
  ]

  const steps = [
    { num: '01', text: 'Upload your notes (image, PDF, or text)' },
    { num: '02', text: 'AI processes and understands the content' },
    { num: '03', text: 'Get summaries or take practice tests' },
    { num: '04', text: 'Review AI feedback and improve' },
  ]

  return (
    <div className="bg-mesh" style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div {...fadeUp}>
            <span className="badge badge-teal" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <Star size={12} style={{ marginRight: '4px' }} /> AI-Powered Learning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}
          >
            Study Smarter with{' '}
            <span className="gradient-text">AI-Powered</span>
            {' '}Tools
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}
          >
            Transform your notes into concise summaries and practice tests. 
            Upload any content and let AI do the heavy lifting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              Log In
            </Link>
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ maxWidth: '900px', margin: '4rem auto 0' }}
        >
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          }}>
            {/* Mock UI preview */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {['#ef4444','#f59e0b','#22c55e'].map(c => (
                <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'AI Summary', icon: '📝', color: 'var(--accent-teal)' },
                { label: 'MCQ Test', icon: '🧠', color: 'var(--accent-amber)' },
                { label: 'Q&A Practice', icon: '💬', color: 'var(--accent-purple)' },
                { label: 'Score: 87%', icon: '🏆', color: 'var(--success)' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.2rem',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: item.color, fontWeight: 600 }}>{item.label}</div>
                    <div style={{ 
                      height: '6px', background: 'var(--border)', borderRadius: '3px', marginTop: '6px', width: '80px'
                    }}>
                      <div style={{ height: '100%', width: `${60 + i*10}%`, background: item.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <motion.h2 variants={fadeUp} style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Everything you need to ace exams
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Powerful AI tools built for students who want results
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="grid-2"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="card"
              style={{ display: 'flex', gap: '1.25rem', cursor: 'default' }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: f.dim, color: f.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '3rem' }}
        >
          How it works
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1.25rem',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '1.1rem 1.5rem', textAlign: 'left'
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem',
                color: 'var(--accent-teal)', opacity: 0.6, minWidth: '40px'
              }}>{step.num}</span>
              <CheckCircle size={18} color="var(--accent-teal)" />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{step.text}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem 6rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '600px', margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(0,229,204,0.08), rgba(255,179,0,0.08))',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-xl)', padding: '3rem 2rem'
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
            Ready to study smarter?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Join thousands of students using AI to supercharge their learning.
          </p>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © 2024 StudyAI — Built with React, Node.js & OpenAI
        </p>
      </footer>
    </div>
  )
}
