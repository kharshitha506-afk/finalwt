import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Brain, BookOpen, Sparkles, Trophy, ChevronLeft, BarChart3, FlaskConical, Atom, Calculator, Dna, BookMarked } from 'lucide-react'
import { SUBJECT_LIST } from '../data/subjects'

const NAV = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/quiz', icon: Brain, label: 'Quiz' },
  { path: '/ai-tutor', icon: Sparkles, label: 'AI Tutor' },
  { path: '/results', icon: BarChart3, label: 'Results' },
  { path: '/study-plan', icon: BookOpen, label: 'Study Plan' },
]

const SUBJECT_ICONS = { mathematics: Calculator, physics: Atom, chemistry: FlaskConical, biology: Dna, english: BookMarked }
const SUBJECT_EMOJIS = { mathematics: '∑', physics: '⚛', chemistry: '⚗', biology: '🧬', english: '📖' }

export default function Sidebar({ subject }) {
  const navigate = useNavigate()
  return (
    <motion.aside initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-16 lg:w-56 bg-surface/95 backdrop-blur-xl border-r border-border z-40 flex flex-col py-4 overflow-hidden">
      {/* Logo */}
      <div className="px-3 mb-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-sm" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
          <Brain size={15} className="text-white" />
        </div>
        <span className="font-display font-bold text-sm bg-clip-text text-transparent hidden lg:block" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>NeuralPath</span>
      </div>

      {subject && (
        <button onClick={() => navigate('/dashboard')} className="mx-2 mb-3 flex items-center gap-2 px-2 py-2 rounded-lg text-soft hover:text-white hover:bg-white/5 transition-all text-xs">
          <ChevronLeft size={14} /><span className="hidden lg:block">Back to Dashboard</span>
        </button>
      )}

      {/* Subjects */}
      <div className="px-2 mb-2">
        <p className="text-[9px] text-muted font-mono px-1 mb-1.5 hidden lg:block tracking-wider">SUBJECTS</p>
        <div className="space-y-0.5">
          {SUBJECT_LIST.map(s => {
            const active = subject?.id === s.id
            return (
              <NavLink key={s.id} to={s.path}
                className="flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs font-body transition-all"
                style={active ? { background: s.bgGlow, border: `1px solid ${s.border}`, color: 'white' } : { color: '#8892a4' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#8892a4' }}>
                <span className="text-sm w-5 text-center flex-shrink-0" style={{ color: active ? s.primary : 'inherit' }}>{SUBJECT_EMOJIS[s.id]}</span>
                <span className="hidden lg:block">{s.label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>

      <div className="px-3 my-2"><div className="h-px bg-border" /></div>

      {/* Nav */}
      <div className="px-2 flex-1">
        <p className="text-[9px] text-muted font-mono px-1 mb-1.5 hidden lg:block tracking-wider">NAVIGATE</p>
        <div className="space-y-0.5">
          {NAV.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path}
              className={({ isActive }) => `flex items-center gap-2.5 px-2 py-2 rounded-xl text-xs font-body transition-all ${isActive ? 'text-indigo-400 bg-indigo-400/10' : 'text-soft hover:text-white hover:bg-white/5'}`}>
              <Icon size={15} /><span className="hidden lg:block">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="px-3 mt-auto">
        <div className="hidden lg:flex items-center gap-2 bg-card/80 border border-border rounded-xl p-2.5">
          <Trophy size={13} className="text-yellow-400" />
          <div><p className="text-[10px] text-white font-mono">Keep learning!</p><p className="text-[10px] text-muted">Streak active 🔥</p></div>
        </div>
      </div>
    </motion.aside>
  )
}
