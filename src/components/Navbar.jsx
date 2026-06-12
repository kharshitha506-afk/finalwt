import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Brain, BarChart3, BookOpen, LogOut, Menu, X, Zap, Trophy, Sparkles } from 'lucide-react'
import { useApp, getLevelName } from '../context/AppContext'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/quiz', label: 'Quiz', icon: Brain },
  { path: '/ai-tutor', label: 'AI Tutor', icon: Sparkles },
  { path: '/results', label: 'Results', icon: BarChart3 },
  { path: '/study-plan', label: 'Study Plan', icon: BookOpen },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { dispatch({ type: 'LOGOUT' }); navigate('/login') }

  const nextLevelXP = 250
  const xpPercent = Math.min(100, Math.round((state.xp / nextLevelXP) * 100))

  return (
    <>
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 bg-void/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-glow-sm" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                <Brain size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg hidden sm:block bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>NeuralPath</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const active = pathname === path
                return (
                  <Link key={path} to={path} className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body transition-all duration-200 ${active ? 'text-indigo-400 bg-indigo-400/10' : 'text-soft hover:text-white hover:bg-white/5'}`}>
                    <Icon size={14} />{label}
                    {active && <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />}
                  </Link>
                )
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-1.5">
                <Trophy size={12} className="text-yellow-400" />
                <span className="text-xs font-mono text-yellow-400">{getLevelName(state.level)}</span>
                <div className="w-14 h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundImage: 'linear-gradient(90deg,#6366f1,#a855f7)' }} initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1 }} />
                </div>
                <span className="text-xs font-mono text-soft">{state.xp}XP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-3 py-1.5">
                <Zap size={12} className="text-orange-400" />
                <span className="text-xs font-mono text-orange-400">{state.streak}🔥</span>
              </div>
              {state.isAuthenticated && (
                <button onClick={handleLogout} className="flex items-center gap-2 text-soft hover:text-white transition-colors text-sm">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-display font-bold">
                    {state.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <LogOut size={13} />
                </button>
              )}
            </div>

            <button className="md:hidden text-soft hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="md:hidden border-t border-border bg-surface overflow-hidden">
              <div className="px-4 py-3 space-y-1">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Link key={path} to={path} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${pathname === path ? 'bg-indigo-400/10 text-indigo-400' : 'text-soft hover:text-white hover:bg-white/5'}`}>
                    <Icon size={15} />{label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs text-soft font-mono">{getLevelName(state.level)} · {state.xp} XP · {state.streak}🔥</span>
                    <button onClick={handleLogout} className="text-soft hover:text-white"><LogOut size={14} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
