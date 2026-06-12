import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import SubjectLayout from '../../layouts/SubjectLayout'
import SmartTutor from '../../components/SmartTutor'
import TopicExplorer from '../../components/TopicExplorer'
import { GlassCard, FormulaCard, StatBadge } from '../../components/SubjectCards'
import { SUBJECTS, ELEMENTS, ELEMENT_COLORS } from '../../data/subjects'
import { TOPIC_DATA } from '../../data/eduKnowledge'
import { fadeUp } from '../../animations/variants'
import { useApp } from '../../context/AppContext'

const s = SUBJECTS.chemistry
const topics = TOPIC_DATA.chemistry

function PeriodicTable() {
  const [sel, setSel] = useState(null)
  const el = sel ? ELEMENTS.find(e => e.symbol === sel) : null
  return (
    <GlassCard subject={s} delay={0.1}>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-1">Interactive Periodic Table</h3>
        <p className="text-xs text-soft mb-4">Click any element to explore its properties</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {ELEMENTS.map(e => {
            const color = ELEMENT_COLORS[e.group]
            const active = sel === e.symbol
            return (
              <motion.button key={e.symbol} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSel(active ? null : e.symbol)}
                className="w-11 h-11 rounded-xl flex flex-col items-center justify-center border transition-all"
                style={{ borderColor: active ? color : 'rgba(255,255,255,0.06)', background: active ? `${color}22` : `${color}08`, boxShadow: active ? `0 0 14px ${color}55` : 'none' }}>
                <span className="text-[8px] font-mono" style={{ color }}>{e.num}</span>
                <span className="text-xs font-mono font-bold" style={{ color }}>{e.symbol}</span>
              </motion.button>
            )
          })}
        </div>
        <motion.div key={sel} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="min-h-[40px]">
          {el ? (
            <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: `${ELEMENT_COLORS[el.group]}30`, background: `${ELEMENT_COLORS[el.group]}10` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-mono font-bold" style={{ background: `${ELEMENT_COLORS[el.group]}20`, color: ELEMENT_COLORS[el.group] }}>{el.symbol}</div>
              <div>
                <p className="text-sm font-body text-white font-semibold">{el.name}</p>
                <p className="text-xs font-mono text-soft">Atomic No. {el.num} · Group: {el.group}</p>
              </div>
            </div>
          ) : <p className="text-xs text-muted font-body">Select an element to explore properties</p>}
        </motion.div>
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(ELEMENT_COLORS).map(([k, c]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: c }} />
              <span className="text-[9px] text-muted capitalize">{k}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

function AtomAnimation() {
  return (
    <GlassCard subject={s} delay={0.25}>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-1">Atomic Model — Carbon (6C)</h3>
        <p className="text-xs text-soft mb-3">Electron configuration: 2, 4</p>
        <div className="flex items-center justify-center h-40">
          <svg viewBox="0 0 200 160" className="w-full h-full">
            <defs>
              <radialGradient id="nucG">
                <stop offset="0%" stopColor={s.primary} stopOpacity="1" />
                <stop offset="100%" stopColor={s.secondary} stopOpacity="0.7" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="80" r="13" fill="url(#nucG)" />
            <text x="94" y="84" fill="white" fontSize="8" fontFamily="JetBrains Mono">6C</text>
            {/* Shell 1 */}
            <ellipse cx="100" cy="80" rx="32" ry="12" fill="none" stroke={s.primary} strokeWidth="0.7" strokeOpacity="0.4" />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '100px 80px' }}>
              <circle cx="132" cy="80" r="4" fill={s.primary} fillOpacity="0.9" />
            </motion.g>
            <motion.g animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '100px 80px' }}>
              <circle cx="68" cy="80" r="4" fill={s.primary} fillOpacity="0.9" />
            </motion.g>
            {/* Shell 2 */}
            <ellipse cx="100" cy="80" rx="58" ry="22" fill="none" stroke={s.secondary} strokeWidth="0.7" strokeOpacity="0.35" />
            {[0, 90, 180, 270].map((deg, i) => (
              <motion.g key={i} animate={{ rotate: 360 }} transition={{ duration: 6 + i * 0.5, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '100px 80px' }}>
                <circle cx={100 + 58 * Math.cos(deg * Math.PI / 180)} cy={80 + 22 * Math.sin(deg * Math.PI / 180)} r="3.5" fill={s.secondary} fillOpacity="0.85" />
              </motion.g>
            ))}
            <text x="58" y="152" fill="#4a5568" fontSize="8" fontFamily="JetBrains Mono">Valence electrons: 4</text>
          </svg>
        </div>
      </div>
    </GlassCard>
  )
}

const MOLECULES = [
  { name: 'Water', formula: 'H₂O', type: 'Polar covalent', geometry: 'Bent (104.5°)', color: '#06b6d4' },
  { name: 'Methane', formula: 'CH₄', type: 'Nonpolar covalent', geometry: 'Tetrahedral', color: '#10b981' },
  { name: 'Ammonia', formula: 'NH₃', type: 'Polar covalent', geometry: 'Trigonal pyramidal', color: '#f59e0b' },
  { name: 'CO₂', formula: 'CO₂', type: 'Polar bonds, nonpolar', geometry: 'Linear (180°)', color: '#a855f7' },
]

export default function Chemistry() {
  const { state } = useApp()
  const { topicScores, subjectProgress } = state
  const avgMastery = subjectProgress?.[s.id] || 0

  return (
    <SubjectLayout subject={s}>
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.primary }} />
          <span className="text-xs font-mono" style={{ color: s.primary }}>Chemistry Ecosystem</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-1">
          Chem <span style={{ background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lab</span>
        </h1>
        <p className="text-soft text-sm font-body">{topics.length} topics · Molecular explorer · AI-powered</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatBadge value={topics.length} label="Topics" subject={s} delay={0.05} />
        <StatBadge value={`${avgMastery}%`} label="Avg Mastery" subject={s} delay={0.1} />
        <StatBadge value="118" label="Elements" subject={s} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <PeriodicTable />
          <AtomAnimation />

          {/* Molecule Cards */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Common Molecules</h3>
            <div className="grid grid-cols-2 gap-3">
              {MOLECULES.map((m, i) => (
                <motion.div key={m.name}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                  className="rounded-2xl p-4 border relative overflow-hidden"
                  style={{ borderColor: `${m.color}28`, background: 'rgba(17,24,39,0.6)' }}>
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
                  <p className="font-mono text-2xl font-bold mb-1" style={{ color: m.color }}>{m.formula}</p>
                  <p className="text-sm font-body text-white">{m.name}</p>
                  <p className="text-xs text-soft mt-0.5">{m.type}</p>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-md mt-2 inline-block border" style={{ color: m.color, borderColor: `${m.color}30`, background: `${m.color}12` }}>{m.geometry}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-white mb-3">Key Formulas</h3>
            <div className="grid grid-cols-2 gap-3">
              {s.formulas.map((f, i) => <FormulaCard key={f.label} label={f.label} expr={f.expr} subject={s} delay={0.05 * i} />)}
            </div>
          </div>

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
        </div>

        <div id="tutor-panel">
          <div className="sticky top-4 space-y-4">
            <SmartTutor subject={s} compact={true} />
            <GlassCard subject={s} delay={0.4}>
              <div className="p-4">
                <p className="text-xs font-mono mb-3" style={{ color: s.primary }}>YOUR PROGRESS</p>
                {topics.slice(0, 5).map((t) => {
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
