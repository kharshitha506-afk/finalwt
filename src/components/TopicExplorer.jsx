import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, FlaskConical, Target, CheckCircle2, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const DIFFICULTY_CONFIG = {
  Beginner: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  Intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Advanced: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
}

function TopicCard({ topic, subject, index }) {
  const [open, setOpen] = useState(false)
  const [quizDone, setQuizDone] = useState([])
  const diff = DIFFICULTY_CONFIG[topic.difficulty] || DIFFICULTY_CONFIG.Intermediate
  const { dispatch } = useApp()

  const toggleConcept = (c) => {
    setQuizDone(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  }

  const handleToggleOpen = () => {
    if (!open) {
      dispatch({ type: 'INCREMENT_DAILY_STAT', payload: { type: 'studiedTopics' } })
    }
    setOpen(!open)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: open ? subject.border : 'rgba(255,255,255,0.07)', background: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(12px)' }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-white/3"
        onClick={handleToggleOpen}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-mono flex-shrink-0"
          style={{ background: `${subject.primary}18`, color: subject.primary, border: `1px solid ${subject.border}` }}>
          {topic.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-white text-sm">{topic.label}</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md"
              style={{ color: diff.color, background: diff.bg }}>
              {topic.difficulty}
            </span>
          </div>
          <p className="text-[11px] text-soft font-body mt-0.5 truncate">{topic.desc}</p>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-mono" style={{ color: subject.primary }}>
              {Math.round((quizDone.length / topic.keyConcepts.length) * 100)}%
            </p>
            <p className="text-[9px] text-muted">mastered</p>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-muted" />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 border-t" style={{ borderColor: `${subject.primary}20` }}>

              {/* Progress bar */}
              <div className="mt-3 mb-4">
                <div className="flex justify-between text-[10px] text-muted mb-1">
                  <span>Progress</span>
                  <span>{quizDone.length}/{topic.keyConcepts.length} concepts</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: subject.gradient }}
                    animate={{ width: `${(quizDone.length / topic.keyConcepts.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key formulas */}
                <div>
                  <p className="text-[10px] font-mono mb-2 flex items-center gap-1.5" style={{ color: subject.primary }}>
                    <BookOpen size={10} />KEY FORMULAS
                  </p>
                  <div className="space-y-1.5">
                    {topic.keyFormulas.map((f, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg font-mono text-[11px] text-white/80"
                        style={{ background: `${subject.primary}10`, border: `1px solid ${subject.border}` }}>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key concepts — checkable */}
                <div>
                  <p className="text-[10px] font-mono mb-2 flex items-center gap-1.5" style={{ color: subject.primary }}>
                    <Target size={10} />KEY CONCEPTS (click to track)
                  </p>
                  <div className="space-y-1.5">
                    {topic.keyConcepts.map((c, i) => {
                      const done = quizDone.includes(c)
                      return (
                        <button key={i} onClick={() => toggleConcept(c)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-left transition-all hover:bg-white/5"
                          style={{ background: done ? `${subject.primary}15` : 'transparent' }}>
                          {done
                            ? <CheckCircle2 size={12} style={{ color: subject.primary, flexShrink: 0 }} />
                            : <Circle size={12} className="text-muted flex-shrink-0" />}
                          <span style={{ color: done ? 'white' : '#8892a4' }}>{c}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link to="/quiz"
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                  style={{ borderColor: subject.border, color: subject.primary, background: subject.bgGlow }}>
                  <FlaskConical size={11} />Practice Quiz
                </Link>
                <button
                  onClick={() => document.getElementById('tutor-panel')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border border-white/10 text-soft hover:text-white transition-all">
                  <BookOpen size={11} />Ask AI Tutor
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function TopicExplorer({ topics, subject }) {
  return (
    <div className="space-y-3">
      {topics.map((topic, i) => (
        <TopicCard key={topic.id} topic={topic} subject={subject} index={i} />
      ))}
    </div>
  )
}
