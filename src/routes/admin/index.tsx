import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from '../../components/ui/Card'
import { Package, AlertTriangle, TrendingUp, ArrowDownToLine } from 'lucide-react'
// import { authMiddleware } from '../../middleware/auth'

export const Route = createFileRoute('/admin/')({
  // beforeLoad: authMiddleware,
  component: RouteComponent,
})

function RouteComponent() {
  const stats = [
    {
      title: 'Total Products',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Low Stock',
      value: '23',
      change: '-5%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'red',
    },
    {
      title: 'Total Sales',
      value: '$45,678',
      change: '+8%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Pending Orders',
      value: '56',
      change: '+3%',
      changeType: 'positive' as const,
      icon: ArrowDownToLine,
      color: 'orange',
    },
  ]

  const recentActivity = [
    { item: 'Product A', action: 'Stock updated', time: '2 mins ago' },
    { item: 'Product B', action: 'New order received', time: '15 mins ago' },
    { item: 'Customer X', action: 'Registration', time: '1 hour ago' },
    { item: 'Product C', action: 'Low stock alert', time: '2 hours ago' },
  ]

  return (
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            const colorClasses = {
              blue: 'bg-blue-900/50 text-blue-400',
              red: 'bg-red-900/50 text-red-400',
              green: 'bg-green-900/50 text-green-400',
              orange: 'bg-orange-900/50 text-orange-400',
            }
            return (
              <Card key={stat.title}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-700">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-800"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{activity.item}</p>
                    <p className="text-sm text-gray-400">{activity.action}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
