import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../stores/authStore'
import LoginBox from '../components/LoginBox'

function checkAlreadyAuthenticated(): boolean {
  const { isAuthenticated, token } = useAuthStore.getState()

  if (isAuthenticated && token) return true
  return false
}

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (checkAlreadyAuthenticated()) {
      throw redirect({ to: '/admin' })
    }
  },
  component: App,
})

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md">
          <LoginBox />
        </div>
      </div>
    </main>
  )
}
