import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AdminService } from '../services/admin.service'
import { SecurityLoggingService } from '../services/security-logging.service'

// Validation schemas
const updateUserStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'PERMANENTLY_LOCKED']),
  reason: z.string().optional()
})

const getUsersSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  trustLevel: z.string().optional(),
  affiliateTier: z.string().optional(),
  roles: z.array(z.string()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional()
})

const getAnalyticsSchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year']).optional()
})

// Middleware to check admin permissions
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.roles.includes('ADMIN')) {
    return res.status(403).json({
      error: 'INSUFFICIENT_PERMISSIONS',
      message: 'Admin access required'
    })
  }
  next()
}

// Controllers
export class AdminController {
  
  // Get admin dashboard
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboardData = await AdminService.getAdminDashboard()
      
      res.json({
        success: true,
        data: dashboardData
      })
      
    } catch (error: any) {
      console.error('Get admin dashboard error:', error)
      
      res.status(500).json({
        error: 'DASHBOARD_ERROR',
        message: 'Failed to load admin dashboard'
      })
    }
  }
  
  // Get all users
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getUsersSchema.parse(req.query)
      
      const page = parseInt(validatedData.page || '1')
      const limit = parseInt(validatedData.limit || '20')
      
      const result = await AdminService.getUsers(page, limit, validatedData)
      
      res.json({
        success: true,
        data: result
      })
      
    } catch (error: any) {
      console.error('Get users error:', error)
      
      res.status(500).json({
        error: 'USERS_ERROR',
        message: 'Failed to load users'
      })
    }
  }
  
  // Get user details
  static async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id
      
      const userDetails = await AdminService.getUserDetails(userId)
      
      res.json({
        success: true,
        data: userDetails
      })
      
    } catch (error: any) {
      console.error('Get user details error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'USER_DETAILS_ERROR',
        message: 'Failed to load user details'
      })
    }
  }
  
  // Update user status
  static async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id
      const adminId = req.user.id
      const validatedData = updateUserStatusSchema.parse(req.body)
      
      const result = await AdminService.updateUserStatus(userId, validatedData.status, validatedData.reason)
      
      // Log admin action
      await SecurityLoggingService.logEvent({
        eventType: 'ADMIN_ACTION',
        userId: adminId,
        metadata: {
          action: 'UPDATE_USER_STATUS',
          targetUserId: userId,
          newStatus: validatedData.status,
          reason: validatedData.reason
        }
      })
      
      res.json({
        success: true,
        message: result.message,
        user: result.user
      })
      
    } catch (error: any) {
      console.error('Update user status error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'USER_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'UPDATE_STATUS_ERROR',
        message: 'Failed to update user status'
      })
    }
  }
  
  // Get system analytics
  static async getSystemAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getAnalyticsSchema.parse(req.query)
      
      const analytics = await AdminService.getSystemAnalytics(validatedData.period)
      
      res.json({
        success: true,
        data: analytics
      })
      
    } catch (error: any) {
      console.error('Get system analytics error:', error)
      
      res.status(500).json({
        error: 'ANALYTICS_ERROR',
        message: 'Failed to load system analytics'
      })
    }
  }
  
  // Get commission leaderboard
  static async getCommissionLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const limit = parseInt(req.query.limit as string) || 10
      
      const leaderboard = await AdminService.getTopPerformers(limit)
      
      res.json({
        success: true,
        data: {
          period,
          leaderboard
        }
      })
      
    } catch (error: any) {
      console.error('Get commission leaderboard error:', error)
      
      res.status(500).json({
        error: 'LEADERBOARD_ERROR',
        message: 'Failed to load commission leaderboard'
      })
    }
  }
  
  // Get security events
  static async getSecurityEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const eventType = req.query.eventType as string
      const severity = req.query.severity as string
      
      const events = await AdminService.getSecurityEvents(page, limit, eventType, severity)
      
      res.json({
        success: true,
        data: events
      })
      
    } catch (error: any) {
      console.error('Get security events error:', error)
      
      res.status(500).json({
        error: 'SECURITY_EVENTS_ERROR',
        message: 'Failed to load security events'
      })
    }
  }
  
  // Get system logs
  static async getSystemLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const level = req.query.level as string
      const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined
      const dateTo = req.query.dateTo ? new Date(req.query.dateTo as string) : undefined
      
      const logs = await AdminService.getSystemLogs(page, limit, level, dateFrom, dateTo)
      
      res.json({
        success: true,
        data: logs
      })
      
    } catch (error: any) {
      console.error('Get system logs error:', error)
      
      res.status(500).json({
        error: 'SYSTEM_LOGS_ERROR',
        message: 'Failed to load system logs'
      })
    }
  }
  
  // Get payout requests
  static async getPayoutRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const status = req.query.status as string
      
      const requests = await AdminService.getPayoutRequests(page, limit, status)
      
      res.json({
        success: true,
        data: requests
      })
      
    } catch (error: any) {
      console.error('Get payout requests error:', error)
      
      res.status(500).json({
        error: 'PAYOUT_REQUESTS_ERROR',
        message: 'Failed to load payout requests'
      })
    }
  }
  
  // Approve payout request
  static async approvePayoutRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const payoutId = req.params.id
      const adminId = req.user.id
      
      const result = await AdminService.approvePayoutRequest(payoutId, adminId)
      
      // Log admin action
      await SecurityLoggingService.logEvent({
        eventType: 'ADMIN_ACTION',
        userId: adminId,
        metadata: {
          action: 'APPROVE_PAYOUT',
          payoutId
        }
      })
      
      res.json({
        success: true,
        message: result.message,
        payout: result.payout
      })
      
    } catch (error: any) {
      console.error('Approve payout request error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'PAYOUT_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'APPROVE_PAYOUT_ERROR',
        message: 'Failed to approve payout request'
      })
    }
  }
  
  // Reject payout request
  static async rejectPayoutRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const payoutId = req.params.id
      const adminId = req.user.id
      const { reason } = req.body
      
      const result = await AdminService.rejectPayoutRequest(payoutId, adminId, reason)
      
      // Log admin action
      await SecurityLoggingService.logEvent({
        eventType: 'ADMIN_ACTION',
        userId: adminId,
        metadata: {
          action: 'REJECT_PAYOUT',
          payoutId,
          reason
        }
      })
      
      res.json({
        success: true,
        message: result.message,
        payout: result.payout
      })
      
    } catch (error: any) {
      console.error('Reject payout request error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'PAYOUT_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'REJECT_PAYOUT_ERROR',
        message: 'Failed to reject payout request'
      })
    }
  }
  
  // Get KYC submissions
  static async getKycSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const status = req.query.status as string
      
      const submissions = await AdminService.getKycSubmissions(page, limit, status)
      
      res.json({
        success: true,
        data: submissions
      })
      
    } catch (error: any) {
      console.error('Get KYC submissions error:', error)
      
      res.status(500).json({
        error: 'KYC_SUBMISSIONS_ERROR',
        message: 'Failed to load KYC submissions'
      })
    }
  }
  
  // Approve KYC submission
  static async approveKycSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const submissionId = req.params.id
      const adminId = req.user.id
      
      const result = await AdminService.approveKycSubmission(submissionId, adminId)
      
      // Log admin action
      await SecurityLoggingService.logEvent({
        eventType: 'ADMIN_ACTION',
        userId: adminId,
        metadata: {
          action: 'APPROVE_KYC',
          submissionId
        }
      })
      
      res.json({
        success: true,
        message: result.message,
        submission: result.submission
      })
      
    } catch (error: any) {
      console.error('Approve KYC submission error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'SUBMISSION_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'APPROVE_KYC_ERROR',
        message: 'Failed to approve KYC submission'
      })
    }
  }
  
  // Reject KYC submission
  static async rejectKycSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const submissionId = req.params.id
      const adminId = req.user.id
      const { reason } = req.body
      
      const result = await AdminService.rejectKycSubmission(submissionId, adminId, reason)
      
      // Log admin action
      await SecurityLoggingService.logEvent({
        eventType: 'ADMIN_ACTION',
        userId: adminId,
        metadata: {
          action: 'REJECT_KYC',
          submissionId,
          reason
        }
      })
      
      res.json({
        success: true,
        message: result.message,
        submission: result.submission
      })
      
    } catch (error: any) {
      console.error('Reject KYC submission error:', error)
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          error: 'SUBMISSION_NOT_FOUND',
          message: error.message
        })
      }
      
      res.status(500).json({
        error: 'REJECT_KYC_ERROR',
        message: 'Failed to reject KYC submission'
      })
    }
  }
  
  // Export middleware
  static requireAdmin = requireAdmin
}
