import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'

const ALL_BADGES = [
  { id: 'first_correct', label: 'First Win', desc: 'Answer your first question correctly', icon: '🎯', color: '#10b981' },
  { id: 'streak_3', label: 'On Fire', desc: '3 correct answers in a row', icon: '🔥', color: '#ef4444' },
  { id: 'streak_5', label: 'Unstoppable', desc: '5 correct answers in a row', icon: '⚡', color: '#f59e0b' },
  { id: 'quiz_complete', label: 'Finisher', desc: 'Complete a full quiz session', icon: '✅', color: '#6366f1' },
  { id: 'perfect_score', label: 'Perfect', desc: '100% accuracy in a quiz', icon: '⭐', color: '#a855f7' },
  { id: 'hard_question', label: 'Deep Thinker', desc: 'Answer a hard question correctly', icon: '🧠', color: '#ec4899' },
  { id: 'level_3', label: 'Scholar', desc: 'Reach Level 3', icon: '📚', color: '#06b6d4' },
  { id: 'all_topics', label: 'Polymath', desc: 'Study all subjects', icon: '🌟', color: '#ffd60a' },
]

export default function BadgesPanel() {
  const { state } = useApp()
  const { badges } = state

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 shadow-card">
      <div className="mb-5">
        <h3 className="font-display font-semibold text-white text-base">Achievements</h3>
        <p className="text-soft text-xs mt-0.5 font-body">{badges.length}/{ALL_BADGES.length} badges unlocked</p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {ALL_BADGES.map((badge, i) => {
          const unlocked = badges.includes(badge.id)
          return (
            <motion.div key={badge.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 * i + 0.5 }}
              className="group relative flex flex-col items-center gap-1.5" title={badge.desc}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-200 ${!unlocked ? 'border-border bg-surface opacity-35 grayscale' : 'border-white/10'}`}
                style={unlocked ? { background: `${badge.color}20`, boxShadow: `0 0 16px ${badge.color}44` } : {}}>
                <span className="text-xl">{badge.icon}</span>
              </div>
              <span className={`text-[9px] text-center font-body leading-tight ${unlocked ? 'text-white' : 'text-muted'}`}>{badge.label}</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 bg-card border border-border rounded-lg p-2 text-[9px] text-soft text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-card">
                {badge.desc}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
