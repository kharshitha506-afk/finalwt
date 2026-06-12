import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Play, RotateCcw, ChevronRight, Lightbulb, CheckCircle2, XCircle, Clock, Zap, Trophy, Star } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { useApp, getWeakTopics } from '../context/AppContext'
import { getAdaptiveQuestion, QUIZ_QUESTIONS } from '../data/quizData'
import { SUBJECT_LIST } from '../data/subjects'
import { generateAIQuestions } from '../services/groqService'
import confetti from 'canvas-confetti'

const QUIZ_LENGTH = 8
const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  time: 40, xp: 8,  desc: 'Beginner friendly' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  time: 25, xp: 12, desc: 'Standard difficulty' },
  hard:   { label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   time: 15, xp: 20, desc: 'Expert level' },
}
const EMOJIS = { mathematics:'∑', physics:'⚛', chemistry:'⚗', biology:'🧬', english:'📖' }

const LANGUAGES_MAP = {
  en: { label: 'English', flag: '🇬🇧' },
  hi: { label: 'Hindi', flag: '🇮🇳' },
  kn: { label: 'Kannada', flag: '🇮🇳' },
  te: { label: 'Telugu', flag: '🇮🇳' },
  ta: { label: 'Tamil', flag: '🇮🇳' },
  ml: { label: 'Malayalam', flag: '🇮🇳' },
}

// ── Subject Selector ──────────────────────────────────────────────────────────
function SubjectSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {SUBJECT_LIST.map(s => (
        <motion.button key={s.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(s.id)}
          className="p-4 rounded-2xl border text-center transition-all bg-void/30"
          style={{
            borderColor: selected === s.id ? s.primary : 'rgba(255,255,255,0.07)',
            background: selected === s.id ? s.bgGlow : 'rgba(17,24,39,0.5)',
            boxShadow: selected === s.id ? `0 0 20px ${s.primary}33` : 'none',
          }}>
          <div className="text-2xl mb-1.5">{EMOJIS[s.id]}</div>
          <p className="text-xs font-display font-semibold text-white">{s.label}</p>
        </motion.button>
      ))}
    </div>
  )
}

// ── Difficulty Selector ───────────────────────────────────────────────────────
function DifficultySelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
        <motion.button key={key} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(key)}
          className="p-4 rounded-2xl border text-center transition-all bg-void/30"
          style={{
            borderColor: selected === key ? cfg.color : 'rgba(255,255,255,0.07)',
            background: selected === key ? cfg.bg : 'rgba(17,24,39,0.5)',
            boxShadow: selected === key ? `0 0 16px ${cfg.color}33` : 'none',
          }}>
          <p className="font-display font-bold text-base mb-0.5" style={{ color: cfg.color }}>{cfg.label}</p>
          <p className="text-[10px] text-soft">{cfg.desc}</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Zap size={10} style={{ color: cfg.color }} />
            <span className="text-[10px] font-mono" style={{ color: cfg.color }}>{cfg.xp} XP / question</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

// ── Quiz Question Card ────────────────────────────────────────────────────────
function QuizQuestion({ question, qNum, total, onAnswer, streak, forcedDifficulty }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const diff = forcedDifficulty || question.difficulty
  const cfg = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.medium
  const [timeLeft, setTimeLeft] = useState(cfg.time)
  const [timedOut, setTimedOut] = useState(false)
  const subj = SUBJECT_LIST.find(s => s.id === question.subject) || SUBJECT_LIST[0]

  useEffect(() => {
    setSelected(null); setRevealed(false); setShowHint(false)
    setTimedOut(false); setTimeLeft(cfg.time)
  }, [question.id, cfg.time])

  useEffect(() => {
    if (revealed || timedOut) return
    if (timeLeft <= 0) { setTimedOut(true); setRevealed(true); return }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, revealed, timedOut])

  const handleSelect = (opt) => { if (revealed) return; setSelected(opt); setRevealed(true) }
  const timerPct = (timeLeft / cfg.time) * 100
  const timerColor = timeLeft > cfg.time * 0.6 ? subj.primary : timeLeft > cfg.time * 0.3 ? '#f59e0b' : '#ef4444'
  const correct = selected === question.answer

  return (
    <motion.div key={question.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}
      className="w-full max-w-2xl mx-auto">

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex gap-1.5 flex-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{ height: 6, flex: 1, background: i < qNum - 1 ? subj.primary : i === qNum - 1 ? subj.primary : 'rgba(255,255,255,0.1)', opacity: i === qNum - 1 ? 1 : i < qNum - 1 ? 0.7 : 1 }} />
          ))}
        </div>
        <span className="text-xs font-mono text-soft flex-shrink-0">{qNum}/{total}</span>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg" style={{ background: subj.bgGlow, color: subj.primary, border: `1px solid ${subj.border}` }}>{question.topic}</span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg capitalize" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{diff}</span>
        </div>
        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/15 border border-orange-500/25">
              <Zap size={10} className="text-orange-400" />
              <span className="text-[10px] font-mono text-orange-400">{streak}🔥</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={11} style={{ color: timerColor }} />
            <span className="text-[10px] font-mono" style={{ color: timerColor }}>{timedOut ? 'Time up!' : `${timeLeft}s`}</span>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-white/8 rounded-full overflow-hidden mb-5">
        <motion.div className="h-full rounded-full transition-colors duration-500" style={{ background: timerColor, width: `${timerPct}%` }} />
      </div>

      {/* Question */}
      <div className="rounded-2xl border p-5 mb-4" style={{ background: 'rgba(17,24,39,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-white font-body text-base leading-relaxed">{question.question}</p>
        <AnimatePresence>
          {showHint && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
              <div className="flex gap-2 p-3 rounded-xl bg-yellow-400/8 border border-yellow-400/20">
                <Lightbulb size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300/90 font-body leading-relaxed">{question.hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-4">
        {question.options.map((opt, i) => {
          let style = 'border-white/8 bg-white/3 hover:border-white/20 cursor-pointer'
          let icon = null
          if (revealed) {
            if (opt === question.answer) { style = 'border-green-500/50 bg-green-500/8 cursor-default'; icon = <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" /> }
            else if (opt === selected) { style = 'border-red-500/50 bg-red-500/8 cursor-default'; icon = <XCircle size={14} className="text-red-400 flex-shrink-0" /> }
            else style = 'border-white/5 opacity-40 cursor-default'
          }
          return (
            <motion.button key={opt} onClick={() => handleSelect(opt)} disabled={revealed}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileTap={!revealed ? { scale: 0.99 } : {}}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${style}`}>
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-sm text-white font-body">{opt}</span>
              {icon}
            </motion.button>
          )
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-4 rounded-xl border mb-4" style={{ borderColor: `${subj.primary}30`, background: subj.bgGlow }}>
            <div className="flex items-center gap-2 mb-1.5">
              {correct && !timedOut
                ? <CheckCircle2 size={13} className="text-green-400" />
                : <XCircle size={13} className="text-red-400" />}
              <p className="text-[10px] font-mono" style={{ color: correct && !timedOut ? '#4ade80' : '#f87171' }}>
                {timedOut ? 'Time ran out!' : correct ? `Correct! +${cfg.xp} XP` : 'Incorrect'}
              </p>
            </div>
            <p className="text-xs text-soft font-body leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {!revealed
          ? <button onClick={() => setShowHint(true)} disabled={showHint}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-yellow-400/25 text-yellow-400 hover:bg-yellow-400/8 disabled:opacity-40 transition-all">
              <Lightbulb size={12} />{showHint ? 'Hint shown' : 'Show Hint'}
            </button>
          : <div />}
        {revealed && (
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            onClick={() => onAnswer({ correct: correct && !timedOut, timedOut, topic: question.topic, difficulty: diff, xp: correct && !timedOut ? cfg.xp : 1 })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-semibold text-white ml-auto shadow-lg"
            style={{ backgroundImage: subj.gradient }}>
            {qNum >= total ? 'View Results' : 'Next'}<ChevronRight size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// ── Main Quiz Page ────────────────────────────────────────────────────────────
export default function Quiz() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useApp()
  const [phase, setPhase] = useState('intro')
  const [subject, setSubject] = useState('mathematics')
  const [difficulty, setDifficulty] = useState('medium')
  const [currentQ, setCurrentQ] = useState(null)
  const [usedIds, setUsedIds] = useState([])
  const [qNum, setQNum] = useState(1)
  const [sessionScore, setSessionScore] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [sessionStreak, setSessionStreak] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [adaptiveDiff, setAdaptiveDiff] = useState(null)

  // AI & Exam Mode states
  const [isAI, setIsAI] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiQuestions, setAiQuestions] = useState(null)
  const [isExamMode, setIsExamMode] = useState(false)
  const [examQuestions, setExamQuestions] = useState(null)

  const weakTopics = getWeakTopics(state.topicScores).map(w => w.topic)
  const subjectObj = SUBJECT_LIST.find(s => s.id === subject) || SUBJECT_LIST[0]

  // Regional language selection
  const userLangCode = localStorage.getItem('tutor_lang') || 'en'
  const userLang = LANGUAGES_MAP[userLangCode] || LANGUAGES_MAP.en

  // Exam Tomorrow revision deck generator
  const prepareExamDeck = useCallback((weaks) => {
    const allQs = [...QUIZ_QUESTIONS]
    allQs.sort((a, b) => {
      const aWeak = weaks.includes(a.topic) ? 1 : 0
      const bWeak = weaks.includes(b.topic) ? 1 : 0
      return bWeak - aWeak
    })

    const easyQs = allQs.filter(q => q.difficulty === 'easy')
    const mediumQs = allQs.filter(q => q.difficulty === 'medium')
    const hardQs = allQs.filter(q => q.difficulty === 'hard')

    const deck = []
    for (let i = 0; i < 3 && i < easyQs.length; i++) deck.push(easyQs[i])
    for (let i = 0; i < 3 && i < mediumQs.length; i++) deck.push(mediumQs[i])
    for (let i = 0; i < 2 && i < hardQs.length; i++) deck.push(hardQs[i])

    const remaining = allQs.filter(q => !deck.find(x => x.id === q.id))
    while (deck.length < 8 && remaining.length > 0) {
      deck.push(remaining.shift())
    }
    return deck
  }, [])

  // Check for Exam Tomorrow mode triggers
  useEffect(() => {
    if (location.state?.mode === 'examTomorrow') {
      setIsExamMode(true)
      dispatch({ type: 'START_SESSION' })
      setUsedIds([])
      setQNum(1)
      setSessionScore(0)
      setSessionTotal(0)
      setSessionStreak(0)
      setTotalXP(0)
      setAdaptiveDiff(null)
      
      const deck = prepareExamDeck(weakTopics)
      setExamQuestions(deck)
      setCurrentQ(deck[0])
      setUsedIds([deck[0].id])
      setPhase('quiz')
    }
  }, [location.state, weakTopics, prepareExamDeck, dispatch])

  const loadNext = useCallback((used, diff) => {
    const q = getAdaptiveQuestion(used, diff, subject, weakTopics)
    if (!q) {
      navigate('/results', { state: { sessionScore, sessionTotal, sessionStreak, subject } })
      return
    }
    setCurrentQ(q)
    setUsedIds(p => [...p, q.id])
  }, [subject, weakTopics, sessionScore, sessionTotal, sessionStreak, navigate])

  const start = async () => {
    dispatch({ type: 'START_SESSION' })
    setUsedIds([]); setQNum(1); setSessionScore(0); setSessionTotal(0)
    setSessionStreak(0); setTotalXP(0); setAdaptiveDiff(null)
    
    if (isAI) {
      setAiLoading(true)
      const accuracyVal = state.totalQuestions > 0 ? Math.round((state.score / state.totalQuestions) * 100) : 70
      const generated = await generateAIQuestions(subject, difficulty, weakTopics, accuracyVal, state.streak)
      setAiLoading(false)
      
      if (generated && generated.length === 8) {
        setAiQuestions(generated)
        setCurrentQ(generated[0])
        setUsedIds([generated[0].id])
        setPhase('quiz')
      } else {
        // Fallback silently to static question bank
        setAiQuestions(null)
        const q = getAdaptiveQuestion([], difficulty, subject, weakTopics)
        setCurrentQ(q)
        setUsedIds(q ? [q.id] : [])
        setPhase('quiz')
      }
    } else {
      setAiQuestions(null)
      const q = getAdaptiveQuestion([], difficulty, subject, weakTopics)
      setCurrentQ(q)
      setUsedIds(q ? [q.id] : [])
      setPhase('quiz')
    }
  }

  useEffect(() => {
    if (phase === 'quiz' && qNum === 1 && usedIds.length === 0 && !isExamMode && !isAI) {
      loadNext([], difficulty)
    }
  }, [phase, qNum, usedIds.length, difficulty, loadNext, isExamMode, isAI])

  const handleAnswer = ({ correct, topic, difficulty: diff, xp }) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { topic, correct, difficulty: diff } })
    if (correct && sessionTotal === 0) dispatch({ type: 'ADD_BADGE', payload: 'first_correct' })
    const newStreak = correct ? sessionStreak + 1 : 0
    if (newStreak >= 3) dispatch({ type: 'ADD_BADGE', payload: 'streak_3' })
    if (newStreak >= 5) dispatch({ type: 'ADD_BADGE', payload: 'streak_5' })
    const newScore = correct ? sessionScore + 1 : sessionScore
    const newTotal = sessionTotal + 1
    const newXP = totalXP + xp
    setSessionScore(newScore); setSessionTotal(newTotal); setSessionStreak(newStreak); setTotalXP(newXP)

    // Adaptive difficulty for static engine
    let nextDiff = difficulty
    if (difficulty === 'medium') {
      nextDiff = correct ? 'hard' : 'easy'
      setAdaptiveDiff(nextDiff)
    }

    if (qNum >= QUIZ_LENGTH) {
      dispatch({ type: 'END_SESSION' })
      if (newScore === QUIZ_LENGTH) dispatch({ type: 'ADD_BADGE', payload: 'perfect_score' })
      dispatch({ type: 'ADD_BADGE', payload: 'quiz_complete' })
      
      // Fire confetti burst upon completion
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        })
      } catch (e) {
        console.warn('Confetti launch error:', e)
      }
      
      navigate('/results', { state: { sessionScore: newScore, sessionTotal: newTotal, sessionStreak: newStreak, subject, totalXP: newXP } })
    } else {
      setQNum(n => n + 1)
      if (isExamMode && examQuestions) {
        const nextQ = examQuestions[qNum]
        setCurrentQ(nextQ)
        setUsedIds(p => [...p, nextQ.id])
      } else if (aiQuestions) {
        const nextQ = aiQuestions[qNum]
        setCurrentQ(nextQ)
        setUsedIds(p => [...p, nextQ.id])
      } else {
        loadNext(usedIds, adaptiveDiff || difficulty)
      }
    }
  }

  // ── AI Generator Loading Screen ───────────────────────────────────────────
  if (aiLoading) return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-t-2 border-indigo-500 border-r-2 border-transparent flex items-center justify-center mb-6"
        >
          <Brain size={28} className="text-indigo-400" />
        </motion.div>
        <h2 className="font-display font-bold text-2xl text-white mb-2">Analyzing Learning Profile</h2>
        <p className="text-soft text-sm max-w-[340px]">NeuralPath AI is constructing an adaptive, customized quiz in {userLang.label} ({userLang.flag}) focused on your weak topics...</p>
      </div>
    </PageLayout>
  )

  // ── Intro Screen ──────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
            style={{ backgroundImage: subjectObj.gradient }}>
            <Brain size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-1">Adaptive Quiz</h1>
          <div className="flex items-center justify-center gap-1.5 text-xs text-soft mb-2 font-mono">
            <span>Learning in {userLang.label} {userLang.flag}</span>
          </div>
          <p className="text-soft font-body">{QUIZ_LENGTH} questions · AI-powered difficulty · XP rewards</p>
        </motion.div>

        {/* Mode Selector Toggle */}
        <div className="glass-card p-4 mb-6 flex items-center justify-between border border-white/10 bg-void/20">
          <div>
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              <Star size={14} className="text-indigo-400" />AI Adaptive Quiz Mode
            </h3>
            <p className="text-[10px] text-soft">Generate live, infinite questions in {userLang.label} with Groq Llama 3.3.</p>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsAI(false)}
              className={`px-3 py-1.5 rounded-l-xl text-xs font-semibold transition-all border border-r-0 ${!isAI ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/10 text-soft bg-white/2 hover:bg-white/5'}`}
            >
              Standard
            </button>
            <button
              onClick={() => setIsAI(true)}
              className={`px-3 py-1.5 rounded-r-xl text-xs font-semibold transition-all border border-l-0 ${isAI ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/10 text-soft bg-white/2 hover:bg-white/5'}`}
            >
              AI Adaptive ⭐
            </button>
          </div>
        </div>

        <div className="glass-card p-6 mb-6 border border-white/10">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Star size={15} className="text-indigo-400" />Choose Subject
          </h3>
          <SubjectSelector selected={subject} onSelect={setSubject} />
        </div>

        <div className="glass-card p-6 mb-6 border border-white/10">
          <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={15} className="text-yellow-400" />Choose Difficulty
          </h3>
          <DifficultySelector selected={difficulty} onSelect={setDifficulty} />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { l: 'Questions', v: QUIZ_LENGTH, c: subjectObj.primary },
            { l: 'Mode', v: isAI ? 'AI Adaptive' : DIFFICULTY_CONFIG[difficulty].label, c: isAI ? '#a855f7' : DIFFICULTY_CONFIG[difficulty].color },
            { l: 'Max XP', v: `${QUIZ_LENGTH * DIFFICULTY_CONFIG[difficulty].xp}`, c: '#f59e0b' },
          ].map(s => (
            <div key={s.l} className="glass-card p-4 text-center border border-white/10">
              <p className="font-display font-bold text-2xl mb-0.5" style={{ color: s.c }}>{s.v}</p>
              <p className="text-xs text-soft font-body">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <motion.button whileTap={{ scale: 0.97 }} onClick={start}
            className="flex items-center gap-2 px-10 py-4 rounded-2xl font-display font-bold text-white text-lg mx-auto shadow-lg shadow-glow"
            style={{ backgroundImage: subjectObj.gradient }}>
            <Play size={20} />Start Quiz
          </motion.button>
        </div>
      </div>
    </PageLayout>
  )

  // ── Quiz Screen ───────────────────────────────────────────────────────────
  return (
    <PageLayout>
      <div className="flex flex-col items-center py-2">
        <AnimatePresence mode="wait">
          {currentQ && (
            <QuizQuestion key={currentQ.id} question={currentQ} qNum={qNum} total={QUIZ_LENGTH}
              onAnswer={handleAnswer} streak={sessionStreak} forcedDifficulty={adaptiveDiff || difficulty} />
          )}
        </AnimatePresence>
        <div className="mt-6 flex items-center gap-4">
          <button onClick={() => { dispatch({ type: 'RESET_QUIZ' }); navigate('/dashboard') }}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors">
            <RotateCcw size={12} />Exit Quiz
          </button>
          <span className="text-muted text-xs font-mono">{sessionScore}/{sessionTotal} correct · {totalXP} XP</span>
        </div>
      </div>
    </PageLayout>
  )
}
