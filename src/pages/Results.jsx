import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'
import { Trophy, RotateCcw, BookOpen, Zap, Target, TrendingUp, Award, ArrowRight, Star } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { useApp, getWeakTopics, getLevelName } from '../context/AppContext'
import { SUBJECT_LIST } from '../data/subjects'

function AccuracyRing({ accuracy, color }) {
  const data = [{ value: accuracy, fill: color }]
  return (
    <div className="relative w-36 h-36 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="68%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: '#1e2a3a' }} dataKey="value" cornerRadius={8} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-3xl" style={{ color }}>{accuracy}%</span>
        <span className="text-xs text-soft">accuracy</span>
      </div>
    </div>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useApp()
  const ss = location.state?.sessionScore ?? state.score
  const st = location.state?.sessionTotal ?? state.totalQuestions
  const streak = location.state?.sessionStreak ?? state.maxStreak
  const subjectId = location.state?.subject ?? 'mathematics'
  const totalXP = location.state?.totalXP ?? ss * 12
  const subject = SUBJECT_LIST.find(s => s.id === subjectId) || SUBJECT_LIST[0]
  const accuracy = st > 0 ? Math.round((ss / st) * 100) : 0
  const weakTopics = getWeakTopics(state.topicScores)

  const grade = accuracy >= 90 ? { label: 'Outstanding!', color: '#10b981', emoji: '🏆' }
    : accuracy >= 75 ? { label: 'Great Work!',    color: '#6366f1', emoji: '🎯' }
    : accuracy >= 50 ? { label: 'Keep Going!',    color: '#f59e0b', emoji: '💪' }
    : { label: 'Keep Practicing!', color: '#ef4444', emoji: '📚' }

  const METRICS = [
    { icon: Zap,        label: 'XP Earned',     value: `+${totalXP}`, color: '#f59e0b' },
    { icon: Trophy,     label: 'Best Streak',   value: `${streak}🔥`, color: '#ef4444' },
    { icon: Target,     label: 'Accuracy',      value: `${accuracy}%`, color: '#10b981' },
    { icon: TrendingUp, label: 'Focus Topics',  value: weakTopics.length, color: '#ec4899' },
  ]

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.div className="text-6xl mb-3" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, delay: 0.2 }}>
            {grade.emoji}
          </motion.div>
          <h1 className="font-display font-bold text-4xl text-white mb-1">{grade.label}</h1>
          <p className="text-soft font-body">{subject.label} Quiz · {getLevelName(state.level)} · {state.xp} XP total</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex flex-col items-center gap-4">
            <AccuracyRing accuracy={accuracy} color={grade.color} />
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-white">{ss}/{st}</p>
              <p className="text-soft text-sm font-body">Questions correct</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="glass-card p-6 grid grid-cols-2 gap-4 content-center">
            {METRICS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center gap-1.5"><Icon size={11} style={{ color }} /><span className="text-xs text-soft">{label}</span></div>
                <p className="font-display font-bold text-xl" style={{ color }}>{value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {weakTopics.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-5 mb-6" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
            <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2"><Award size={15} className="text-red-400" />Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map(wt => (
                <div key={wt.topic} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)' }}>
                  <span className="text-sm text-white font-body">{wt.topic}</span>
                  <span className="text-xs font-mono text-red-400">{wt.accuracy}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-5 mb-6" style={{ borderColor: subject.border, background: subject.bgGlow }}>
          <h3 className="font-display font-semibold text-white mb-2 text-sm">Next Steps</h3>
          <p className="text-xs text-soft font-body mb-3">
            {accuracy >= 75 ? `Great score in ${subject.label}! Try Hard difficulty for maximum XP.` : `Review ${weakTopics[0]?.topic || subject.label} topics and retry for improvement.`}
          </p>
          <Link to={subject.path} className="flex items-center gap-1.5 text-xs font-body" style={{ color: subject.primary }}>
            <BookOpen size={11} />Study {subject.label} topics <ArrowRight size={10} />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/quiz')} className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto"><RotateCcw size={14} />Try Again</button>
          <Link to="/study-plan" className="btn-ghost flex items-center gap-2 justify-center w-full sm:w-auto"><BookOpen size={14} />Study Plan</Link>
          <Link to="/dashboard" className="btn-ghost flex items-center gap-2 justify-center w-full sm:w-auto"><Trophy size={14} />Dashboard</Link>
        </motion.div>
      </div>
    </PageLayout>
  )
}
