import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { 
  AuthService,
  PasswordHashingService
} from '../services'
import { 
  LoginCredentials,
  RegisterData,
  MfaVerificationData,
  PasswordResetData,
  PasswordResetConfirmData,
  ChangePasswordData,
  EmailVerificationData,
  PhoneVerificationData,
  ResendVerificationData
} from '../types/auth'
import { SecurityLoggingService } from '../services/security-logging.service'
import { DeviceFingerprintService } from '../services/device-fingerprint.service'
import { RateLimitingService } from '../services/rate-limiting.service'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  deviceName: z.string().optional(),
  deviceType: z.enum(['desktop', 'mobile', 'tablet']).optional(),
  rememberMe: z.boolean().optional(),
  otp: z.string().optional()
})

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^(077|071|078|079)\d{7}$/),
  fullName: z.string().min(2),
  password: z.string().min(12),
  confirmPassword: z.string(),
  nationalId: z.string().regex(/^\d{8}[A-Z]$/),
  referralCode: z.string().regex(/^[A-Z0-9]{8}$/).optional(),
  acceptTerms: z.boolean(),
  acceptPrivacyPolicy: z.boolean(),
  marketingConsent: z.boolean().optional(),
  preferredLanguage: z.string().optional()
})

const mfaVerificationSchema = z.object({
  sessionId: z.string().uuid(),
  code: z.string().regex(/^\d{6}$/),
  rememberDevice: z.boolean().optional()
})

const passwordResetSchema = z.object({
  email: z.string().email()
})

const passwordResetConfirmSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  newPassword: z.string().min(12),
  confirmPassword: z.string()
})

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(12),
  confirmPassword: z.string()
})

const emailVerificationSchema = z.object({
  userId: z.string().uuid(),
  otp: z.string().regex(/^\d{6}$/)
})

const phoneVerificationSchema = z.object({
  userId: z.string().uuid(),
  otp: z.string().regex(/^\d{6}$/)
})

const resendVerificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['EMAIL', 'PHONE'])
})

// Middleware for device fingerprinting
export const deviceFingerprintMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const deviceFingerprint = DeviceFingerprintService.generateFingerprint(req)
  req.deviceFingerprint = deviceFingerprint
  next()
}

// Middleware for rate limiting
export const rateLimitMiddleware = (type: 'ip' | 'user' | 'global', action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let rateLimit
      
      if (type === 'ip') {
        rateLimit = await RateLimitingService.checkIpRateLimit(req.ip, action)
      } else if (type === 'user' && req.user?.id) {
        rateLimit = await RateLimitingService.checkUserRateLimit(req.user.id, action)
      } else {
        rateLimit = await RateLimitingService.checkGlobalRateLimit(action)
      }
      
      if (!rateLimit.allowed) {
        res.set({
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': Math.max(0, rateLimit.limit - rateLimit.current).toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Retry-After': rateLimit.retryAfter.toString()
        })
        
        return res.status(429).json({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.retryAfter
        })
      }
      
      res.set({
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': Math.max(0, rateLimit.limit - rateLimit.current).toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString()
      })
      
      next()
    } catch (error) {
      console.error('Rate limiting error:', error)
      next()
    }
  }
}

// Controllers
export class AuthController {
  
  // Register user
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body)
      
      const result = await AuthService.register(validatedData)
      
      res.status(201).json({
        success: true,
        message: result.message,
        userId: result.userId
      })
      
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          error: 'ACCOUNT_EXISTS',
          message: error.message
        })
      }
      
      if (error.message.includes('Too many')) {
        return res.status(429).json({
          error: 'TOO_MANY_ATTEMPTS',
          message: error.message
        })
      }
      
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: error.message
      })
    }
  }
  
  // Login user
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body)
      
      const result = await AuthService.login(
        validatedData,
        req.ip,
        req.headers['user-agent'],
        req.deviceFingerprint
      )
      
      if (result.requiresMfa) {
        return res.json({
          requiresMfa: true,
          mfaSessionId: result.mfaSessionId,
          availableMethods: result.availableMethods,
          isNewDevice: result.isNewDevice,
          suspiciousActivity: result.suspiciousActivity
        })
      }
      
      // Set HTTP-only cookies
      res.cookie('access_token', result.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      
      res.cookie('refresh_token', result.session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/auth/refresh'
      })
      
      res.json({
        success: true,
        user: result.user,
        expiresIn: result.session.expiresIn,
        isNewDevice: result.isNewDevice,
        suspiciousActivity: result.suspiciousActivity
      })
      
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.message.includes('locked')) {
        return res.status(423).json({
          error: 'ACCOUNT_LOCKED',
          message: error.message
        })
      }
      
      if (error.message.includes('Too many')) {
        return res.status(429).json({
          error: 'TOO_MANY_ATTEMPTS',
          message: error.message
        })
      }
      
      res.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: error.message
      })
    }
  }
  
  // Verify MFA
  static async verifyMfa(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = mfaVerificationSchema.parse(req.body)
      
      const result = await AuthService.verifyMfa(
        validatedData,
        req.ip,
        req.headers['user-agent']
      )
      
      // Set HTTP-only cookies
      res.cookie('access_token', result.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      
      res.cookie('refresh_token', result.session.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/auth/refresh'
      })
      
      res.json({
        success: true,
        user: result.user,
        expiresIn: result.session.expiresIn
      })
      
    } catch (error: any) {
      console.error('MFA verification error:', error)
      
      res.status(401).json({
        error: 'INVALID_MFA_CODE',
        message: error.message
      })
    }
  }
  
  // Refresh token
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token
      
      if (!refreshToken) {
        return res.status(401).json({
          error: 'NO_REFRESH_TOKEN',
          message: 'Refresh token is required'
        })
      }
      
      const result = await AuthService.refreshToken(
        refreshToken,
        req.ip,
        req.headers['user-agent']
      )
      
      if (!result.user) {
        return res.status(401).json({
          error: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token'
        })
      }
      
      // Set new access token
      res.cookie('access_token', result.session.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      
      res.json({
        success: true,
        user: result.user
      })
      
    } catch (error: any) {
      console.error('Token refresh error:', error)
      
      res.status(401).json({
        error: 'TOKEN_REFRESH_FAILED',
        message: 'Failed to refresh token'
      })
    }
  }
  
  // Logout
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id
      const sessionId = req.session?.id
      const refreshTokenJti = req.session?.refreshTokenJti
      
      if (!userId || !sessionId || !refreshTokenJti) {
        return res.status(401).json({
          error: 'INVALID_SESSION',
          message: 'No active session found'
        })
      }
      
      await AuthService.logout(userId, sessionId, refreshTokenJti)
      
      // Clear cookies
      res.clearCookie('access_token')
      res.clearCookie('refresh_token')
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      })
      
    } catch (error: any) {
      console.error('Logout error:', error)
      
      res.status(500).json({
        error: 'LOGOUT_FAILED',
        message: 'Failed to logout'
      })
    }
  }
  
  // Verify email
  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = emailVerificationSchema.parse(req.body)
      
      const result = await AuthService.verifyEmail(
        validatedData.userId,
        validatedData.otp
      )
      
      res.json({
        success: true,
        message: result.message,
        trustLevel: result.trustLevel
      })
      
    } catch (error: any) {
      console.error('Email verification error:', error)
      
      res.status(400).json({
        error: 'VERIFICATION_FAILED',
        message: error.message
      })
    }
  }
  
  // Verify phone
  static async verifyPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = phoneVerificationSchema.parse(req.body)
      
      const result = await AuthService.verifyPhone(
        validatedData.userId,
        validatedData.otp
      )
      
      res.json({
        success: true,
        message: result.message,
        trustLevel: result.trustLevel
      })
      
    } catch (error: any) {
      console.error('Phone verification error:', error)
      
      res.status(400).json({
        error: 'VERIFICATION_FAILED',
        message: error.message
      })
    }
  }
  
  // Resend verification
  static async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = resendVerificationSchema.parse(req.body)
      
      await AuthService.resendVerification(
        validatedData.userId,
        validatedData.type
      )
      
      res.json({
        success: true,
        message: `Verification code sent to your ${validatedData.type.toLowerCase()}`
      })
      
    } catch (error: any) {
      console.error('Resend verification error:', error)
      
      res.status(400).json({
        error: 'RESEND_FAILED',
        message: error.message
      })
    }
  }
  
  // Forgot password
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = passwordResetSchema.parse(req.body)
      
      await AuthService.forgotPassword(validatedData)
      
      res.json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.',
        nextStep: 'check_email'
      })
      
    } catch (error: any) {
      console.error('Forgot password error:', error)
      
      res.status(500).json({
        error: 'RESET_REQUEST_FAILED',
        message: 'Failed to process password reset request'
      })
    }
  }
  
  // Reset password
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = passwordResetConfirmSchema.parse(req.body)
      
      await AuthService.resetPassword(validatedData)
      
      res.json({
        success: true,
        message: 'Password reset successful. Please login with your new password.',
        nextStep: 'login'
      })
      
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      if (error.message.includes('expired')) {
        return res.status(400).json({
          error: 'INVALID_OR_EXPIRED_TOKEN',
          message: 'Reset token is invalid or has expired'
        })
      }
      
      res.status(500).json({
        error: 'RESET_FAILED',
        message: 'Password reset failed. Please try again.'
      })
    }
  }
  
  // Change password
  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = changePasswordSchema.parse(req.body)
      
      await AuthService.changePassword(validatedData)
      
      res.json({
        success: true,
        message: 'Password changed successfully',
        strength: 'STRONG'
      })
      
    } catch (error: any) {
      console.error('Change password error:', error)
      
      if (error.message.includes('incorrect')) {
        return res.status(400).json({
          error: 'INVALID_CURRENT_PASSWORD',
          message: 'Current password is incorrect'
        })
      }
      
      if (error.message.includes('reuse')) {
        return res.status(400).json({
          error: 'PASSWORD_REUSE',
          message: 'You cannot reuse any of your last 5 passwords'
        })
      }
      
      res.status(500).json({
        error: 'CHANGE_FAILED',
        message: 'Password change failed. Please try again.'
      })
    }
  }
  
  // Get current user
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies.access_token
      const refreshToken = req.cookies.refresh_token
      
      if (!accessToken || !refreshToken) {
        return res.status(401).json({
          error: 'NO_TOKEN',
          message: 'Authentication required'
        })
      }
      
      const result = await AuthService.getCurrentSession(
        accessToken,
        refreshToken,
        req.ip,
        req.headers['user-agent']
      )
      
      if (!result.user) {
        return res.status(401).json({
          error: 'INVALID_SESSION',
          message: 'No active session found'
        })
      }
      
      res.json({
        success: true,
        user: result.user
      })
      
    } catch (error: any) {
      console.error('Get current user error:', error)
      
      res.status(500).json({
        error: 'SESSION_CHECK_FAILED',
        message: 'Failed to verify session'
      })
    }
  }
}
