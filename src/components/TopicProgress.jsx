import { motion } from 'framer-motion'
import { useApp, getTopicAccuracy } from '../context/AppContext'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

const TOPIC_COLORS = {
  Algebra: '#6366f1', Calculus: '#a855f7', Trigonometry: '#06b6d4',
  Geometry: '#10b981', Statistics: '#f59e0b', Matrices: '#ec4899',
  Mechanics: '#06b6d4', Kinematics: '#0ea5e9', Waves: '#22d3ee',
  Electricity: '#fbbf24', Thermodynamics: '#f87171', 'Modern Physics': '#8b5cf6',
  'Organic Chemistry': '#10b981', 'Periodic Table': '#34d399', 'Chemical Bonding': '#f59e0b',
  Reactions: '#fb923c', 'Acids & Bases': '#a3e635', Electrochemistry: '#22c55e',
  'Cell Biology': '#ec4899', Genetics: '#8b5cf6', 'Human Anatomy': '#f43f5e',
  'Plant Biology': '#4ade80', Evolution: '#fb923c', Ecology: '#2dd4bf',
  Grammar: '#f59e0b', Vocabulary: '#ef4444', Writing: '#f97316',
  Comprehension: '#eab308', Literature: '#d946ef', 'Spoken English': '#06b6d4',
}

export default function TopicProgress() {
  const { state } = useApp()
  const { topicScores } = state

  const topics = Object.entries(topicScores).map(([name, data]) => ({
    name,
    accuracy: getTopicAccuracy(data),
    correct: data.correct,
    total: data.total,
    color: TOPIC_COLORS[name] || '#6366f1',
    isWeak: getTopicAccuracy(data) < 60,
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-white text-base">Topic Mastery</h3>
          <p className="text-soft text-xs mt-0.5 font-body">Accuracy per topic</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-400" /><span className="text-xs text-soft">Strong</span></div>
          <div className="flex items-center gap-1.5"><AlertTriangle size={12} className="text-orange-400" /><span className="text-xs text-soft">Weak</span></div>
        </div>
      </div>
      <div className="space-y-4">
        {topics.map((topic, i) => (
          <motion.div key={topic.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i + 0.3 }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: topic.color }} />
                <span className="text-sm font-body text-white">{topic.name}</span>
                {topic.isWeak && <span className="text-[9px] bg-orange-500/10 border border-orange-500/25 text-orange-400 px-1.5 py-0.5 rounded font-mono">WEAK</span>}
              </div>
              <span className="text-xs font-mono text-white">{topic.accuracy}% <span className="text-muted">({topic.correct}/{topic.total})</span></span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: topic.color }} initial={{ width: 0 }} animate={{ width: `${topic.accuracy}%` }} transition={{ duration: 0.8, delay: 0.1 * i + 0.4, ease: 'easeOut' }} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
