import { useForm } from 'react-hook-form'
import { useAuthStore } from '../stores/authStore'

interface LoginFormData {
  email: string
  password: string
}

interface LoginBoxProps {
  className?: string
}

export default function LoginBox({ className = '' }: LoginBoxProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { login, isLoading, error, clearError } = useAuthStore()

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    await login(data.email, data.password)
  }

  return (
    <div className={`island-shell rounded-2xl p-6 sm:p-8 ${className}`}>
      <div className="mb-6 text-center">
        <h2 className="display-title text-2xl font-bold text-[var(--sea-ink)]">
          SMART INVENTORY
        </h2>
        <p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
          Sign in to manage your inventory
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[var(--sea-ink)]"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/60 focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/20"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[var(--sea-ink)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/60 focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/20"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[var(--palm)] px-4 py-3 font-semibold text-white transition-all hover:bg-[var(--lagoon-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/30 disabled:opacity-60"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
