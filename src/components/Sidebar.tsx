import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/inventory', label: 'Inventory', icon: Package },
  { path: '/admin/customer', label: 'Customers', icon: Users },
  { path: '/admin/transaction', label: 'Transactions', icon: ShoppingCart },
]

export function Sidebar() {
  const location = useLocation()
  const logout = useAuthStore().logout

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Inventory</h1>
        <p className="text-sm text-gray-400">Management System</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-300 hover:bg-red-900/50 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
