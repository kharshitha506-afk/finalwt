import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Brain, ArrowRight, Sparkles, BookOpen, Trophy, Flame, Target, Zap, TrendingUp, Play, Star, Calendar, CheckCircle2, ChevronRight } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { useApp, getWeakTopics, getLevelName, getNextLevelXP, getXPForLevel, getWeeklyChartData } from '../context/AppContext'
import { SUBJECT_LIST } from '../data/subjects'
import { isClerkEnabled } from '../lib/clerk'

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl p-2.5 shadow-card text-xs">
      <p className="text-soft mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white font-mono">{p.value}%</span>
          <span className="text-soft capitalize">{p.name}</span>
        </div>
      ))}
    </div>
  )
}

// Animated counter
function Counter({ end, duration = 1000, suffix = '' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const steps = 40
    const inc = end / steps
    let cur = 0
    const t = setInterval(() => {
      cur = Math.min(cur + inc, end)
      setVal(Math.floor(cur))
      if (cur >= end) clearInterval(t)
    }, duration / steps)
    return () => clearInterval(t)
  }, [end, duration])
  return <>{val}{suffix}</>
}

const BADGES = [
  { id: 'first_correct', icon: '🎯', label: 'First Win',   color: '#10b981' },
  { id: 'streak_3',      icon: '🔥', label: 'On Fire',     color: '#ef4444' },
  { id: 'streak_5',      icon: '⚡', label: 'Lightning',   color: '#f59e0b' },
  { id: 'quiz_complete', icon: '✅', label: 'Finisher',    color: '#6366f1' },
  { id: 'perfect_score', icon: '⭐', label: 'Perfect',     color: '#a855f7' },
  { id: 'level_3',       icon: '🧠', label: 'Scholar',     color: '#ec4899' },
  { id: 'all_topics',    icon: '🌟', label: 'Polymath',    color: '#ffd60a' },
  { id: 'streak_all',    icon: '📚', label: 'Devoted',     color: '#06b6d4' },
]

// Rule-based Learning DNA Generator
const DNA_PROFILES = {
  deepLearner: {
    title: 'Deep Learner',
    icon: '🧠',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg,#6366f1,#a855f7)',
    strong: 'Sustained focus & streak building',
    improve: 'Breadth — try exploring more subjects',
    desc: 'You maintain excellent focus and build strong streaks of correct answers under pressure.',
    recommendation: 'Challenge yourself with Hard difficulty settings to test your limits.',
    confidence: 88,
  },
  precisionSolver: {
    title: 'Precision Solver',
    icon: '🎯',
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
    strong: 'High accuracy & analytical thinking',
    improve: 'Speed — try shorter time limits',
    desc: 'You prioritize accuracy and analyze concepts carefully before answering.',
    recommendation: 'Practice speed rounds with a 20-second timer to sharpen quick recall.',
    confidence: 92,
  },
  consistentImprover: {
    title: 'Consistent Improver',
    icon: '📈',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    strong: 'Resilience & learning from mistakes',
    improve: 'Accuracy — review explanations carefully',
    desc: 'You actively learn from mistakes and build knowledge step-by-step.',
    recommendation: 'Read the AI Tutor explanation for every wrong answer to solidify weak spots.',
    confidence: 74,
  },
  conceptExplorer: {
    title: 'Concept Explorer',
    icon: '🌐',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg,#06b6d4,#6366f1)',
    strong: 'Cross-subject curiosity & breadth',
    improve: 'Depth — focus on your weakest single topic',
    desc: 'You enjoy broad, interdisciplinary learning across multiple sciences and subjects.',
    recommendation: 'Focus 3 sessions specifically on your weakest topic in the Study Plan.',
    confidence: 79,
  },
  fastThinker: {
    title: 'Fast Thinker',
    icon: '⚡',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg,#ec4899,#f59e0b)',
    strong: 'Quick recall & fast processing',
    improve: 'Accuracy under pressure',
    desc: 'You solve problems quickly, though accuracy sometimes drops under time pressure.',
    recommendation: 'Slow down on Mathematics and double-check calculation steps before submitting.',
    confidence: 81,
  }
}

const getLearningDNA = (quizHistory, topicScores, streak, maxStreak) => {
  if (!quizHistory || quizHistory.length < 8) {
    return { unlocked: false }
  }
  const total = quizHistory.length
  const correct = quizHistory.filter(h => h.correct).length
  const accuracy = Math.round((correct / total) * 100)
  const activeTopics = Object.keys(topicScores).length

  let profile
  if (maxStreak >= 5)           profile = DNA_PROFILES.deepLearner
  else if (accuracy >= 85)      profile = DNA_PROFILES.precisionSolver
  else if (accuracy < 60)       profile = DNA_PROFILES.consistentImprover
  else if (activeTopics >= 5)   profile = DNA_PROFILES.conceptExplorer
  else                          profile = DNA_PROFILES.fastThinker

  return { unlocked: true, ...profile }
}

// 3-Step Onboarding Modal Component
function OnboardingModal({ isOpen, onClose }) {
  const { dispatch } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [subjects, setSubjects] = useState([])
  const [confidence, setConfidence] = useState('intermediate')
  const [goal, setGoal] = useState(30)

  if (!isOpen) return null

  const toggleSubject = (id) => {
    setSubjects(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleComplete = () => {
    if (subjects.length === 0) return
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: {
        subjects,
        confidenceLevel: confidence,
        dailyGoal: goal
      }
    })
    onClose()
  }

  const handleCancelSignOut = async () => {
    dispatch({ type: 'LOGOUT' })
    if (isClerkEnabled() && window.Clerk) {
      try {
        await window.Clerk.signOut()
      } catch (e) {
        console.error('Clerk logout error:', e)
      }
    }
    onClose()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-6 relative overflow-hidden border border-white/10"
      >
        {/* Shimmer line top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 to-purple-500" />
        
        <div className="mb-4 flex justify-between items-center">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">Onboarding — Step {step} of 3</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancelSignOut}
              className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors"
            >
              Cancel / Logout
            </button>
            <div className="flex gap-1">
              {[1, 2, 3].map(s => (
                <div key={s} className={`w-6 h-1 rounded-full transition-all ${step >= s ? 'bg-indigo-500' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className="font-display font-bold text-xl text-white mb-1">Select Focus Subjects</h3>
            <p className="text-xs text-soft mb-4">Choose which subjects you want to focus on for your adaptive path.</p>
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {SUBJECT_LIST.map(s => {
                const selected = subjects.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSubject(s.id)}
                    className="p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2"
                    style={{
                      borderColor: selected ? s.primary : 'rgba(255,255,255,0.06)',
                      background: selected ? `${s.primary}12` : 'rgba(255,255,255,0.03)',
                      color: selected ? 'white' : '#8892a4'
                    }}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <span className="font-semibold">{s.label}</span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => subjects.length > 0 && setStep(2)}
              disabled={subjects.length === 0}
              className="w-full btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              Next Step <ChevronRight size={13} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-display font-bold text-xl text-white mb-1">Your Confidence Level</h3>
            <p className="text-xs text-soft mb-4">Select your starting comfort level. This seeds weak focus areas to kickstart practice.</p>
            <div className="space-y-2 mb-6">
              {[
                { id: 'beginner', label: 'Beginner / Foundation', desc: 'I need to review starting concepts in detail.' },
                { id: 'intermediate', label: 'Intermediate / Comfortable', desc: 'I have some baseline knowledge but need practice.' },
                { id: 'advanced', label: 'Advanced / Confident', desc: 'I want to dive straight into difficult challenge problems.' }
              ].map(level => {
                const selected = confidence === level.id
                return (
                  <button
                    key={level.id}
                    onClick={() => setConfidence(level.id)}
                    className="w-full p-3.5 rounded-xl border text-left text-xs transition-all relative flex flex-col gap-0.5"
                    style={{
                      borderColor: selected ? '#6366f1' : 'rgba(255,255,255,0.06)',
                      background: selected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                      color: selected ? 'white' : '#8892a4'
                    }}
                  >
                    <span className="font-bold text-white text-xs">{level.label}</span>
                    <span className="text-[10px] text-soft">{level.desc}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1 py-2.5 text-xs text-soft">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 py-2.5 text-xs font-semibold">Next Step</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-display font-bold text-xl text-white mb-1">Daily Study Goal</h3>
            <p className="text-xs text-soft mb-4">Set a target XP goal to achieve each day.</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[15, 30, 50, 100].map(val => {
                const selected = goal === val
                return (
                  <button
                    key={val}
                    onClick={() => setGoal(val)}
                    className="p-3.5 rounded-xl border text-center text-xs font-mono transition-all font-bold"
                    style={{
                      borderColor: selected ? '#6366f1' : 'rgba(255,255,255,0.06)',
                      background: selected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                      color: selected ? 'white' : '#8892a4'
                    }}
                  >
                    {val} XP
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-ghost flex-1 py-2.5 text-xs text-soft">Back</button>
              <button onClick={handleComplete} className="btn-primary flex-1 py-2.5 text-xs font-bold">Build My NeuralPath</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { user, xp, level, streak, maxStreak, score, totalQuestions, topicScores, subjectProgress, quizHistory, hasCompletedOnboarding, isDemo } = state
  
  const [onboardingOpen, setOnboardingOpen] = useState(false)

  // Trigger onboarding if not completed and not demo
  useEffect(() => {
    if (state.isAuthenticated && !hasCompletedOnboarding && !isDemo) {
      setOnboardingOpen(true)
    } else {
      setOnboardingOpen(false)
    }
  }, [state.isAuthenticated, hasCompletedOnboarding, isDemo])

  const weakTopics = getWeakTopics(topicScores)
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const levelName = getLevelName(level)
  const nextLevelXP = getNextLevelXP(level)
  const currentLevelXP = getXPForLevel(level > 1 ? level - 1 : 0)
  const xpProgress = Math.min(100, Math.round(((xp - currentLevelXP) / Math.max(1, nextLevelXP - currentLevelXP)) * 100))

  // Dynamic weekly performance
  const weeklyData = getWeeklyChartData(quizHistory)
  const hasWeeklyData = quizHistory.length > 0

  // Dynamic Learning DNA
  const dna = getLearningDNA(quizHistory, topicScores, streak, maxStreak)

  const radarData = SUBJECT_LIST.map(s => ({
    subject: s.label.slice(0, 4),
    score: subjectProgress?.[s.id] || 0,
  }))
  const hasRadarData = Object.keys(topicScores).length > 0

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const aiInsight = weakTopics.length > 0
    ? { msg: `Your weakest area is **${weakTopics[0].topic}** (${weakTopics[0].accuracy}% accuracy). Focus your next session here.`, type: 'warn' }
    : { msg: `Excellent progress! All topics are strong. Challenge yourself with hard difficulty quizzes.`, type: 'good' }

  const STATS = [
    { icon: Flame,      label: 'Study Streak',  value: streak,     suffix: '🔥', sub: `Best: ${maxStreak}`,   color: '#ef4444' },
    { icon: Target,     label: 'Accuracy',      value: accuracy,   suffix: '%',  sub: `${score}/${totalQuestions}`, color: '#10b981' },
    { icon: Zap,        label: 'Total XP',      value: xp,         suffix: '',   sub: 'Keep earning!',        color: '#f59e0b' },
    { icon: TrendingUp, label: 'Weak Topics',   value: weakTopics.length, suffix: '', sub: weakTopics.length === 0 ? 'All strong!' : weakTopics[0]?.topic, color: weakTopics.length === 0 ? '#10b981' : '#ec4899' },
  ]

  return (
    <PageLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <motion.span className="w-2 h-2 rounded-full bg-green-400" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-green-400 text-xs font-mono">
              Session active {isDemo && <span className="text-indigo-400 font-bold ml-1 border border-indigo-400/20 px-1 py-0.5 rounded bg-indigo-500/10 uppercase text-[8px]">Demo Account</span>}
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl text-white">
            {greeting()}, <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>{user?.name || 'Scholar'}</span> 👋
          </h1>
          <p className="text-soft text-sm mt-1">{levelName} · Level {level} · {xp} XP total</p>
        </motion.div>
        
        {/* Onboarding Trigger Button if they skipped */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 flex-wrap items-center">
          {/* Exam Tomorrow pulse button */}
          <Link
            to="/quiz"
            state={{ mode: 'examTomorrow' }}
            className="btn-ghost border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 flex items-center gap-2 text-xs font-bold py-2 rounded-xl transition-all shadow-glow-red animate-pulse"
          >
            🚨 Exam Tomorrow?
          </Link>
          <Link to="/study-plan" className="btn-ghost flex items-center gap-2 text-xs py-2 rounded-xl"><BookOpen size={13} />Study Plan</Link>
          <Link to="/quiz" className="btn-primary flex items-center gap-2 text-xs py-2 rounded-xl"><Brain size={13} />Start Quiz<ArrowRight size={12} /></Link>
        </motion.div>
      </div>

      {/* XP Level Bar */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-yellow-400" />
            <span className="text-sm font-display font-semibold text-white">{levelName}</span>
            <span className="text-xs text-muted font-mono">Lv.{level}</span>
          </div>
          <span className="text-xs font-mono text-soft">{xp} / {nextLevelXP} XP</span>
        </div>
        <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}
            initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
        </div>
        <p className="text-muted text-xs mt-1">{Math.max(0, nextLevelXP - xp)} XP to {getLevelName(level + 1)}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="glass-card p-5 relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
              style={{ background: s.color, transform: 'translate(30%,-30%)' }} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-soft text-xs font-body mb-1">{s.label}</p>
                <p className="font-display font-bold text-2xl" style={{ color: s.color }}>
                  <Counter end={s.value} />{s.suffix}
                </p>
                <p className="text-muted text-xs mt-0.5">{s.sub}</p>
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insight */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-5 mb-6 border" style={{ borderColor: aiInsight.type === 'warn' ? 'rgba(236,72,153,0.25)' : 'rgba(16,185,129,0.25)', background: aiInsight.type === 'warn' ? 'rgba(236,72,153,0.05)' : 'rgba(16,185,129,0.05)' }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-mono text-purple-400 mb-1">AI Study Advisor</p>
            <p className="text-sm text-white font-body leading-relaxed">
              {aiInsight.msg.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
            </p>
          </div>
          <Link to="/quiz" className="text-xs px-3 py-1.5 rounded-lg border flex-shrink-0 transition-all hover:opacity-80" style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#a855f7', background: 'rgba(99,102,241,0.08)' }}>
            Practice Now
          </Link>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Performance */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="font-display font-semibold text-white">Weekly Performance</h3><p className="text-xs text-soft">Score & XP this week</p></div>
            {hasWeeklyData && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
                <TrendingUp size={11} className="text-green-400" /><span className="text-xs font-mono text-green-400">+18%</span>
              </div>
            )}
          </div>
          <div className="h-44">
            {hasWeeklyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ left: -24, right: 4, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                    <linearGradient id="xg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#sg)" dot={false} activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="xp" stroke="#a855f7" strokeWidth={2} fill="url(#xg)" dot={false} activeDot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-white/5 bg-white/2 rounded-xl">
                <Calendar className="text-muted mb-2 animate-pulse" size={24} />
                <p className="text-xs text-soft font-semibold mb-1">Weekly Chart Locked</p>
                <p className="text-[10px] text-muted max-w-[260px]">Take your first quiz to unlock weekly performance insights.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Subject Mastery Radar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.37 }} className="glass-card p-5">
          <div className="mb-4"><h3 className="font-display font-semibold text-white">Subject Mastery</h3><p className="text-xs text-soft">Skill distribution</p></div>
          <div className="h-44">
            {hasRadarData ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e2a3a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8892a4', fontSize: 10, fontFamily: 'DM Sans' }} />
                  <Radar name="Mastery" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-white/5 bg-white/2 rounded-xl">
                <Brain className="text-muted mb-2 animate-pulse" size={24} />
                <p className="text-xs text-soft font-semibold mb-1">Subject Mastery Chart Locked</p>
                <p className="text-[10px] text-muted max-w-[260px]">Complete your first quiz to unlock subject mastery insights.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Unique Feature 1: Neural Learning DNA Card — Premium Redesign */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.39 }}
        className="mb-6 relative overflow-hidden rounded-2xl"
        style={{
          background: dna.unlocked
            ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.10) 50%, rgba(6,182,212,0.08) 100%)'
            : 'rgba(255,255,255,0.03)',
          border: dna.unlocked ? `1px solid ${dna.color || '#6366f1'}30` : '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Animated gradient aura */}
        {dna.unlocked && (
          <>
            <motion.div
              className="absolute -top-8 -right-8 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: dna.gradient, filter: 'blur(60px)', opacity: 0.15 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.22, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: dna.gradient, filter: 'blur(40px)', opacity: 0.10 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
          </>
        )}

        <div className="relative z-10 p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Animated DNA icon */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                style={{ background: dna.unlocked ? dna.gradient : 'rgba(255,255,255,0.05)' }}
                animate={dna.unlocked ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {dna.unlocked ? dna.icon : '🔒'}
              </motion.div>
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase mb-0.5" style={{ color: dna.unlocked ? dna.color : '#4b5563' }}>
                  🧬 Neural Learning DNA
                </p>
                <h3 className="font-display font-bold text-white text-lg leading-tight">
                  {dna.unlocked ? dna.title : 'Profile Locked'}
                </h3>
              </div>
            </div>

            {/* Personality badge */}
            {dna.unlocked && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border"
                style={{
                  background: `${dna.color}18`,
                  borderColor: `${dna.color}40`,
                  color: dna.color
                }}
              >
                AI Matched
              </motion.div>
            )}
          </div>

          {dna.unlocked ? (
            <>
              {/* Description */}
              <p className="text-sm text-white/80 font-body leading-relaxed mb-4">{dna.desc}</p>

              {/* Strength / Improve row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="text-[10px] font-mono text-emerald-400 mb-1">⚡ STRENGTH</p>
                  <p className="text-xs text-white/80 leading-tight">{dna.strong}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <p className="text-[10px] font-mono text-amber-400 mb-1">⚠ IMPROVE</p>
                  <p className="text-xs text-white/80 leading-tight">{dna.improve}</p>
                </div>
              </div>

              {/* AI Confidence meter */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-soft uppercase tracking-wider">AI Confidence Score</span>
                  <span className="text-xs font-bold font-mono" style={{ color: dna.color }}>{dna.confidence}%</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: dna.gradient }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dna.confidence}%` }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.6 }}
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 rounded-xl flex gap-2.5 items-start"
                style={{ background: `${dna.color}0D`, border: `1px solid ${dna.color}20` }}>
                <span className="text-sm flex-shrink-0">🎯</span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: dna.color }}>Recommendation</span>
                  <p className="text-xs text-white/75 leading-relaxed mt-0.5">{dna.recommendation}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <motion.p
                className="text-xs text-soft"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Complete <strong className="text-white">8 quiz questions</strong> to unlock your AI-powered learning profile
              </motion.p>
              <div className="mt-3 flex items-center justify-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20"
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Subject Ecosystems */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
        <h2 className="font-display font-bold text-white text-xl mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />Subject Ecosystems
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {SUBJECT_LIST.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.42 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className="glass-card p-5 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: s.gradient }} />
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" style={{ background: s.primary }} />
              <div className="text-3xl mb-3">{s.emoji}</div>
              <h4 className="font-display font-bold text-white mb-0.5 text-sm">{s.label}</h4>
              <p className="text-xs text-soft font-body mb-3 leading-relaxed">{s.tagline}</p>
              <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-3">
                <motion.div className="h-full rounded-full" style={{ background: s.gradient }}
                  initial={{ width: 0 }} animate={{ width: `${subjectProgress?.[s.id] || 0}%` }} transition={{ duration: 0.9, delay: i * 0.05 + 0.5 }} />
              </div>
              <Link to={s.path} className="flex items-center justify-between text-xs group/link">
                <span style={{ color: s.primary }}>Explore</span>
                <ArrowRight size={12} className="text-muted group-hover/link:translate-x-1 transition-transform" style={{ color: s.primary }} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-5 mb-6" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
          <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />Needs Attention
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {weakTopics.map(wt => (
              <Link key={wt.topic} to="/quiz"
                className="flex items-center justify-between px-4 py-3 rounded-xl border hover:border-red-500/35 transition-all group"
                style={{ borderColor: 'rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.05)' }}>
                <div><p className="text-sm text-white font-body">{wt.topic}</p><p className="text-xs font-mono text-red-400">{wt.accuracy}% accuracy</p></div>
                <ArrowRight size={13} className="text-muted group-hover:text-red-400 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-white flex items-center gap-2"><Star size={15} className="text-yellow-400" />Achievements</h3>
          <span className="text-xs text-soft">{state.badges.length}/{BADGES.length} unlocked</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {BADGES.map((b, i) => {
            const unlocked = state.badges.includes(b.id)
            return (
              <motion.div key={b.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.04 * i + 0.55 }}
                className="flex flex-col items-center gap-1.5 group relative" title={b.label}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${!unlocked ? 'border-border bg-surface opacity-35 grayscale' : 'border-white/10'}`}
                  style={unlocked ? { background: `${b.color}20`, boxShadow: `0 0 16px ${b.color}44` } : {}}>
                  <span className="text-xl">{b.icon}</span>
                </div>
                <span className={`text-[9px] text-center font-body leading-tight ${unlocked ? 'text-white' : 'text-muted'}`}>{b.label}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Lightweight Onboarding Modal */}
      <OnboardingModal isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </PageLayout>
  )
}
