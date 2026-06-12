import { motion } from 'framer-motion'
import { cardHover, transition } from '../animations/variants'

export function GlassCard({ children, className = '', subject, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transition.normal, delay }}
      whileHover={{ y: -4, transition: transition.fast }}
      onClick={onClick}
      className={`bg-card/60 backdrop-blur-md border rounded-2xl shadow-card relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ borderColor: subject?.border || 'rgba(255,255,255,0.08)' }}
    >
      {/* Subtle gradient shimmer top */}
      {subject && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: subject.gradient }}
        />
      )}
      {children}
    </motion.div>
  )
}

export function FormulaCard({ label, expr, subject, delay }) {
  return (
    <GlassCard subject={subject} delay={delay} className="p-4">
      <p className="text-[10px] font-mono mb-2" style={{ color: subject.primary }}>{label}</p>
      <p className="font-mono text-white text-sm lg:text-base tracking-wide">{expr}</p>
    </GlassCard>
  )
}

export function ToolCard({ tool, subject, delay }) {
  return (
    <GlassCard subject={subject} delay={delay} className="p-5 group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-mono font-bold"
          style={{ background: `${subject.primary}18`, color: subject.primary }}
        >
          {tool.icon}
        </div>
        <span className="text-xs font-mono" style={{ color: subject.primary }}>
          {tool.progress}%
        </span>
      </div>
      <p className="font-display font-semibold text-white text-sm mb-0.5">{tool.label}</p>
      <p className="text-xs text-soft font-body mb-3">{tool.desc}</p>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: subject.gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${tool.progress}%` }}
          transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
        />
      </div>
    </GlassCard>
  )
}

export function QuizTopicCard({ topic, subject, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
      className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
      style={{ borderColor: subject.border, background: subject.bgGlow }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
        style={{ background: `${subject.primary}20`, color: subject.primary }}
      >
        {index + 1}
      </div>
      <span className="text-sm font-body text-white">{topic}</span>
    </motion.div>
  )
}

export function StatBadge({ value, label, subject, delay }) {
  return (
    <GlassCard subject={subject} delay={delay} className="p-4 text-center">
      <p className="font-display font-bold text-2xl mb-0.5" style={{ color: subject.primary }}>{value}</p>
      <p className="text-xs text-soft font-body">{label}</p>
    </GlassCard>
  )
}
