import { prisma, redis } from '../config/database'
import crypto from 'crypto'

export class SecurityLoggingService {
  
  static async logEvent(eventData: any): Promise<void> {
    try {
      const validatedEvent = this.validateEventData(eventData)
      const enrichedEvent = await this.enrichEventData(validatedEvent)
      const severity = this.assessSeverity(enrichedEvent)
      
      await this.storeEvent(enrichedEvent, severity)
      await this.storeRealtimeEvent(enrichedEvent, severity)
      
      if (severity === 'HIGH' || severity === 'CRITICAL') {
        await this.triggerAlerts(enrichedEvent, severity)
      }
      
      await this.updateMetrics(enrichedEvent, severity)
      
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }
  
  private static validateEventData(eventData: any): any {
    const requiredFields = ['eventType']
    
    for (const field of requiredFields) {
      if (!eventData[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }
    
    return {
      ...eventData,
      timestamp: eventData.timestamp || new Date(),
      eventId: eventData.eventId || crypto.randomUUID(),
      metadata: eventData.metadata || {}
    }
  }
  
  private static async enrichEventData(eventData: any): Promise<any> {
    return {
      ...eventData,
      eventId: eventData.eventId || crypto.randomUUID(),
      timestamp: eventData.timestamp || new Date(),
      location: eventData.ipAddress ? await this.getLocationData(eventData.ipAddress) : null,
      deviceInfo: eventData.userAgent ? this.analyzeDevice(eventData.userAgent) : null,
      riskScore: await this.calculateRiskScore(eventData)
    }
  }
  
  private static assessSeverity(event: any): string {
    const baseSeverity = this.getBaseSeverity(event.eventType)
    const riskScore = event.riskScore || 0
    
    if (riskScore >= 80) return 'CRITICAL'
    if (riskScore >= 60) return 'HIGH'
    if (riskScore >= 40) return 'MEDIUM'
    
    return baseSeverity
  }
  
  private static async storeEvent(event: any, severity: string): Promise<void> {
    await prisma.securityEvent.create({
      data: {
        id: event.eventId,
        userId: event.userId,
        eventType: event.eventType,
        severity,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        metadata: {
          ...event.metadata,
          location: event.location,
          deviceInfo: event.deviceInfo,
          riskScore: event.riskScore
        },
        createdAt: event.timestamp
      }
    })
  }
  
  private static async storeRealtimeEvent(event: any, severity: string): Promise<void> {
    const redisKey = `security:events:${severity.toLowerCase()}`
    const eventData = {
      eventId: event.eventId,
      eventType: event.eventType,
      userId: event.userId,
      timestamp: event.timestamp,
      location: event.location,
      riskScore: event.riskScore
    }
    
    await redis.lpush(redisKey, JSON.stringify(eventData))
    await redis.ltrim(redisKey, 0, 999)
    await redis.expire(redisKey, 24 * 60 * 60) // 24 hours
    
    if (event.userId) {
      const userKey = `security:user:${event.userId}:timeline`
      await redis.lpush(userKey, JSON.stringify(eventData))
      await redis.ltrim(userKey, 0, 99)
      await redis.expire(userKey, 7 * 24 * 60 * 60) // 7 days
    }
  }
  
  private static async triggerAlerts(event: any, severity: string): Promise<void> {
    const alertData = {
      eventId: event.eventId,
      eventType: event.eventType,
      severity,
      userId: event.userId,
      timestamp: event.timestamp,
      location: event.location,
      riskScore: event.riskScore,
      metadata: event.metadata
    }
    
    await redis.lpush('security:alerts', JSON.stringify(alertData))
    
    if (severity === 'CRITICAL') {
      await redis.lpush('security:critical', JSON.stringify(alertData))
    }
  }
  
  private static async updateMetrics(event: any, severity: string): Promise<void> {
    const metricsKey = `security:metrics:${new Date().toISOString().split('T')[0]}`
    
    await redis.hincrby(metricsKey, `events:${severity.toLowerCase()}`, 1)
    await redis.hincrby(metricsKey, `events:${event.eventType.toLowerCase()}`, 1)
    await redis.expire(metricsKey, 30 * 24 * 60 * 60) // 30 days
  }
  
  private static async getLocationData(ipAddress: string): Promise<any> {
    try {
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
      console.error('Failed to get location data:', error)
      return null
    }
  }
  
  private static analyzeDevice(userAgent: string): any {
    const ua = userAgent.toLowerCase()
    
    return {
      browser: this.detectBrowser(ua),
      os: this.detectOS(ua),
      device: this.detectDevice(ua),
      isBot: this.isBot(ua),
      isMobile: /mobile|android|iphone|ipad/i.test(ua)
    }
  }
  
  private static detectBrowser(ua: string): string {
    if (ua.includes('chrome')) return 'chrome'
    if (ua.includes('firefox')) return 'firefox'
    if (ua.includes('safari') && !ua.includes('chrome')) return 'safari'
    if (ua.includes('edge')) return 'edge'
    return 'unknown'
  }
  
  private static detectOS(ua: string): string {
    if (ua.includes('windows')) return 'windows'
    if (ua.includes('mac')) return 'macos'
    if (ua.includes('linux')) return 'linux'
    if (ua.includes('android')) return 'android'
    if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'ios'
    return 'unknown'
  }
  
  private static detectDevice(ua: string): string {
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile'
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet'
    }
    return 'desktop'
  }
  
  private static isBot(ua: string): boolean {
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
      'python', 'java', 'node', 'php', 'ruby', 'perl'
    ]
    
    return botPatterns.some(pattern => ua.includes(pattern))
  }
  
  private static async calculateRiskScore(eventData: any): Promise<number> {
    let score = 0
    
    const eventScores: Record<string, number> = {
      'LOGIN_SUCCESS': 5,
      'LOGIN_FAILED': 20,
      'MFA_FAILED': 30,
      'ACCOUNT_LOCKED': 50,
      'TOKEN_THEFT_DETECTED': 80,
      'BRUTE_FORCE_DETECTED': 70,
      'SUSPICIOUS_ACTIVITY': 40
    }
    
    score += eventScores[eventData.eventType] || 10
    
    // Time-based factors
    const hour = new Date().getHours()
    if (hour >= 2 && hour <= 5) {
      score += 10
    }
    
    return Math.max(0, Math.min(100, score))
  }
  
  private static getBaseSeverity(eventType: string): string {
    const severityMap: Record<string, string> = {
      'LOGIN_SUCCESS': 'LOW',
      'LOGIN_FAILED': 'MEDIUM',
      'MFA_ENABLED': 'LOW',
      'MFA_FAILED': 'MEDIUM',
      'PASSWORD_CHANGED': 'LOW',
      'ACCOUNT_LOCKED': 'HIGH',
      'TOKEN_THEFT_DETECTED': 'CRITICAL',
      'BRUTE_FORCE_DETECTED': 'CRITICAL',
      'SUSPICIOUS_ACTIVITY': 'HIGH',
      'SESSION_REVOKED': 'MEDIUM',
      'REGISTRATION_INITIATED': 'LOW',
      'EMAIL_VERIFIED': 'LOW',
      'PHONE_VERIFIED': 'LOW'
    }
    
    return severityMap[eventType] || 'LOW'
  }
}
