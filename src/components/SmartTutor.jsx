import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Sparkles, User, RotateCcw, Mic, MicOff,
  Copy, CheckCheck, RefreshCw, ChevronDown, Globe
} from 'lucide-react'
import { streamGroqResponse, hasAnyApiKey, getProviderName, getUserFriendlyError } from '../services/groqService'
import { useApp } from '../context/AppContext'


// ─── Languages ────────────────────────────────────────────────────────────────
export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', voiceLang: 'en-US' },
  { code: 'hi', label: 'हिंदी',   flag: '🇮🇳', voiceLang: 'hi-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ',   flag: '🇮🇳', voiceLang: 'kn-IN' },
  { code: 'te', label: 'తెలుగు',  flag: '🇮🇳', voiceLang: 'te-IN' },
  { code: 'ta', label: 'தமிழ்',   flag: '🇮🇳', voiceLang: 'ta-IN' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳', voiceLang: 'ml-IN' },
]

// ─── Subject prompts ──────────────────────────────────────────────────────────
const PROMPTS = {
  mathematics: ['Explain quadratic formula with an example','How does integration by parts work?','What is the difference between permutation and combination?','Solve: 2x² - 5x + 3 = 0'],
  physics:     ["Explain Newton's three laws with examples",'Derive the kinematic equations (SUVAT)','How does the photoelectric effect work?','Difference between series and parallel circuits?'],
  chemistry:   ['Explain mole concept with example','What are periodic table trends?','How does an electrochemical cell work?',"Explain Le Chatelier's principle"],
  biology:     ['Explain DNA replication step by step','Mitosis vs meiosis?','How does photosynthesis work?','Explain natural selection with examples'],
  english:     ['Explain all 12 English tenses with examples','Active and passive voice with examples','How to write a good argumentative essay?','Common literary devices explained'],
}

// ─── Markdown renderer ────────────────────────────────────────────────────────
function inl(text) {
  if (!text) return null
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/).map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="text-white font-semibold">{p.slice(2,-2)}</strong>
    if (p.startsWith('*') && p.endsWith('*')) return <em key={i} className="text-white/80 italic">{p.slice(1,-1)}</em>
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{background:'rgba(165,243,252,0.12)',color:'#a5f3fc'}}>{p.slice(1,-1)}</code>
    return p
  })
}

const MdRender = memo(({ text }) => {
  if (!text) return null
  const lines = text.split('\n')
  const els = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim(); const code = []; i++
      while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i++ }
      els.push(<div key={`c${i}`} className="my-2 rounded-xl overflow-hidden border border-white/10"><div className="px-3 py-1 bg-white/5 text-[9px] font-mono text-muted uppercase">{lang||'code'}</div><pre className="px-4 py-3 text-[11px] font-mono text-cyan-300 leading-relaxed overflow-x-auto bg-black/40 whitespace-pre-wrap">{code.join('\n')}</pre></div>)
      i++; continue
    }
    if (line.startsWith('## '))  { els.push(<h2 key={i} className="font-display font-bold text-sm text-white mt-3 mb-1 pb-1 border-b border-white/10">{inl(line.slice(3))}</h2>); i++; continue }
    if (line.startsWith('### ')) { els.push(<h3 key={i} className="font-semibold text-xs text-white/90 mt-2 mb-0.5">{inl(line.slice(4))}</h3>); i++; continue }
    if (line.startsWith('|')) {
      const rows=[]
      while (i < lines.length && lines[i].startsWith('|')) { if (!lines[i].replace(/\|/g,'').trim().match(/^[-:\s]+$/)) rows.push(lines[i]); i++ }
      els.push(<div key={`t${i}`} className="overflow-x-auto my-2 rounded-xl border border-white/8"><table className="w-full text-[10px]"><tbody>{rows.map((r,ri)=>{const cells=r.split('|').filter(c=>c.trim());return(<tr key={ri} style={{background:ri===0?'rgba(255,255,255,0.06)':ri%2?'rgba(255,255,255,0.02)':'transparent'}}>{cells.map((c,ci)=><td key={ci} className={`px-3 py-1.5 ${ri===0?'font-semibold text-white':'text-soft'}`}>{inl(c.trim())}</td>)}</tr>)})}</tbody></table></div>)
      continue
    }
    if (/^[-*•]\s/.test(line)) {
      const items=[]; while(i<lines.length&&/^[\s]*[-*•]\s/.test(lines[i])){items.push(lines[i].replace(/^[\s]*[-*•]\s/,''));i++}
      els.push(<ul key={`ul${i}`} className="my-1 space-y-0.5">{items.map((t,j)=><li key={j} className="flex gap-2 text-xs text-soft"><span className="text-[8px] mt-0.5 flex-shrink-0">●</span><span>{inl(t)}</span></li>)}</ul>); continue
    }
    if (/^\d+\.\s/.test(line)) {
      const items=[]; while(i<lines.length&&/^\d+\.\s/.test(lines[i])){items.push(lines[i].replace(/^\d+\.\s/,''));i++}
      els.push(<ol key={`ol${i}`} className="my-1 space-y-0.5">{items.map((t,j)=><li key={j} className="flex gap-2 text-xs text-soft"><span className="font-mono text-[10px] font-bold flex-shrink-0 min-w-[16px]">{j+1}.</span><span>{inl(t)}</span></li>)}</ol>); continue
    }
    if (!line.trim()) { els.push(<div key={i} className="h-0.5"/>); i++; continue }
    els.push(<p key={i} className="text-xs text-soft leading-relaxed">{inl(line)}</p>); i++
  }
  return <div className="space-y-0.5">{els}</div>
})
MdRender.displayName = 'MdRender'

const StreamMsg = memo(({ text, streaming }) => (
  <div>
    <MdRender text={text} />
    {streaming && <motion.span className="inline-block w-0.5 h-3 bg-white/60 ml-0.5 rounded-full align-middle" animate={{opacity:[1,0,1]}} transition={{duration:0.6,repeat:Infinity}} />}
  </div>
))
StreamMsg.displayName = 'StreamMsg'

// ─── Language Selector ────────────────────────────────────────────────────────
function LangSelector({ value, onChange, subject }) {
  const [open, setOpen] = useState(false)
  const cur = LANGUAGES.find(l => l.code === value) || LANGUAGES[0]
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono transition-all hover:opacity-80"
        style={{ borderColor: subject.border, background: subject.bgGlow, color: subject.primary }}>
        <Globe size={10} />{cur.flag} {cur.label}
        <ChevronDown size={8} className={`transition-transform ml-0.5 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-4,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-4,scale:0.97}}
            className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-card overflow-hidden min-w-[140px]">
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => { onChange(lang.code); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-white/5 ${value===lang.code?'text-white':'text-soft'}`}>
                {lang.flag} {lang.label}
                {value === lang.code && <span className="ml-auto text-[8px]" style={{ color: subject.primary }}>✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Voice Input Hook (fixed) ─────────────────────────────────────────────────
function useVoiceInput({ language, onTranscript, onEnd }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)
  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const stop = useCallback(() => {
    try { recRef.current?.stop() } catch {}
    recRef.current = null
    setListening(false)
  }, [])

  const start = useCallback(() => {
    if (!supported) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.')
      return
    }
    if (listening) { stop(); return }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    const langConf = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]
    rec.lang = langConf.voiceLang
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1

    rec.onstart = () => setListening(true)

    rec.onresult = (e) => {
      let interimTranscript = ''
      let finalTranscript = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalTranscript += t
        else interimTranscript += t
      }
      const transcript = finalTranscript || interimTranscript
      const isFinal = !!finalTranscript
      onTranscript(transcript, isFinal)
    }

    rec.onerror = (e) => {
      setListening(false)
      recRef.current = null
      if (e.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone permissions in your browser settings.')
      }
    }

    rec.onend = () => {
      setListening(false)
      recRef.current = null
      onEnd?.()
    }

    recRef.current = rec
    try { rec.start() } catch (err) { setListening(false); recRef.current = null }
  }, [supported, language, listening, stop, onTranscript, onEnd])

  return { listening, supported, start, stop }
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
const Dots = memo(({ subject }) => (
  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex gap-2.5">
    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundImage:subject.gradient}}>
      <Sparkles size={12} className="text-white" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{background:subject.bgGlow,border:`1px solid ${subject.border}`}}>
      {[0,1,2].map(i=>(
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{background:subject.primary}}
          animate={{opacity:[0.3,1,0.3],scale:[0.8,1.2,0.8]}} transition={{duration:0.9,repeat:Infinity,delay:i*0.15}} />
      ))}
    </div>
  </motion.div>
))
Dots.displayName = 'Dots'

// ─── Message Bubble ───────────────────────────────────────────────────────────
const Bubble = memo(({ msg, subject, isLatest, onRegen }) => {
  const isUser = msg.role === 'user'
  const isError = msg.role === 'error'
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(msg.content).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.2}}
      className={`flex gap-2.5 group ${isUser?'flex-row-reverse':''}`}>
      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={isUser ? {background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)'}
          : isError ? {background:'rgba(239,68,68,0.2)',border:'1px solid rgba(239,68,68,0.3)'}
          : {backgroundImage:subject.gradient}}>
        {isUser ? <User size={12} className="text-soft" />
          : isError ? <span className="text-xs">⚠️</span>
          : <Sparkles size={12} className="text-white" />}
      </div>
      <div className="max-w-[88%] min-w-0">
        <p className="text-[9px] font-mono opacity-40 px-1 mb-1">
          {isUser ? 'You' : isError ? 'Error' : `${subject.label} Tutor`}
          {msg.ts ? ` · ${new Date(msg.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}` : ''}
        </p>
        <div className="relative" style={isUser
          ? {background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px 4px 16px 16px',padding:'10px 14px'}
          : isError ? {background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:'4px 16px 16px 16px',padding:'10px 14px'}
          : {background:subject.bgGlow,border:`1px solid ${subject.border}`,borderRadius:'4px 16px 16px 16px',padding:'10px 14px'}}>
          {isUser
            ? <p className="text-xs text-white leading-relaxed">{msg.content}</p>
            : <StreamMsg text={msg.content} streaming={isLatest && msg.streaming} />}
          {!isUser && !msg.streaming && msg.content && (
            <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={copy} className="flex items-center gap-1 text-[9px] font-mono text-muted hover:text-white transition-colors">
                {copied ? <><CheckCheck size={9} className="text-green-400" />copied</> : <><Copy size={9} />copy</>}
              </button>
              {!isError && isLatest && (
                <button onClick={onRegen} className="flex items-center gap-1 text-[9px] font-mono text-muted hover:text-white transition-colors">
                  <RefreshCw size={9} />retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})
Bubble.displayName = 'Bubble'

// ─── MAIN SmartTutor ──────────────────────────────────────────────────────────
export default function SmartTutor({ subject, compact = false }) {
  const { dispatch } = useApp()
  const apiReady = hasAnyApiKey()
  const provider = getProviderName()

  const [language, setLanguage] = useState(() => localStorage.getItem('tutor_lang') || 'en')
  const setLang = (l) => { setLanguage(l); localStorage.setItem('tutor_lang', l) }

  const makeWelcome = useCallback(() => ({
    role: 'assistant',
    content: `## Welcome to ${subject.label} AI Tutor! 🎓\n\nI'm your intelligent${apiReady ? ` AI assistant powered by **${provider}**` : ' educational assistant'}.\n\n- **Any ${subject.label} concept** — detailed explanations\n- **Problem solving** — step-by-step solutions\n- **Formulas & derivations** — complete workings\n- **Follow-up questions** — full conversation context\n\n${apiReady ? `✅ Connected to **${provider}** — Ask anything!` : '⚠️ Add Groq API key for real AI responses'}`,
    ts: Date.now(),
  }), [subject.label, apiReady, provider])

  const [msgs, setMsgs] = useState(() => [makeWelcome()])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(!apiReady)
  const [lastQ, setLastQ] = useState(null)
  const [voicePreview, setVoicePreview] = useState('')
  const streamRef = useRef(false)
  const chatRef = useRef(null)
  const inputRef = useRef(null)
  const textareaRef = useRef(null)

  // Scroll only the chat container — never the full page
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [msgs, loading])

  const { listening, supported: micOk, start: startMic, stop: stopMic } = useVoiceInput({
    language,
    onTranscript: (t, isFinal) => {
      setVoicePreview(t)
      setInput(t)
      if (isFinal) setVoicePreview('')
    },
    onEnd: () => setVoicePreview(''),
  })

  const updateLastAi = (content, streaming = false) => {
    setMsgs(prev => {
      const u = [...prev]
      const last = u[u.length - 1]
      if (last?.streaming) u[u.length - 1] = { ...last, content, streaming }
      else u.push({ role: 'assistant', content, ts: Date.now(), streaming })
      return u
    })
  }

  const send = useCallback(async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    dispatch({ type: 'INCREMENT_DAILY_STAT', payload: { type: 'tutorQuestions' } })
    setInput('')
    setVoicePreview('')
    if (textareaRef.current) { textareaRef.current.style.height = 'auto' }
    setLastQ(q)
    const userMsg = { role: 'user', content: q, ts: Date.now() }
    setMsgs(prev => [...prev, userMsg, { role: 'assistant', content: '', ts: Date.now(), streaming: true }])
    setLoading(true)
    streamRef.current = true
    const hist = [...msgs, userMsg].filter(m => (m.role === 'user' || m.role === 'assistant') && !m.streaming && m.content)
    try {
      await streamGroqResponse(hist, subject.label, language,
        (chunk, full) => { if (streamRef.current) updateLastAi(full, true) },
        (full) => {
          streamRef.current = false
          updateLastAi(full || 'Please try again.', false)
          setLoading(false)
          inputRef.current?.focus()
        },
        (errCode) => {
          streamRef.current = false
          setMsgs(p => { const u=[...p]; const l=u[u.length-1]; if(l?.streaming) u[u.length-1]={role:'error',content:getUserFriendlyError(errCode),ts:Date.now()}; return u })
          setLoading(false)
          inputRef.current?.focus()
        }
      )
    } catch (e) {
      streamRef.current = false
      updateLastAi(getUserFriendlyError(e.message), false)
      setLoading(false)
    }
  }, [input, loading, msgs, subject.label, language])

  const regen = useCallback(async () => {
    if (!lastQ || loading) return
    setMsgs(p => p.filter(m => m.role !== 'error').slice(0, -1))
    await send(lastQ)
  }, [lastQ, loading, send])

  const clear = () => {
    streamRef.current = false
    setMsgs([makeWelcome()])
    setLastQ(null)
    setLoading(false)
  }

  const latestAi = msgs.reduce((acc, m, i) => m.role === 'assistant' ? i : acc, -1)
  const prompts = PROMPTS[subject.id] || PROMPTS.mathematics

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border"
      style={{ borderColor: subject.border, background: 'rgba(6,8,15,0.94)', backdropFilter: 'blur(24px)' }}>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b flex-shrink-0" style={{ borderColor: subject.border }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0" style={{ backgroundImage: subject.gradient }}>
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-bold text-white leading-tight">{subject.label} AI Tutor</p>
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: apiReady ? '#4ade80' : '#f59e0b' }}
              animate={{ opacity: [1,0.4,1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-[10px] font-mono" style={{ color: apiReady ? '#4ade80' : '#f59e0b' }}>
              {apiReady ? `${provider} · Online` : 'API key required'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <LangSelector value={language} onChange={setLang} subject={subject} />
          <button onClick={clear} title="Clear chat" className="p-1.5 rounded-lg text-muted hover:text-white transition-colors">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Setup banner */}
      <AnimatePresence>
        {showSetup && !apiReady && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden flex-shrink-0">
            <div className="mx-3 mt-2 p-3 rounded-xl border border-yellow-400/25 bg-yellow-400/8 flex gap-2">
              <span className="flex-shrink-0">🔑</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-yellow-300 mb-1">Add Groq API Key — it's free!</p>
                <p className="text-[10px] text-yellow-200/70">
                  Get key at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline">console.groq.com</a> → Add <code className="bg-black/30 px-1 rounded">VITE_GROQ_API_KEY=gsk_...</code> to .env → Restart
                </p>
              </div>
              <button onClick={() => setShowSetup(false)} className="text-yellow-400/50 hover:text-yellow-400 flex-shrink-0">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages — fixed height, isolated scroll */}
      <div ref={chatRef} className="overflow-y-auto px-4 py-3 space-y-3.5 flex-shrink-0"
        style={{ height: compact ? '320px' : '420px', scrollBehavior: 'smooth' }}>

        {/* Suggested prompts */}
        {msgs.length === 1 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} className="grid grid-cols-1 gap-1.5 mb-2">
            {prompts.map((p, i) => (
              <motion.button key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.07*i+0.2}}
                onClick={() => send(p)}
                className="text-left text-xs text-soft hover:text-white px-3 py-2 rounded-xl border transition-all group"
                style={{ borderColor: subject.border, background: subject.bgGlow }}>
                <span className="font-mono text-[9px] mr-2" style={{ color: subject.primary }}>→</span>
                <span className="group-hover:text-white transition-colors">{p}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <Bubble key={i} msg={m} subject={subject} isLatest={i === latestAi} onRegen={regen} />
          ))}
          {loading && !msgs[msgs.length-1]?.streaming && <Dots key="d" subject={subject} />}
        </AnimatePresence>
      </div>

      {/* Voice preview */}
      <AnimatePresence>
        {voicePreview && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            className="px-4 py-2 border-t text-xs text-soft italic overflow-hidden flex-shrink-0"
            style={{ borderColor: subject.border, background: `${subject.primary}08` }}>
            🎤 {voicePreview}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t flex-shrink-0" style={{ borderColor: subject.border }}>
        <div className="flex gap-2 items-end">
          <textarea
            ref={(el) => { inputRef.current = el; textareaRef.current = el }}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
            }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={apiReady ? `Ask anything about ${subject.label}...` : 'Add API key to enable AI...'}
            disabled={loading}
            rows={1}
            className="flex-1 rounded-xl px-3 py-2.5 text-xs text-white placeholder-muted focus:outline-none transition-all resize-none leading-relaxed"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '96px' }}
          />

          {/* Mic button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={listening ? stopMic : startMic}
            title={micOk ? (listening ? 'Stop recording' : 'Start voice input') : 'Voice not supported in this browser'}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all"
            style={listening
              ? { background: '#ef4444', border: '1px solid #ef444460' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', opacity: micOk ? 1 : 0.4 }}>
            {listening
              ? <motion.div animate={{scale:[1,1.3,1]}} transition={{duration:0.8,repeat:Infinity}}>
                  <MicOff size={13} className="text-white" />
                </motion.div>
              : <Mic size={13} className="text-soft" />}
          </motion.button>

          {/* Send button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg disabled:opacity-30 transition-all"
            style={{ backgroundImage: subject.gradient }}>
            <Send size={13} className="text-white" />
          </motion.button>
        </div>
        <p className="text-[9px] text-muted text-center mt-1.5">
          Enter to send · Shift+Enter newline
          {micOk ? ' · 🎤 Voice supported' : ' · Voice: use Chrome/Edge'}
          {apiReady ? ` · ${provider} AI` : ''}
        </p>
      </div>
    </div>
  )
}
