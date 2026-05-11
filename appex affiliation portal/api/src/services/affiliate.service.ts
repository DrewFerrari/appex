import { prisma } from '../config/database'
import { SecurityLoggingService } from './security-logging.service'
import { EmailService } from './email.service'
import { SMSService } from './sms.service'

export class AffiliateService {
  
  // Get affiliate dashboard data
  static async getDashboardData(userId: string): Promise<any> {
    try {
      const [
        user,
        totalCommissions,
        monthlyCommissions,
        totalReferrals,
        recentReferrals,
        activeSessions,
        lastPayout
      ] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            fullName: true,
            affiliateTier: true,
            trustLevel: true,
            referralCode: true,
            createdAt: true,
            lastLoginAt: true,
            emailVerified: true,
            phoneVerified: true,
            mfaEnabled: true
          }
        }),
        
        prisma.commission.aggregate({
          where: { userId },
          _sum: { amount: true },
          _count: { id: true }
        }),
        
        prisma.commission.aggregate({
          where: {
            userId,
            earnedDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { amount: true },
          _count: { id: true }
        }),
        
        prisma.referral.count({
          where: { affiliateId: userId }
        }),
        
        prisma.referral.findMany({
          where: { affiliateId: userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            referredEmail: true,
            referredName: true,
            businessName: true,
            status: true,
            createdAt: true
          }
        }),
        
        prisma.session.count({
          where: {
            userId,
            isActive: true,
            expiresAt: { gt: new Date() }
          }
        }),
        
        prisma.payout.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
            completedDate: true
          }
        })
      ])
      
      const commissionRates = this.getCommissionRates(user.affiliateTier)
      const nextTier = this.getNextTier(user.affiliateTier)
      
      return {
        user,
        totalCommissions: totalCommissions._sum.amount || 0,
        totalSales: totalCommissions._count.id || 0,
        monthlyCommissions: monthlyCommissions._sum.amount || 0,
        monthlySales: monthlyCommissions._count.id || 0,
        totalReferrals,
        recentReferrals,
        activeSessions,
        lastPayout,
        commissionRates,
        nextTier,
        stats: {
          averageCommission: totalCommissions._count.id > 0 ? 
            (totalCommissions._sum.amount || 0) / totalCommissions._count.id : 0,
          conversionRate: totalReferrals > 0 ? 
            (totalCommissions._count.id / totalReferrals) * 100 : 0,
          topReferralSource: await this.getTopReferralSource(userId)
        }
      }
    } catch (error) {
      console.error('Get dashboard data error:', error)
      throw error
    }
  }
  
  // Create referral
  static async createReferral(userId: string, referralData: any): Promise<any> {
    try {
      const affiliate = await prisma.user.findUnique({
        where: { id: userId },
        select: { referralCode: true, fullName: true }
      })
      
      if (!affiliate) {
        throw new Error('Affiliate not found')
      }
      
      // Check if referral already exists
      const existingReferral = await prisma.referral.findFirst({
        where: {
          affiliateId: userId,
          referredEmail: referralData.email.toLowerCase()
        }
      })
      
      if (existingReferral) {
        throw new Error('Referral already exists')
      }
      
      const referral = await prisma.referral.create({
        data: {
          affiliateId: userId,
          referredEmail: referralData.email.toLowerCase(),
          referredName: referralData.name,
          businessName: referralData.businessName,
          status: 'PENDING',
          nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        }
      })
      
      // Send referral invitation
      await EmailService.sendReferralInvitation(
        referralData.email,
        referralData.name,
        affiliate.fullName,
        affiliate.referralCode
      )
      
      // Log referral creation
      await SecurityLoggingService.logEvent({
        eventType: 'REFERRAL_CREATED',
        userId,
        metadata: {
          referralId: referral.id,
          referredEmail: referralData.email,
          referralCode: affiliate.referralCode
        }
      })
      
      return {
        success: true,
        referral,
        message: 'Referral created successfully'
      }
    } catch (error) {
      console.error('Create referral error:', error)
      throw error
    }
  }
  
  // Update referral status
  static async updateReferralStatus(
    userId: string, 
    referralId: string, 
    status: string,
    notes?: string
  ): Promise<any> {
    try {
      const referral = await prisma.referral.findFirst({
        where: {
          id: referralId,
          affiliateId: userId
        }
      })
      
      if (!referral) {
        throw new Error('Referral not found')
      }
      
      const updateData: any = {
        status,
        nextFollowUp: this.calculateNextFollowUp(status)
      }
      
      if (notes) {
        updateData.notes = notes
      }
      
      if (status === 'CONVERTED') {
        updateData.convertedAt = new Date()
        updateData.commissionEarned = await this.calculateReferralCommission(referralId)
      }
      
      const updatedReferral = await prisma.referral.update({
        where: { id: referralId },
        data: updateData
      })
      
      // Log status update
      await SecurityLoggingService.logEvent({
        eventType: 'REFERRAL_STATUS_UPDATED',
        userId,
        metadata: {
          referralId,
          previousStatus: referral.status,
          newStatus: status,
          notes
        }
      })
      
      return {
        success: true,
        referral: updatedReferral,
        message: 'Referral status updated successfully'
      }
    } catch (error) {
      console.error('Update referral status error:', error)
      throw error
    }
  }
  
  // Get referrals list
  static async getReferrals(
    userId: string, 
    page: number = 1, 
    limit: number = 20,
    status?: string
  ): Promise<any> {
    try {
      const whereClause: any = { affiliateId: userId }
      
      if (status) {
        whereClause.status = status
      }
      
      const [referrals, totalCount] = await Promise.all([
        prisma.referral.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            referredEmail: true,
            referredName: true,
            businessName: true,
            status: true,
            nextFollowUp: true,
            createdAt: true,
            convertedAt: true,
            commissionEarned: true
          }
        }),
        
        prisma.referral.count({ where: whereClause })
      ])
      
      return {
        referrals,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      }
    } catch (error) {
      console.error('Get referrals error:', error)
      throw error
    }
  }
  
  // Get commissions history
  static async getCommissions(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<any> {
    try {
      const whereClause: any = { userId }
      
      if (status) {
        whereClause.status = status
      }
      
      if (dateFrom || dateTo) {
        whereClause.earnedDate = {}
        if (dateFrom) whereClause.earnedDate.gte = dateFrom
        if (dateTo) whereClause.earnedDate.lte = dateTo
      }
      
      const [commissions, totalCount] = await Promise.all([
        prisma.commission.findMany({
          where: whereClause,
          orderBy: { earnedDate: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            referral: {
              select: {
                referredName: true,
                businessName: true
              }
            }
          }
        }),
        
        prisma.commission.count({ where: whereClause })
      ])
      
      return {
        commissions,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      }
    } catch (error) {
      console.error('Get commissions error:', error)
      throw error
    }
  }
  
  // Get payout history
  static async getPayouts(
    userId: string,
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<any> {
    try {
      const whereClause: any = { userId }
      
      if (status) {
        whereClause.status = status
      }
      
      const [payouts, totalCount] = await Promise.all([
        prisma.payout.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        
        prisma.payout.count({ where: whereClause })
      ])
      
      return {
        payouts,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      }
    } catch (error) {
      console.error('Get payouts error:', error)
      throw error
    }
  }
  
  // Request payout
  static async requestPayout(userId: string, payoutData: any): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          trustLevel: true,
          emailVerified: true,
          phoneVerified: true,
          kycSubmissions: {
            where: { status: 'APPROVED' },
            select: { id: true }
          }
        }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // Check if user can request payout
      const canRequest = this.canRequestPayout(user)
      if (!canRequest.allowed) {
        throw new Error(canRequest.reason)
      }
      
      // Get available balance
      const availableBalance = await this.getAvailableBalance(userId)
      
      if (availableBalance < (payoutData.amount || 0)) {
        throw new Error('Insufficient balance')
      }
      
      const payout = await prisma.payout.create({
        data: {
          userId,
          amount: payoutData.amount,
          method: payoutData.method,
          status: 'PENDING',
          bankAccount: payoutData.bankAccount || null,
          mobileMoney: payoutData.mobileMoney || null,
          reference: this.generatePayoutReference()
        }
      })
      
      // Send confirmation
      await EmailService.sendPayoutConfirmation(
        user.email,
        payout.amount,
        payoutData.method,
        payout.reference
      )
      
      // Log payout request
      await SecurityLoggingService.logEvent({
        eventType: 'PAYOUT_REQUESTED',
        userId,
        metadata: {
          payoutId: payout.id,
          amount: payoutData.amount,
          method: payoutData.method,
          reference: payout.reference
        }
      })
      
      return {
        success: true,
        payout,
        message: 'Payout request submitted successfully'
      }
    } catch (error) {
      console.error('Request payout error:', error)
      throw error
    }
  }
  
  // Private helper methods
  private static getCommissionRates(tier: string): any {
    const rates = {
      BRONZE: {
        standard: 5,
        bonus: 10,
        recurring: 2,
        referral: 3
      },
      SILVER: {
        standard: 10,
        bonus: 15,
        recurring: 5,
        referral: 5
      },
      GOLD: {
        standard: 15,
        bonus: 20,
        recurring: 8,
        referral: 8
      },
      PLATINUM: {
        standard: 20,
        bonus: 25,
        recurring: 12,
        referral: 12
      }
    }
    
    return rates[tier] || rates.BRONZE
  }
  
  private static getNextTier(currentTier: string): string | null {
    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']
    const currentIndex = tiers.indexOf(currentTier)
    
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null
  }
  
  private static calculateNextFollowUp(status: string): Date {
    const followUpIntervals = {
      PENDING: 3 * 24 * 60 * 60 * 1000, // 3 days
      CONTACTED: 7 * 24 * 60 * 60 * 1000, // 1 week
      INTERESTED: 14 * 24 * 60 * 60 * 1000, // 2 weeks
      NOT_INTERESTED: null, // No follow up
      CONVERTED: null // No follow up needed
    }
    
    const interval = followUpIntervals[status]
    
    if (interval === null) {
      return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Far future
    }
    
    return new Date(Date.now() + interval)
  }
  
  private static async calculateReferralCommission(referralId: string): Promise<number> {
    try {
      const referral = await prisma.referral.findUnique({
        where: { id: referralId },
        include: {
          affiliate: {
            select: { affiliateTier: true }
          }
        }
      })
      
      if (!referral) return 0
      
      const rates = this.getCommissionRates(referral.affiliate.affiliateTier)
      return rates.referral
    } catch (error) {
      console.error('Calculate referral commission error:', error)
      return 0
    }
  }
  
  private static async getAvailableBalance(userId: string): Promise<number> {
    try {
      const [totalEarned, totalPaid] = await Promise.all([
        prisma.commission.aggregate({
          where: {
            userId,
            status: 'CONFIRMED'
          },
          _sum: { amount: true }
        }),
        
        prisma.payout.aggregate({
          where: {
            userId,
            status: 'COMPLETED'
          },
          _sum: { amount: true }
        })
      ])
      
      return (totalEarned._sum.amount || 0) - (totalPaid._sum.amount || 0)
    } catch (error) {
      console.error('Get available balance error:', error)
      return 0
    }
  }
  
  private static canRequestPayout(user: any): { allowed: boolean; reason?: string } {
    // Check trust level
    if (user.trustLevel < 2) {
      return { allowed: false, reason: 'Trust level too low. Complete KYC verification.' }
    }
    
    // Check verification status
    if (!user.emailVerified || !user.phoneVerified) {
      return { allowed: false, reason: 'Email and phone verification required.' }
    }
    
    // Check KYC
    if (!user.kycSubmissions || user.kycSubmissions.length === 0) {
      return { allowed: false, reason: 'KYC verification required.' }
    }
    
    return { allowed: true }
  }
  
  private static generatePayoutReference(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `PAYOUT-${timestamp}-${random}`.toUpperCase()
  }
  
  private static async getTopReferralSource(userId: string): Promise<string> {
    try {
      const result = await prisma.referral.groupBy({
        by: ['referredEmail'],
        where: { affiliateId: userId },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1
      })
      
      return result[0]?.referredEmail || 'Direct'
    } catch (error) {
      console.error('Get top referral source error:', error)
      return 'Direct'
    }
  }
}
