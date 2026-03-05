import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  email: string
  token: string | null
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  getToken: () => string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      email: '',
      token: null,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call - replace with actual auth logic
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Example validation - replace with real authentication
          if (!email || !password) {
            throw new Error('Email and password are required')
          }

          // Simulated token - replace with actual token from API
          const mockToken = `mock_token_${Date.now()}`

          // Store token in cookie

          // Store in localStorage via zustand persist
          set({ isAuthenticated: true, email, token: mockToken, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          })
        }
      },

      logout: () => {
        set({ isAuthenticated: false, email: '', token: null, error: null })
      },

      clearError: () => {
        set({ error: null })
      },

      getToken: () => {
        return get().token
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        email: state.email,
        token: state.token,
      }),
    }
  )
)
