import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, ArrowRight, Play } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useSignIn, useAuth } from '@clerk/clerk-react'
import { isClerkEnabled } from '../lib/clerk'

// Separate sub-component for Clerk integrations to prevent hooks error if Clerk is disabled
function ClerkButtons() {
  const { signIn, isLoaded } = useSignIn()
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [clerkLoading, setClerkLoading] = useState(false)
  const [clerkError, setClerkError] = useState('')

  // Already signed in — just go to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard', { replace: true })
    }
  }, [isLoaded, isSignedIn, navigate])

  const handleGoogle = async () => {
    if (!isLoaded || clerkLoading) return
    // Guard: already signed in
    if (isSignedIn) { navigate('/dashboard', { replace: true }); return }
    setClerkError('')
    setClerkLoading(true)
    try {
      const callbackUrl = `${window.location.origin}/sso-callback`
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: callbackUrl,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      })
    } catch (err) {
      const code = err?.errors?.[0]?.code || ''
      // Already signed in error — just redirect
      if (code === 'identifier_already_signed_in' || code.includes('already') || err?.status === 403) {
        navigate('/dashboard', { replace: true })
        return
      }
      const realMsg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Google sign-in failed. Please try again.'
      setClerkError(realMsg)
      setClerkLoading(false)
    }
  }

  return (
    <div className="space-y-2.5 mb-4">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={!isLoaded || clerkLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-semibold text-white transition-all bg-void/30 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {clerkLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
        )}
        {clerkLoading ? 'Redirecting to Google...' : 'Continue with Google'}
      </button>
      {clerkError && <p className="text-red-400 text-xs text-center">{clerkError}</p>}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If already logged in (local auth), skip to dashboard
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [state.isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    dispatch({ type: 'LOGIN', payload: { name: form.email.split('@')[0], email: form.email } })
    setLoading(false)
    navigate('/dashboard')
  }

  const handleGoogleMock = () => {
    dispatch({ type: 'LOGIN', payload: { name: 'Google Scholar', email: 'scholar@google.com' } })
    navigate('/dashboard')
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    dispatch({ type: 'LOGIN_DEMO' })
    setLoading(false)
    navigate('/dashboard')
  }

  const SUBJECTS = [
    { emoji: '∑', label: 'Math', color: '#6366f1' },
    { emoji: '⚛', label: 'Physics', color: '#06b6d4' },
    { emoji: '⚗', label: 'Chem', color: '#10b981' },
    { emoji: '🧬', label: 'Biology', color: '#ec4899' },
    { emoji: '📖', label: 'English', color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-void bg-grid flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated bg orbs */}
      <motion.div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-12"
        style={{ backgroundImage: 'radial-gradient(circle,#6366f1,#a855f7)' }}
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-8 bg-cyan-500"
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
            style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
            <Brain size={28} className="text-white" />
          </motion.div>
          <h1 className="font-display font-bold text-4xl bg-clip-text text-transparent mb-1"
            style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>NeuralPath AI</h1>
          <p className="text-soft text-sm font-body">India's Multilingual Personalized Learning Companion</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            {SUBJECTS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2 }}
                className="flex flex-col items-center gap-1" title={s.label}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>{s.emoji}</div>
                <span className="text-[9px] font-mono hidden sm:block" style={{ color: s.color }}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 shadow-card">
          <h2 className="font-display font-bold text-2xl text-white mb-1">Welcome back</h2>
          <p className="text-soft text-xs font-body mb-6">Sign in to continue learning</p>

          {/* Clerk or Fallback Google Auth */}
          {isClerkEnabled() ? (
            <ClerkButtons />
          ) : (
            <div className="space-y-2.5 mb-4">
              <button
                type="button"
                onClick={handleGoogleMock}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-semibold text-white transition-all bg-void/30"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] text-muted font-mono uppercase">or email sign in</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-soft mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" className="input-field pl-10" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-soft mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="password" className="input-field pl-10" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs">{error}</motion.p>}
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-semibold text-white mt-2 transition-all shadow-glow"
              style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight size={15} /></>}
            </motion.button>
          </form>

          {/* Explore Demo Mode Button */}
          <motion.button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold text-white mt-4 transition-all border border-indigo-500/25 bg-indigo-500/10 hover:bg-indigo-500/15 hover:border-indigo-500/35"
          >
            <Play size={13} fill="white" className="mr-1" />
            Explore Demo Mode
          </motion.button>

          <p className="text-center text-soft text-sm mt-5">
            No account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
