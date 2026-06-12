import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isClerkEnabled } from '../lib/clerk'
import { useAuth } from '@clerk/clerk-react'

// Clerk-aware protected route — prevents bounce when Clerk session
// is established but ClerkSync hasn't updated AppContext yet
function ClerkAwareProtectedRoute({ children, location }) {
  const { isLoaded, isSignedIn } = useAuth()
  // Still loading Clerk — wait before deciding
  if (!isLoaded) return null
  // Clerk loaded and user is signed in — allow through
  if (isSignedIn) return children
  // Clerk loaded but not signed in — bounce to login
  return <Navigate to="/login" state={{ from: location }} replace />
}

export default function ProtectedRoute({ children }) {
  const { state } = useApp()
  const location = useLocation()

  // If Clerk is active, delegate auth check to Clerk-aware guard
  if (isClerkEnabled()) {
    return (
      <ClerkAwareProtectedRoute location={location}>
        {children}
      </ClerkAwareProtectedRoute>
    )
  }

  // Fallback: legacy localStorage-based auth check
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
