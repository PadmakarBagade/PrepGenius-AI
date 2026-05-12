// components/LoadingSpinner.jsx
import { motion } from 'framer-motion'

export default function LoadingSpinner({ message = 'Processing...', subMessage = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '1.5rem', padding: '4rem 2rem',
        textAlign: 'center'
      }}
    >
      {/* Animated rings */}
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            border: '3px solid transparent',
            borderTopColor: 'var(--accent-teal)',
            borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: '8px',
            border: '3px solid transparent',
            borderTopColor: 'var(--accent-amber)',
            borderRadius: '50%',
          }}
        />
      </div>
      
      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
          {message}
        </p>
        {subMessage && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            {subMessage}
          </p>
        )}
      </div>
    </motion.div>
  )
}
