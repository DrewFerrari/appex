import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { prisma, redis, sessionRedis } from '../config/database'
import { 
  User, 
  Session, 
  LoginCredentials, 
  RegisterData, 
  AuthTokens, 
  LoginResult, 
  MfaSetupData, 
  MfaVerificationData, 
  MfaResult,
  PasswordResetData,
  PasswordResetConfirmData,
  ChangePasswordData,
  EmailVerificationData,
  PhoneVerificationData,
  ResendVerificationData,
  CurrentSessionResult
} from '../types/auth'
import { SecurityLoggingService } from './security-logging.service'
import { PasswordHashingService } from './password-hashing.service'
import { DeviceFingerprintService } from './device-fingerprint.service'
import { RateLimitingService } from './rate-limiting.service'
import { EmailService } from './email.service'
import { SMSService } from './sms.service'

export class AuthService {
  // JWT Configuration
  private static readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
  private static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
  private static readonly JWT_ACCESS_EXPIRES = '15m'
  private static readonly JWT_REFRESH_EXPIRES = '7d'

  // Register new user
  static async register(data: RegisterData): Promise<{ userId: string; message: string }> {
    try {
      // Rate limiting check
      const rateLimit = await RateLimitingService.checkUserRateLimit(data.email, 'register')
      if (!rateLimit.allowed) {
        throw new Error('Too many registration attempts. Please try again later.')
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email.toLowerCase() },
            { phone: data.phone }
          ]
        }
      })

      if (existingUser) {
        if (existingUser.email === data.email.toLowerCase()) {
          throw new Error('An account with this email already exists')
        }
        if (existingUser.phone === data.phone) {
          throw new Error('An account with this phone number already exists')
        }
      }

      // Hash password
      const passwordHash = await PasswordHashingService.hashPassword(data.password)

      // Generate unique referral code
      const referralCode = this.generateReferralCode()

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          phone: data.phone,
          fullName: data.fullName,
          passwordHash,
          nationalId: data.nationalId,
          referralCode,
          acceptTerms: data.acceptTerms,
          acceptPrivacyPolicy: data.acceptPrivacyPolicy,
          marketingConsent: data.marketingConsent || false,
          preferredLanguage: data.preferredLanguage || 'en'
        }
      })

      // Send verification emails
      await EmailService.sendEmailVerification(user.id, user.email, user.fullName)
      await SMSService.sendPhoneVerification(user.id, user.phone!, user.fullName)

      // Log registration
      await SecurityLoggingService.logEvent({
        eventType: 'REGISTRATION_INITIATED',
        userId: user.id,
        ipAddress: '', // Will be set by middleware
        userAgent: '', // Will be set by middleware
        metadata: {
          email: data.email,
          phone: data.phone,
          referralCode: data.referralCode
        }
      })

      return {
        userId: user.id,
        message: 'Registration successful. Please check your email and phone for verification codes.'
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Login user
  static async login(
    credentials: LoginCredentials, 
    ipAddress: string, 
    userAgent: string,
    deviceFingerprint: string
  ): Promise<LoginResult> {
    try {
      // Rate limiting check
      const rateLimit = await RateLimitingService.checkUserRateLimit(credentials.email, 'login')
      if (!rateLimit.allowed) {
        throw new Error('Too many login attempts. Please try again later.')
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() }
      })

      if (!user) {
        await SecurityLoggingService.logEvent({
          eventType: 'LOGIN_FAILED',
          ipAddress,
          userAgent,
          metadata: {
            email: credentials.email,
            reason: 'USER_NOT_FOUND'
          }
        })
        throw new Error('Invalid email or password')
      }

      // Check account status
      if (user.status === 'PERMANENTLY_LOCKED') {
        await SecurityLoggingService.logEvent({
          eventType: 'LOGIN_FAILED',
          userId: user.id,
          ipAddress,
          userAgent,
          metadata: {
            reason: 'PERMANENTLY_LOCKED'
          }
        })
        throw new Error('Account is permanently locked. Please contact support.')
      }

      if (user.lockedUntil && user.lockedUntil > new Date()) {
        await SecurityLoggingService.logEvent({
          eventType: 'LOGIN_FAILED',
          userId: user.id,
          ipAddress,
          userAgent,
          metadata: {
            reason: 'TEMPORARILY_LOCKED',
            lockedUntil: user.lockedUntil
          }
        })
        throw new Error('Account is temporarily locked. Please try again later.')
      }

      // Verify password
      const isPasswordValid = await PasswordHashingService.verifyPassword(
        credentials.password, 
        user.passwordHash
      )

      if (!isPasswordValid) {
        await SecurityLoggingService.logEvent({
          eventType: 'LOGIN_FAILED',
          userId: user.id,
          ipAddress,
          userAgent,
          metadata: {
            reason: 'INVALID_PASSWORD'
          }
        })
        
        // Update failed attempts
        await this.handleFailedLogin(user.id)
        throw new Error('Invalid email or password')
      }

      // Check if MFA is required
      if (user.mfaEnabled) {
        const mfaSessionId = randomBytes(32).toString('hex')
        
        // Store MFA session
        await sessionRedis.setex(
          `mfa_session:${mfaSessionId}`,
          900, // 15 minutes
          JSON.stringify({
            userId: user.id,
            email: user.email,
            deviceFingerprint,
            ipAddress,
            userAgent
          })
        )

        return {
          user: null,
          session: null,
          requiresMfa: true,
          mfaSessionId,
          availableMethods: await this.getAvailableMfaMethods(user.id)
        }
      }

      // Create session
      const session = await this.createSession(user, deviceFingerprint, ipAddress, userAgent, credentials.deviceName, credentials.deviceType)

      // Update user login info
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: ipAddress,
          lastLoginDevice: credentials.deviceName || 'Unknown',
          failedLoginAttempts: 0,
          lockedUntil: null,
          lockReason: null
        }
      })

      // Log successful login
      await SecurityLoggingService.logEvent({
        eventType: 'LOGIN_SUCCESS',
        userId: user.id,
        ipAddress,
        userAgent,
        metadata: {
          sessionId: session.id,
          deviceFingerprint,
          isNewDevice: await this.isNewDevice(user.id, deviceFingerprint)
        }
      })

      return {
        user,
        session,
        requiresMfa: false
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Verify MFA
  static async verifyMfa(
    data: MfaVerificationData,
    ipAddress: string,
    userAgent: string
  ): Promise<MfaResult> {
    try {
      // Get MFA session
      const mfaSessionData = await sessionRedis.get(`mfa_session:${data.sessionId}`)
      if (!mfaSessionData) {
        throw new Error('MFA session expired or invalid')
      }

      const mfaSession = JSON.parse(mfaSessionData)

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: mfaSession.userId }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Verify MFA code
      const isValid = await this.verifyMfaCode(user.id, data.code)
      
      if (!isValid) {
        await SecurityLoggingService.logEvent({
          eventType: 'MFA_FAILED',
          userId: user.id,
          ipAddress,
          userAgent,
          metadata: {
            sessionId: data.sessionId,
            code: data.code
          }
        })
        throw new Error('Invalid MFA code')
      }

      // Clean up MFA session
      await sessionRedis.del(`mfa_session:${data.sessionId}`)

      // Create session
      const session = await this.createSession(
        user, 
        mfaSession.deviceFingerprint, 
        mfaSession.ipAddress, 
        mfaSession.userAgent
      )

      // Update user login info
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: mfaSession.ipAddress,
          lastLoginDevice: 'MFA Verified Device',
          failedLoginAttempts: 0
        }
      })

      // Log MFA success
      await SecurityLoggingService.logEvent({
        eventType: 'MFA_VERIFIED',
        userId: user.id,
        ipAddress: mfaSession.ipAddress,
        userAgent: mfaSession.userAgent,
        metadata: {
          sessionId: data.sessionId,
          rememberDevice: data.rememberDevice
        }
      })

      return {
        user,
        session
      }
    } catch (error) {
      console.error('MFA verification error:', error)
      throw error
    }
  }

  // Get current session
  static async getCurrentSession(
    accessToken: string,
    refreshToken: string,
    ipAddress: string,
    userAgent: string
  ): Promise<CurrentSessionResult> {
    try {
      // Verify access token
      const decoded = jwt.verify(accessToken, this.JWT_ACCESS_SECRET) as any
      if (!decoded || !decoded.sub) {
        return { user: null, session: null }
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub }
      })

      if (!user || user.status !== 'ACTIVE') {
        return { user: null, session: null }
      }

      // Get session
      const session = await prisma.session.findFirst({
        where: {
          userId: user.id,
          refreshTokenJti: decoded.jti,
          isActive: true,
          expiresAt: { gt: new Date() }
        }
      })

      if (!session) {
        return { user: null, session: null }
      }

      // Update session last used
      await prisma.session.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() }
      })

      return { user, session }
    } catch (error) {
      console.error('Get current session error:', error)
      return { user: null, session: null }
    }
  }

  // Refresh tokens
  static async refreshToken(
    refreshToken: string,
    ipAddress: string,
    userAgent: string
  ): Promise<CurrentSessionResult> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as any
      if (!decoded || !decoded.sub) {
        throw new Error('Invalid refresh token')
      }

      // Check if token is revoked
      const isRevoked = await redis.get(`revoked:${decoded.jti}`)
      if (isRevoked) {
        throw new Error('Token has been revoked')
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub }
      })

      if (!user || user.status !== 'ACTIVE') {
        throw new Error('User not found or inactive')
      }

      // Get session
      const session = await prisma.session.findFirst({
        where: {
          userId: user.id,
          refreshTokenJti: decoded.jti,
          isActive: true,
          expiresAt: { gt: new Date() }
        }
      })

      if (!session) {
        throw new Error('Session not found or expired')
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id, decoded.jti, decoded.deviceFingerprint)

      // Revoke old refresh token
      await redis.setex(`revoked:${decoded.jti}`, 7 * 24 * 3600, 'token_rotated')

      // Update session
      await prisma.session.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() }
      })

      return { user, session }
    } catch (error) {
      console.error('Refresh token error:', error)
      throw error
    }
  }

  // Logout
  static async logout(
    userId: string,
    sessionId: string,
    refreshTokenJti: string
  ): Promise<void> {
    try {
      // Revoke refresh token
      await redis.setex(`revoked:${refreshTokenJti}`, 7 * 24 * 3600, 'user_logout')

      // Mark session as inactive
      await prisma.session.updateMany({
        where: {
          userId,
          isActive: true
        },
        data: {
          isActive: false,
          revokedAt: new Date(),
          revokeReason: 'USER_LOGOUT'
        }
      })

      // Log logout
      await SecurityLoggingService.logEvent({
        eventType: 'USER_LOGOUT',
        userId,
        metadata: {
          sessionId
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Private helper methods
  private static generateTokens(
    userId: string, 
    deviceFingerprint: string
  ): AuthTokens {
    const jti = randomBytes(32).toString('hex')
    
    const accessToken = jwt.sign(
      {
        sub: userId,
        jti,
        deviceFingerprint,
        type: 'access'
      },
      this.JWT_ACCESS_SECRET,
      { expiresIn: this.JWT_ACCESS_EXPIRES }
    )

    const refreshToken = jwt.sign(
      {
        sub: userId,
        jti,
        deviceFingerprint,
        type: 'refresh'
      },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.JWT_REFRESH_EXPIRES }
    )

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes
      refreshTokenJti: jti
    }
  }

  private static async createSession(
    user: any,
    deviceFingerprint: string,
    ipAddress: string,
    userAgent: string,
    deviceName?: string,
    deviceType?: string
  ): Promise<Session> {
    const tokens = this.generateTokens(user.id, deviceFingerprint)
    
    // Store refresh token in Redis
    await sessionRedis.setex(
      `refresh:${tokens.refreshTokenJti}`,
      7 * 24 * 3600, // 7 days
      JSON.stringify({
        userId: user.id,
        deviceFingerprint,
        ipAddress,
        userAgent,
        createdAt: new Date().toISOString()
      })
    )

    // Create session record
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenJti: tokens.refreshTokenJti,
        deviceFingerprint,
        deviceName: deviceName || 'Unknown Device',
        deviceType: deviceType || 'desktop',
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isActive: true
      }
    })

    return {
      ...session,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  private static async handleFailedLogin(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) return

    const newAttempts = user.failedLoginAttempts + 1
    const lockThresholds = [
      { attempts: 5, action: 'CAPTCHA', duration: 0 },
      { attempts: 10, action: 'LOCKOUT_15MIN', duration: 15 * 60 * 1000 },
      { attempts: 20, action: 'LOCKOUT_1HOUR', duration: 60 * 60 * 1000 },
      { attempts: 50, action: 'LOCKOUT_24HOUR', duration: 24 * 60 * 60 * 1000 },
      { attempts: 100, action: 'PERMANENT_LOCK', duration: null }
    ]

    const threshold = lockThresholds
      .slice()
      .reverse()
      .find(t => newAttempts >= t.attempts)

    const updateData: any = {
      failedLoginAttempts: newAttempts
    }

    if (threshold && threshold.duration) {
      updateData.lockedUntil = new Date(Date.now() + threshold.duration)
      updateData.lockReason = threshold.action
    } else if (threshold && threshold.action === 'PERMANENT_LOCK') {
      updateData.status = 'PERMANENTLY_LOCKED'
      updateData.lockReason = threshold.action
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
  }

  private static async verifyMfaCode(userId: string, code: string): Promise<boolean> {
    // Check TOTP
    const totpMethod = await prisma.mfaMethod.findFirst({
      where: {
        userId,
        methodType: 'TOTP',
        isActive: true
      }
    })

    if (totpMethod && totpMethod.secret) {
      const speakeasy = require('speakeasy')
      return speakeasy.totp.verify({
        secret: totpMethod.secret,
        encoding: 'base32',
        token: code,
        window: 2 // Allow 2-step window
      })
    }

    // Check backup codes
    const backupCode = await prisma.backupCode.findFirst({
      where: {
        userId,
        isActive: true
      }
    })

    if (backupCode) {
      const isValid = await bcrypt.compare(code, backupCode.codeHash)
      if (isValid) {
        // Mark backup code as used
        await prisma.backupCode.update({
          where: { id: backupCode.id },
          data: {
            isActive: false,
            usedAt: new Date()
          }
        })
        return true
      }
    }

    return false
  }

  private static async getAvailableMfaMethods(userId: string): Promise<string[]> {
    const methods = await prisma.mfaMethod.findMany({
      where: {
        userId,
        isActive: true
      },
      select: { methodType: true }
    })

    return methods.map(m => m.methodType)
  }

  private static async isNewDevice(userId: string, deviceFingerprint: string): Promise<boolean> {
    const existingSession = await prisma.session.findFirst({
      where: {
        userId,
        deviceFingerprint,
        isActive: true
      }
    })

    return !existingSession
  }

  private static generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}
