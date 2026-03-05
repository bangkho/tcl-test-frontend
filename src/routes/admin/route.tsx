import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '../../components/Sidebar'
// import { authMiddleware } from '../../middleware/auth'

export const Route = createFileRoute('/admin')({
  // beforeLoad: authMiddleware,
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <Outlet/>
    </div>
  )
}
