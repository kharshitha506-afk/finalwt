import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import StudyPlan from './pages/StudyPlan'
import AITutor from './pages/AITutor'
import Mathematics from './pages/subjects/Mathematics'
import Physics from './pages/subjects/Physics'
import Chemistry from './pages/subjects/Chemistry'
import Biology from './pages/subjects/Biology'
import English from './pages/subjects/English'

import { ClerkProvider, useUser, AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { CLERK_PUBLISHABLE_KEY, isClerkEnabled } from './lib/clerk'

const NAVBAR_ROUTES = ['/dashboard', '/quiz', '/results', '/study-plan', '/ai-tutor']

function ClerkSync() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { state, dispatch } = useApp()

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      if (!state.isAuthenticated) {
        dispatch({
          type: 'LOGIN',
          payload: {
            name: user.firstName || user.username || user.primaryEmailAddress?.emailAddress.split('@')[0],
            email: user.primaryEmailAddress?.emailAddress
          }
        })
      }
    } else if (isLoaded && !isSignedIn && state.isAuthenticated && !state.isDemo) {
      dispatch({ type: 'LOGOUT' })
    }
  }, [isLoaded, isSignedIn, user, state.isAuthenticated, state.isDemo, dispatch])

  return null
}

function AppInner() {
  const location = useLocation()
  const showNavbar = NAVBAR_ROUTES.some(r => location.pathname.startsWith(r))
  const enabled = isClerkEnabled()

  return (
    <div className="noise">
      <ScrollToTop />
      {showNavbar && <Navbar />}
      {enabled && <ClerkSync />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Default → Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/study-plan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
          <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />

          {/* Subjects */}
          <Route path="/subjects/mathematics" element={<ProtectedRoute><Mathematics /></ProtectedRoute>} />
          <Route path="/subjects/physics" element={<ProtectedRoute><Physics /></ProtectedRoute>} />
          <Route path="/subjects/chemistry" element={<ProtectedRoute><Chemistry /></ProtectedRoute>} />
          <Route path="/subjects/biology" element={<ProtectedRoute><Biology /></ProtectedRoute>} />
          <Route path="/subjects/english" element={<ProtectedRoute><English /></ProtectedRoute>} />

          {/* SSO callback — Clerk OAuth handshake finalizer (must always be registered) */}
          <Route
            path="/sso-callback"
            element={<AuthenticateWithRedirectCallback afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />}
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const enabled = isClerkEnabled()

  const content = (
    <AppProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AppProvider>
  )

  if (enabled) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        {content}
      </ClerkProvider>
    )
  }

  return content
}
