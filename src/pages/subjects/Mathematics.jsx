import { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Link } from 'react-router-dom'
import { Play, Brain } from 'lucide-react'
import SubjectLayout from '../../layouts/SubjectLayout'
import SmartTutor from '../../components/SmartTutor'
import TopicExplorer from '../../components/TopicExplorer'
import { GlassCard, FormulaCard, StatBadge } from '../../components/SubjectCards'
import { SUBJECTS } from '../../data/subjects'
import { TOPIC_DATA } from '../../data/eduKnowledge'
import { fadeUp } from '../../animations/variants'
import { useApp } from '../../context/AppContext'

const s = SUBJECTS.mathematics
const topics = TOPIC_DATA.mathematics

const GRAPHS = {
  'sin(x)': Array.from({ length: 37 }, (_, i) => ({ x: i * 10, y: +(Math.sin(i * 10 * Math.PI / 180) * 100).toFixed(1) })),
  'cos(x)': Array.from({ length: 37 }, (_, i) => ({ x: i * 10, y: +(Math.cos(i * 10 * Math.PI / 180) * 100).toFixed(1) })),
  'x²-4':   Array.from({ length: 21 }, (_, i) => { const x = i - 10; return { x, y: x * x - 4 } }),
  'x³':     Array.from({ length: 21 }, (_, i) => { const x = i - 10; return { x, y: x * x * x } }),
}

const CustomTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return <div className="bg-card border border-border rounded-lg px-2.5 py-1 text-xs font-mono text-white">{payload[0].value}</div>
}

export default function Mathematics() {
  const [activeGraph, setActiveGraph] = useState('sin(x)')
  const { state } = useApp()
  const { topicScores, subjectProgress } = state
  const avgMastery = subjectProgress?.[s.id] || 0

  return (
    <SubjectLayout subject={s}>
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.primary }} />
          <span className="text-xs font-mono" style={{ color: s.primary }}>Mathematics Ecosystem</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-1">
          Math <span style={{ background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Universe</span>
        </h1>
        <p className="text-soft text-sm font-body">{topics.length} topics · Interactive learning · AI-powered</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatBadge value={topics.length} label="Topics" subject={s} delay={0.05} />
        <StatBadge value={`${avgMastery}%`} label="Avg Mastery" subject={s} delay={0.1} />
        <StatBadge value="∞" label="Practice Problems" subject={s} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Topics + Graph */}
        <div className="xl:col-span-2 space-y-6">

          {/* Graph Visualizer */}
          <GlassCard subject={s} delay={0.1}>
            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-display font-semibold text-white">Function Visualizer</h3>
                  <p className="text-xs text-soft">Explore mathematical functions interactively</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(GRAPHS).map(g => (
                    <button key={g} onClick={() => setActiveGraph(g)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border font-mono transition-all"
                      style={{
                        borderColor: activeGraph === g ? s.primary : 'rgba(255,255,255,0.08)',
                        background: activeGraph === g ? `${s.primary}18` : 'transparent',
                        color: activeGraph === g ? s.primary : '#8892a4',
                      }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={GRAPHS[activeGraph]} margin={{ left: -24, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2a3a" vertical={false} />
                    <XAxis dataKey="x" tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#4a5568', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTip />} />
                    <Line type="monotone" dataKey="y" stroke={s.primary} strokeWidth={2.5} dot={false}
                      activeDot={{ r: 4, fill: s.primary, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>

          {/* Key Formulas */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Essential Formulas</h3>
            <div className="grid grid-cols-2 gap-3">
              {s.formulas.map((f, i) => <FormulaCard key={f.label} label={f.label} expr={f.expr} subject={s} delay={0.05 * i} />)}
            </div>
          </div>

          {/* Topic Explorer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-white">Topics</h3>
              <Link to="/quiz" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
                style={{ borderColor: s.border, color: s.primary, background: s.bgGlow }}>
                <Play size={11} />Practice All
              </Link>
            </div>
            <TopicExplorer topics={topics} subject={s} />
          </div>

          {/* Geometry SVG */}
          <GlassCard subject={s} delay={0.3}>
            <div className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-3">Geometry — Animated Proof</h3>
              <div className="flex items-center gap-6">
                <div className="flex-1 h-36 flex items-center justify-center">
                  <svg viewBox="0 0 200 150" className="w-full h-full">
                    <defs>
                      <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={s.primary} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={s.secondary} stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                    <motion.circle cx="100" cy="70" r="45" fill="none" stroke="url(#mg)" strokeWidth="1.5"
                      animate={{ r: [45, 50, 45] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.polygon points="100,25 143,100 57,100" fill="none" stroke={s.primary} strokeWidth="1" strokeOpacity="0.6"
                      animate={{ rotate: [0, 360] }} style={{ transformOrigin: '100px 70px' }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} />
                    <circle cx="100" cy="70" r="3" fill={s.primary} />
                    <line x1="100" y1="70" x2="145" y2="70" stroke={s.secondary} strokeWidth="1" strokeOpacity="0.5" />
                    <text x="118" y="65" fill={s.secondary} fontSize="9" fontFamily="JetBrains Mono" fillOpacity="0.8">r</text>
                    <text x="68" y="140" fill="#4a5568" fontSize="8" fontFamily="JetBrains Mono">a² + b² = c²</text>
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  {['Pythagorean theorem in action', 'Circumscribed triangle rotation', 'Circle properties visualization'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-soft">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.primary }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: AI Tutor */}
        <div id="tutor-panel">
          <div className="sticky top-4 space-y-4">
            <SmartTutor subject={s} compact={true} />
            {/* Quick stats */}
            <GlassCard subject={s} delay={0.4}>
              <div className="p-4">
                <p className="text-xs font-mono mb-3" style={{ color: s.primary }}>YOUR PROGRESS</p>
                {topics.slice(0, 4).map((t) => {
                  const score = topicScores[t.label]
                  const pct = score && score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
                  return (
                    <div key={t.id} className="mb-2.5">
                      <div className="flex justify-between text-[10px] text-soft mb-1">
                        <span>{t.label}</span>
                        <span style={{ color: s.primary }}>{pct}%</span>
                      </div>
                      <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: s.gradient }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </SubjectLayout>
  )
}
