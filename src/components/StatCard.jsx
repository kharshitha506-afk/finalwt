import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, sub, color = '#00d4ff', delay = 0, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 shadow-card relative overflow-hidden group hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ background: color, transform: 'translate(30%, -30%)' }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-soft text-xs font-body mb-1">{label}</p>
          <p
            className="font-display font-bold text-2xl"
            style={gradient ? { background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color }}
          >
            {value}
          </p>
          {sub && <p className="text-muted text-xs font-body mt-0.5">{sub}</p>}
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}
