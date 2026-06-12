import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Play, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import SubjectLayout from '../../layouts/SubjectLayout'
import SmartTutor from '../../components/SmartTutor'
import TopicExplorer from '../../components/TopicExplorer'
import { GlassCard, FormulaCard, StatBadge } from '../../components/SubjectCards'
import { SUBJECTS } from '../../data/subjects'
import { TOPIC_DATA } from '../../data/eduKnowledge'
import { fadeUp } from '../../animations/variants'
import { useApp } from '../../context/AppContext'

const s = SUBJECTS.english
const topics = TOPIC_DATA.english

const VOCAB_WORDS = [
  { word: 'Eloquent', meaning: 'Fluent and persuasive in speaking or writing', example: 'She gave an eloquent speech.', synonyms: ['articulate', 'fluent', 'persuasive'] },
  { word: 'Ambiguous', meaning: 'Open to more than one interpretation', example: 'The contract was deliberately ambiguous.', synonyms: ['vague', 'unclear', 'uncertain'] },
  { word: 'Ephemeral', meaning: 'Lasting for a very short time', example: 'Fame can be ephemeral.', synonyms: ['fleeting', 'transient', 'brief'] },
  { word: 'Pragmatic', meaning: 'Dealing with things sensibly and realistically', example: 'We need a pragmatic approach.', synonyms: ['practical', 'realistic', 'sensible'] },
]

function VocabBuilder() {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const word = VOCAB_WORDS[idx]
  return (
    <GlassCard subject={s} delay={0.1}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="font-display font-semibold text-white text-sm">Vocabulary Builder</h3><p className="text-xs text-soft">Word {idx + 1} of {VOCAB_WORDS.length}</p></div>
          <button onClick={() => { setIdx((idx + 1) % VOCAB_WORDS.length); setFlipped(false) }} className="p-1.5 rounded-lg border border-border text-soft hover:text-white transition-all bg-void/10"><RefreshCw size={12} /></button>
        </div>
        <motion.div onClick={() => setFlipped(f => !f)} className="cursor-pointer h-36 rounded-xl border flex items-center justify-center relative overflow-hidden" style={{ borderColor: flipped ? s.border : 'rgba(255,255,255,0.1)', background: flipped ? s.bgGlow : 'rgba(17,24,39,0.5)' }}>
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-4">
                <p className="font-display font-bold text-2xl text-white mb-1">{word.word}</p>
                <p className="text-xs text-soft">Click to reveal meaning</p>
              </motion.div>
            ) : (
              <motion.div key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center px-4">
                <p className="text-sm text-white font-body leading-relaxed mb-2">{word.meaning}</p>
                <p className="text-xs text-soft italic mb-2">"{word.example}"</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {word.synonyms.map(syn => <span key={syn} className="text-[9px] px-2 py-0.5 rounded-md font-mono" style={{ background: `${s.primary}18`, color: s.primary, border: `1px solid ${s.border}` }}>{syn}</span>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute bottom-2 right-2 text-[9px] text-muted">{flipped ? 'Click to flip back' : 'Click to flip'}</div>
        </motion.div>
        <div className="flex gap-1.5 mt-3 justify-center">
          {VOCAB_WORDS.map((_, i) => <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ background: i === idx ? s.primary : 'rgba(255,255,255,0.15)' }} />)}
        </div>
      </div>
    </GlassCard>
  )
}

const GRAMMAR_QUIZ = [
  { q: 'Choose the correct sentence:', opts: ['She have been studying.', 'She has been studying.', 'She is been studying.', 'She been studying.'], ans: 'She has been studying.', exp: 'Present perfect continuous: Subject + has/have + been + V-ing' },
  { q: 'Convert to passive: "The teacher taught the students."', opts: ['The students were taught by the teacher.', 'The students are taught by the teacher.', 'The teacher was taught by students.', 'Students have been taught.'], ans: 'The students were taught by the teacher.', exp: 'Simple past passive: Object + was/were + past participle + by + agent' },
  { q: 'Which is a metaphor?', opts: ['"Life is a journey."', '"As brave as a lion."', '"The wind whispered."', '"Crash, bang, splash!"'], ans: '"Life is a journey."', exp: 'A metaphor is a direct comparison without "like" or "as". "As brave as a lion" is a simile.' },
]

function GrammarPractice() {
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const q = GRAMMAR_QUIZ[qIdx]
  const next = () => { setQIdx((qIdx + 1) % GRAMMAR_QUIZ.length); setSelected(null) }
  return (
    <GlassCard subject={s} delay={0.25}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div><h3 className="font-display font-semibold text-white text-sm">Grammar Practice</h3><p className="text-xs text-soft">Question {qIdx + 1} of {GRAMMAR_QUIZ.length}</p></div>
          {selected && <button onClick={next} className="text-xs px-3 py-1.5 rounded-lg border transition-all animate-glow" style={{ borderColor: s.border, color: s.primary, background: s.bgGlow }}>Next →</button>}
        </div>
        <p className="text-sm text-white font-body mb-3 leading-relaxed">{q.q}</p>
        <div className="space-y-2 mb-3">
          {q.opts.map(opt => {
            let style = 'border-white/8 bg-white/3 hover:border-white/20 cursor-pointer'
            let icon = null
            if (selected) {
              if (opt === q.ans) { style = 'border-green-500/50 bg-green-500/8 cursor-default'; icon = <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" /> }
              else if (opt === selected) { style = 'border-red-500/50 bg-red-500/8 cursor-default'; icon = <XCircle size={12} className="text-red-400 flex-shrink-0" /> }
              else style = 'border-white/5 opacity-40 cursor-default'
            }
            return (
              <button key={opt} onClick={() => !selected && setSelected(opt)} disabled={!!selected}
                className={`w-full flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs text-white transition-all ${style}`}>
                <span className="flex-1 font-body">{opt}</span>{icon}
              </button>
            )
          })}
        </div>
        {selected && <div className="p-3 rounded-xl border text-xs" style={{ borderColor: `${s.primary}25`, background: s.bgGlow }}><p className="text-[10px] font-mono mb-1" style={{ color: s.primary }}>Explanation</p><p className="text-soft font-body">{q.exp}</p></div>}
      </div>
    </GlassCard>
  )
}

const TENSES = [
  { name: 'Simple Present', formula: 'S + V1 (+s/es)', example: 'She reads books.' },
  { name: 'Present Continuous', formula: 'S + am/is/are + V-ing', example: 'She is reading.' },
  { name: 'Past Simple', formula: 'S + V2', example: 'She read the book.' },
  { name: 'Past Perfect', formula: 'S + had + V3', example: 'She had read it.' },
  { name: 'Future Simple', formula: 'S + will + V1', example: 'She will read.' },
  { name: 'Present Perfect', formula: 'S + have/has + V3', example: 'She has read it.' },
]

export default function English() {
  const { state } = useApp()
  const { topicScores, subjectProgress } = state
  const avgMastery = subjectProgress?.[s.id] || 0

  return (
    <SubjectLayout subject={s}>
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.primary }} />
          <span className="text-xs font-mono" style={{ color: s.primary }}>English Ecosystem</span>
        </div>
        <h1 className="font-display font-bold text-4xl text-white mb-1">
          English <span style={{ background: s.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Studio</span>
        </h1>
        <p className="text-soft text-sm">{topics.length} topics · Grammar · Vocabulary · AI-powered</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatBadge value={topics.length} label="Topics" subject={s} delay={0.05} />
        <StatBadge value={`${avgMastery}%`} label="Avg Mastery" subject={s} delay={0.1} />
        <StatBadge value="12" label="Tenses" subject={s} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <VocabBuilder />
          <GrammarPractice />

          {/* Tenses Quick Reference */}
          <GlassCard subject={s} delay={0.3}>
            <div className="p-5">
              <h3 className="font-display font-semibold text-white text-sm mb-4">Tense Quick Reference</h3>
              <div className="space-y-2">
                {TENSES.map((t, i) => (
                  <motion.div key={t.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border items-center" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                    <span className="text-xs font-body text-white">{t.name}</span>
                    <code className="text-[10px] font-mono px-2 py-1 rounded-lg text-center" style={{ background: `${s.primary}15`, color: s.primary }}>{t.formula}</code>
                    <span className="text-[10px] text-soft italic">{t.example}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Key formulas */}
          <div>
            <h3 className="font-display font-semibold text-white mb-3">Grammar Rules</h3>
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
