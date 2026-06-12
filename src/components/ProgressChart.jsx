import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

const weeklyData = [
  { day: 'Mon', score: 62, xp: 48 },
  { day: 'Tue', score: 74, xp: 61 },
  { day: 'Wed', score: 68, xp: 54 },
  { day: 'Thu', score: 82, xp: 77 },
  { day: 'Fri', score: 78, xp: 70 },
  { day: 'Sat', score: 89, xp: 84 },
  { day: 'Sun', score: 93, xp: 91 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-card text-xs">
      <p className="text-soft mb-1.5 font-body">{label}</p>
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

export default function ProgressChart() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-white text-base">Weekly Performance</h3>
          <p className="text-soft text-xs mt-0.5 font-body">Score & XP trend this week</p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1">
          <TrendingUp size={12} className="text-green-400" />
          <span className="text-green-400 text-xs font-mono">+18%</span>
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full bg-indigo-400 inline-block" /><span className="text-xs text-soft">Score</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded-full bg-purple-400 inline-block" /><span className="text-xs text-soft">XP</span></div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#4a5568', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4a5568', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGrad)" dot={false} activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} />
            <Area type="monotone" dataKey="xp" stroke="#a855f7" strokeWidth={2} fill="url(#xpGrad)" dot={false} activeDot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
