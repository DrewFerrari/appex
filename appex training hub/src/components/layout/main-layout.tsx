"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"
import { WhatsAppWidget } from "../zimbabwe/whatsapp-widget"
import { DataSaver } from "../zimbabwe/data-saver"
import { OfflineManager } from "../zimbabwe/offline-manager"
import { MobileNav } from "./mobile-nav"
import { MobileDrawer } from "./mobile-drawer"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  Wifi, 
  WifiOff, 
  Download,
  X
} from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const { data: session } = useSession()
  const [showZimFeatures, setShowZimFeatures] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Make it sticky or fixed if needed, but for now keep as is */}
      <Header />
      
      <div className="flex pt-16 pb-16 md:pb-0">
        {/* Sidebar - Only show for authenticated users */}
        {showSidebar && session && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}
        
        {/* Mobile Drawer */}
        {showSidebar && session && (
          <MobileDrawer 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showSidebar && session ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            {/* Zimbabwe Features Bar */}
            {session && (
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    {isOnline ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-600">Offline Mode</span>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowZimFeatures(!showZimFeatures)}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Zimbabwe Features</span>
                  </Button>
                </div>
                
                {!isOnline && (
                  <div className="bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg">
                    <p className="text-sm text-orange-700">
                      You're offline. Some features may be limited.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Zimbabwe Features Panel */}
            {showZimFeatures && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowZimFeatures(false)}
                    className="absolute -top-2 -right-2 z-10 bg-white border shadow-sm"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <DataSaver />
                </div>
                <div className="relative">
                  <OfflineManager />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start space-x-2">
                      <Wifi className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Enable Data Saver on slow connections</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Download className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Download courses for offline viewing</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <WifiOff className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>Content works even during load shedding</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Settings className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>Adjust video quality to save data</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {showSidebar && session && (
        <MobileNav onMenuClick={() => setIsMobileMenuOpen(true)} />
      )}

      {/* WhatsApp Widget - Always show */}
      <WhatsAppWidget />
    </div>
  )
}
