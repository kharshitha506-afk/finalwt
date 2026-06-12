import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Signup() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    dispatch({ type: 'LOGIN', payload: { name: form.name, email: form.email } })
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-void bg-grid flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle,#a855f7,#6366f1)' }}
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 7, repeat: Infinity }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
            style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-4xl bg-clip-text text-transparent mb-1"
            style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>NeuralPath</h1>
          <p className="text-soft text-sm">Start your AI learning journey</p>
        </div>

        <div className="glass-card p-8 shadow-card">
          <h2 className="font-display font-bold text-2xl text-white mb-1">Create Account</h2>
          <p className="text-soft text-xs mb-6">Join thousands of students learning smarter</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k: 'name', label: 'Full Name', type: 'text', icon: User, ph: 'Alex Johnson' },
              { k: 'email', label: 'Email Address', type: 'email', icon: Mail, ph: 'you@example.com' },
              { k: 'password', label: 'Password', type: 'password', icon: Lock, ph: 'Min 6 characters' },
            ].map(({ k, label, type, icon: Icon, ph }) => (
              <div key={k}>
                <label className="text-xs text-soft mb-1.5 block">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input type={type} className="input-field pl-10" placeholder={ph}
                    value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                </div>
              </div>
            ))}
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs">{error}</motion.p>}
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-semibold text-white mt-2"
              style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight size={15} /></>}
            </motion.button>
          </form>
          <p className="text-center text-soft text-sm mt-5">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
