import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NotificationState, Notification, NotificationSettings } from '@/types'

interface NotificationStore extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  removeNotification: (id: string) => void
  updateSettings: (settings: Partial<NotificationSettings>) => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      settings: {
        email: true,
        sms: true,
        push: true,
        lowStock: true,
        sales: true,
        customers: true,
      },

      // Actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date(),
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))

        // Auto-remove success notifications after 5 seconds
        if (notification.type === 'success') {
          setTimeout(() => {
            get().removeNotification(newNotification.id)
          }, 5000)
        }
      },

      markAsRead: (id: string) => {
        set((state) => {
          const notifications = state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          )
          const unreadCount = notifications.filter((notif) => !notif.read).length
          
          return {
            notifications,
            unreadCount,
          }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
          unreadCount: 0,
        }))
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        })
      },

      removeNotification: (id: string) => {
        set((state) => {
          const notifications = state.notifications.filter((notif) => notif.id !== id)
          const unreadCount = notifications.filter((notif) => !notif.read).length
          
          return {
            notifications,
            unreadCount,
          }
        })
      },

      updateSettings: (newSettings: Partial<NotificationSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
)
