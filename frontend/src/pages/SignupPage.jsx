// pages/SignupPage.jsx - Clerk Sign Up
import { SignUp } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

export default function SignupPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(255,179,0,0.05) 0%, transparent 60%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-amber))',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BookOpen size={20} color="#0a0a0f" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              StudyAI
            </span>
          </Link>
        </div>

        {/* Clerk SignUp component */}
        <SignUp
          routing="path"
          path="/signup"
          afterSignUpUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#00e5cc',
              colorBackground: '#16161f',
              colorInputBackground: '#111118',
              colorInputText: '#e8e8f0',
              colorText: '#e8e8f0',
              colorTextSecondary: '#8888aa',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
            elements: {
              card: { boxShadow: 'none', border: '1px solid #2a2a3a' },
              headerTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700 },
              formButtonPrimary: { fontFamily: 'DM Sans, sans-serif' },
            }
          }}
        />
      </motion.div>
    </div>
  )
}
