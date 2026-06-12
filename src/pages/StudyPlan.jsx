import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Brain, CheckCircle2, Circle, ArrowRight, Flame, Clock, Star, Zap, Target, FileText } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { useApp, getWeakTopics, getTopicAccuracy } from '../context/AppContext'
import { SUBJECT_LIST } from '../data/subjects'

const STUDY_TIPS = {
  mathematics: ['Practice 5 problems daily', 'Draw diagrams for geometry', 'Memorize key formulas', 'Work through examples step by step'],
  physics: ['Draw free body diagrams', 'Check units always', 'Relate concepts to real life', 'Practice numerical problems'],
  chemistry: ['Balance equations first', 'Use the periodic table', 'Understand reaction mechanisms', 'Practice mole calculations'],
  biology: ['Create mind maps', 'Use diagrams and drawings', 'Relate to real organisms', 'Revise using flashcards'],
  english: ['Read widely every day', 'Write practice essays', 'Build vocabulary daily', 'Listen to English media'],
}

// Rule-based Learning DNA lookup for print report
const getLearningDNA = (quizHistory, topicScores, streak, maxStreak) => {
  if (!quizHistory || quizHistory.length < 8) {
    return {
      title: "Locked",
      desc: "Complete at least 8 quiz questions to unlock your learning DNA profile.",
      recommendation: "Take more quizzes in different subjects to start analyzing your learning patterns."
    }
  }
  const total = quizHistory.length
  const correct = quizHistory.filter(h => h.correct).length
  const accuracy = Math.round((correct / total) * 100)
  const activeTopics = Object.keys(topicScores).length

  if (maxStreak >= 5) {
    return {
      title: "Deep Learner",
      desc: "You maintain excellent focus and build strong streaks of correct answers under pressure.",
      recommendation: "Challenge yourself with Hard difficulty settings to test your limits."
    }
  }
  if (accuracy >= 85) {
    return {
      title: "Precision Solver",
      desc: "You prioritize accuracy and analyze concepts carefully before answering.",
      recommendation: "Try practicing speed runs or setting shorter timers to build quick recall."
    }
  }
  if (accuracy < 60) {
    return {
      title: "Consistent Improver",
      desc: "You are actively learning from mistakes and building up knowledge step-by-step.",
      recommendation: "Review the AI Tutor explanations in detail when you get a question wrong."
    }
  }
  if (activeTopics >= 5) {
    return {
      title: "Concept Explorer",
      desc: "You enjoy broad, interdisciplinary learning across multiple sciences and subjects.",
      recommendation: "Focus on your single weakest topic in your Study Plan to build depth."
    }
  }
  return {
    title: "Fast Thinker",
    desc: "You solve problems quickly, though accuracy sometimes drops under pressure.",
    recommendation: "Slow down in Mathematics and double check calculation steps."
  }
}

function SubjectPlanCard({ subject, weakInSubject, delay }) {
  const [checked, setChecked] = useState([])
  const tips = STUDY_TIPS[subject.id] || STUDY_TIPS.mathematics
  const priority = weakInSubject.length > 0 ? 'high' : 'low'
  const priorityColor = priority === 'high' ? '#ef4444' : '#10b981'

  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className="glass-card overflow-hidden border border-white/10">
      <div className="h-px w-full" style={{ background: subject.gradient }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{subject.emoji}</div>
            <div>
              <h3 className="font-display font-bold text-white">{subject.label}</h3>
              <p className="text-xs text-soft">{subject.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono px-2 py-1 rounded-lg border" style={{ color: priorityColor, borderColor: `${priorityColor}30`, background: `${priorityColor}10` }}>
              {priority === 'high' ? 'NEEDS FOCUS' : 'MAINTAIN'}
            </span>
          </div>
        </div>

        {weakInSubject.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-mono text-red-400 mb-2 flex items-center gap-1"><Flame size={10} />Weak Topics</p>
            <div className="space-y-1.5">
              {weakInSubject.map(wt => (
                <div key={wt.topic} className="flex items-center justify-between text-xs p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <span className="text-white font-body">{wt.topic}</span>
                  <span className="font-mono text-red-400">{wt.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-[10px] font-mono mb-2 flex items-center gap-1" style={{ color: subject.primary }}><Star size={10} />Study Tips</p>
          <div className="space-y-1.5">
            {tips.map((tip, i) => {
              const done = checked.includes(i)
              return (
                <button key={i} onClick={() => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                  className="w-full flex items-center gap-2 text-left text-xs px-2 py-1.5 rounded-lg transition-all hover:bg-white/5">
                  {done ? <CheckCircle2 size={12} style={{ color: subject.primary, flexShrink: 0 }} /> : <Circle size={12} className="text-muted flex-shrink-0" />}
                  <span style={{ color: done ? 'white' : '#8892a4' }}>{tip}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={subject.path} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl border transition-all hover:opacity-80 animate-glow"
            style={{ borderColor: subject.border, color: subject.primary, background: subject.bgGlow }}>
            <BookOpen size={11} />Study Now
          </Link>
          <Link to="/quiz" className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl border border-white/10 text-soft hover:text-white transition-all">
            <Brain size={11} />Practice Quiz
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function StudyPlan() {
  const { state } = useApp()
  const { topicScores, dailyStats, quizHistory, streak, maxStreak, subjectProgress } = state
  const weakTopics = getWeakTopics(topicScores)

  const getWeakForSubject = (subjectLabel) => {
    const subjectTopics = {
      Mathematics: ['Algebra', 'Calculus', 'Trigonometry', 'Geometry', 'Statistics', 'Matrices'],
      Physics: ['Mechanics', 'Kinematics', 'Waves', 'Waves & Optics', 'Electricity', 'Thermodynamics', 'Modern Physics'],
      Chemistry: ['Organic Chemistry', 'Periodic Table', 'Chemical Bonding', 'Chemical Reactions', 'Reactions', 'Acids & Bases', 'Electrochemistry'],
      Biology: ['Cell Biology', 'Genetics', 'Human Anatomy', 'Plant Biology', 'Evolution', 'Ecology'],
      English: ['Grammar', 'Vocabulary', 'Writing', 'Writing Skills', 'Reading Comprehension', 'Comprehension', 'Literature', 'Spoken English'],
    }
    const topics = subjectTopics[subjectLabel] || []
    return weakTopics.filter(wt => topics.includes(wt.topic))
  }

  const totalStudyTime = SUBJECT_LIST.length * 45

  // Connect daily goals checklist dynamically to actual state actions
  const dailyGoals = [
    { icon: '📖', task: 'Study 1 topic', done: (dailyStats?.studiedTopics || 0) >= 1 },
    { icon: '✍️', task: 'Complete 5 quiz questions', done: (dailyStats?.quizQuestions || 0) >= 5 },
    { icon: '🤖', task: 'Ask AI tutor 1 question', done: (dailyStats?.tutorQuestions || 0) >= 1 },
    { icon: '📝', task: 'Review weak areas', done: (dailyStats?.quizQuestions || 0) >= 1 && weakTopics.length > 0 },
  ]

  const doneCount = dailyGoals.filter(g => g.done).length
  const dailyProgress = Math.round((doneCount / dailyGoals.length) * 100)

  // printable Report Generator
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const dna = getLearningDNA(quizHistory, topicScores, streak, maxStreak)
    const weakTopicsHtml = weakTopics.map(wt => `<li><strong>${wt.topic}</strong>: ${wt.accuracy}% accuracy (Status: needs focus)</li>`).join('')
    const subjectProgressHtml = SUBJECT_LIST.map(s => `<li><strong>${s.label}</strong>: ${subjectProgress?.[s.id] || 0}% mastery</li>`).join('')

    const html = `
      <html>
        <head>
          <title>NeuralPath AI - Study Performance Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1a202c; max-width: 800px; margin: 0 auto; }
            h1 { border-bottom: 2px solid #6366f1; padding-bottom: 10px; color: #6366f1; font-size: 28px; }
            h2 { color: #312e81; margin-top: 30px; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; color: #4a5568; }
            .stats-grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; background: #f8fafc; }
            .stat-label { font-size: 11px; text-transform: uppercase; color: #718096; margin-bottom: 5px; font-weight: bold; }
            .stat-val { font-size: 22px; font-weight: bold; color: #4f46e5; }
            ul { padding-left: 20px; line-height: 1.6; font-size: 14px; }
            li { margin-bottom: 6px; }
            p { line-height: 1.6; font-size: 14px; color: #2d3748; }
            .dna-box { background: #f5f3ff; border: 1px solid #ddd6fe; padding: 15px; border-radius: 8px; margin-top: 15px; }
            .footer { margin-top: 60px; font-size: 11px; color: #a0aec0; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <h1>NeuralPath AI — Personal Study Report</h1>
          <div class="header-info">
            <div>
              <p style="margin: 0;"><strong>Student:</strong> ${state.user?.name || 'Scholar'}</p>
              <p style="margin: 4px 0 0 0;"><strong>Email:</strong> ${state.user?.email || 'N/A'}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0;"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
              <p style="margin: 4px 0 0 0;"><strong>Status:</strong> ${state.isDemo ? 'Demo Session' : 'Active Student'}</p>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-label">Level</div><div class="stat-val">${state.level}</div></div>
            <div class="stat-card"><div class="stat-label">Total XP</div><div class="stat-val">${state.xp} XP</div></div>
            <div class="stat-card"><div class="stat-label">Max Streak</div><div class="stat-val">${state.maxStreak} 🔥</div></div>
            <div class="stat-card"><div class="stat-label">Total Questions</div><div class="stat-val">${state.totalQuestions}</div></div>
          </div>
          
          <h2>Subject Mastery Breakdown</h2>
          <ul>${subjectProgressHtml}</ul>
          
          <h2>Weak Topics & Focus Areas</h2>
          <ul>${weakTopicsHtml || '<li>All topics are strong! Challenge yourself with harder quizzes.</li>'}</ul>
          
          <h2>Neural Learning DNA Profile</h2>
          <div class="dna-box">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #5b21b6; font-size: 15px;">Profile: ${dna.title}</p>
            <p style="margin: 0 0 10px 0;">${dna.desc}</p>
            <p style="margin: 0; font-size: 12px; color: #4c1d95;"><strong>Recommendation:</strong> ${dna.recommendation}</p>
          </div>
          
          <div class="footer">
            NeuralPath AI adaptive learning platform — Prepared for CBSE/ICSE Board Prep.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: '#6366f1' }} animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-xs font-mono text-indigo-400">AI-Generated</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">
              Your <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>Study Plan</span>
            </h1>
            <p className="text-soft font-body text-sm">Personalized based on your performance · Est. {totalStudyTime} min/week</p>
          </div>
          {/* Printable Report Action */}
          <button
            onClick={handlePrintReport}
            className="btn-ghost border-white/10 hover:border-white/20 text-soft hover:text-white flex items-center gap-2 text-xs py-2 rounded-xl"
          >
            <FileText size={13} />
            Export Study Report
          </button>
        </motion.div>

        {/* Daily Goals */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white flex items-center gap-2"><Target size={15} className="text-indigo-400" />Daily Goals</h3>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-white/8 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${dailyProgress}%`, background: 'linear-gradient(90deg,#6366f1,#a855f7)' }} /></div>
              <span className="text-xs font-mono text-indigo-400">{dailyProgress}%</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dailyGoals.map((g, i) => {
              return (
                <div key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all bg-void/10"
                  style={{ borderColor: g.done ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.04)', background: g.done ? 'rgba(99,102,241,0.08)' : 'transparent' }}>
                  <span className="text-lg">{g.icon}</span>
                  <span className="text-sm font-body flex-1" style={{ color: g.done ? 'white' : '#8892a4' }}>{g.task}</span>
                  {g.done ? <CheckCircle2 size={14} className="text-indigo-400 flex-shrink-0" /> : <Circle size={14} className="text-muted flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Flame, label: 'Focus Subjects', value: weakTopics.length > 0 ? SUBJECT_LIST.filter(s => getWeakForSubject(s.label).length > 0).length : 0, color: '#ef4444' },
            { icon: Zap, label: 'Total Topics', value: SUBJECT_LIST.reduce((a, s) => a + (s.tools?.length || 0), 0), color: '#6366f1' },
            { icon: CheckCircle2, label: 'Strong Areas', value: Object.keys(state.topicScores).filter(t => getTopicAccuracy(state.topicScores[t]) >= 80).length, color: '#10b981' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="glass-card p-4 text-center border border-white/10">
              <Icon size={18} className="mx-auto mb-2" style={{ color }} />
              <p className="font-display font-bold text-2xl" style={{ color }}>{value}</p>
              <p className="text-xs text-soft font-body">{label}</p>
            </div>
          ))}
        </div>

        {/* Subject plans */}
        <h2 className="font-display font-bold text-white text-xl mb-4">Subject Roadmaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {SUBJECT_LIST.map((s, i) => (
            <SubjectPlanCard key={s.id} subject={s} weakInSubject={getWeakForSubject(s.label)} delay={0.05 * i + 0.2} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
          <Link to="/quiz" className="btn-primary inline-flex items-center gap-2 shadow-glow"><Brain size={15} />Start Practice Session<ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </PageLayout>
  )
}
