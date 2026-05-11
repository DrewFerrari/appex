import { prisma } from '../config/database'
import { SecurityLoggingService } from './security-logging.service'

export class CommissionService {
  
  // Calculate commission for a referral conversion
  static async calculateCommission(
    referralId: string, 
    saleAmount: number, 
    commissionType: string = 'STANDARD'
  ): Promise<any> {
    try {
      // Get referral details
      const referral = await prisma.referral.findUnique({
        where: { id: referralId },
        include: {
          affiliate: {
            select: { 
              affiliateTier: true,
              trustLevel: true,
              referralCode: true
            }
          }
        }
      })
      
      if (!referral) {
        throw new Error('Referral not found')
      }
      
      // Get commission rates for affiliate tier
      const commissionRate = this.getCommissionRate(
        referral.affiliate.affiliateTier, 
        commissionType,
        referral.affiliate.trustLevel
      )
      
      // Calculate commission amount
      let commissionAmount = 0
      
      switch (commissionType) {
        case 'STANDARD':
          commissionAmount = (saleAmount * commissionRate.rate) / 100
          break
        case 'BONUS':
          commissionAmount = (saleAmount * commissionRate.rate) / 100
          break
        case 'RECURRING':
          commissionAmount = (saleAmount * commissionRate.rate) / 100
          break
        case 'REFERRAL':
          commissionAmount = commissionRate.flatRate || 0
          break
        default:
          commissionAmount = (saleAmount * commissionRate.rate) / 100
      }
      
      // Apply minimum and maximum limits
      commissionAmount = Math.max(
        commissionRate.minAmount || 0, 
        Math.min(commissionAmount, commissionRate.maxAmount || Infinity)
      )
      
      // Create commission record
      const commission = await prisma.commission.create({
        data: {
          userId: referral.affiliateId,
          referralId,
          amount: commissionAmount,
          type: commissionType,
          status: 'PENDING',
          earnedDate: new Date(),
          metadata: {
            saleAmount,
            referralTier: referral.affiliate.affiliateTier,
            trustLevel: referral.affiliate.trustLevel,
            commissionRate: commissionRate.rate,
            referralCode: referral.affiliate.referralCode
          }
        }
      })
      
      // Log commission calculation
      await SecurityLoggingService.logEvent({
        eventType: 'COMMISSION_CALCULATED',
        userId: referral.affiliateId,
        metadata: {
          referralId,
          commissionId: commission.id,
          amount: commissionAmount,
          type: commissionType,
          saleAmount
        }
      })
      
      return {
        success: true,
        commission,
        message: 'Commission calculated successfully'
      }
    } catch (error) {
      console.error('Calculate commission error:', error)
      throw error
    }
  }
  
  // Confirm commission (after verification)
  static async confirmCommission(commissionId: string, verificationData?: any): Promise<any> {
    try {
      const commission = await prisma.commission.findUnique({
        where: { id: commissionId }
      })
      
      if (!commission) {
        throw new Error('Commission not found')
      }
      
      if (commission.status !== 'PENDING') {
        throw new Error('Commission already processed')
      }
      
      // Update commission status
      const updatedCommission = await prisma.commission.update({
        where: { id: commissionId },
        data: {
          status: 'CONFIRMED',
          confirmedDate: new Date(),
          metadata: {
            ...commission.metadata,
            verificationData,
            confirmedAt: new Date().toISOString()
          }
        }
      })
      
      // Update affiliate stats
      await this.updateAffiliateStats(commission.userId)
      
      // Log commission confirmation
      await SecurityLoggingService.logEvent({
        eventType: 'COMMISSION_CONFIRMED',
        userId: commission.userId,
        metadata: {
          commissionId,
          amount: commission.amount,
          type: commission.type
        }
      })
      
      return {
        success: true,
        commission: updatedCommission,
        message: 'Commission confirmed successfully'
      }
    } catch (error) {
      console.error('Confirm commission error:', error)
      throw error
    }
  }
  
  // Mark commission as paid
  static async markCommissionPaid(commissionId: string, payoutId: string): Promise<any> {
    try {
      const commission = await prisma.commission.findUnique({
        where: { id: commissionId }
      })
      
      if (!commission) {
        throw new Error('Commission not found')
      }
      
      if (commission.status !== 'CONFIRMED') {
        throw new Error('Commission must be confirmed before marking as paid')
      }
      
      // Update commission status
      const updatedCommission = await prisma.commission.update({
        where: { id: commissionId },
        data: {
          status: 'PAID',
          paidDate: new Date(),
          payoutId
        }
      })
      
      // Log commission payment
      await SecurityLoggingService.logEvent({
        eventType: 'COMMISSION_PAID',
        userId: commission.userId,
        metadata: {
          commissionId,
          amount: commission.amount,
          payoutId
        }
      })
      
      return {
        success: true,
        commission: updatedCommission,
        message: 'Commission marked as paid'
      }
    } catch (error) {
      console.error('Mark commission paid error:', error)
      throw error
    }
  }
  
  // Get commission rates for tier
  static getCommissionRate(
    tier: string, 
    commissionType: string, 
    trustLevel: number
  ): any {
    const baseRates = {
      BRONZE: {
        standard: { rate: 5, minAmount: 1, maxAmount: 100 },
        bonus: { rate: 10, minAmount: 5, maxAmount: 500 },
        recurring: { rate: 2, minAmount: 0.5, maxAmount: 50 },
        referral: { flatRate: 3, minAmount: 3, maxAmount: 3 }
      },
      SILVER: {
        standard: { rate: 10, minAmount: 1, maxAmount: 200 },
        bonus: { rate: 15, minAmount: 10, maxAmount: 1000 },
        recurring: { rate: 5, minAmount: 1, maxAmount: 100 },
        referral: { flatRate: 5, minAmount: 5, maxAmount: 5 }
      },
      GOLD: {
        standard: { rate: 15, minAmount: 1, maxAmount: 500 },
        bonus: { rate: 20, minAmount: 15, maxAmount: 2000 },
        recurring: { rate: 8, minAmount: 2, maxAmount: 200 },
        referral: { flatRate: 8, minAmount: 8, maxAmount: 8 }
      },
      PLATINUM: {
        standard: { rate: 20, minAmount: 1, maxAmount: 1000 },
        bonus: { rate: 25, minAmount: 20, maxAmount: 5000 },
        recurring: { rate: 12, minAmount: 5, maxAmount: 500 },
        referral: { flatRate: 12, minAmount: 12, maxAmount: 12 }
      }
    }
    
    let tierRates = baseRates[tier] || baseRates.BRONZE
    
    // Apply trust level multiplier
    const trustMultiplier = this.getTrustLevelMultiplier(trustLevel)
    
    // Adjust rates based on trust level
    const adjustedRates = {}
    for (const [type, rate] of Object.entries(tierRates)) {
      adjustedRates[type] = {
        ...rate,
        rate: rate.rate * trustMultiplier
      }
    }
    
    return adjustedRates[commissionType] || adjustedRates.standard
  }
  
  // Calculate trust level multiplier
  private static getTrustLevelMultiplier(trustLevel: number): number {
    const multipliers = {
      0: 0.5,    // Unverified
      1: 0.7,    // Email verified
      2: 0.85,   // Phone verified
      3: 1.0,    // KYC approved
      4: 1.15,   // High trust
      5: 1.25    // Premium
    }
    
    return multipliers[trustLevel] || 0.5
  }
  
  // Update affiliate stats
  private static async updateAffiliateStats(userId: string): Promise<void> {
    try {
      // Get current stats
      const stats = await prisma.userActivitySummary.findFirst({
        where: {
          userId,
          date: new Date(),
          periodType: 'daily'
        }
      })
      
      if (stats) {
        // Update existing stats
        await prisma.userActivitySummary.update({
          where: { id: stats.id },
          data: {
            commissionsEarned: {
              increment: 1
            }
          }
        })
      } else {
        // Create new stats record
        await prisma.userActivitySummary.create({
          data: {
            userId,
            date: new Date(),
            periodType: 'daily',
            commissionsEarned: 1
          }
        })
      }
    } catch (error) {
      console.error('Update affiliate stats error:', error)
    }
  }
  
  // Get commission analytics
  static async getCommissionAnalytics(
    userId: string, 
    period: string = 'month'
  ): Promise<any> {
    try {
      const dateRange = this.getDateRange(period)
      
      const [commissions, summary] = await Promise.all([
        prisma.commission.findMany({
          where: {
            userId,
            earnedDate: { gte: dateRange.startDate, lte: dateRange.endDate }
          },
          orderBy: { earnedDate: 'desc' },
          include: {
            referral: {
              select: {
                referredName: true,
                businessName: true
              }
            }
          }
        }),
        
        prisma.commission.aggregate({
          where: {
            userId,
            earnedDate: { gte: dateRange.startDate, lte: dateRange.endDate }
          },
          _sum: { amount: true },
          _count: { id: true },
          _avg: { amount: true },
          _max: { amount: true },
          _min: { amount: true }
        })
      ])
      
      const typeBreakdown = await prisma.commission.groupBy({
        by: ['type'],
        where: {
          userId,
          earnedDate: { gte: dateRange.startDate, lte: dateRange.endDate }
        },
        _sum: { amount: true },
        _count: { id: true }
      })
      
      return {
        period,
        dateRange,
        commissions,
        summary: {
          totalAmount: summary._sum.amount || 0,
          totalCount: summary._count.id || 0,
          averageAmount: summary._avg.amount || 0,
          maxAmount: summary._max.amount || 0,
          minAmount: summary._min.amount || 0
        },
        typeBreakdown: typeBreakdown.map((item: any) => ({
          type: item.type,
          totalAmount: item._sum.amount,
          count: item._count.id,
          percentage: ((item._sum.amount / (summary._sum.amount || 1)) * 100).toFixed(2)
        })),
        trends: await this.calculateCommissionTrends(userId, period)
      }
    } catch (error) {
      console.error('Get commission analytics error:', error)
      throw error
    }
  }
  
  // Calculate commission trends
  private static async calculateCommissionTrends(userId: string, period: string): Promise<any> {
    try {
      const periods = this.getTrendPeriods(period)
      const trendData = []
      
      for (const periodData of periods) {
        const summary = await prisma.commission.aggregate({
          where: {
            userId,
            earnedDate: { gte: periodData.startDate, lte: periodData.endDate }
          },
          _sum: { amount: true },
          _count: { id: true }
        })
        
        trendData.push({
          period: periodData.label,
          startDate: periodData.startDate,
          endDate: periodData.endDate,
          totalAmount: summary._sum.amount || 0,
          totalCount: summary._count.id || 0
        })
      }
      
      return {
        trendData,
        growth: this.calculateGrowthRate(trendData)
      }
    } catch (error) {
      console.error('Calculate commission trends error:', error)
      return { trendData: [], growth: 0 }
    }
  }
  
  // Get date range for period
  private static getDateRange(period: string): { startDate: Date; endDate: Date } {
    const now = new Date()
    let startDate: Date
    let endDate: Date = now
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear() + 1, 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }
    
    return { startDate, endDate }
  }
  
  // Get trend periods
  private static getTrendPeriods(period: string): Array<{ label: string; startDate: Date; endDate: Date }> {
    const now = new Date()
    const periods = []
    
    if (period === 'month') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        periods.push({
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          startDate: new Date(date.getFullYear(), date.getMonth(), 1),
          endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        })
      }
    } else if (period === 'quarter') {
      // Last 4 quarters
      for (let i = 3; i >= 0; i--) {
        const quarter = Math.floor(now.getMonth() / 3) - i
        periods.push({
          label: `Q${quarter + 1}`,
          startDate: new Date(now.getFullYear(), quarter * 3, 1),
          endDate: new Date(now.getFullYear(), (quarter + 1) * 3, 0)
        })
      }
    } else if (period === 'year') {
      // Last 3 years
      for (let i = 2; i >= 0; i--) {
        const year = now.getFullYear() - i
        periods.push({
          label: year.toString(),
          startDate: new Date(year, 0, 1),
          endDate: new Date(year + 1, 0, 1)
        })
      }
    }
    
    return periods
  }
  
  // Calculate growth rate
  private static calculateGrowthRate(trendData: any[]): number {
    if (trendData.length < 2) return 0
    
    const current = trendData[trendData.length - 1]
    const previous = trendData[trendData.length - 2]
    
    if (previous.totalAmount === 0) return 0
    
    return ((current.totalAmount - previous.totalAmount) / previous.totalAmount) * 100
  }
  
  // Get commission leaderboard
  static async getCommissionLeaderboard(
    period: string = 'month',
    limit: number = 10
  ): Promise<any> {
    try {
      const dateRange = this.getDateRange(period)
      
      const leaderboard = await prisma.commission.groupBy({
        by: ['userId'],
        where: {
          earnedDate: { gte: dateRange.startDate, lte: dateRange.endDate }
        },
        _sum: { amount: true },
        _count: { id: true },
        orderBy: {
          _sum: { amount: 'desc' }
        },
        take: limit,
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              affiliateTier: true,
              trustLevel: true
            }
          }
        }
      })
      
      return {
        period,
        dateRange,
        leaderboard: leaderboard.map((item: any, index) => ({
          rank: index + 1,
          userId: item.userId,
          user: item.user,
          totalAmount: item._sum.amount,
          totalCount: item._count.id,
          averageAmount: item._count.id > 0 ? item._sum.amount / item._count.id : 0
        }))
      }
    } catch (error) {
      console.error('Get commission leaderboard error:', error)
      throw error
    }
  }
}
