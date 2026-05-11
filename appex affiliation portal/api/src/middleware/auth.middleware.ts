import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthService } from '../services/auth.service'
import { SecurityLoggingService } from '../services/security-logging.service'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
    
    if (!result.user || !result.session) {
      return res.status(401).json({
        error: 'INVALID_SESSION',
        message: 'No active session found'
      })
    }
    
    // Attach user and session to request
    req.user = result.user
    req.session = result.session
    
    // Log session access
    await SecurityLoggingService.logEvent({
      eventType: 'SESSION_ACCESS',
      userId: result.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      deviceFingerprint: req.deviceFingerprint,
      metadata: {
        sessionId: result.session.id
      }
    })
    
    next()
  } catch (error: any) {
    console.error('Auth middleware error:', error)
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        error: 'TOKEN_EXPIRED',
        message: 'Access token has expired'
      })
    }
    
    if (error.message.includes('invalid')) {
      return res.status(401).json({
        error: 'INVALID_TOKEN',
        message: 'Invalid access token'
      })
    }
    
    res.status(500).json({
      error: 'AUTH_ERROR',
      message: 'Authentication error'
    })
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any
      session?: any
      deviceFingerprint?: string
    }
  }
}
