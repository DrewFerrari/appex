import crypto from 'crypto'
import { DeviceInfo, LocationData } from '../types/auth'
import { prisma } from '../config/database'

export class DeviceFingerprintService {
  private static readonly DEVICE_FINGERPRINT_SALT = process.env.DEVICE_FINGERPRINT_SALT || 'default-salt'

  static generateFingerprint(req: any): string {
    const signals = {
      // Browser characteristics
      userAgent: req.headers['user-agent'],
      acceptLanguage: req.headers['accept-language'],
      acceptEncoding: req.headers['accept-encoding'],
      
      // Client hints (modern browsers)
      platform: req.headers['sec-ch-ua-platform'],
      mobile: req.headers['sec-ch-ua-mobile'],
      architecture: req.headers['sec-ch-ua-arch'],
      model: req.headers['sec-ch-ua-model'],
      brands: req.headers['sec-ch-ua'],
      
      // Network information
      ipAddress: req.ip,
      timezone: req.headers.timezone || 'unknown',
      
      // Screen information (if available)
      screenWidth: req.headers['x-screen-width'],
      screenHeight: req.headers['x-screen-height'],
      colorDepth: req.headers['x-color-depth'],
      
      // Additional security headers
      forwardedFor: req.headers['x-forwarded-for'],
      realIp: req.headers['x-real-ip'],
      clusterClientIp: req.headers['x-cluster-client-ip']
    }
    
    // Create fingerprint hash
    const fingerprint = crypto
      .createHash('sha256')
      .update(JSON.stringify(signals) + this.DEVICE_FINGERPRINT_SALT)
      .digest('hex')
    
    return fingerprint
  }

  static analyzeDevice(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase()
    
    // Detect browser
    let browser = 'unknown'
    let version = 'unknown'
    
    if (ua.includes('chrome')) {
      browser = 'chrome'
      const match = ua.match(/chrome\/(\d+)/)
      version = match ? match[1] : 'unknown'
    } else if (ua.includes('firefox')) {
      browser = 'firefox'
      const match = ua.match(/firefox\/(\d+)/)
      version = match ? match[1] : 'unknown'
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      browser = 'safari'
      const match = ua.match(/version\/(\d+)/)
      version = match ? match[1] : 'unknown'
    } else if (ua.includes('edge')) {
      browser = 'edge'
      const match = ua.match(/edge\/(\d+)/)
      version = match ? match[1] : 'unknown'
    }
    
    // Detect OS
    let os = 'unknown'
    if (ua.includes('windows')) os = 'windows'
    else if (ua.includes('mac')) os = 'macos'
    else if (ua.includes('linux')) os = 'linux'
    else if (ua.includes('android')) os = 'android'
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'ios'
    
    // Detect device type
    let deviceType = 'desktop'
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      deviceType = 'mobile'
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      deviceType = 'tablet'
    }
    
    // Calculate trust score
    const trustScore = this.calculateTrustScore(browser, version, os, deviceType, ua)
    
    return {
      browser,
      version,
      os,
      deviceType,
      trustScore,
      isBot: this.isBot(ua),
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet'
    }
  }

  static async detectAnomalousSession(
    userId: string, 
    deviceFingerprint: string, 
    ipAddress: string
  ): Promise<{
    anomalies: string[]
    riskScore: number
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    recommendations: string[]
  }> {
    const anomalies: string[] = []
    let riskScore = 0
    
    // Get recent sessions for this user
    const recentSessions = await prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        lastUsedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      },
      select: {
        deviceFingerprint: true,
        ipAddress: true,
        userAgent: true,
        lastUsedAt: true
      },
      orderBy: { lastUsedAt: 'desc' },
      take: 10
    })
    
    // Check if device is new
    const knownDevice = recentSessions.some(s => s.deviceFingerprint === deviceFingerprint)
    if (!knownDevice) {
      anomalies.push('NEW_DEVICE')
      riskScore += 30
    }
    
    // Check IP location
    const currentLocation = await this.getLocationFromIp(ipAddress)
    const previousLocations = await Promise.all(
      recentSessions.map(async (session) => ({
        location: await this.getLocationFromIp(session.ipAddress),
        timestamp: session.lastUsedAt
      }))
    )
    
    if (previousLocations.length > 0) {
      const distances = previousLocations.map(prev => 
        this.calculateDistance(currentLocation, prev.location)
      )
      
      const maxDistance = Math.max(...distances)
      if (maxDistance > 1000) { // More than 1000km
        anomalies.push('UNUSUAL_LOCATION')
        riskScore += 25
      }
      
      // Check for impossible travel
      const lastSession = previousLocations[0]
      if (lastSession) {
        const timeDiff = Date.now() - lastSession.timestamp.getTime()
        const requiredTime = (maxDistance / 900) * 3600 * 1000 // 900km/h max speed
        
        if (timeDiff < requiredTime) {
          anomalies.push('IMPOSSIBLE_TRAVEL')
          riskScore += 40
        }
      }
    }
    
    // Check user agent consistency
    const currentUserAgent = await prisma.session.findFirst({
      where: { userId, deviceFingerprint },
      select: { userAgent: true }
    })
    
    if (currentUserAgent && currentUserAgent.userAgent !== recentSessions[0]?.userAgent) {
      anomalies.push('USER_AGENT_CHANGED')
      riskScore += 15
    }
    
    // Check time patterns
    const currentHour = new Date().getHours()
    const previousHours = recentSessions.map(s => new Date(s.lastUsedAt).getHours())
    
    if (previousHours.length > 0) {
      const hourVariance = this.calculateHourVariance(currentHour, previousHours)
      if (hourVariance > 12) { // More than 12 hours from usual pattern
        anomalies.push('UNUSUAL_TIME')
        riskScore += 10
      }
    }
    
    return {
      anomalies,
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      recommendations: this.getRecommendations(anomalies, riskScore)
    }
  }

  private static calculateTrustScore(
    browser: string, 
    version: string, 
    os: string, 
    deviceType: string,
    userAgent: string
  ): number {
    let score = 50 // Base score
    
    // Browser trust
    const trustedBrowsers = ['chrome', 'firefox', 'safari', 'edge']
    if (trustedBrowsers.includes(browser)) {
      score += 20
    }
    
    // Version check (not too old, not too new/unknown)
    const versionNum = parseInt(version)
    if (versionNum > 0 && versionNum < 100) {
      score += 10
    }
    
    // OS trust
    const trustedOS = ['windows', 'macos', 'linux', 'android', 'ios']
    if (trustedOS.includes(os)) {
      score += 10
    }
    
    // Device type
    if (deviceType === 'desktop') score += 5
    else if (deviceType === 'mobile') score += 3
    
    // Penalize suspicious patterns
    if (this.isBot(userAgent)) {
      score -= 30
    }
    
    if (userAgent.length < 50 || userAgent.length > 500) {
      score -= 10
    }
    
    return Math.max(0, Math.min(100, score))
  }

  private static isBot(userAgent: string): boolean {
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python', 'java', 'node', 'php', 'ruby', 'perl'
    ]
    
    const ua = userAgent.toLowerCase()
    return botPatterns.some(pattern => ua.includes(pattern))
  }

  private static async getLocationFromIp(ipAddress: string): Promise<LocationData> {
    try {
      // Use IP geolocation service
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`)
      const data = await response.json()
      
      return {
        ip: ipAddress,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        timezone: data.timezone,
        isProxy: data.org?.includes('proxy') || false,
        isVpn: data.org?.includes('vpn') || false
      }
    } catch (error) {
      console.error('Failed to get location:', error)
      return {
        ip: ipAddress,
        country: 'Unknown',
        countryCode: 'XX',
        region: 'Unknown',
        city: 'Unknown',
        latitude: 0,
        longitude: 0,
        timezone: 'UTC',
        isProxy: false,
        isVpn: false
      }
    }
  }

  private static calculateDistance(loc1: LocationData, loc2: LocationData): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRadians(loc2.latitude - loc1.latitude)
    const dLon = this.toRadians(loc2.longitude - loc1.longitude)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(loc1.latitude)) * Math.cos(this.toRadians(loc2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private static calculateHourVariance(currentHour: number, previousHours: number[]): number {
    if (previousHours.length === 0) return 0
    
    const average = previousHours.reduce((sum, hour) => sum + hour, 0) / previousHours.length
    return Math.abs(currentHour - average)
  }

  private static getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score < 20) return 'LOW'
    if (score < 40) return 'MEDIUM'
    if (score < 60) return 'HIGH'
    return 'CRITICAL'
  }

  private static getRecommendations(anomalies: string[], score: number): string[] {
    const recommendations: string[] = []
    
    if (anomalies.includes('NEW_DEVICE')) {
      recommendations.push('Require MFA verification')
      recommendations.push('Send new device alert')
    }
    
    if (anomalies.includes('UNUSUAL_LOCATION')) {
      recommendations.push('Send location verification email')
      recommendations.push('Require additional verification')
    }
    
    if (anomalies.includes('IMPOSSIBLE_TRAVEL')) {
      recommendations.push('Block session and require password reset')
      recommendations.push('Send high-priority security alert')
    }
    
    if (anomalies.includes('USER_AGENT_CHANGED')) {
      recommendations.push('Monitor for suspicious activity')
    }
    
    if (anomalies.includes('UNUSUAL_TIME')) {
      recommendations.push('Send time-based verification')
    }
    
    if (score >= 60) {
      recommendations.push('Consider temporary account lock')
      recommendations.push('Require identity verification')
    }
    
    return recommendations
  }
}
