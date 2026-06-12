import { createContext, useContext, useReducer, useEffect } from 'react'

const initialState = {
  user: null,
  isAuthenticated: false,
  score: 0,
  totalQuestions: 0,
  streak: 0,
  maxStreak: 0,
  xp: 0,
  level: 1,
  topicScores: {}, // starts empty
  subjectProgress: {}, // computed dynamically
  currentDifficulty: 'medium',
  quizHistory: [],
  currentSession: null,
  badges: [],
  dailyGoal: 10,
  hasCompletedOnboarding: false,
  confidenceLevel: null,
  isDemo: false,
  dailyStats: {
    studiedTopics: 0,
    quizQuestions: 0,
    tutorQuestions: 0,
  },
}

const XP_PER_CORRECT = 15
const XP_PER_STREAK = 5
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000]

export const getLevelName = (level) => {
  const names = ['', 'Novice', 'Learner', 'Scholar', 'Explorer', 'Thinker', 'Expert', 'Master', 'Guru', 'Legend']
  return names[Math.min(level, names.length - 1)] || 'Legend'
}
export const getXPForLevel = (level) => LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)] || 5000
export const getNextLevelXP = (level) => LEVEL_THRESHOLDS[Math.min(level + 1, LEVEL_THRESHOLDS.length - 1)] || 9999
export const getWeakTopics = (topicScores) =>
  Object.entries(topicScores)
    .filter(([, d]) => d.total > 0 && d.correct / d.total < 0.6)
    .map(([topic, d]) => ({ topic, accuracy: Math.round((d.correct / d.total) * 100), ...d }))
    .sort((a, b) => a.accuracy - b.accuracy)
export const getTopicAccuracy = (d) => d.total === 0 ? 0 : Math.round((d.correct / d.total) * 100)

export const getSubjectProgress = (topicScores) => {
  const subjectTopics = {
    mathematics: ['Algebra', 'Calculus', 'Trigonometry', 'Geometry', 'Statistics', 'Matrices'],
    physics: ['Mechanics', 'Kinematics', 'Waves', 'Waves & Optics', 'Electricity', 'Thermodynamics', 'Modern Physics'],
    chemistry: ['Organic Chemistry', 'Periodic Table', 'Chemical Bonding', 'Chemical Reactions', 'Reactions', 'Acids & Bases', 'Electrochemistry'],
    biology: ['Cell Biology', 'Genetics', 'Human Anatomy', 'Plant Biology', 'Evolution', 'Ecology'],
    english: ['Grammar', 'Vocabulary', 'Writing', 'Writing Skills', 'Reading Comprehension', 'Comprehension', 'Literature', 'Spoken English'],
  }
  
  const progress = {}
  Object.entries(subjectTopics).forEach(([subId, topics]) => {
    let correctSum = 0
    let totalSum = 0
    topics.forEach(t => {
      const score = topicScores[t]
      if (score && score.total > 0) {
        correctSum += score.correct
        totalSum += score.total
      }
    })
    progress[subId] = totalSum > 0 ? Math.round((correctSum / totalSum) * 100) : 0
  })
  return progress
}

export const getWeeklyChartData = (quizHistory) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const result = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const dayName = days[d.getDay()]
    const dateStr = d.toDateString()
    
    const dayEntries = quizHistory.filter(h => {
      if (!h.date) return false
      return new Date(h.date).toDateString() === dateStr
    })
    
    let correctCount = 0
    let xpSum = 0
    dayEntries.forEach(e => {
      if (e.correct) correctCount++
      xpSum += e.xpEarned || (e.correct ? 15 : 2)
    })
    
    const scoreVal = dayEntries.length > 0 ? Math.round((correctCount / dayEntries.length) * 100) : 0
    
    result.push({
      day: dayName,
      score: scoreVal,
      xp: xpSum,
      dateStr
    })
  }
  return result
}

function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN': return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGOUT': return { ...initialState }
    case 'LOGIN_DEMO': {
      const today = new Date()
      const getPastDateString = (daysAgo) => {
        const d = new Date()
        d.setDate(today.getDate() - daysAgo)
        return d.toISOString()
      }
      return {
        ...state,
        user: { name: 'Arjun (Demo)', email: 'demo@neuralpath.ai' },
        isAuthenticated: true,
        score: 24,
        totalQuestions: 32,
        streak: 4,
        maxStreak: 6,
        xp: 450,
        level: 3,
        isDemo: true,
        hasCompletedOnboarding: true,
        confidenceLevel: 'intermediate',
        dailyGoal: 30,
        badges: ['first_correct', 'streak_3', 'quiz_complete'],
        topicScores: {
          Algebra: { correct: 4, total: 6, difficulty: 'medium' },
          Calculus: { correct: 2, total: 5, difficulty: 'hard' },
          Trigonometry: { correct: 3, total: 5, difficulty: 'medium' },
          Geometry: { correct: 5, total: 6, difficulty: 'easy' },
          Mechanics: { correct: 3, total: 5, difficulty: 'medium' },
          Thermodynamics: { correct: 1, total: 4, difficulty: 'hard' },
        },
        quizHistory: [
          { topic: 'Algebra', correct: true, difficulty: 'medium', xpEarned: 15, date: getPastDateString(4) },
          { topic: 'Geometry', correct: true, difficulty: 'easy', xpEarned: 15, date: getPastDateString(4) },
          { topic: 'Calculus', correct: false, difficulty: 'hard', xpEarned: 2, date: getPastDateString(3) },
          { topic: 'Mechanics', correct: true, difficulty: 'medium', xpEarned: 15, date: getPastDateString(2) },
          { topic: 'Algebra', correct: true, difficulty: 'medium', xpEarned: 17, date: getPastDateString(2) },
          { topic: 'Thermodynamics', correct: false, difficulty: 'hard', xpEarned: 2, date: getPastDateString(1) },
          { topic: 'Trigonometry', correct: true, difficulty: 'medium', xpEarned: 15, date: getPastDateString(1) },
          { topic: 'Calculus', correct: true, difficulty: 'hard', xpEarned: 20, date: getPastDateString(0) },
          { topic: 'Geometry', correct: true, difficulty: 'easy', xpEarned: 15, date: getPastDateString(0) },
        ],
        dailyStats: {
          studiedTopics: 1,
          quizQuestions: 2,
          tutorQuestions: 1,
        }
      }
    }
    case 'COMPLETE_ONBOARDING': {
      const { subjects, confidenceLevel, dailyGoal } = action.payload
      const newScores = {}
      
      const subjectTopics = {
        mathematics: ['Algebra', 'Calculus', 'Trigonometry', 'Geometry'],
        physics: ['Mechanics', 'Thermodynamics'],
        chemistry: ['Organic Chemistry', 'Periodic Table'],
        biology: ['Cell Biology', 'Genetics'],
        english: ['Grammar', 'Vocabulary'],
      }
      
      // Seed small baseline to indicate they are weak topics (needs focus)
      let correct = 1, total = 3 // Beginner: 33%
      if (confidenceLevel === 'intermediate') {
        correct = 2
        total = 5 // 40%
      } else if (confidenceLevel === 'advanced') {
        correct = 3
        total = 6 // 50%
      }
      
      subjects.forEach(sub => {
        const topics = subjectTopics[sub] || []
        topics.forEach(t => {
          newScores[t] = { correct, total, difficulty: confidenceLevel === 'advanced' ? 'hard' : 'medium' }
        })
      })
      
      return {
        ...state,
        hasCompletedOnboarding: true,
        confidenceLevel,
        dailyGoal,
        topicScores: newScores,
        dailyStats: {
          studiedTopics: 0,
          quizQuestions: 0,
          tutorQuestions: 0,
        }
      }
    }
    case 'ANSWER_QUESTION': {
      const { topic, correct, difficulty } = action.payload
      const prev = state.topicScores[topic] || { correct: 0, total: 0 }
      const newStreak = correct ? state.streak + 1 : 0
      const xpEarned = correct ? XP_PER_CORRECT + Math.floor(newStreak / 3) * XP_PER_STREAK : 2
      const newXP = state.xp + xpEarned
      let newLevel = state.level
      while (newLevel < LEVEL_THRESHOLDS.length - 1 && newXP >= LEVEL_THRESHOLDS[newLevel]) newLevel++
      
      // Update daily stats
      const newDailyStats = {
        ...state.dailyStats,
        quizQuestions: (state.dailyStats?.quizQuestions || 0) + 1
      }
      
      return {
        ...state,
        score: correct ? state.score + 1 : state.score,
        totalQuestions: state.totalQuestions + 1,
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
        xp: newXP,
        level: newLevel,
        currentDifficulty: correct ? (difficulty === 'easy' ? 'medium' : 'hard') : (difficulty === 'hard' ? 'medium' : 'easy'),
        topicScores: { ...state.topicScores, [topic]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1, difficulty } },
        quizHistory: [...state.quizHistory, { topic, correct, difficulty, xpEarned, date: new Date().toISOString() }],
        dailyStats: newDailyStats
      }
    }
    case 'START_SESSION': return { ...state, currentSession: { startTime: Date.now() }, score: 0, totalQuestions: 0 }
    case 'END_SESSION': return { ...state, currentSession: null }
    case 'RESET_QUIZ': return { ...state, score: 0, totalQuestions: 0, streak: 0, currentSession: null }
    case 'ADD_BADGE': return state.badges.includes(action.payload) ? state : { ...state, badges: [...state.badges, action.payload] }
    case 'INCREMENT_DAILY_STAT': {
      const { type } = action.payload
      return {
        ...state,
        dailyStats: {
          ...state.dailyStats,
          [type]: (state.dailyStats?.[type] || 0) + 1
        }
      }
    }
    default: return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('neuralpath_v4')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...init,
          ...parsed,
          topicScores: parsed.topicScores || {},
          quizHistory: parsed.quizHistory || [],
          badges: parsed.badges || [],
          dailyStats: parsed.dailyStats || { studiedTopics: 0, quizQuestions: 0, tutorQuestions: 0 },
        }
      }
    } catch {}
    return init
  })

  useEffect(() => {
    try {
      localStorage.setItem('neuralpath_v4', JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        xp: state.xp,
        level: state.level,
        maxStreak: state.maxStreak,
        topicScores: state.topicScores,
        quizHistory: state.quizHistory,
        badges: state.badges,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        confidenceLevel: state.confidenceLevel,
        dailyGoal: state.dailyGoal,
        isDemo: state.isDemo,
        dailyStats: state.dailyStats,
      }))
    } catch {}
  }, [state.xp, state.topicScores, state.badges, state.isAuthenticated])

  const dynamicSubjectProgress = getSubjectProgress(state.topicScores)

  return (
    <AppContext.Provider value={{ state: { ...state, subjectProgress: dynamicSubjectProgress }, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
