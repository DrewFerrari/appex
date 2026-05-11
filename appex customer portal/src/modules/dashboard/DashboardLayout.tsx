import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useSyncStore } from '@/stores/syncStore'
import { useNotificationStore } from '@/stores/notificationStore'
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Wifi,
  WifiOff,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import DashboardPage from './DashboardPage'
import AIAssistant from '../ai/AIAssistant'
import { CurrencySwitcher } from '@/components/shared/CurrencySwitcher'
import ThemeToggle from '@/components/shared/ThemeToggle'
import SolutionRouter from '../solutions/SolutionRouter'

interface DashboardLayoutProps { }

export default function DashboardLayout({ }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { isOnline, syncQueue, syncProgress } = useSyncStore()
  const { unreadCount } = useNotificationStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'POS', href: '/pos', icon: ShoppingCart },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  return (
    <div className="min-h-screen bg-background-primary">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background-secondary transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-background-tertiary">
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <span className="text-lg font-semibold text-text-primary">Appex</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-accent-blue/20 text-accent-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-background-tertiary p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-background-secondary border-b border-background-tertiary">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Sync status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-status-success" />
                ) : (
                  <WifiOff className="h-4 w-4 text-status-warning" />
                )}
                <span className="text-xs text-text-muted">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                {!isOnline && syncQueue.length > 0 && (
                  <span className="text-xs text-accent-blue">
                    ({syncQueue.length} pending)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Currency selector */}
              <CurrencySwitcher />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-status-error text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Business name */}
              <div className="hidden sm:block">
                <p className="text-sm text-text-muted">
                  {user?.businessId ? 'Business Name' : 'Demo Business'}
                </p>
              </div>
            </div>
          </div>

          {/* Sync progress bar */}
          {!isOnline && syncQueue.length > 0 && (
            <div className="h-1 bg-background-tertiary">
              <div
                className="h-full bg-accent-blue transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1">
          {location.pathname === '/dashboard' ? <SolutionRouter /> : <Outlet />}
        </main>
      </div>
      <AIAssistant />
    </div>
  )
}
