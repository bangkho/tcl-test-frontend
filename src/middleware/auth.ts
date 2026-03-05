import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'

/**
 * Public routes that don't require authentication
 */
const publicRoutes = new Set(['/'])

/**
 * Check if user is authenticated (checks both store and cookie)
 */
function checkAuthentication(): boolean {
  // First check the store state (persisted via Zustand)
  const { isAuthenticated, token } = useAuthStore.getState()

  if (isAuthenticated && token) {
    return true
  }

  return false
}

/**
 * Auth middleware/guard for TanStack Router
 * Checks authentication before loading protected routes
 * Redirects to home page if not authenticated
 *
 * Works with page refresh/restart - uses both Zustand persist and cookie storage
 */
export async function authMiddleware({ location }: { location: { pathname: string } }) {
  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.has(location.pathname)

  // If it's a public route, allow access
  if (isPublicRoute) {
    return
  }

  // Check if user is authenticated (works after page restart)
  const isAuthenticated = checkAuthentication()

  if (!isAuthenticated) {
    // Redirect to home page if not authenticated
    throw redirect({
      to: '/',
    })
  }
}
