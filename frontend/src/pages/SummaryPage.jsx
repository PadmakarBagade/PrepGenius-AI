// pages/SummaryPage.jsx - AI Notes Summary
import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Upload, FileText, Link as LinkIcon, Type, CheckCircle, Copy, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { createAuthApi } from '../utils/api.js'

const INPUT_TYPES = [
  { id: 'text', label: 'Paste Text', icon: <Type size={16} /> },
  { id: 'file', label: 'Upload File/Image', icon: <Upload size={16} /> },
  { id: 'youtube', label: 'YouTube URL', icon: <LinkIcon size={16} /> },
]

export default function SummaryPage() {
  const { getToken } = useAuth()
  const [inputType, setInputType] = useState('text')
  const [text, setText] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [topic, setTopic] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback(accepted => {
    if (accepted[0]) {
      setFile(accepted[0])
      toast.success(`File ready: ${accepted[0].name}`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  })

  const handleSubmit = async () => {
    if (inputType === 'text' && !text.trim()) return toast.error('Please paste some text')
    if (inputType === 'file' && !file) return toast.error('Please upload a file')
    if (inputType === 'youtube' && !youtubeUrl.trim()) return toast.error('Please enter a YouTube URL')

    setLoading(true)
    setResult(null)

    try {
      const api = createAuthApi(getToken)
      const formData = new FormData()
      
      if (inputType === 'file') formData.append('file', file)
      if (inputType === 'text') formData.append('text', text)
      if (inputType === 'youtube') formData.append('youtube_url', youtubeUrl)
      if (topic) formData.append('topic', topic)

      const { data } = await api.post('/api/summary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setResult(data)
      toast.success('Summary generated!')
    } catch (err) {
      toast.error(err.message || 'Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} className="bg-mesh">
      <Navbar />
      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '860px' }}>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <span className="badge badge-teal" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>Option 1</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>AI Notes Summary</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload your notes and get bullet-point summaries with key revision points</p>
        </motion.div>

        {/* Input type tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', width: 'fit-content', border: '1px solid var(--border)' }}>
            {INPUT_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setInputType(t.id)}
                className="btn"
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px',
                  background: inputType === t.id ? 'var(--accent-teal)' : 'transparent',
                  color: inputType === t.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  fontSize: '0.85rem'
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Topic input */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label>Topic / Subject (optional)</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Photosynthesis, World War II..." />
          </div>

          {/* Input area */}
          <AnimatePresence mode="wait">
            {inputType === 'text' && (
              <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label>Paste your notes</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  rows={8}
                  placeholder="Paste your study notes, textbook content, or any text here..."
                  style={{ resize: 'vertical' }}
                />
                <p className="text-sm text-muted" style={{ marginTop: '0.4rem' }}>{text.length} characters</p>
              </motion.div>
            )}

            {inputType === 'file' && (
              <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div
                  {...getRootProps()}
                  style={{
                    border: `2px dashed ${isDragActive ? 'var(--accent-teal)' : file ? 'var(--success)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragActive ? 'var(--accent-teal-dim)' : file ? 'rgba(34,197,94,0.05)' : 'var(--bg-card)',
                    transition: 'all 0.2s'
                  }}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={40} color="var(--success)" />
                      <p style={{ fontWeight: 600 }}>{file.name}</p>
                      <p className="text-sm text-muted">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <Upload size={36} color="var(--text-secondary)" />
                      <p style={{ fontWeight: 600 }}>Drop file here or click to browse</p>
                      <p className="text-sm text-muted">Supports: JPG, PNG, PDF · Max 10MB</p>
                      <p className="text-sm" style={{ color: 'var(--accent-teal)' }}>Images will be processed with OCR</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {inputType === 'youtube' && (
              <motion.div key="youtube" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <label>YouTube Video URL</label>
                <input
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-muted" style={{ marginTop: '0.5rem' }}>
                  ⚠️ Note: YouTube transcript extraction is mocked. To enable real transcripts, configure the youtube-transcript package.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: '1.5rem', padding: '0.8rem 2rem', fontSize: '0.95rem', width: '100%' }}
          >
            {loading ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : '✨ Generate Summary'}
          </motion.button>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <LoadingSpinner
            message={inputType === 'file' ? 'Processing file with OCR...' : 'Generating AI summary...'}
            subMessage="This may take 10-30 seconds"
          />
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '2.5rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>📋 Your Summary</h2>
                {result.estimated_read_time && (
                  <span className="badge badge-teal">⏱ {result.estimated_read_time}</span>
                )}
              </div>

              {/* Summary points */}
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Key Summary</h3>
                  <button
                    onClick={() => copyToClipboard((result.summary || []).join('\n'))}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(result.summary || []).map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{ display: 'flex', gap: '0.75rem', fontSize: '0.92rem', lineHeight: 1.6 }}
                    >
                      <span style={{ color: 'var(--accent-teal)', marginTop: '3px', flexShrink: 0 }}>▸</span>
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Revision points */}
              {result.revision_points && result.revision_points.length > 0 && (
                <div className="card" style={{ marginBottom: '1.25rem', borderColor: 'rgba(255,179,0,0.3)' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: 'var(--accent-amber)' }}>
                    ⚡ Quick Revision Points
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.revision_points.map((point, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--accent-amber)', flexShrink: 0 }}>→</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key concepts */}
              {result.key_concepts && result.key_concepts.length > 0 && (
                <div className="card">
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--accent-purple)' }}>
                    🔑 Key Concepts
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.key_concepts.map((concept, i) => (
                      <span key={i} className="badge badge-purple">{concept}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
