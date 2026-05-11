import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AffiliateService } from '../services/affiliate.service'
import { SecurityLoggingService } from '../services/security-logging.service'

// Validation schemas
const createReferralSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  businessName: z.string().optional()
})

const updateReferralSchema = z.object({
  status: z.enum(['PENDING', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'NOT_INTERESTED']),
  notes: z.string().optional(),
  nextFollowUp: z.string().optional()
})

const requestPayoutSchema = z.object({
  amount: z.number().min(1),
  method: z.enum(['BANK_TRANSFER', 'ECOCASH', 'PAYNOW', 'MOBILE_MONEY']),
  bankAccount: z.object({
    accountName: z.string(),
    accountNumber: z.string(),
    bankName: z.string(),
    branch: z.string().optional()
  }).optional(),
  mobileMoney: z.object({
    provider: z.string(),
    phoneNumber: z.string(),
    accountName: z.string()
  }).optional()
})

// Controllers
export class AffiliateController {
  
  // Get dashboard data
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      
      const dashboardData = await AffiliateService.getDashboardData(userId)
      
      res.json({
        success: true,
        data: dashboardData
      })
      
    } catch (error: any) {
      console.error('Get dashboard error:', error)
      
      res.status(500).json({
        error: 'DASHBOARD_ERROR',
        message: 'Failed to load dashboard data'
      })
    }
  }
  
  // Create referral
  static async createReferral(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const validatedData = createReferralSchema.parse(req.body)
      
      const result = await AffiliateService.createReferral(userId, validatedData)
      
      res.status(201).json({
        success: true,
        message: result.message,
        referral: result.referral
      })
      
    } catch (error: any) {
      console.error('Create referral error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: error.message
        })
      }
      
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          error: 'REFERRAL_EXISTS',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'REFERRAL_ERROR',
        message: 'Failed to create referral'
      })
    }
  }
  
  // Update referral status
  static async updateReferral(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const referralId = req.params.id
      const validatedData = updateReferralSchema.parse(req.body)
      
      const result = await AffiliateService.updateReferralStatus(
        userId, 
        referralId, 
        validatedData.status, 
        validatedData.notes
      )
      
      res.json({
        success: true,
        message: result.message,
        referral: result.referral
      })
      
    } catch (error: any) {
      console.error('Update referral error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'REFERRAL_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'UPDATE_ERROR',
        message: 'Failed to update referral'
      })
    }
  }
  
  // Get referrals list
  static async getReferrals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const status = req.query.status as string
      
      const result = await AffiliateService.getReferrals(userId, page, limit, status)
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get referrals error:', error)
      
      res.status(500).json({
        error: 'REFERRALS_ERROR',
        message: 'Failed to load referrals'
      })
    }
  }
  
  // Get commissions history
  static async getCommissions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const status = req.query.status as string
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined
      
      const result = await AffiliateService.getCommissions(
        userId, 
        page, 
        limit, 
        status, 
        dateFrom, 
        dateTo
      )
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get commissions error:', error)
      
      res.status(500).json({
        error: 'COMMISSIONS_ERROR',
        message: 'Failed to load commissions'
      })
    }
  }
  
  // Get payout history
  static async getPayouts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const status = req.query.status as string
      
      const result = await AffiliateService.getPayouts(userId, page, limit, status)
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get payouts error:', error)
      
      res.status(500).json({
        error: 'PAYOUTS_ERROR',
        message: 'Failed to load payouts'
      })
    }
  }
  
  // Request payout
  static async requestPayout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const validatedData = requestPayoutSchema.parse(req.body)
      
      const result = await AffiliateService.requestPayout(userId, validatedData)
      
      res.status(201).json({
        success: true,
        message: result.message,
        payout: result.payout
      })
      
    } catch (error: any) {
      console.error('Request payout error:', error)
      
      if (error.message.includes('Insufficient')) {
        return res.status(400).json({
          error: 'INSUFFICIENT_BALANCE',
          message: error.message
        })
      }
      
      if (error.message.includes('required')) {
        return res.status(400).json({
          error: 'REQUIREMENTS_NOT_MET',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'PAYOUT_ERROR',
        message: 'Failed to request payout'
      })
    }
  }
  
  // Get affiliate stats
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const timeframe = req.query.timeframe as string || 'month'
      
      const stats = await AffiliateService.getStats(userId, timeframe)
      
      res.json({
        success: true,
        data: stats
      })
      
    } catch (error: any) {
      console.error('Get stats error:', error)
      
      res.status(500).json({
        error: 'STATS_ERROR',
        message: 'Failed to load stats'
      })
    }
  }
  
  // Get referral link
  static async getReferralLink(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      
      const referralLink = await AffiliateService.getReferralLink(userId)
      
      res.json({
        success: true,
        data: {
          referralLink,
          qrCode: await AffiliateService.generateQRCode(referralLink)
        }
      })
      
    } catch (error: any) {
      console.error('Get referral link error:', error)
      
      res.status(500).json({
        error: 'REFERRAL_LINK_ERROR',
        message: 'Failed to generate referral link'
      })
    }
  }
  
  // Get earnings summary
  static async getEarningsSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id
      const period = req.query.period as string || 'month'
      
      const summary = await AffiliateService.getEarningsSummary(userId, period)
      
      res.json({
        success: true,
        data: summary
      })
      
    } catch (error: any) {
      console.error('Get earnings summary error:', error)
      
      res.status(500).json({
        error: 'EARNINGS_ERROR',
        message: 'Failed to load earnings summary'
      })
    }
  }
}
