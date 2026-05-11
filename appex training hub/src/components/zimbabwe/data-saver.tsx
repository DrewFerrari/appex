"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Monitor,
  Smartphone,
  Settings,
  Zap
} from "lucide-react"

interface DataSaverSettings {
  enabled: boolean
  videoQuality: "auto" | "360p" | "720p" | "1080p"
  autoDownload: boolean
  preloadImages: boolean
  compressImages: boolean
  reduceAnimations: boolean
  offlineMode: boolean
}

export function DataSaver() {
  const [settings, setSettings] = useState<DataSaverSettings>({
    enabled: false,
    videoQuality: "auto",
    autoDownload: false,
    preloadImages: true,
    compressImages: false,
    reduceAnimations: false,
    offlineMode: false
  })

  const [connectionSpeed, setConnectionSpeed] = useState<"fast" | "slow" | "unknown">("unknown")
  const [dataUsed, setDataUsed] = useState({
    today: 45.2, // MB
    thisWeek: 234.7, // MB
    thisMonth: 1024.5 // MB
  })

  // Detect connection speed
  useEffect(() => {
    const detectConnectionSpeed = async () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        if (connection) {
          const effectiveType = connection.effectiveType
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            setConnectionSpeed("slow")
          } else if (effectiveType === '4g') {
            setConnectionSpeed("fast")
          } else {
            setConnectionSpeed("unknown")
          }
        }
      }
    }

    detectConnectionSpeed()
    
    // Listen for connection changes
    const handleConnectionChange = () => {
      detectConnectionSpeed()
    }

    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  // Auto-enable data saver on slow connections
  useEffect(() => {
    if (connectionSpeed === "slow" && !settings.enabled) {
      setSettings(prev => ({ ...prev, enabled: true }))
    }
  }, [connectionSpeed, settings.enabled])

  const updateSetting = (key: keyof DataSaverSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    // Save to localStorage
    localStorage.setItem('dataSaverSettings', JSON.stringify({ ...settings, [key]: value }))
  }

  const loadSettings = () => {
    const saved = localStorage.getItem('dataSaverSettings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
      } catch (error) {
        console.error('Failed to load data saver settings:', error)
      }
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const applyDataSaverStyles = () => {
    if (settings.enabled) {
      document.body.classList.add('data-saver-mode')
      if (settings.reduceAnimations) {
        document.body.classList.add('reduce-animations')
      }
      if (settings.compressImages) {
        document.body.classList.add('compress-images')
      }
    } else {
      document.body.classList.remove('data-saver-mode', 'reduce-animations', 'compress-images')
    }
  }

  useEffect(() => {
    applyDataSaverStyles()
  }, [settings])

  const getConnectionIcon = () => {
    switch (connectionSpeed) {
      case "fast":
        return <Wifi className="h-4 w-4 text-green-600" />
      case "slow":
        return <WifiOff className="h-4 w-4 text-orange-600" />
      default:
        return <Wifi className="h-4 w-4 text-gray-600" />
    }
  }

  const getConnectionText = () => {
    switch (connectionSpeed) {
      case "fast":
        return "Good connection"
      case "slow":
        return "Slow connection"
      default:
        return "Checking connection..."
    }
  }

  const estimatedSavings = settings.enabled ? "60-80%" : "0%"

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">Data Saver</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {getConnectionIcon()}
            <span className="text-sm text-gray-600">{getConnectionText()}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="data-saver" className="text-base font-medium">
              Enable Data Saver
            </Label>
            <p className="text-sm text-gray-600">
              Reduce data usage by up to {estimatedSavings}
            </p>
          </div>
          <Switch
            id="data-saver"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Video Quality */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Video Quality</Label>
              <div className="grid grid-cols-2 gap-2">
                {["auto", "360p", "720p", "1080p"].map((quality) => (
                  <Button
                    key={quality}
                    variant={settings.videoQuality === quality ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSetting('videoQuality', quality)}
                    className="text-xs"
                  >
                    {quality === "auto" ? "Auto" : quality}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto-download" className="text-sm">
                    Auto-download for offline
                  </Label>
                  <p className="text-xs text-gray-600">
                    Download courses when on WiFi
                  </p>
                </div>
                <Switch
                  id="auto-download"
                  checked={settings.autoDownload}
                  onCheckedChange={(checked) => updateSetting('autoDownload', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="preload-images" className="text-sm">
                    Preload images
                  </Label>
                  <p className="text-xs text-gray-600">
                    Load images in advance
                  </p>
                </div>
                <Switch
                  id="preload-images"
                  checked={settings.preloadImages}
                  onCheckedChange={(checked) => updateSetting('preloadImages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="compress-images" className="text-sm">
                    Compress images
                  </Label>
                  <p className="text-xs text-gray-600">
                    Lower quality images
                  </p>
                </div>
                <Switch
                  id="compress-images"
                  checked={settings.compressImages}
                  onCheckedChange={(checked) => updateSetting('compressImages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="reduce-animations" className="text-sm">
                    Reduce animations
                  </Label>
                  <p className="text-xs text-gray-600">
                    Disable visual effects
                  </p>
                </div>
                <Switch
                  id="reduce-animations"
                  checked={settings.reduceAnimations}
                  onCheckedChange={(checked) => updateSetting('reduceAnimations', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="offline-mode" className="text-sm">
                    Offline mode
                  </Label>
                  <p className="text-xs text-gray-600">
                    Use only cached content
                  </p>
                </div>
                <Switch
                  id="offline-mode"
                  checked={settings.offlineMode}
                  onCheckedChange={(checked) => updateSetting('offlineMode', checked)}
                />
              </div>
            </div>
          </>
        )}

        {/* Data Usage */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm mb-3">Data Usage This Month</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Today</span>
              <span>{dataUsed.today.toFixed(1)} MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>This Week</span>
              <span>{dataUsed.thisWeek.toFixed(1)} MB</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>This Month</span>
              <span>{dataUsed.thisMonth.toFixed(1)} MB</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        {settings.enabled && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 text-sm mb-2">
              Data Saving Tips
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>Download courses on WiFi for offline viewing</li>
              <li>Use lower video quality to save bandwidth</li>
              <li>Enable auto-download to prepare content in advance</li>
              <li>Compress images for faster loading</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
