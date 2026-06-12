import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, Square, RefreshCw } from 'lucide-react'
import SubjectLayout from '../../layouts/SubjectLayout'
import SmartTutor from '../../components/SmartTutor'
import TopicExplorer from '../../components/TopicExplorer'
import { GlassCard, FormulaCard, StatBadge } from '../../components/SubjectCards'
import { SUBJECTS } from '../../data/subjects'
import { TOPIC_DATA } from '../../data/eduKnowledge'
import { fadeUp } from '../../animations/variants'
import { useApp } from '../../context/AppContext'

const s = SUBJECTS.physics
const topics = TOPIC_DATA.physics

function ProjectileSim() {
  const [running, setRunning] = useState(false)
  const [ball, setBall] = useState({ x: 10, y: 130 })
  const stRef = useRef({ x: 10, y: 130, vx: 3.2, vy: -7 })
  const rafRef = useRef(null)

  const reset = () => {
    setRunning(false)
    cancelAnimationFrame(rafRef.current)
    stRef.current = { x: 10, y: 130, vx: 3.2, vy: -7 }
    setBall({ x: 10, y: 130 })
  }

  useEffect(() => {
    if (!running) { cancelAnimationFrame(rafRef.current); return }
    const tick = () => {
      const st = stRef.current
      st.vy += 0.2
      st.x += st.vx
      st.y += st.vy
      if (st.y >= 130) { st.y = 130; st.vy *= -0.55; st.vx *= 0.97 }
      if (st.x >= 185) { reset(); return }
      setBall({ x: st.x, y: st.y })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  return (
    <GlassCard subject={s} delay={0.1}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-white text-sm">Projectile Motion Simulator</h3>
            <p className="text-xs text-soft">Live physics simulation — v = u + at</p>
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="p-1.5 rounded-lg border border-border text-soft hover:text-white transition-all bg-void/10"><RefreshCw size={12} /></button>
            <button onClick={() => setRunning(!running)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
              style={{ borderColor: s.border, color: s.primary, background: s.bgGlow }}>
              {running ? <><Square size={11} />Stop</> : <><Play size={11} />Launch</>}
            </button>
          </div>
        </div>
        <div className="relative h-44 bg-void/50 rounded-xl overflow-hidden border border-border">
          <svg width="100%" height="100%" viewBox="0 0 200 150">
            <line x1="0" y1="135" x2="200" y2="135" stroke="#1e2a3a" strokeWidth="1.5" />
            {[40, 80, 120, 160].map(x => <line key={x} x1={x} y1="0" x2={x} y2="135" stroke="#1e2a3a" strokeWidth="0.5" strokeOpacity="0.4" />)}
            {[35, 70, 105].map(y => <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#1e2a3a" strokeWidth="0.5" strokeOpacity="0.3" />)}
            <circle cx={ball.x} cy={ball.y} r="7" fill={s.primary} fillOpacity="0.9" />
            <circle cx={ball.x} cy={ball.y} r="14" fill={s.primary} fillOpacity="0.1" />
            {running && <>
              <line x1={ball.x} y1={ball.y} x2={ball.x + stRef.current.vx * 5} y2={ball.y} stroke={s.secondary} strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1={ball.x} y1={ball.y} x2={ball.x} y2={ball.y + stRef.current.vy * 2} stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.8" />
            </>}
            <text x="4" y="148" fill="#4a5568" fontSize="8" fontFamily="JetBrains Mono">g = 9.8 m/s²</text>
          </svg>
        </div>
        <div className="flex gap-5 mt-2.5 text-[10px] font-mono">
          <span style={{ color: s.secondary }}>→ Vx (horizontal)</span>
          <span className="text-yellow-400">↓ Vy + gravity</span>
          <span className="text-soft ml-auto">F = ma</span>
        </div>
      </div>
    </GlassCard>
  )
}

function WaveViz() {
  const t = useRef(0)
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    const W = canvas.offsetWidth, H = canvas.offsetHeight

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t.current += 0.05

      // Wave 1
      ctx.beginPath()
      ctx.strokeStyle = s.primary
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.8
      for (let x = 0; x < W; x++) {
        const y = H / 2 + Math.sin(x * 0.05 + t.current) * (H / 3)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Wave 2
      ctx.beginPath()
      ctx.strokeStyle = s.secondary
      ctx.lineWidth = 1.5
      ctx.globalAlpha = 0.5
      for (let x = 0; x < W; x++) {
        const y = H / 2 + Math.sin(x * 0.08 + t.current * 1.5) * (H / 5)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <GlassCard subject={s} delay={0.25}>
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-1">Wave Propagation</h3>
        <p className="text-xs text-soft mb-3">v = fλ · Superposition principle</p>
        <canvas ref={canvasRef} className="w-full h-28 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }} />
        <div className="flex gap-4 mt-2 text-[10px] font-mono">
          <span style={{ color: s.primary }}>— Wave 1 (high freq)</span>
          <span style={{ color: s.secondary }}>— Wave 2 (low freq)</span>
        </div>
      </div>
    </GlassCard>
  )
}

export default function Physics() {
  const { state } = useApp()
  const { topicScores, subjectProgress } = state
  const avgMastery = subjectProgress?.[s.id] || 0

  return (
    <SubjectLayout subject={s}>
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.primary }} />
          <span className="text-xs font-mono" style={{ color: s.primary }}>Physics Ecosystem</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-1">
          Physics <span style={{ background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lab</span>
        </h1>
        <p className="text-soft text-sm font-body">{topics.length} topics · Live simulations · AI-powered</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatBadge value={topics.length} label="Topics" subject={s} delay={0.05} />
        <StatBadge value={`${avgMastery}%`} label="Avg Mastery" subject={s} delay={0.1} />
        <StatBadge value="2" label="Simulations" subject={s} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <ProjectileSim />
          <WaveViz />

          <div>
            <h3 className="font-display font-semibold text-white mb-3">Core Formulas</h3>
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
