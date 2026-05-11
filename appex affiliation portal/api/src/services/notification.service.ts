import { prisma } from '../config/database'
import { EmailService } from './email.service'
import { SMSService } from './sms.service'
import { SecurityLoggingService } from './security-logging.service'

export class NotificationService {
  
  // Send notification based on user preferences
  static async sendNotification(
    userId: string,
    type: 'EMAIL' | 'SMS' | 'PUSH' | 'ALL',
    subject: string,
    message: string,
    data?: any
  ): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          preferredCommunicationChannel: true,
          emailVerified: true,
          phoneVerified: true,
          marketingConsent: true
        }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const results = []
      
      // Send email notification
      if ((type === 'EMAIL' || type === 'ALL') && user.emailVerified && user.email) {
        try {
          const emailResult = await EmailService.sendNotificationEmail(
            user.email,
            user.fullName,
            subject,
            message,
            data
          )
          results.push({ channel: 'EMAIL', success: true, result: emailResult })
        } catch (error) {
          console.error('Email notification failed:', error)
          results.push({ channel: 'EMAIL', success: false, error: error.message })
        }
      }
      
      // Send SMS notification
      if ((type === 'SMS' || type === 'ALL') && user.phoneVerified && user.phone) {
        try {
          const smsResult = await SMSService.sendNotificationSMS(
            user.phone,
            user.fullName,
            message,
            data
          )
          results.push({ channel: 'SMS', success: true, result: smsResult })
        } catch (error) {
          console.error('SMS notification failed:', error)
          results.push({ channel: 'SMS', success: false, error: error.message })
        }
      }
      
      // Log notification
      await this.logNotification(userId, type, subject, message, results)
      
      return {
        success: true,
        results
      }
    } catch (error) {
      console.error('Send notification error:', error)
      throw error
    }
  }
  
  // Send commission notification
  static async sendCommissionNotification(
    userId: string,
    commissionData: any
  ): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, email: true, phone: true, preferredCommunicationChannel: true }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const subject = `New Commission Earned - $${commissionData.amount.toFixed(2)}`
      const message = `Congratulations ${user.fullName}! You've earned a commission of $${commissionData.amount.toFixed(2)} from ${commissionData.type}.`
      
      const emailData = {
        commissionAmount: commissionData.amount,
        commissionType: commissionData.type,
        referralName: commissionData.referralName,
        earnedDate: commissionData.earnedDate,
        status: commissionData.status
      }
      
      return await this.sendNotification(userId, 'ALL', subject, message, emailData)
    } catch (error) {
      console.error('Send commission notification error:', error)
      throw error
    }
  }
  
  // Send payout notification
  static async sendPayoutNotification(
    userId: string,
    payoutData: any
  ): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, email: true, phone: true, preferredCommunicationChannel: true }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const subject = `Payout ${payoutData.status} - $${payoutData.amount.toFixed(2)}`
      const message = `Your payout request of $${payoutData.amount.toFixed(2)} has been ${payoutData.status.toLowerCase()}.`
      
      const emailData = {
        payoutAmount: payoutData.amount,
        payoutMethod: payoutData.method,
        status: payoutData.status,
        reference: payoutData.reference,
        completedDate: payoutData.completedDate
      }
      
      return await this.sendNotification(userId, 'ALL', subject, message, emailData)
    } catch (error) {
      console.error('Send payout notification error:', error)
      throw error
    }
  }
  
  // Send referral notification
  static async sendReferralNotification(
    userId: string,
    referralData: any
  ): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, email: true, phone: true, preferredCommunicationChannel: true }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const subject = `New Referral - ${referralData.referredName}`
      const message = `Great news! ${referralData.referredName} has been added to your referrals.`
      
      const emailData = {
        referralName: referralData.referredName,
        referralEmail: referralData.referredEmail,
        businessName: referralData.businessName,
        status: referralData.status,
        createdAt: referralData.createdAt
      }
      
      return await this.sendNotification(userId, 'ALL', subject, message, emailData)
    } catch (error) {
      console.error('Send referral notification error:', error)
      throw error
    }
  }
  
  // Send security alert
  static async sendSecurityAlert(
    userId: string,
    alertData: any
  ): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, email: true, phone: true, preferredCommunicationChannel: true }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const subject = `Security Alert - ${alertData.eventType}`
      const message = `Security alert: ${alertData.description}. If this wasn't you, please contact support immediately.`
      
      const emailData = {
        eventType: alertData.eventType,
        description: alertData.description,
        ipAddress: alertData.ipAddress,
        userAgent: alertData.userAgent,
        location: alertData.location,
        timestamp: alertData.timestamp
      }
      
      return await this.sendNotification(userId, 'ALL', subject, message, emailData)
    } catch (error) {
      console.error('Send security alert error:', error)
      throw error
    }
  }
  
  // Send marketing notification
  static async sendMarketingNotification(
    userIds: string[],
    campaignData: any
  ): Promise<any> {
    try {
      const users = await prisma.user.findMany({
        where: {
          id: { in: userIds },
          marketingConsent: true,
          status: 'ACTIVE'
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          preferredCommunicationChannel: true,
          emailVerified: true,
          phoneVerified: true
        }
      })
      
      const results = []
      
      for (const user of users) {
        try {
          const subject = campaignData.subject
          const message = campaignData.message.replace('{name}', user.fullName)
          
          const result = await this.sendNotification(
            user.id,
            user.preferredCommunicationChannel,
            subject,
            message,
            campaignData
          )
          
          results.push({ userId: user.id, success: true, result })
        } catch (error) {
          console.error(`Marketing notification failed for user ${user.id}:`, error)
          results.push({ userId: user.id, success: false, error: error.message })
        }
      }
      
      return {
        success: true,
        totalUsers: users.length,
        successfulNotifications: results.filter(r => r.success).length,
        results
      }
    } catch (error) {
      console.error('Send marketing notification error:', error)
      throw error
    }
  }
  
  // Send system notification
  static async sendSystemNotification(
    type: 'MAINTENANCE' | 'UPDATE' | 'OUTAGE' | 'ANNOUNCEMENT',
    title: string,
    message: string,
    targetUsers?: string[] // If not provided, send to all active users
  ): Promise<any> {
    try {
      let users
      
      if (targetUsers) {
        users = await prisma.user.findMany({
          where: {
            id: { in: targetUsers },
            status: 'ACTIVE'
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            preferredCommunicationChannel: true,
            emailVerified: true,
            phoneVerified: true
          }
        })
      } else {
        users = await prisma.user.findMany({
          where: {
            status: 'ACTIVE'
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            preferredCommunicationChannel: true,
            emailVerified: true,
            phoneVerified: true
          }
        })
      }
      
      const results = []
      
      for (const user of users) {
        try {
          const subject = `[${type}] ${title}`
          const notificationData = {
            type,
            title,
            message,
            timestamp: new Date()
          }
          
          const result = await this.sendNotification(
            user.id,
            user.preferredCommunicationChannel,
            subject,
            message,
            notificationData
          )
          
          results.push({ userId: user.id, success: true, result })
        } catch (error) {
          console.error(`System notification failed for user ${user.id}:`, error)
          results.push({ userId: user.id, success: false, error: error.message })
        }
      }
      
      return {
        success: true,
        type,
        title,
        message,
        totalUsers: users.length,
        successfulNotifications: results.filter(r => r.success).length,
        results
      }
    } catch (error) {
      console.error('Send system notification error:', error)
      throw error
    }
  }
  
  // Get notification preferences
  static async getNotificationPreferences(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          preferredCommunicationChannel: true,
          emailVerified: true,
          phoneVerified: true,
          marketingConsent: true
        }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      return {
        preferredChannel: user.preferredCommunicationChannel,
        emailEnabled: user.emailVerified,
        smsEnabled: user.phoneVerified,
        marketingConsent: user.marketingConsent,
        availableChannels: [
          ...(user.emailVerified ? ['EMAIL'] : []),
          ...(user.phoneVerified ? ['SMS'] : []),
          'PUSH'
        ]
      }
    } catch (error) {
      console.error('Get notification preferences error:', error)
      throw error
    }
  }
  
  // Update notification preferences
  static async updateNotificationPreferences(
    userId: string,
    preferences: any
  ): Promise<any> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          preferredCommunicationChannel: preferences.preferredChannel,
          marketingConsent: preferences.marketingConsent
        },
        select: {
          id: true,
          preferredCommunicationChannel: true,
          marketingConsent: true
        }
      })
      
      return {
        success: true,
        message: 'Notification preferences updated successfully',
        preferences: {
          preferredChannel: user.preferredCommunicationChannel,
          marketingConsent: user.marketingConsent
        }
      }
    } catch (error) {
      console.error('Update notification preferences error:', error)
      throw error
    }
  }
  
  // Get notification history
  static async getNotificationHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<any> {
    try {
      const whereClause = {
        userId,
        ...filters
      }
      
      const [notifications, totalCount] = await Promise.all([
        prisma.notificationLog.findMany({
          where: whereClause,
          select: {
            id: true,
            type: true,
            channel: true,
            subject: true,
            message: true,
            data: true,
            success: true,
            error: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        
        prisma.notificationLog.count({ where: whereClause })
      ])
      
      return {
        notifications,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      }
    } catch (error) {
      console.error('Get notification history error:', error)
      throw error
    }
  }
  
  // Log notification
  private static async logNotification(
    userId: string,
    type: string,
    subject: string,
    message: string,
    results: any[]
  ): Promise<void> {
    try {
      for (const result of results) {
        await prisma.notificationLog.create({
          data: {
            userId,
            type,
            channel: result.channel,
            subject,
            message,
            success: result.success,
            error: result.error,
            data: result.result
          }
        })
      }
    } catch (error) {
      console.error('Log notification error:', error)
    }
  }
  
  // Get notification statistics
  static async getNotificationStatistics(
    period: string = 'month'
  ): Promise<any> {
    try {
      const dateRange = this.getDateRange(period)
      
      const [
        totalNotifications,
        successfulNotifications,
        notificationsByType,
        notificationsByChannel,
        notificationsByDay
      ] = await Promise.all([
        prisma.notificationLog.count({
          where: {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate
            }
          }
        }),
        prisma.notificationLog.count({
          where: {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate
            },
            success: true
          }
        }),
        prisma.notificationLog.groupBy({
          by: ['type'],
          where: {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate
            }
          },
          _count: { id: true }
        }),
        prisma.notificationLog.groupBy({
          by: ['channel'],
          where: {
            createdAt: {
              gte: dateRange.startDate,
              lte: dateRange.endDate
            }
          },
          _count: { id: true }
        }),
        this.getNotificationsByDay(dateRange)
      ])
      
      return {
        period,
        dateRange,
        total: totalNotifications,
        successful: successfulNotifications,
        successRate: totalNotifications > 0 ? (successfulNotifications / totalNotifications) * 100 : 0,
        byType: notificationsByType,
        byChannel: notificationsByChannel,
        byDay: notificationsByDay
      }
    } catch (error) {
      console.error('Get notification statistics error:', error)
      throw error
    }
  }
  
  // Helper method to get date range
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
  
  // Helper method to get notifications by day
  private static async getNotificationsByDay(dateRange: any): Promise<any> {
    const notifications = await prisma.notificationLog.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate
        }
      },
      _count: { id: true }
    })
    
    // Group by day
    const byDay = {}
    notifications.forEach(notification => {
      const day = notification.createdAt.toISOString().split('T')[0]
      byDay[day] = (byDay[day] || 0) + notification._count.id
    })
    
    return byDay
  }
}
