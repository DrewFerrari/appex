import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AnalyticsService } from '../services/analytics.service'

// Validation schemas
const getAnalyticsSchema = z.object({
  period: z.enum(['week', 'month', 'quarter', 'year']).optional(),
  userId: z.string().uuid().optional()
})

const getCustomAnalyticsSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  userId: z.string().uuid().optional(),
  metrics: z.array(z.string()).optional()
})

// Controllers
export class AnalyticsController {
  
  // Get analytics data
  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getAnalyticsSchema.parse(req.query)
      
      const analyticsData = await AnalyticsService.getAnalyticsData(
        validatedData.period || 'month',
        validatedData.userId
      )
      
      res.json({
        success: true,
        data: analyticsData
      })
      
    } catch (error: any) {
      console.error('Get analytics error:', error)
      
      res.status(500).json({
        error: 'ANALYTICS_ERROR',
        message: 'Failed to load analytics data'
      })
    }
  }
  
  // Get custom analytics data
  static async getCustomAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = getCustomAnalyticsSchema.parse(req.body)
      
      const startDate = new Date(validatedData.startDate)
      const endDate = new Date(validatedData.endDate)
      
      const analyticsData = await AnalyticsService.getAnalyticsData(
        'custom',
        validatedData.userId
      )
      
      res.json({
        success: true,
        data: {
          ...analyticsData,
          dateRange: { startDate, endDate }
        }
      })
      
    } catch (error: any) {
      console.error('Get custom analytics error:', error)
      
      res.status(500).json({
        error: 'CUSTOM_ANALYTICS_ERROR',
        message: 'Failed to load custom analytics data'
      })
    }
  }
  
  // Get user analytics
  static async getUserAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id
      const period = req.query.period as string || 'month'
      
      const analyticsData = await AnalyticsService.getAnalyticsData(period, userId)
      
      res.json({
        success: true,
        data: analyticsData
      })
      
    } catch (error: any) {
      console.error('Get user analytics error:', error)
      
      res.status(500).json({
        error: 'USER_ANALYTICS_ERROR',
        message: 'Failed to load user analytics data'
      })
    }
  }
  
  // Get revenue analytics
  static async getRevenueAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const userId = req.query.userId as string
      
      const revenueData = await AnalyticsService.getRevenueAnalytics(period, userId)
      
      res.json({
        success: true,
        data: revenueData
      })
      
    } catch (error: any) {
      console.error('Get revenue analytics error:', error)
      
      res.status(500).json({
        error: 'REVENUE_ANALYTICS_ERROR',
        message: 'Failed to load revenue analytics data'
      })
    }
  }
  
  // Get commission analytics
  static async getCommissionAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const userId = req.query.userId as string
      
      const commissionData = await AnalyticsService.getCommissionAnalytics(period, userId)
      
      res.json({
        success: true,
        data: commissionData
      })
      
    } catch (error: any) {
      console.error('Get commission analytics error:', error)
      
      res.status(500).json({
        error: 'COMMISSION_ANALYTICS_ERROR',
        message: 'Failed to load commission analytics data'
      })
    }
  }
  
  // Get referral analytics
  static async getReferralAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const userId = req.query.userId as string
      
      const referralData = await AnalyticsService.getReferralAnalytics(period, userId)
      
      res.json({
        success: true,
        data: referralData
      })
      
    } catch (error: any) {
      console.error('Get referral analytics error:', error)
      
      res.status(500).json({
        error: 'REFERRAL_ANALYTICS_ERROR',
        message: 'Failed to load referral analytics data'
      })
    }
  }
  
  // Get performance analytics
  static async getPerformanceAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const userId = req.query.userId as string
      
      const performanceData = await AnalyticsService.getPerformanceAnalytics(period, userId)
      
      res.json({
        success: true,
        data: performanceData
      })
      
    } catch (error: any) {
      console.error('Get performance analytics error:', error)
      
      res.status(500).json({
        error: 'PERFORMANCE_ANALYTICS_ERROR',
        message: 'Failed to load performance analytics data'
      })
    }
  }
  
  // Get trends data
  static async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const userId = req.query.userId as string
      
      const trendsData = await AnalyticsService.getTrendsData(period, userId)
      
      res.json({
        success: true,
        data: trendsData
      })
      
    } catch (error: any) {
      console.error('Get trends data error:', error)
      
      res.status(500).json({
        error: 'TRENDS_ERROR',
        message: 'Failed to load trends data'
      })
    }
  }
  
  // Get leaderboard data
  static async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const limit = parseInt(req.query.limit as string) || 10
      
      const leaderboardData = await AnalyticsService.getLeaderboardData(period, limit)
      
      res.json({
        success: true,
        data: leaderboardData
      })
      
    } catch (error: any) {
      console.error('Get leaderboard data error:', error)
      
      res.status(500).json({
        error: 'LEADERBOARD_ERROR',
        message: 'Failed to load leaderboard data'
      })
    }
  }
  
  // Export analytics data
  static async exportAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const format = req.query.format as string || 'json'
      const userId = req.query.userId as string
      
      const analyticsData = await AnalyticsService.getAnalyticsData(period, userId)
      
      if (format === 'csv') {
        // Convert to CSV and send as file
        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv')
        res.send(this.convertToCSV(analyticsData))
      } else if (format === 'pdf') {
        // Convert to PDF and send as file
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=analytics.pdf')
        res.send(this.convertToPDF(analyticsData))
      } else {
        // Default to JSON
        res.json({
          success: true,
          data: analyticsData
        })
      }
      
    } catch (error: any) {
      console.error('Export analytics error:', error)
      
      res.status(500).json({
        error: 'EXPORT_ERROR',
        message: 'Failed to export analytics data'
      })
    }
  }
  
  // Get real-time analytics
  static async getRealTimeAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const realTimeData = await AnalyticsService.getRealTimeAnalytics()
      
      res.json({
        success: true,
        data: realTimeData
      })
      
    } catch (error: any) {
      console.error('Get real-time analytics error:', error)
      
      res.status(500).json({
        error: 'REALTIME_ANALYTICS_ERROR',
        message: 'Failed to load real-time analytics data'
      })
    }
  }
  
  // Get comparison analytics
  static async getComparisonAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { period1, period2, userId } = req.query
      
      const [data1, data2] = await Promise.all([
        AnalyticsService.getAnalyticsData(period1 as string, userId as string),
        AnalyticsService.getAnalyticsData(period2 as string, userId as string)
      ])
      
      const comparisonData = AnalyticsService.compareAnalytics(data1, data2)
      
      res.json({
        success: true,
        data: {
          period1: data1,
          period2: data2,
          comparison: comparisonData
        }
      })
      
    } catch (error: any) {
      console.error('Get comparison analytics error:', error)
      
      res.status(500).json({
        error: 'COMPARISON_ANALYTICS_ERROR',
        message: 'Failed to load comparison analytics data'
      })
    }
  }
  
  // Get forecast analytics
  static async getForecastAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const period = req.query.period as string || 'month'
      const userId = req.query.userId as string
      const forecastPeriod = parseInt(req.query.forecastPeriod as string) || 30
      
      const forecastData = await AnalyticsService.getForecastAnalytics(
        period, 
        userId, 
        forecastPeriod
      )
      
      res.json({
        success: true,
        data: forecastData
      })
      
    } catch (error: any) {
      console.error('Get forecast analytics error:', error)
      
      res.status(500).json({
        error: 'FORECAST_ANALYTICS_ERROR',
        message: 'Failed to load forecast analytics data'
      })
    }
  }
  
  // Helper methods for data conversion
  private static convertToCSV(data: any): string {
    // Implementation for converting analytics data to CSV
    const headers = Object.keys(data)
    const csvContent = [
      headers.join(','),
      headers.map(header => data[header]).join(',')
    ].join('\n')
    
    return csvContent
  }
  
  private static convertToPDF(data: any): Buffer {
    // Implementation for converting analytics data to PDF
    // This would typically use a PDF library like jsPDF or puppeteer
    return Buffer.from('PDF content here')
  }
}
