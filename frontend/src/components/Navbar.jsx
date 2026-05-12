// components/Navbar.jsx - Top Navigation Bar
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, useUser, UserButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { BookOpen, LayoutDashboard, FileText, Clock, Zap } from 'lucide-react'

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const location = useLocation()
  
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/summary', label: 'Summarize', icon: <FileText size={16} /> },
    { to: '/test', label: 'Practice', icon: <Zap size={16} /> },
    { to: '/history', label: 'History', icon: <Clock size={16} /> },
  ]
  
  const isActive = (path) => location.pathname === path
  
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem',
      }}
    >
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Logo */}
        <Link to={isSignedIn ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-amber))',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BookOpen size={18} color="#0a0a0f" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            StudyAI
          </span>
        </Link>
        
        {/* Nav links (only when signed in) */}
        {isSignedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive(link.to) ? 'var(--accent-teal)' : 'var(--text-secondary)',
                  background: isActive(link.to) ? 'var(--accent-teal-dim)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.background = 'var(--bg-card)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {link.icon}
                <span className="hide-mobile">{link.label}</span>
              </Link>
            ))}
          </div>
        )}
        
        {/* Auth section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isSignedIn ? (
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: { width: '34px', height: '34px' }
                }
              }}
            />
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
