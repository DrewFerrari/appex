import { prisma } from '../config/database'
import { SecurityLoggingService } from './security-logging.service'

export class AdminService {
  
  // Get admin dashboard data
  static async getAdminDashboard(): Promise<any> {
    try {
      const [
        totalUsers,
        activeUsers,
        pendingUsers,
        totalAffiliates,
        activeAffiliates,
        totalCommissions,
        pendingCommissions,
        totalPayouts,
        pendingPayouts,
        monthlyRevenue,
        monthlyUsers,
        topPerformers
      ] = await Promise.all([
        // User stats
        prisma.user.count(),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.user.count({ where: { status: 'PENDING' } }),
        
        // Affiliate stats
        prisma.user.count({ where: { roles: { has: 'AFFILIATE' } } }),
        prisma.user.count({ 
          where: { 
            roles: { has: 'AFFILIATE' },
            status: 'ACTIVE'
          } 
        }),
        
        // Commission stats
        prisma.commission.aggregate({
          _sum: { amount: true },
          _count: { id: true }
        }),
        prisma.commission.count({ where: { status: 'PENDING' } }),
        
        // Payout stats
        prisma.payout.aggregate({
          _sum: { amount: true },
          _count: { id: true }
        }),
        prisma.payout.count({ where: { status: 'PENDING' } }),
        
        // Monthly stats
        this.getMonthlyRevenue(),
        this.getMonthlyUsers(),
        
        // Top performers
        this.getTopPerformers(5)
      ])
      
      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          pending: pendingUsers,
          growthRate: await this.calculateUserGrowthRate()
        },
        affiliates: {
          total: totalAffiliates,
          active: activeAffiliates,
          conversionRate: totalAffiliates > 0 ? (activeAffiliates / totalAffiliates) * 100 : 0
        },
        commissions: {
          total: totalCommissions._sum.amount || 0,
          count: totalCommissions._count.id || 0,
          pending: pendingCommissions,
          average: totalCommissions._count.id > 0 ? 
            (totalCommissions._sum.amount || 0) / totalCommissions._count.id : 0
        },
        payouts: {
          total: totalPayouts._sum.amount || 0,
          count: totalPayouts._count.id || 0,
          pending: pendingPayouts,
          average: totalPayouts._count.id > 0 ? 
            (totalPayouts._sum.amount || 0) / totalPayouts._count.id : 0
        },
        revenue: {
          monthly: monthlyRevenue,
          growthRate: await this.calculateRevenueGrowthRate()
        },
        newUsers: {
          monthly: monthlyUsers,
          growthRate: await this.calculateUserGrowthRate()
        },
        topPerformers,
        recentActivity: await this.getRecentActivity(),
        systemHealth: await this.getSystemHealth()
      }
    } catch (error) {
      console.error('Get admin dashboard error:', error)
      throw error
    }
  }
  
  // Get all users with pagination
  static async getUsers(page: number = 1, limit: number = 20, filters: any = {}): Promise<any> {
    try {
      const whereClause = this.buildUserWhereClause(filters)
      
      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            status: true,
            trustLevel: true,
            affiliateTier: true,
            roles: true,
            emailVerified: true,
            phoneVerified: true,
            mfaEnabled: true,
            createdAt: true,
            lastLoginAt: true,
            _count: {
              select: {
                referrals: true,
                commissions: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        
        prisma.user.count({ where: whereClause })
      ])
      
      return {
        users,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      }
    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  }
  
  // Update user status
  static async updateUserStatus(userId: string, status: string, reason?: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          status: status as any,
          ...(reason && { lockReason: reason })
        }
      })
      
      // Log status change
      await SecurityLoggingService.logEvent({
        eventType: 'USER_STATUS_CHANGED',
        userId,
        metadata: {
          previousStatus: user.status,
          newStatus: status,
          reason,
          changedBy: 'admin'
        }
      })
      
      return {
        success: true,
        user: updatedUser,
        message: `User status updated to ${status}`
      }
    } catch (error) {
      console.error('Update user status error:', error)
      throw error
    }
  }
  
  // Get user details
  static async getUserDetails(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          referrals: {
            select: {
              id: true,
              referredEmail: true,
              referredName: true,
              businessName: true,
              status: true,
              createdAt: true,
              convertedAt: true,
              commissionEarned: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          commissions: {
            select: {
              id: true,
              amount: true,
              type: true,
              status: true,
              earnedDate: true,
              confirmedDate: true,
              paidDate: true
            },
            orderBy: { earnedDate: 'desc' },
            take: 10
          },
          payouts: {
            select: {
              id: true,
              amount: true,
              method: true,
              status: true,
              createdAt: true,
              completedDate: true,
              reference: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          sessions: {
            select: {
              id: true,
              deviceName: true,
              deviceType: true,
              ipAddress: true,
              isActive: true,
              createdAt: true,
              lastUsedAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          kycSubmissions: {
            select: {
              id: true,
              status: true,
              documentType: true,
              submittedAt: true,
              reviewedAt: true
            },
            orderBy: { submittedAt: 'desc' },
            take: 5
          }
        }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // Calculate additional stats
      const stats = await this.calculateUserStats(userId)
      
      return {
        user,
        stats
      }
    } catch (error) {
      console.error('Get user details error:', error)
      throw error
    }
  }
  
  // Get system analytics
  static async getSystemAnalytics(period: string = 'month'): Promise<any> {
    try {
      const dateRange = this.getDateRange(period)
      
      const [
        userGrowth,
        revenueGrowth,
        commissionStats,
        payoutStats,
        referralStats,
        activityStats
      ] = await Promise.all([
        this.getUserGrowthData(dateRange),
        this.getRevenueGrowthData(dateRange),
        this.getCommissionStats(dateRange),
        this.getPayoutStats(dateRange),
        this.getReferralStats(dateRange),
        this.getActivityStats(dateRange)
      ])
      
      return {
        period,
        dateRange,
        userGrowth,
        revenueGrowth,
        commissionStats,
        payoutStats,
        referralStats,
        activityStats
      }
    } catch (error) {
      console.error('Get system analytics error:', error)
      throw error
    }
  }
  
  // Private helper methods
  private static async getMonthlyRevenue(): Promise<number> {
    const result = await prisma.commission.aggregate({
      where: {
        earnedDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    })
    
    return result._sum.amount || 0
  }
  
  private static async getMonthlyUsers(): Promise<number> {
    const result = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
    
    return result
  }
  
  private static async getTopPerformers(limit: number): Promise<any[]> {
    const performers = await prisma.commission.groupBy({
      by: ['userId'],
      where: {
        earnedDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: {
        _sum: { amount: 'desc' }
      },
      take: limit
    })
    
    const userIds = performers.map(p => p.userId)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        fullName: true,
        email: true,
        affiliateTier: true,
        trustLevel: true
      }
    })
    
    return performers.map((performer, index) => {
      const user = users.find(u => u.id === performer.userId)
      return {
        rank: index + 1,
        user,
        totalCommissions: performer._sum.amount || 0,
        commissionCount: performer._count.id || 0,
        averageCommission: performer._count.id > 0 ? 
          (performer._sum.amount || 0) / performer._count.id : 0
      }
    })
  }
  
  private static async getRecentActivity(): Promise<any[]> {
    const activities = await prisma.securityEvent.findMany({
      select: {
        id: true,
        eventType: true,
        userId: true,
        ipAddress: true,
        userAgent: true,
        metadata: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    
    return activities
  }
  
  private static async getSystemHealth(): Promise<any> {
    const [
      activeSessions,
      failedLogins,
      systemErrors
    ] = await Promise.all([
        prisma.session.count({
          where: {
            isActive: true,
            expiresAt: { gt: new Date() }
          }
        }),
        prisma.securityEvent.count({
          where: {
            eventType: 'LOGIN_FAILED',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        }),
        prisma.securityEvent.count({
          where: {
            severity: 'HIGH',
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        })
      ])
      
    return {
      activeSessions,
      failedLogins,
      systemErrors,
      status: systemErrors > 10 ? 'CRITICAL' : 
             systemErrors > 5 ? 'WARNING' : 'HEALTHY'
    }
  }
  
  private static buildUserWhereClause(filters: any): any {
    const whereClause: any = {}
    
    if (filters.status) {
      whereClause.status = filters.status
    }
    
    if (filters.trustLevel) {
      whereClause.trustLevel = { gte: parseInt(filters.trustLevel) }
    }
    
    if (filters.affiliateTier) {
      whereClause.affiliateTier = filters.affiliateTier
    }
    
    if (filters.roles && filters.roles.length > 0) {
      whereClause.roles = { hasSome: filters.roles }
    }
    
    if (filters.dateFrom) {
      whereClause.createdAt = { gte: new Date(filters.dateFrom) }
    }
    
    if (filters.dateTo) {
      whereClause.createdAt = { 
        ...whereClause.createdAt,
        lte: new Date(filters.dateTo) 
      }
    }
    
    if (filters.search) {
      whereClause.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ]
    }
    
    return whereClause
  }
  
  private static async calculateUserGrowthRate(): Promise<number> {
    const currentMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
    
    const previousMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
    
    if (previousMonth === 0) return 0
    
    return ((currentMonth - previousMonth) / previousMonth) * 100
  }
  
  private static async calculateRevenueGrowthRate(): Promise<number> {
    const currentMonth = await prisma.commission.aggregate({
      where: {
        earnedDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    })
    
    const previousMonth = await prisma.commission.aggregate({
      where: {
        earnedDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    })
    
    const currentRevenue = currentMonth._sum.amount || 0
    const previousRevenue = previousMonth._sum.amount || 0
    
    if (previousRevenue === 0) return 0
    
    return ((currentRevenue - previousRevenue) / previousRevenue) * 100
  }
  
  private static async calculateUserStats(userId: string): Promise<any> {
    const [
      totalReferrals,
      convertedReferrals,
      totalCommissions,
      confirmedCommissions,
      totalPayouts,
      completedPayouts,
      activeSessions
    ] = await Promise.all([
      prisma.referral.count({ where: { affiliateId: userId } }),
      prisma.referral.count({ 
        where: { 
          affiliateId: userId,
          status: 'CONVERTED' 
        } 
      }),
      prisma.commission.aggregate({
        where: { userId },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.commission.count({ 
        where: { 
          userId,
          status: 'CONFIRMED' 
        } 
      }),
      prisma.payout.aggregate({
        where: { userId },
        _sum: { amount: true },
        _count: { id: true }
      }),
      prisma.payout.count({ 
        where: { 
          userId,
          status: 'COMPLETED' 
        } 
      }),
      prisma.session.count({
        where: {
          userId,
          isActive: true,
          expiresAt: { gt: new Date() }
        }
      })
    ])
    
    return {
      referrals: {
        total: totalReferrals,
        converted: convertedReferrals,
        conversionRate: totalReferrals > 0 ? (convertedReferrals / totalReferrals) * 100 : 0
      },
      commissions: {
        total: totalCommissions._sum.amount || 0,
        count: totalCommissions._count.id || 0,
        confirmed: confirmedCommissions,
        average: totalCommissions._count.id > 0 ? 
          (totalCommissions._sum.amount || 0) / totalCommissions._count.id : 0
      },
      payouts: {
        total: totalPayouts._sum.amount || 0,
        count: totalPayouts._count.id || 0,
        completed: completedPayouts,
        average: totalPayouts._count.id > 0 ? 
          (totalPayouts._sum.amount || 0) / totalPayouts._count.id : 0
      },
      sessions: {
        active: activeSessions
      }
    }
  }
  
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
  
  private static async getUserGrowthData(dateRange: any): Promise<any> {
    const users = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate
        }
      },
      _count: { id: true }
    })
    
    return users
  }
  
  private static async getRevenueGrowthData(dateRange: any): Promise<any> {
    const revenue = await prisma.commission.groupBy({
      by: ['earnedDate'],
      where: {
        earnedDate: {
          gte: dateRange.startDate,
          lte: dateRange.endDate
        }
      },
      _sum: { amount: true }
    })
    
    return revenue
  }
  
  private static async getCommissionStats(dateRange: any): Promise<any> {
    const stats = await prisma.commission.groupBy({
      by: ['type', 'status'],
      where: {
        earnedDate: {
          gte: dateRange.startDate,
          lte: dateRange.endDate
        }
      },
      _sum: { amount: true },
      _count: { id: true }
    })
    
    return stats
  }
  
  private static async getPayoutStats(dateRange: any): Promise<any> {
    const stats = await prisma.payout.groupBy({
      by: ['method', 'status'],
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate
        }
      },
      _sum: { amount: true },
      _count: { id: true }
    })
    
    return stats
  }
  
  private static async getReferralStats(dateRange: any): Promise<any> {
    const stats = await prisma.referral.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate
        }
      },
      _count: { id: true }
    })
    
    return stats
  }
  
  private static async getActivityStats(dateRange: any): Promise<any> {
    const stats = await prisma.securityEvent.groupBy({
      by: ['eventType', 'severity'],
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate
        }
      },
      _count: { id: true }
    })
    
    return stats
  }
}
