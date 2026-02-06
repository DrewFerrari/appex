import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { useSyncStore } from '@/stores/syncStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useEffect } from 'react'
import AppRoutes from './AppRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 1000 * 60, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function AppProviders({ children }: { children: React.ReactNode }) {
  const setOnlineStatus = useSyncStore((state) => state.setOnlineStatus)
  const addNotification = useNotificationStore((state) => state.addNotification)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true)
      addNotification({
        title: 'Connection Restored',
        message: 'You are back online. Syncing data...',
        type: 'success',
      })
    }

    const handleOffline = () => {
      setOnlineStatus(false)
      addNotification({
        title: 'Connection Lost',
        message: 'You are offline. Changes will be synced when connection is restored.',
        type: 'warning',
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnlineStatus, addNotification])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

function App() {
  return (
    <AppProviders>
      <div className="min-h-screen bg-background-primary text-text-primary">
        <AppRoutes />
      </div>
    </AppProviders>
  )
}

export default App
