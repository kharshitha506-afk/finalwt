import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import SubjectLayout from '../../layouts/SubjectLayout'
import SmartTutor from '../../components/SmartTutor'
import TopicExplorer from '../../components/TopicExplorer'
import { GlassCard, FormulaCard, StatBadge } from '../../components/SubjectCards'
import { SUBJECTS } from '../../data/subjects'
import { TOPIC_DATA } from '../../data/eduKnowledge'
import { fadeUp } from '../../animations/variants'
import { useApp } from '../../context/AppContext'

const s = SUBJECTS.biology
const topics = TOPIC_DATA.biology

function DNAAnimation() {
  return (
    <GlassCard subject={s} delay={0.1}>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-1">DNA Double Helix</h3>
        <p className="text-xs text-soft mb-3">A → T and G → C base pairing</p>
        <div className="flex items-center justify-center h-48">
          <svg viewBox="0 0 200 180" className="w-full h-full">
            {Array.from({ length: 9 }, (_, i) => {
              const t = i / 8
              const x1 = 70 + Math.sin(t * Math.PI * 2) * 35
              const x2 = 130 - Math.sin(t * Math.PI * 2) * 35
              const y = 20 + i * 16
              const bases = [['A','T'],['T','A'],['G','C'],['C','G'],['A','T'],['G','C'],['T','A'],['C','G'],['A','T']]
              const colors = { A: s.primary, T: s.secondary, G: '#a855f7', C: '#f59e0b' }
              return (
                <g key={i}>
                  <motion.line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} />
                  <motion.circle cx={x1} cy={y} r="6" fill={colors[bases[i][0]]}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08, type: 'spring' }} />
                  <motion.circle cx={x2} cy={y} r="6" fill={colors[bases[i][1]]}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 + 0.05, type: 'spring' }} />
                  <text x={x1 - 3} y={y + 4} fill="white" fontSize="6" fontFamily="JetBrains Mono">{bases[i][0]}</text>
                  <text x={x2 - 3} y={y + 4} fill="white" fontSize="6" fontFamily="JetBrains Mono">{bases[i][1]}</text>
                </g>
              )
            })}
            <motion.path d={`M ${70 + Math.sin(0) * 35} 20 ${Array.from({ length: 20 }, (_, i) => { const t = i / 19; return `L ${70 + Math.sin(t * Math.PI * 2) * 35} ${20 + t * 144}` }).join(' ')}`}
              fill="none" stroke={s.primary} strokeWidth="2.5" strokeOpacity="0.7"
              animate={{ strokeDashoffset: [100, 0] }} />
            <motion.path d={`M ${130 - Math.sin(0) * 35} 20 ${Array.from({ length: 20 }, (_, i) => { const t = i / 19; return `L ${130 - Math.sin(t * Math.PI * 2) * 35} ${20 + t * 144}` }).join(' ')}`}
              fill="none" stroke={s.secondary} strokeWidth="2.5" strokeOpacity="0.7" />
          </svg>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-[10px] font-mono">
          {[['A', s.primary], ['T', s.secondary], ['G', '#a855f7'], ['C', '#f59e0b']].map(([b, c]) => (
            <span key={b} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: c }} />{b}</span>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

function CellDiagram() {
  const organelles = [
    { name: 'Nucleus', x: 95, y: 85, r: 22, color: s.primary, desc: 'Controls cell' },
    { name: 'Mito', x: 148, y: 60, r: 14, color: '#f59e0b', desc: 'ATP production' },
    { name: 'ER', x: 55, y: 110, r: 10, color: s.secondary, desc: 'Protein synthesis' },
    { name: 'Golgi', x: 145, y: 115, r: 11, color: '#a855f7', desc: 'Packaging' },
  ]
  return (
    <GlassCard subject={s} delay={0.25}>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-1">Animal Cell Diagram</h3>
        <p className="text-xs text-soft mb-3">Click to learn about each organelle</p>
        <div className="relative h-44 flex items-center justify-center">
          <svg viewBox="0 0 200 165" className="w-full h-full">
            {/* Cell membrane */}
            <ellipse cx="100" cy="90" rx="90" ry="70" fill="rgba(236,72,153,0.04)" stroke={s.primary} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 2" />
            {organelles.map(o => (
              <g key={o.name}>
                <circle cx={o.x} cy={o.y} r={o.r} fill={`${o.color}25`} stroke={o.color} strokeWidth="1.5" />
                <text x={o.x} y={o.y + 4} fill={o.color} fontSize="7" textAnchor="middle" fontFamily="JetBrains Mono">{o.name}</text>
              </g>
            ))}
            {/* Cytoplasm label */}
            <text x="32" y="145" fill="#4a5568" fontSize="7" fontFamily="DM Sans">Cytoplasm</text>
            <text x="140" y="158" fill="#4a5568" fontSize="7" fontFamily="DM Sans">Cell membrane</text>
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {organelles.map(o => (
            <div key={o.name} className="flex items-center gap-1.5 text-[10px] text-soft">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: o.color }} />
              <span>{o.name}: {o.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

const SYSTEMS = [
  { name: 'Digestive System', organ: '🫁', desc: 'Mouth → Oesophagus → Stomach → Small intestine → Large intestine', color: s.primary },
  { name: 'Cardiovascular', organ: '🫀', desc: 'Heart pumps blood through arteries, veins, and capillaries', color: s.secondary },
  { name: 'Nervous System', organ: '🧠', desc: 'Brain, spinal cord, peripheral nerves — electrical signals', color: '#a855f7' },
  { name: 'Respiratory', organ: '🫁', desc: 'Lungs, diaphragm — O₂/CO₂ gas exchange in alveoli', color: '#f59e0b' },
]

export default function Biology() {
  const { state } = useApp()
  const { topicScores, subjectProgress } = state
  const avgMastery = subjectProgress?.[s.id] || 0

  return (
    <SubjectLayout subject={s}>
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.primary }} />
          <span className="text-xs font-mono" style={{ color: s.primary }}>Biology Ecosystem</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-1">
          Bio <span style={{ background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lab</span>
        </h1>
        <p className="text-soft text-sm">{topics.length} topics · DNA animations · AI-powered</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatBadge value={topics.length} label="Topics" subject={s} delay={0.05} />
        <StatBadge value={`${avgMastery}%`} label="Avg Mastery" subject={s} delay={0.1} />
        <StatBadge value="37T" label="Cells in Body" subject={s} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <DNAAnimation />
          <CellDiagram />

          {/* Human body systems */}
          <GlassCard subject={s} delay={0.3}>
            <div className="p-5">
              <h3 className="font-display font-semibold text-white mb-4 text-sm">Human Body Systems</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYSTEMS.map((sys, i) => (
                  <motion.div key={sys.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="p-3 rounded-xl border" style={{ borderColor: `${sys.color}25`, background: `${sys.color}08` }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{sys.organ}</span>
                      <span className="text-xs font-display font-semibold text-white">{sys.name}</span>
                    </div>
                    <p className="text-[10px] text-soft font-body leading-relaxed">{sys.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Formulas */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Key Equations</h3>
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
                <Play size={11} />Practice
              </Link>
            </div>
            <TopicExplorer topics={topics} subject={s} />
          </div>
        </div>

        <div id="tutor-panel">
          <div className="sticky top-4 space-y-4">
            <SmartTutor subject={s} compact />
            <GlassCard subject={s} delay={0.4}>
              <div className="p-4">
                <p className="text-xs font-mono mb-3" style={{ color: s.primary }}>PROGRESS</p>
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
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
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
