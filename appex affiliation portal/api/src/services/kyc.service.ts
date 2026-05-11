import { prisma } from '../config/database'
import { SecurityLoggingService } from './security-logging.service'
import { NotificationService } from './notification.service'
import crypto from 'crypto'

export class KycService {
  
  // Submit KYC documents
  static async submitKycDocuments(
    userId: string,
    documents: any[]
  ): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          status: true,
          kycSubmissions: {
            where: { status: 'PENDING' },
            select: { id: true }
          }
        }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      if (user.status !== 'ACTIVE') {
        throw new Error('User account must be active to submit KYC documents')
      }
      
      // Check if there's already a pending submission
      if (user.kycSubmissions.length > 0) {
        throw new Error('You already have a pending KYC submission')
      }
      
      // Create KYC submission
      const submission = await prisma.kycSubmission.create({
        data: {
          userId,
          status: 'PENDING',
          submittedAt: new Date(),
          documents: {
            create: documents.map(doc => ({
              documentType: doc.documentType,
              documentNumber: doc.documentNumber,
              documentUrl: doc.documentUrl,
              fileName: doc.fileName,
              fileSize: doc.fileSize,
              mimeType: doc.mimeType,
              checksum: doc.checksum || this.generateChecksum(doc.documentUrl),
              extractedAt: new Date(),
              status: 'PENDING'
            }))
          }
        }
      })
      
      // Update user registration stage
      await prisma.user.update({
        where: { id: userId },
        data: {
          registrationStage: 'KYC_SUBMITTED'
        }
      })
      
      // Log KYC submission
      await SecurityLoggingService.logEvent({
        eventType: 'KYC_SUBMITTED',
        userId,
        metadata: {
          submissionId: submission.id,
          documentCount: documents.length,
          documentTypes: documents.map(d => d.documentType)
        }
      })
      
      // Send notification to user
      await NotificationService.sendNotification(
        userId,
        'EMAIL',
        'KYC Documents Submitted',
        'Your KYC documents have been successfully submitted for review. We will notify you once the review is complete.',
        {
          submissionId: submission.id,
          submittedAt: submission.submittedAt
        }
      )
      
      // Send notification to admins
      await this.notifyAdminsOfNewSubmission(submission, user)
      
      return {
        success: true,
        message: 'KYC documents submitted successfully',
        submission: {
          id: submission.id,
          status: submission.status,
          submittedAt: submission.submittedAt,
          documentCount: documents.length
        }
      }
    } catch (error) {
      console.error('Submit KYC documents error:', error)
      throw error
    }
  }
  
  // Review KYC submission
  static async reviewKycSubmission(
    submissionId: string,
    adminId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string,
    notes?: string
  ): Promise<any> {
    try {
      const submission = await prisma.kycSubmission.findUnique({
        where: { id: submissionId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              trustLevel: true
            }
          },
          documents: true
        }
      })
      
      if (!submission) {
        throw new Error('KYC submission not found')
      }
      
      if (submission.status !== 'PENDING') {
        throw new Error('KYC submission has already been reviewed')
      }
      
      // Update submission
      const updatedSubmission = await prisma.kycSubmission.update({
        where: { id: submissionId },
        data: {
          status,
          reviewedAt: new Date(),
          reviewedBy: adminId,
          reason,
          notes,
          documents: {
            updateMany: {
              where: { submissionId },
              data: {
                status,
                reviewedAt: new Date()
              }
            }
          }
        }
      })
      
      // Update user trust level and registration stage if approved
      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: submission.userId },
          data: {
            trustLevel: 3, // KYC approved level
            registrationStage: 'APPROVED'
          }
        })
        
        // Log trust level increase
        await SecurityLoggingService.logEvent({
          eventType: 'TRUST_LEVEL_INCREASED',
          userId: submission.userId,
          metadata: {
            previousLevel: submission.user.trustLevel,
            newLevel: 3,
            reason: 'KYC_APPROVED',
            submissionId
          }
        })
      }
      
      // Log admin action
      await SecurityLoggingService.logEvent({
        eventType: 'ADMIN_ACTION',
        userId: adminId,
        metadata: {
          action: 'REVIEW_KYC',
          targetUserId: submission.userId,
          submissionId,
          decision: status,
          reason,
          notes
        }
      })
      
      // Send notification to user
      const notificationTitle = status === 'APPROVED' ? 'KYC Approved' : 'KYC Review Required'
      const notificationMessage = status === 'APPROVED' 
        ? 'Congratulations! Your KYC documents have been approved. Your account trust level has been increased.'
        : `Your KYC documents require attention. ${reason || 'Please contact support for more information.'}`
      
      await NotificationService.sendNotification(
        submission.userId,
        'ALL',
        notificationTitle,
        notificationMessage,
        {
          submissionId,
          status,
          reason,
          reviewedAt: updatedSubmission.reviewedAt
        }
      )
      
      return {
        success: true,
        message: `KYC submission ${status.toLowerCase()} successfully`,
        submission: updatedSubmission
      }
    } catch (error) {
      console.error('Review KYC submission error:', error)
      throw error
    }
  }
  
  // Get KYC submission details
  static async getKycSubmission(submissionId: string): Promise<any> {
    try {
      const submission = await prisma.kycSubmission.findUnique({
        where: { id: submissionId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              trustLevel: true,
              status: true
            }
          },
          documents: {
            select: {
              id: true,
              documentType: true,
              documentNumber: true,
              documentUrl: true,
              fileName: true,
              fileSize: true,
              mimeType: true,
              checksum: true,
              status: true,
              submittedAt: true,
              reviewedAt: true
            }
          },
          reviewer: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        }
      })
      
      if (!submission) {
        throw new Error('KYC submission not found')
      }
      
      return submission
    } catch (error) {
      console.error('Get KYC submission error:', error)
      throw error
    }
  }
  
  // Get user KYC status
  static async getUserKycStatus(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          trustLevel: true,
          registrationStage: true,
          kycSubmissions: {
            select: {
              id: true,
              status: true,
              submittedAt: true,
              reviewedAt: true,
              reason: true,
              notes: true,
              documents: {
                select: {
                  id: true,
                  documentType: true,
                  status: true
                }
              }
            },
            orderBy: { submittedAt: 'desc' },
            take: 1
          }
        }
      })
      
      if (!user) {
        throw new Error('User not found')
      }
      
      const latestSubmission = user.kycSubmissions[0]
      
      return {
        userId: user.id,
        trustLevel: user.trustLevel,
        registrationStage: user.registrationStage,
        latestSubmission: latestSubmission ? {
          id: latestSubmission.id,
          status: latestSubmission.status,
          submittedAt: latestSubmission.submittedAt,
          reviewedAt: latestSubmission.reviewedAt,
          reason: latestSubmission.reason,
          notes: latestSubmission.notes,
          documentCount: latestSubmission.documents.length,
          documentTypes: latestSubmission.documents.map(d => d.documentType)
        } : null,
        canSubmit: !latestSubmission || latestSubmission.status === 'REJECTED',
        requiredDocuments: this.getRequiredDocuments(user.trustLevel)
      }
    } catch (error) {
      console.error('Get user KYC status error:', error)
      throw error
    }
  }
  
  // Get all KYC submissions (for admin)
  static async getKycSubmissions(
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<any> {
    try {
      const whereClause = this.buildKycWhereClause(filters)
      
      const [submissions, totalCount] = await Promise.all([
        prisma.kycSubmission.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                trustLevel: true
              }
            },
            documents: {
              select: {
                id: true,
                documentType: true,
                status: true
              }
            },
            reviewer: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        
        prisma.kycSubmission.count({ where: whereClause })
      ])
      
      return {
        submissions,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      }
    } catch (error) {
      console.error('Get KYC submissions error:', error)
      throw error
    }
  }
  
  // Upload document
  static async uploadDocument(
    userId: string,
    documentType: string,
    documentData: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<any> {
    try {
      // Validate document type
      const allowedTypes = this.getAllowedDocumentTypes()
      if (!allowedTypes.includes(documentType)) {
        throw new Error(`Document type ${documentType} is not allowed`)
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (documentData.length > maxSize) {
        throw new Error('File size exceeds maximum allowed size of 10MB')
      }
      
      // Generate checksum
      const checksum = crypto.createHash('sha256').update(documentData).digest('hex')
      
      // Store document (in a real implementation, this would be stored in cloud storage)
      const documentUrl = await this.storeDocument(documentData, fileName, checksum)
      
      // Create document record
      const document = await prisma.kycDocument.create({
        data: {
          userId,
          documentType,
          documentUrl,
          fileName,
          fileSize: documentData.length,
          mimeType,
          checksum,
          extractedAt: new Date(),
          status: 'PENDING'
        }
      })
      
      return {
        success: true,
        document: {
          id: document.id,
          documentType,
          documentUrl,
          fileName,
          fileSize: documentData.length,
          checksum
        }
      }
    } catch (error) {
      console.error('Upload document error:', error)
      throw error
    }
  }
  
  // Verify document
  static async verifyDocument(
    documentId: string,
    isValid: boolean,
    reason?: string
  ): Promise<any> {
    try {
      const document = await prisma.kycDocument.findUnique({
        where: { id: documentId }
      })
      
      if (!document) {
        throw new Error('Document not found')
      }
      
      const updatedDocument = await prisma.kycDocument.update({
        where: { id: documentId },
        data: {
          status: isValid ? 'VERIFIED' : 'REJECTED',
          reason,
          verifiedAt: new Date()
        }
      })
      
      return {
        success: true,
        document: updatedDocument
      }
    } catch (error) {
      console.error('Verify document error:', error)
      throw error
    }
  }
  
  // Helper methods
  private static generateChecksum(documentUrl: string): string {
    return crypto.createHash('sha256').update(documentUrl).digest('hex')
  }
  
  private static async notifyAdminsOfNewSubmission(submission: any, user: any): Promise<void> {
    try {
      const adminUsers = await prisma.user.findMany({
        where: {
          roles: { has: 'ADMIN' },
          status: 'ACTIVE'
        },
        select: {
          id: true,
          fullName: true,
          email: true
        }
      })
      
      for (const admin of adminUsers) {
        await NotificationService.sendNotification(
          admin.id,
          'EMAIL',
          'New KYC Submission',
          `User ${user.fullName} (${user.email}) has submitted KYC documents for review.`,
          {
            submissionId: submission.id,
            userId: user.id,
            userName: user.fullName,
            userEmail: user.email,
            submittedAt: submission.submittedAt
          }
        )
      }
    } catch (error) {
      console.error('Notify admins of new submission error:', error)
    }
  }
  
  private static buildKycWhereClause(filters: any): any {
    const whereClause: any = {}
    
    if (filters.status) {
      whereClause.status = filters.status
    }
    
    if (filters.userId) {
      whereClause.userId = filters.userId
    }
    
    if (filters.dateFrom) {
      whereClause.submittedAt = { gte: new Date(filters.dateFrom) }
    }
    
    if (filters.dateTo) {
      whereClause.submittedAt = { 
        ...whereClause.submittedAt,
        lte: new Date(filters.dateTo) 
      }
    }
    
    if (filters.search) {
      whereClause.user = {
        OR: [
          { fullName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ]
      }
    }
    
    return whereClause
  }
  
  private static getRequiredDocuments(trustLevel: number): string[] {
    switch (trustLevel) {
      case 0:
      case 1:
        return ['NATIONAL_ID', 'PROOF_OF_ADDRESS', 'SELFIE']
      case 2:
        return ['NATIONAL_ID', 'PROOF_OF_ADDRESS', 'SELFIE']
      case 3:
        return [] // KYC already completed
      default:
        return ['NATIONAL_ID', 'PROOF_OF_ADDRESS', 'SELFIE']
    }
  }
  
  private static getAllowedDocumentTypes(): string[] {
    return [
      'NATIONAL_ID',
      'PASSPORT',
      'DRIVERS_LICENSE',
      'PROOF_OF_ADDRESS',
      'UTILITY_BILL',
      'BANK_STATEMENT',
      'SELFIE',
      'BUSINESS_REGISTRATION',
      'TAX_CLEARANCE'
    ]
  }
  
  private static async storeDocument(
    documentData: Buffer,
    fileName: string,
    checksum: string
  ): Promise<string> {
    // In a real implementation, this would upload to cloud storage
    // For now, return a mock URL
    const timestamp = Date.now()
    const extension = fileName.split('.').pop()
    return `https://storage.appex.co.zw/kyc/${checksum}_${timestamp}.${extension}`
  }
}
