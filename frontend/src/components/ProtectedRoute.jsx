import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROLE_HOME } from '../utils/constants'
import { PageLoader } from './ui/Misc'

/**
 * Guards a route by authentication and (optionally) role.
 */
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    // Signed in but wrong portal — send to their own home.
    return <Navigate to={ROLE_HOME[user.role] || '/'} replace />
  }

  return children
}
