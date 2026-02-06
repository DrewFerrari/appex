import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useNotificationStore } from '@/stores/notificationStore'
import { useEffect } from 'react'

export function Toaster() {
  const { toasts } = useToast()
  const { notifications, removeNotification } = useNotificationStore()

  // Convert notifications to toasts
  useEffect(() => {
    notifications.forEach((notification) => {
      // This would be handled by the useToast hook
      // For now, we'll just remove old notifications
      if (Date.now() - notification.createdAt.getTime() > 5000) {
        removeNotification(notification.id)
      }
    })
  }, [notifications, removeNotification])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
