import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Key, ExternalLink, CheckCircle2, BookOpen } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import SmartTutor from '../components/SmartTutor'
import { SUBJECT_LIST } from '../data/subjects'
import { hasAnyApiKey, getProviderName } from '../services/groqService'

const EMOJIS = { mathematics: '∑', physics: '⚛', chemistry: '⚗', biology: '🧬', english: '📖' }

export default function AITutor() {
  const [active, setActive] = useState('mathematics')
  const subject = SUBJECT_LIST.find(s => s.id === active) || SUBJECT_LIST[0]
  const apiReady = hasAnyApiKey()
  const provider = getProviderName()

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-white">AI Study Tutor</h1>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${apiReady ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <span className={`text-[10px] font-mono ${apiReady ? 'text-green-400' : 'text-yellow-400'}`}>
                  {apiReady ? `${provider} AI · Ask anything in any language` : 'Add API key to enable real AI'}
                </span>
                {apiReady && <CheckCircle2 size={11} className="text-green-400" />}
              </div>
            </div>
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {SUBJECT_LIST.map(s => (
              <motion.button key={s.id} whileTap={{ scale: 0.95 }} onClick={() => setActive(s.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-body flex-shrink-0 transition-all duration-200"
                style={{
                  borderColor: active === s.id ? s.primary : 'rgba(255,255,255,0.07)',
                  background: active === s.id ? s.bgGlow : 'rgba(17,24,39,0.5)',
                  color: active === s.id ? 'white' : '#8892a4',
                  boxShadow: active === s.id ? `0 0 20px ${s.primary}25` : 'none',
                }}>
                <span>{EMOJIS[s.id]}</span>
                <span>{s.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Setup panel */}
        {!apiReady && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 mb-5 border border-indigo-500/25 bg-indigo-500/5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <Key size={16} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-white text-sm mb-2">Enable Real AI — Free Groq API</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { n: '1', t: 'Get free key at console.groq.com', link: 'https://console.groq.com' },
                    { n: '2', t: 'Add VITE_GROQ_API_KEY=gsk_... to .env' },
                    { n: '3', t: 'Restart dev server (npm run dev)' },
                    { n: '4', t: 'Start asking any question!' },
                  ].map(({ n, t, link }) => (
                    <div key={n} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[9px] font-mono text-indigo-400 flex-shrink-0">{n}</span>
                      <span className="text-xs text-soft">{t}</span>
                      {link && <a href={link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-lg bg-indigo-500/10">
                        <ExternalLink size={9} />Open
                      </a>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main 2-col layout — chat takes 2/3, sidebar 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Chat — fills available height naturally */}
          <div className="lg:col-span-2">
            <SmartTutor key={active} subject={subject} />
          </div>

          {/* Sidebar — no AI Capabilities card */}
          <div className="space-y-4">
            {/* Quick Topics */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass-card p-4" style={{ borderColor: subject.border }}>
              <p className="text-[10px] font-mono mb-3" style={{ color: subject.primary }}>
                TOPICS — {subject.label.toUpperCase()}
              </p>
              <div className="space-y-0.5">
                {(subject.quizTopics || []).map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-soft px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-mono flex-shrink-0"
                      style={{ background: `${subject.primary}18`, color: subject.primary }}>{i + 1}</span>
                    {t}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Key Formulas */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-4" style={{ borderColor: subject.border, background: subject.bgGlow }}>
              <p className="text-[10px] font-mono mb-3 flex items-center gap-1.5" style={{ color: subject.primary }}>
                <BookOpen size={10} />KEY FORMULAS
              </p>
              <div className="space-y-3">
                {(subject.formulas || []).map((f, i) => (
                  <div key={i} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <p className="text-[9px] text-muted mb-0.5">{f.label}</p>
                    <code className="font-mono text-[11px] text-white">{f.expr}</code>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick tips */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="glass-card p-4">
              <p className="text-[10px] font-mono text-soft mb-3">HOW TO USE</p>
              <div className="space-y-1.5 text-[11px] text-soft">
                <p>💡 Ask any academic question</p>
                <p>🌐 Switch language in chat header</p>
                <p>🎤 Tap mic icon for voice input</p>
                <p>🔄 Conversation context is saved</p>
                <p>📋 Hover messages to copy/retry</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
