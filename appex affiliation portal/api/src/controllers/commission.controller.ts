import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { CommissionService } from '../services/commission.service'
import { SecurityLoggingService } from '../services/security-logging.service'

// Validation schemas
const calculateCommissionSchema = z.object({
  referralId: z.string().uuid(),
  saleAmount: z.number().min(1),
  commissionType: z.enum(['STANDARD', 'BONUS', 'RECURRING', 'REFERRAL']).optional()
})

const confirmCommissionSchema = z.object({
  commissionId: z.string().uuid(),
  verificationData: z.any().optional()
})

const markPaidCommissionSchema = z.object({
  commissionId: z.string().uuid(),
  payoutId: z.string().uuid()
})

const getAnalyticsSchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year']).optional(),
  limit: z.number().min(1).max(100).optional()
})

const getLeaderboardSchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year']).optional(),
  limit: z.number().min(1).max(100).optional()
})

// Controllers
export class CommissionController {
  
  // Calculate commission
  static async calculateCommission(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const validatedData = calculateCommissionSchema.parse(req.body)
      
      const result = await CommissionService.calculateCommission(
        validatedData.referralId,
        validatedData.saleAmount,
        validatedData.commissionType
      )
      
      res.status(201).json({
        success: true,
        message: result.message,
        commission: result.commission
      })
      
    } catch (error: any) {
      console.error('Calculate commission error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'REFERRAL_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'CALCULATION_ERROR',
        message: 'Failed to calculate commission'
      })
    }
  }
  
  // Confirm commission
  static async confirmCommission(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const commissionId = req.params.id
      const validatedData = confirmCommissionSchema.parse(req.body)
      
      const result = await CommissionService.confirmCommission(
        commissionId,
        validatedData.verificationData
      )
      
      res.json({
        success: true,
        message: result.message,
        commission: result.commission
      })
      
    } catch (error: any) {
      console.error('Confirm commission error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'COMMISSION_NOT_FOUND',
          message: error.message
        })
      }
      
      if (error.message.includes('already processed')) {
        return res.status(400).json({
          error: 'COMMISSION_PROCESSED',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'CONFIRMATION_ERROR',
        message: 'Failed to confirm commission'
      })
    }
  }
  
  // Mark commission as paid
  static async markCommissionPaid(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const commissionId = req.params.id
      const validatedData = markPaidCommissionSchema.parse(req.body)
      
      const result = await CommissionService.markCommissionPaid(
        commissionId,
        validatedData.payoutId
      )
      
      res.json({
        success: true,
        message: result.message,
        commission: result.commission
      })
      
    } catch (error: any) {
      console.error('Mark commission paid error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'COMMISSION_NOT_FOUND',
          message: error.message
        })
      }
      
      if (error.message.includes('must be confirmed')) {
        return res.status(400).json({
          error: 'COMMISSION_NOT_CONFIRMED',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'PAYMENT_ERROR',
        message: 'Failed to mark commission as paid'
      })
    }
  }
  
  // Get commission analytics
  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const validatedData = getAnalyticsSchema.parse(req.query)
      
      const result = await CommissionService.getCommissionAnalytics(
        userId,
        validatedData.period,
        validatedData.limit
      )
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get commission analytics error:', error)
      
      res.status(500).json({
        error: 'ANALYTICS_ERROR',
        message: 'Failed to load commission analytics'
      })
    }
  }
  
  // Get commission leaderboard
  static async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getLeaderboardSchema.parse(req.query)
      
      const result = await CommissionService.getCommissionLeaderboard(
        validatedData.period,
        validatedData.limit
      )
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get commission leaderboard error:', error)
      
      res.status(500).json({
        error: 'LEADERBOARD_ERROR',
        message: 'Failed to load commission leaderboard'
      })
    }
  }
  
  // Get commission details
  static async getCommissionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const commissionId = req.params.id
      
      const commission = await CommissionService.getCommissionDetails(commissionId)
      
      if (!commission) {
        return res.status(404).json({
          error: 'COMMISSION_NOT_FOUND',
          message: 'Commission not found'
        })
      }
      
      // Check if user owns this commission
      if (commission.userId !== userId) {
        return res.status(403).json({
          error: 'ACCESS_DENIED',
          message: 'Access denied'
        })
      }
      
      res.json({
        success: true,
        data: commission
      })
      
    } catch (error: any) {
      console.error('Get commission details error:', error)
      
      res.status(500).json({
        error: 'DETAILS_ERROR',
        message: 'Failed to load commission details'
      })
    }
  }
  
  // Get commission summary
  static async getCommissionSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const period = req.query.period as string || 'month'
      
      const summary = await CommissionService.getCommissionSummary(userId, period)
      
      res.json({
        success: true,
        data: summary
      })
      
    } catch (error: any) {
      console.error('Get commission summary error:', error)
      
      res.status(500).json({
        error: 'SUMMARY_ERROR',
        message: 'Failed to load commission summary'
      })
    }
  }
  
  // Get commission trends
  static async getCommissionTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const period = req.query.period as string || 'month'
      
      const trends = await CommissionService.getCommissionTrends(userId, period)
      
      res.json({
        success: true,
        data: trends
      })
      
    } catch (error: any) {
      console.error('Get commission trends error:', error)
      
      res.status(500).json({
        error: 'TRENDS_ERROR',
        message: 'Failed to load commission trends'
      })
    }
  }
  
  // Get pending commissions
  static async getPendingCommissions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      
      const result = await CommissionService.getPendingCommissions(userId, page, limit)
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get pending commissions error:', error)
      
      res.status(500).json({
        error: 'PENDING_ERROR',
        message: 'Failed to load pending commissions'
      })
    }
  }
  
  // Get commission by referral
  static async getCommissionsByReferral(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const referralId = req.params.referralId
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      
      const result = await CommissionService.getCommissionsByReferral(
        userId,
        referralId,
        page,
        limit
      )
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get commissions by referral error:', error)
      
      res.status(500).json({
        error: 'REFERRAL_COMMISSIONS_ERROR',
        message: 'Failed to load commissions by referral'
      })
    }
  }
}
