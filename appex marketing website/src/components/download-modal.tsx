'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, QrCode, Smartphone, Monitor, Apple, Play, Check } from 'lucide-react'
import QRCode from 'qrcode'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
}

const industries = [
  { value: 'retail', label: 'Retail Store' },
  { value: 'hardware', label: 'Hardware Store' },
  { value: 'restaurant', label: 'Restaurant / Café' },
  { value: 'grocery', label: 'Grocery Store' },
  { value: 'butchery', label: 'Butchery' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'service', label: 'Service Business' },
]

const platforms = [
  { 
    value: 'android', 
    label: 'Android App', 
    icon: Play,
    description: 'For Android phones and tablets',
    color: 'bg-green-500'
  },
  { 
    value: 'ios', 
    label: 'iOS App', 
    icon: Apple,
    description: 'For iPhone and iPad',
    color: 'bg-gray-800'
  },
  { 
    value: 'windows', 
    label: 'Windows App', 
    icon: Monitor,
    description: 'For Windows desktop',
    color: 'bg-blue-500'
  },
]

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showQR, setShowQR] = useState<boolean>(false)

  const generateQRCode = async () => {
    if (!selectedPlatform || !selectedIndustry) return

    const baseUrl = 'https://appexpos.com/app'
    const url = `${baseUrl}?platform=${selectedPlatform}&industry=${selectedIndustry}`
    
    try {
      const qrDataUrl = await QRCode.toDataURL(url)
      setQrCodeUrl(qrDataUrl)
      setShowQR(true)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const handleDownload = (platform: string) => {
    setSelectedPlatform(platform)
    setTimeout(() => {
      const element = document.getElementById('industry-selection')
      element?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const getDownloadUrl = (platform: string) => {
    const baseUrl = 'https://appexpos.com/app'
    if (selectedIndustry) {
      return `${baseUrl}?platform=${platform}&industry=${selectedIndustry}`
    }
    return `${baseUrl}?platform=${platform}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient">
            Download Appex POS
          </DialogTitle>
          <DialogDescription className="text-lg">
            Choose your platform and business type for a personalized experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Platform Selection */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Choose Your Platform</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <Card 
                  key={platform.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPlatform === platform.value 
                      ? 'ring-2 ring-appex-teal shadow-glow' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => handleDownload(platform.value)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className={`w-16 h-16 ${platform.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <platform.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{platform.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {platform.description}
                    </p>
                    <Button 
                      variant={selectedPlatform === platform.value ? "appex" : "outline"}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(platform.value)
                      }}
                    >
                      {selectedPlatform === platform.value ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Choose
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Industry Selection */}
          {selectedPlatform && (
            <div id="industry-selection">
              <h3 className="text-xl font-semibold mb-4">Select Your Business Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {industries.map((industry) => (
                  <Card 
                    key={industry.value}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedIndustry === industry.value 
                        ? 'ring-2 ring-appex-teal shadow-glow' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setSelectedIndustry(industry.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{industry.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tailored features for your industry
                          </p>
                        </div>
                        {selectedIndustry === industry.value && (
                          <Check className="w-5 h-5 text-appex-teal" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Generate QR Code Button */}
              <div className="text-center">
                <Button 
                  variant="appex" 
                  size="lg"
                  onClick={generateQRCode}
                  disabled={!selectedIndustry}
                  className="mr-4"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Generate QR Code
                </Button>

                {/* Direct Download Button */}
                <Button 
                  variant="appexOutline" 
                  size="lg"
                  onClick={() => window.open(getDownloadUrl(selectedPlatform), '_blank')}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Directly
                </Button>
              </div>
            </div>
          )}

          {/* QR Code Display */}
          {showQR && qrCodeUrl && (
            <div className="text-center">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Scan to Download</CardTitle>
                  <CardDescription>
                    Scan this QR code with your phone to download Appex POS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img 
                      src={qrCodeUrl} 
                      alt="Download QR Code" 
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Platform:</strong> {platforms.find(p => p.value === selectedPlatform)?.label}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Industry:</strong> {industries.find(i => i.value === selectedIndustry)?.label}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => setShowQR(false)}>
                      Generate Another
                    </Button>
                    <Button 
                      variant="appex"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.download = 'appex-pos-qr.png'
                        link.href = qrCodeUrl
                        link.click()
                      }}
                    >
                      Save QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Preview */}
          <div className="bg-gradient-to-r from-appex-teal/10 to-appex-cyan/10 dark:from-appex-teal/20 dark:to-appex-cyan/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">What's Included?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm">Industry-specific product catalog</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm">Pre-configured workflows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm">Sample data & templates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm">Zimbabwe payment methods</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DownloadModal
