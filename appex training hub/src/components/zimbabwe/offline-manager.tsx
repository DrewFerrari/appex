"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  WifiOff, 
  Wifi, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  HardDrive,
  FileText,
  Video,
  Clock,
  Smartphone
} from "lucide-react"

interface DownloadItem {
  id: string
  title: string
  type: "course" | "video" | "document"
  size: number // in MB
  downloaded: number // in MB
  status: "pending" | "downloading" | "completed" | "failed"
  priority: "high" | "medium" | "low"
  url: string
}

// Global type for PWA beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

export function OfflineManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isAppInstalled, setIsAppInstalled] = useState(false)
  const [storageInfo, setStorageInfo] = useState({
    used: 245.6, // MB
    total: 1024, // MB
    available: 778.4 // MB
  })
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      type: "course",
      size: 125.4,
      downloaded: 0,
      status: "completed",
      priority: "high",
      url: "/courses/getting-started-retail"
    },
    {
      id: "2",
      title: "POS Operations Tutorial",
      type: "video",
      size: 45.2,
      downloaded: 22.6,
      status: "downloading",
      priority: "medium",
      url: "/videos/pos-operations"
    },
    {
      id: "3",
      title: "Inventory Management Guide",
      type: "document",
      size: 8.7,
      downloaded: 0,
      status: "pending",
      priority: "low",
      url: "/docs/inventory-management"
    }
  ])

  // Monitor online/offline status and PWA install prompt
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsAppInstalled(true)
      console.log('PWA was installed')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check initial status
    setIsOnline(navigator.onLine)
    
    // Check if already in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Check storage quota
  useEffect(() => {
    const checkStorage = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate()
          const used = (estimate.usage || 0) / (1024 * 1024) // Convert to MB
          const quota = (estimate.quota || 1024 * 1024 * 1024) / (1024 * 1024) // Convert to MB
          
          setStorageInfo({
            used: Math.round(used * 10) / 10,
            total: Math.round(quota * 10) / 10,
            available: Math.round((quota - used) * 10) / 10
          })
        } catch (error) {
          console.error('Failed to check storage quota:', error)
        }
      }
    }

    checkStorage()
  }, [])

  // Simulate download progress
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(prev => prev.map(download => {
        if (download.status === "downloading" && download.downloaded < download.size) {
          const increment = Math.random() * 5 // Download 0-5 MB per update
          const newDownloaded = Math.min(download.downloaded + increment, download.size)
          
          if (newDownloaded >= download.size) {
            return { ...download, downloaded: download.size, status: "completed" as const }
          }
          
          return { ...download, downloaded: newDownloaded }
        }
        return download
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const startDownload = (id: string) => {
    setDownloads(prev => prev.map(download => 
      download.id === id 
        ? { ...download, status: "downloading" as const }
        : download
    ))
  }

  const pauseDownload = (id: string) => {
    setDownloads(prev => prev.map(download => 
      download.id === id 
        ? { ...download, status: "pending" as const }
        : download
    ))
  }

  const removeDownload = (id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id))
  }

  const retryDownload = (id: string) => {
    setDownloads(prev => prev.map(download => 
      download.id === id 
        ? { ...download, status: "downloading" as const, downloaded: 0 }
        : download
    ))
  }

  const clearCompleted = () => {
    setDownloads(prev => prev.filter(download => download.status !== "completed"))
  }

  const downloadAll = () => {
    setDownloads(prev => prev.map(download => 
      download.status === "pending" 
        ? { ...download, status: "downloading" as const }
        : download
    ))
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    setDeferredPrompt(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "downloading":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Download className="h-4 w-4 text-gray-600" />
    }
  }

  const totalDownloading = downloads.filter(d => d.status === "downloading").length
  const totalCompleted = downloads.filter(d => d.status === "completed").length
  const totalPending = downloads.filter(d => d.status === "pending").length

  return (
    <Card className="w-full max-w-2xl border-0 md:border shadow-none md:shadow-sm">
      <CardHeader className="pb-4 pt-6 md:pt-6 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-orange-600" />}
            <CardTitle className="text-lg md:text-xl">Offline Manager</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            {totalDownloading > 0 && (
              <Badge variant="outline" className="text-blue-600 hidden md:inline-flex">
                {totalDownloading} downloading
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 px-4 md:px-6">
        {/* PWA Install Banner */}
        {deferredPrompt && !isAppInstalled && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-900">Install AppEx Training Hub</h4>
                <p className="text-sm text-emerald-700">Get a better offline experience and faster access</p>
              </div>
            </div>
            <Button onClick={handleInstallClick} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
              Install App
            </Button>
          </div>
        )}

        {/* Storage Info */}
        <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Storage Used</span>
            <span className="text-gray-600 font-medium">{storageInfo.used.toFixed(1)} <span className="font-normal text-xs text-gray-400">MB</span> / {storageInfo.total.toFixed(1)} <span className="font-normal text-xs text-gray-400">MB</span></span>
          </div>
          <Progress value={(storageInfo.used / storageInfo.total) * 100} className="h-2 bg-gray-200" />
          <p className="text-xs text-gray-500 font-medium">
            {storageInfo.available.toFixed(1)} MB available for downloads
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button 
            onClick={downloadAll} 
            disabled={totalPending === 0 || !isOnline}
            size="sm"
            className="flex-1 md:flex-none h-10"
          >
            <Download className="h-4 w-4 mr-2" />
            Download All {totalPending > 0 && `(${totalPending})`}
          </Button>
          <Button 
            onClick={clearCompleted} 
            disabled={totalCompleted === 0}
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none h-10"
          >
            Clear Completed
          </Button>
          <Button variant="outline" size="sm" className="flex-1 md:flex-none h-10">
            <HardDrive className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Manage Storage</span>
          </Button>
        </div>

        {/* Offline Tips */}
        {!isOnline && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                <WifiOff className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-orange-900 text-base">You're offline</p>
                <p className="text-orange-700 mt-1">
                  Download content while online to access it offline. Currently <span className="font-bold">{totalCompleted} items</span> available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Downloads List */}
        <div className="space-y-3 pt-2">
          <h4 className="font-semibold text-base md:text-sm text-gray-900 border-b pb-2">Downloads</h4>
          {downloads.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Download className="h-10 w-10 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">No downloads yet</p>
              <p className="text-xs text-gray-500 mt-1">Download courses and videos to view offline</p>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((download) => (
                <div key={download.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-gray-100 rounded-xl hover:border-emerald-100 transition-colors gap-3">
                  <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      download.type === 'course' ? 'bg-blue-50 text-blue-600' :
                      download.type === 'video' ? 'bg-purple-50 text-purple-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      {getTypeIcon(download.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm text-gray-900 line-clamp-1">{download.title}</h5>
                        <Badge className={`${getPriorityColor(download.priority)} text-[10px] px-1.5 py-0 uppercase`} variant="outline">
                          {download.priority}
                        </Badge>
                      </div>
                      
                      {download.status === "downloading" && (
                        <div className="space-y-1.5 mt-2">
                          <div className="flex justify-between text-xs font-medium text-gray-500">
                            <span>{download.downloaded.toFixed(1)} MB / {download.size.toFixed(1)} MB</span>
                            <span className="text-blue-600">{Math.round((download.downloaded / download.size) * 100)}%</span>
                          </div>
                          <Progress value={(download.downloaded / download.size) * 100} className="h-1.5 bg-gray-100 [&>div]:bg-blue-500" />
                        </div>
                      )}
                      
                      {download.status !== "downloading" && (
                        <div className="flex items-center space-x-3 text-xs font-medium text-gray-500 mt-1">
                          <span>{download.size.toFixed(1)} MB</span>
                          {download.status === "completed" && (
                            <span className="text-emerald-600 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Available offline</span>
                          )}
                          {download.status === "failed" && (
                            <span className="text-red-600 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Download failed</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end sm:justify-start space-x-1 pl-11 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 mt-2 sm:mt-0">
                    <div className="flex space-x-2">
                      {download.status === "pending" && isOnline && (
                        <Button size="sm" variant="secondary" onClick={() => startDownload(download.id)} className="h-8">
                          <Download className="h-3.5 w-3.5 mr-1.5" /> Start
                        </Button>
                      )}
                      
                      {download.status === "downloading" && (
                        <Button size="sm" variant="secondary" onClick={() => pauseDownload(download.id)} className="h-8">
                          <Clock className="h-3.5 w-3.5 mr-1.5" /> Pause
                        </Button>
                      )}
                      
                      {download.status === "failed" && isOnline && (
                        <Button size="sm" variant="secondary" onClick={() => retryDownload(download.id)} className="h-8">
                          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
                        </Button>
                      )}
                      
                      {(download.status === "completed" || download.status === "failed") && (
                        <Button size="icon" variant="ghost" onClick={() => removeDownload(download.id)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                          <WifiOff className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
