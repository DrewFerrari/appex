import { redis } from '../config/database'

export class RateLimitingService {
  
  static async checkIpRateLimit(ipAddress: string, endpoint: string): Promise<{
    allowed: boolean
    current: number
    limit: number
    resetTime: number
    retryAfter: number
  }> {
    const key = `rate_limit:ip:${ipAddress}:${endpoint}`
    const limit = this.getIpLimit(endpoint)
    const window = this.getIpWindow(endpoint)
    
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, window)
    }
    
    const isAllowed = current <= limit
    const resetTime = await redis.ttl(key)
    
    return {
      allowed: isAllowed,
      current,
      limit,
      resetTime,
      retryAfter: isAllowed ? 0 : resetTime
    }
  }
  
  static async checkUserRateLimit(userId: string, action: string): Promise<{
    allowed: boolean
    current: number
    limit: number
    resetTime: number
    retryAfter: number
  }> {
    const key = `rate_limit:user:${userId}:${action}`
    const limit = this.getUserLimit(action)
    const window = this.getUserWindow(action)
    
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, window)
    }
    
    const isAllowed = current <= limit
    const resetTime = await redis.ttl(key)
    
    return {
      allowed: isAllowed,
      current,
      limit,
      resetTime,
      retryAfter: isAllowed ? 0 : resetTime
    }
  }
  
  static async checkGlobalRateLimit(action: string): Promise<{
    allowed: boolean
    current: number
    limit: number
    resetTime: number
    retryAfter: number
  }> {
    const key = `rate_limit:global:${action}`
    const limit = this.getGlobalLimit(action)
    const window = this.getGlobalWindow(action)
    
    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, window)
    }
    
    const isAllowed = current <= limit
    const resetTime = await redis.ttl(key)
    
    return {
      allowed: isAllowed,
      current,
      limit,
      resetTime,
      retryAfter: isAllowed ? 0 : resetTime
    }
  }
  
  private static getIpLimit(endpoint: string): number {
    const limits: Record<string, number> = {
      login: 5,
      register: 10,
      password_reset: 3,
      mfa_verify: 10,
      default: 100
    }
    return limits[endpoint] || limits.default
  }
  
  private static getIpWindow(endpoint: string): number {
    const windows: Record<string, number> = {
      login: 900, // 15 minutes
      register: 3600, // 1 hour
      password_reset: 3600, // 1 hour
      mfa_verify: 900, // 15 minutes
      default: 60 // 1 minute
    }
    return windows[endpoint] || windows.default
  }
  
  private static getUserLimit(action: string): number {
    const limits: Record<string, number> = {
      login_attempt: 5,
      password_reset_request: 3,
      mfa_attempt: 5,
      otp_request: 3,
      default: 50
    }
    return limits[action] || limits.default
  }
  
  private static getUserWindow(action: string): number {
    const windows: Record<string, number> = {
      login_attempt: 900, // 15 minutes
      password_reset_request: 3600, // 1 hour
      mfa_attempt: 900, // 15 minutes
      otp_request: 900, // 15 minutes
      default: 300 // 5 minutes
    }
    return windows[action] || windows.default
  }
  
  private static getGlobalLimit(action: string): number {
    const limits: Record<string, number> = {
      login_attempt: 1000,
      registration: 500,
      password_reset: 200,
      default: 10000
    }
    return limits[action] || limits.default
  }
  
  private static getGlobalWindow(action: string): number {
    const windows: Record<string, number> = {
      login_attempt: 60, // 1 minute
      registration: 60, // 1 minute
      password_reset: 60, // 1 minute
      default: 60 // 1 minute
    }
    return windows[action] || windows.default
  }
}
