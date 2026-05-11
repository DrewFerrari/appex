# Background Jobs Architecture

## 📋 Overview

The AppEx Affiliation Portal uses BullMQ with Redis for robust background job processing. This architecture ensures high reliability, scalability, and observability for asynchronous operations like email sending, PDF generation, commission calculations, and webhook processing.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Job Processing Layer                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Producers     │    │     Queue       │    │   Consumers     │ │
│  │                 │    │                 │    │                 │ │
│  │ • API Endpoints │    │ • Redis Store   │    │ • Job Workers   │ │
│  │ • Webhooks      │    │ • Job Queues    │    │ • Processors    │ │
│  │ • Scheduled     │    │ • Priorities    │    │ • Handlers      │ │
│  │   Tasks         │    │ • Retries       │    │ • Failover      │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Monitoring    │    │   Persistence   │    │   Scaling       │ │
│  │                 │    │                 │    │                 │ │
│  │ • Metrics       │    │ • Job Storage   │    │ • Horizontal    │ │
│  │ • Alerts        │    │ • Failed Jobs   │    │   Scaling       │ │
│  │ • Dashboards    │    │ • Completed     │    │ • Load Balancing│ │
│  │   (BullMQ GUI)  │    │   Jobs         │    │ • Worker Pools  │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔧 Queue Configuration

### Redis Connection Setup

```typescript
// src/queues/redis.ts
import Redis from 'ioredis'

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  keepAlive: 30000,
  family: 4,
  enableOfflineQueue: false,
}

export const createRedisConnection = () => {
  const redis = new Redis(redisConfig)
  
  redis.on('connect', () => {
    console.log('✅ Redis connected')
  })
  
  redis.on('error', (error) => {
    console.error('❌ Redis connection error:', error)
  })
  
  redis.on('close', () => {
    console.log('🔌 Redis connection closed')
  })
  
  return redis
}
```

### Queue Definitions

```typescript
// src/queues/queues.ts
import { Queue, QueueOptions } from 'bullmq'
import { createRedisConnection } from './redis'

const connection = createRedisConnection()

export interface JobData {
  [key: string]: any
}

export interface JobResult {
  success: boolean
  data?: any
  error?: string
}

// Queue configurations with specific settings for each job type
export const queueConfigs: Record<string, QueueOptions> = {
  'email-sending': {
    connection,
    defaultJobOptions: {
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 50,      // Keep last 50 failed jobs
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      delay: 0,
    },
  },
  
  'pdf-generation': {
    connection,
    defaultJobOptions: {
      removeOnComplete: 10,
      removeOnFail: 10,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  },
  
  'commission-calculation': {
    connection,
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 25,
      attempts: 1,
    },
  },
  
  'webhook-processing': {
    connection,
    defaultJobOptions: {
      removeOnComplete: 200,
      removeOnFail: 100,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  },
  
  'data-sync': {
    connection,
    defaultJobOptions: {
      removeOnComplete: 20,
      removeOnFail: 20,
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 10000,
      },
    },
  },
  
  'cleanup': {
    connection,
    defaultJobOptions: {
      removeOnComplete: 5,
      removeOnFail: 5,
      attempts: 1,
    },
  },
}

// Create queue instances
export const queues = {
  emailSending: new Queue('email-sending', queueConfigs['email-sending']),
  pdfGeneration: new Queue('pdf-generation', queueConfigs['pdf-generation']),
  commissionCalculation: new Queue('commission-calculation', queueConfigs['commission-calculation']),
  webhookProcessing: new Queue('webhook-processing', queueConfigs['webhook-processing']),
  dataSync: new Queue('data-sync', queueConfigs['data-sync']),
  cleanup: new Queue('cleanup', queueConfigs['cleanup']),
}
```

## 📧 Email Sending Jobs

### Email Queue Processor

```typescript
// src/queues/processors/email.processor.ts
import { Worker, Job } from 'bullmq'
import { EmailService } from '@/services/email.service'
import { createRedisConnection } from '../redis'

interface EmailJobData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
  priority?: 'high' | 'normal' | 'low'
}

export class EmailProcessor {
  private emailService: EmailService
  private worker: Worker

  constructor() {
    this.emailService = new EmailService()
    this.worker = new Worker(
      'email-sending',
      this.processEmailJob.bind(this),
      {
        connection: createRedisConnection(),
        concurrency: 10, // Process 10 emails concurrently
        limiter: {
          max: 100, // Max 100 emails per minute
          duration: 60000,
        },
      }
    )
    
    this.setupEventHandlers()
  }

  private async processEmailJob(job: Job<EmailJobData>): Promise<JobResult> {
    const { to, subject, template, data, priority } = job.data
    
    try {
      job.log(`Processing email job: ${subject} to ${to}`)
      
      // Validate email data
      if (!to || !subject || !template) {
        throw new Error('Missing required email fields')
      }
      
      // Send email
      const result = await this.emailService.sendTemplate({
        to,
        subject,
        template,
        data,
        priority,
      })
      
      job.log(`Email sent successfully: ${result.messageId}`)
      
      return {
        success: true,
        data: {
          messageId: result.messageId,
          provider: result.provider,
        },
      }
    } catch (error) {
      job.log(`Email sending failed: ${error.message}`)
      
      return {
        success: false,
        error: error.message,
      }
    }
  }

  private setupEventHandlers(): void {
    this.worker.on('completed', (job, result) => {
      console.log(`✅ Email job completed: ${job.id}`, result)
    })
    
    this.worker.on('failed', (job, error) => {
      console.error(`❌ Email job failed: ${job.id}`, error)
    })
    
    this.worker.on('error', (error) => {
      console.error('🔥 Email worker error:', error)
    })
  }

  async close(): Promise<void> {
    await this.worker.close()
  }
}

// Email job creators
export class EmailJobCreator {
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    await queues.emailSending.add(
      'welcome-email',
      {
        to: userEmail,
        subject: 'Welcome to AppEx Affiliation Portal',
        template: 'welcome',
        data: {
          userName,
          loginUrl: `${process.env.FRONTEND_URL}/login`,
        },
        priority: 'high',
      },
      {
        priority: 10, // High priority
        delay: 0,
      }
    )
  }

  static async sendVerificationEmail(email: string, code: string): Promise<void> {
    await queues.emailSending.add(
      'verification-email',
      {
        to: email,
        subject: 'Verify your email address',
        template: 'email-verification',
        data: {
          verificationCode: code,
          expiryMinutes: 10,
        },
        priority: 'high',
      },
      {
        priority: 10,
        delay: 0,
      }
    )
  }

  static async sendCommissionNotification(
    userEmail: string,
    amount: number,
    referralName: string
  ): Promise<void> {
    await queues.emailSending.add(
      'commission-notification',
      {
        to: userEmail,
        subject: 'New Commission Earned!',
        template: 'commission-earned',
        data: {
          amount,
          referralName,
          currency: 'USD',
        },
        priority: 'normal',
      },
      {
        priority: 5,
        delay: 0,
      }
    )
  }

  static async sendPayoutConfirmation(
    userEmail: string,
    amount: number,
    reference: string
  ): Promise<void> {
    await queues.emailSending.add(
      'payout-confirmation',
      {
        to: userEmail,
        subject: 'Payout Processed Successfully',
        template: 'payout-confirmation',
        data: {
          amount,
          reference,
          currency: 'USD',
        },
        priority: 'normal',
      },
      {
        priority: 5,
        delay: 0,
      }
    )
  }
}
```

## 📄 PDF Generation Jobs

### Certificate PDF Generation

```typescript
// src/queues/processors/pdf.processor.ts
import { Worker, Job } from 'bullmq'
import puppeteer from 'puppeteer'
import { CloudinaryService } from '@/services/cloudinary.service'
import { createRedisConnection } from '../redis'

interface PDFJobData {
  type: 'certificate' | 'report' | 'invoice'
  userId: string
  data: Record<string, any>
  template: string
  options?: {
    format?: 'A4' | 'Letter'
    landscape?: boolean
    printBackground?: boolean
  }
}

export class PDFProcessor {
  private cloudinaryService: CloudinaryService
  private worker: Worker

  constructor() {
    this.cloudinaryService = new CloudinaryService()
    this.worker = new Worker(
      'pdf-generation',
      this.processPDFJob.bind(this),
      {
        connection: createRedisConnection(),
        concurrency: 2, // Limited due to memory usage
        limiter: {
          max: 10, // Max 10 PDFs per minute
          duration: 60000,
        },
      }
    )
    
    this.setupEventHandlers()
  }

  private async processPDFJob(job: Job<PDFJobData>): Promise<JobResult> {
    const { type, userId, data, template, options = {} } = job.data
    
    let browser: puppeteer.Browser | null = null
    
    try {
      job.log(`Processing PDF job: ${type} for user ${userId}`)
      
      // Launch browser
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
        ],
      })
      
      const page = await browser.newPage()
      
      // Generate HTML content
      const html = await this.generateHTML(template, data, type)
      
      // Set content and wait for load
      await page.setContent(html, { waitUntil: 'networkidle0' })
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        landscape: options.landscape || false,
        printBackground: options.printBackground !== false,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      })
      
      // Upload to Cloudinary
      const fileName = `${type}-${userId}-${Date.now()}.pdf`
      const uploadResult = await this.cloudinaryService.uploadBuffer(pdfBuffer, {
        folder: 'documents',
        public_id: fileName,
        resource_type: 'raw',
      })
      
      job.log(`PDF generated and uploaded: ${uploadResult.secure_url}`)
      
      return {
        success: true,
        data: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          size: pdfBuffer.length,
        },
      }
    } catch (error) {
      job.log(`PDF generation failed: ${error.message}`)
      
      return {
        success: false,
        error: error.message,
      }
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }

  private async generateHTML(template: string, data: Record<string, any>, type: string): Promise<string> {
    // Template rendering logic
    switch (type) {
      case 'certificate':
        return this.generateCertificateHTML(data)
      case 'report':
        return this.generateReportHTML(data)
      case 'invoice':
        return this.generateInvoiceHTML(data)
      default:
        throw new Error(`Unknown PDF type: ${type}`)
    }
  }

  private generateCertificateHTML(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Certificate of Completion</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; }
          .certificate { 
            border: 10px solid #gold; 
            padding: 40px; 
            text-align: center; 
            max-width: 800px; 
            margin: 0 auto;
            background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          }
          .title { font-size: 36px; color: #2c3e50; margin-bottom: 20px; }
          .recipient { font-size: 28px; color: #34495e; margin: 30px 0; font-weight: bold; }
          .course { font-size: 20px; color: #7f8c8d; margin: 20px 0; }
          .date { font-size: 16px; color: #95a5a6; margin-top: 40px; }
          .signature { margin-top: 60px; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="title">Certificate of Completion</div>
          <div class="recipient">This is to certify that</div>
          <div class="recipient">${data.userName}</div>
          <div class="course">has successfully completed the course</div>
          <div class="course">${data.courseTitle}</div>
          <div class="date">on ${new Date(data.completionDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
          <div class="signature">Authorized Signature</div>
        </div>
      </body>
      </html>
    `
  }

  private generateReportHTML(data: any): string {
    // Report generation logic
    return `<html><body><h1>Report</h1></body></html>`
  }

  private generateInvoiceHTML(data: any): string {
    // Invoice generation logic
    return `<html><body><h1>Invoice</h1></body></html>`
  }

  private setupEventHandlers(): void {
    this.worker.on('completed', (job, result) => {
      console.log(`✅ PDF job completed: ${job.id}`, result)
    })
    
    this.worker.on('failed', (job, error) => {
      console.error(`❌ PDF job failed: ${job.id}`, error)
    })
    
    this.worker.on('error', (error) => {
      console.error('🔥 PDF worker error:', error)
    })
  }

  async close(): Promise<void> {
    await this.worker.close()
  }
}

// PDF job creators
export class PDFJobCreator {
  static async generateCertificate(
    userId: string,
    courseId: string,
    userName: string,
    courseTitle: string
  ): Promise<void> {
    await queues.pdfGeneration.add(
      'certificate-generation',
      {
        type: 'certificate',
        userId,
        data: {
          userName,
          courseTitle,
          completionDate: new Date().toISOString(),
          courseId,
        },
        template: 'certificate',
        options: {
          format: 'A4',
          landscape: false,
          printBackground: true,
        },
      },
      {
        priority: 5,
        delay: 0,
      }
    )
  }
}
```

## 💰 Commission Calculation Jobs

### Commission Processing

```typescript
// src/queues/processors/commission.processor.ts
import { Worker, Job } from 'bullmq'
import { CommissionService } from '@/services/commission.service'
import { AffiliateService } from '@/services/affiliate.service'
import { createRedisConnection } from '../redis'

interface CommissionJobData {
  type: 'calculate' | 'process' | 'batch'
  affiliateId?: string
  referralId?: string
  data?: Record<string, any>
}

export class CommissionProcessor {
  private commissionService: CommissionService
  private affiliateService: AffiliateService
  private worker: Worker

  constructor() {
    this.commissionService = new CommissionService()
    this.affiliateService = new AffiliateService()
    this.worker = new Worker(
      'commission-calculation',
      this.processCommissionJob.bind(this),
      {
        connection: createRedisConnection(),
        concurrency: 5,
      }
    )
    
    this.setupEventHandlers()
  }

  private async processCommissionJob(job: Job<CommissionJobData>): Promise<JobResult> {
    const { type, affiliateId, referralId, data } = job.data
    
    try {
      job.log(`Processing commission job: ${type}`)
      
      switch (type) {
        case 'calculate':
          return await this.calculateCommission(affiliateId!, referralId!, data!)
        
        case 'process':
          return await this.processCommission(affiliateId!, data!)
        
        case 'batch':
          return await this.batchCalculateCommissions(data!)
        
        default:
          throw new Error(`Unknown commission job type: ${type}`)
      }
    } catch (error) {
      job.log(`Commission job failed: ${error.message}`)
      
      return {
        success: false,
        error: error.message,
      }
    }
  }

  private async calculateCommission(
    affiliateId: string,
    referralId: string,
    data: { amount: number; productType: string }
  ): Promise<JobResult> {
    // Get affiliate details
    const affiliate = await this.affiliateService.findById(affiliateId)
    if (!affiliate) {
      throw new Error('Affiliate not found')
    }
    
    // Calculate commission based on tier and product
    const commissionData = await this.commissionService.calculateCommission(
      referralId,
      data.productType,
      data.amount,
      affiliate.tier,
      affiliate.commissionRate
    )
    
    // Create commission record
    const commission = await this.commissionService.createCommission({
      affiliateId,
      referralId,
      type: data.productType,
      amount: commissionData.amount,
      rate: commissionData.rate,
      status: 'pending',
      description: `Commission from ${data.productType} sale`,
    })
    
    // Update affiliate stats
    await this.affiliateService.updateStats(affiliateId, {
      totalEarned: affiliate.totalEarned + commissionData.amount,
      pendingPayments: affiliate.pendingPayments + commissionData.amount,
    })
    
    // Check for tier upgrade
    await this.affiliateService.checkTierUpgrade(affiliateId)
    
    job.log(`Commission calculated: $${commissionData.amount} for affiliate ${affiliateId}`)
    
    return {
      success: true,
      data: {
        commissionId: commission.id,
        amount: commissionData.amount,
        rate: commissionData.rate,
      },
    }
  }

  private async processCommission(affiliateId: string, data: { commissionIds: string[] }): Promise<JobResult> {
    const processedCommissions = []
    
    for (const commissionId of data.commissionIds) {
      const commission = await this.commissionService.findById(commissionId)
      if (!commission || commission.status !== 'pending') continue
      
      // Process commission (could involve additional validation)
      await this.commissionService.updateStatus(commissionId, 'approved')
      processedCommissions.push(commissionId)
    }
    
    job.log(`Processed ${processedCommissions.length} commissions for affiliate ${affiliateId}`)
    
    return {
      success: true,
      data: {
        processedCount: processedCommissions.length,
        commissionIds: processedCommissions,
      },
    }
  }

  private async batchCalculateCommissions(data: { referrals: any[] }): Promise<JobResult> {
    const results = []
    
    for (const referral of data.referrals) {
      try {
        await this.calculateCommission(
          referral.affiliateId,
          referral.id,
          {
            amount: referral.conversionValue,
            productType: referral.productType,
          }
        )
        results.push({ referralId: referral.id, success: true })
      } catch (error) {
        results.push({ 
          referralId: referral.id, 
          success: false, 
          error: error.message 
        })
      }
    }
    
    const successCount = results.filter(r => r.success).length
    job.log(`Batch calculation completed: ${successCount}/${results.length} successful`)
    
    return {
      success: true,
      data: {
        totalCount: results.length,
        successCount,
        results,
      },
    }
  }

  private setupEventHandlers(): void {
    this.worker.on('completed', (job, result) => {
      console.log(`✅ Commission job completed: ${job.id}`, result)
    })
    
    this.worker.on('failed', (job, error) => {
      console.error(`❌ Commission job failed: ${job.id}`, error)
    })
    
    this.worker.on('error', (error) => {
      console.error('🔥 Commission worker error:', error)
    })
  }

  async close(): Promise<void> {
    await this.worker.close()
  }
}
```

## 🪝 Webhook Processing Jobs

### Webhook Handler

```typescript
// src/queues/processors/webhook.processor.ts
import { Worker, Job } from 'bullmq'
import { WebhookService } from '@/services/webhook.service'
import { createRedisConnection } from '../redis'

interface WebhookJobData {
  source: 'paynow' | 'africas-talking' | 'custom'
  eventType: string
  payload: any
  signature?: string
  idempotencyKey?: string
}

export class WebhookProcessor {
  private webhookService: WebhookService
  private worker: Worker

  constructor() {
    this.webhookService = new WebhookService()
    this.worker = new Worker(
      'webhook-processing',
      this.processWebhookJob.bind(this),
      {
        connection: createRedisConnection(),
        concurrency: 20,
      }
    )
    
    this.setupEventHandlers()
  }

  private async processWebhookJob(job: Job<WebhookJobData>): Promise<JobResult> {
    const { source, eventType, payload, signature, idempotencyKey } = job.data
    
    try {
      job.log(`Processing webhook: ${source} - ${eventType}`)
      
      // Check idempotency
      if (idempotencyKey) {
        const isProcessed = await this.webhookService.checkIdempotency(idempotencyKey)
        if (isProcessed) {
          job.log(`Webhook already processed: ${idempotencyKey}`)
          return {
            success: true,
            data: { message: 'Already processed' },
          }
        }
      }
      
      // Verify signature
      if (signature) {
        const isValid = await this.webhookService.verifySignature(source, payload, signature)
        if (!isValid) {
          throw new Error('Invalid webhook signature')
        }
      }
      
      // Process webhook based on source and event type
      let result
      switch (source) {
        case 'paynow':
          result = await this.processPaynowWebhook(eventType, payload)
          break
        case 'africas-talking':
          result = await this.processAfricaTalkingWebhook(eventType, payload)
          break
        case 'custom':
          result = await this.processCustomWebhook(eventType, payload)
          break
        default:
          throw new Error(`Unknown webhook source: ${source}`)
      }
      
      // Mark as processed
      if (idempotencyKey) {
        await this.webhookService.markProcessed(idempotencyKey)
      }
      
      job.log(`Webhook processed successfully: ${source} - ${eventType}`)
      
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      job.log(`Webhook processing failed: ${error.message}`)
      
      return {
        success: false,
        error: error.message,
      }
    }
  }

  private async processPaynowWebhook(eventType: string, payload: any): Promise<any> {
    switch (eventType) {
      case 'payment.completed':
        return await this.handlePaymentCompleted(payload)
      case 'payment.failed':
        return await this.handlePaymentFailed(payload)
      default:
        throw new Error(`Unknown Paynow event: ${eventType}`)
    }
  }

  private async processAfricaTalkingWebhook(eventType: string, payload: any): Promise<any> {
    switch (eventType) {
      case 'sms.delivered':
        return await this.handleSMSDelivered(payload)
      case 'sms.failed':
        return await this.handleSMSFailed(payload)
      default:
        throw new Error(`Unknown Africa's Talking event: ${eventType}`)
    }
  }

  private async processCustomWebhook(eventType: string, payload: any): Promise<any> {
    // Custom webhook processing logic
    return { processed: true, eventType }
  }

  private async handlePaymentCompleted(payload: any): Promise<any> {
    // Update payment status, trigger commission calculation, etc.
    return { paymentId: payload.reference, status: 'completed' }
  }

  private async handlePaymentFailed(payload: any): Promise<any> {
    // Handle payment failure
    return { paymentId: payload.reference, status: 'failed' }
  }

  private async handleSMSDelivered(payload: any): Promise<any> {
    // Update SMS delivery status
    return { messageId: payload.id, status: 'delivered' }
  }

  private async handleSMSFailed(payload: any): Promise<any> {
    // Handle SMS delivery failure
    return { messageId: payload.id, status: 'failed' }
  }

  private setupEventHandlers(): void {
    this.worker.on('completed', (job, result) => {
      console.log(`✅ Webhook job completed: ${job.id}`, result)
    })
    
    this.worker.on('failed', (job, error) => {
      console.error(`❌ Webhook job failed: ${job.id}`, error)
    })
    
    this.worker.on('error', (error) => {
      console.error('🔥 Webhook worker error:', error)
    })
  }

  async close(): Promise<void> {
    await this.worker.close()
  }
}
```

## ⏰ Scheduled Jobs

### Cron Job Manager

```typescript
// src/queues/scheduler.ts
import { Queue, Job } from 'bullmq'
import { createRedisConnection } from './queues'

export class JobScheduler {
  private queues: Record<string, Queue>

  constructor() {
    this.queues = {
      cleanup: new Queue('cleanup', { connection: createRedisConnection() }),
      dataSync: new Queue('data-sync', { connection: createRedisConnection() }),
      reports: new Queue('reports', { connection: createRedisConnection() }),
    }
  }

  async startScheduledJobs(): Promise<void> {
    // Daily cleanup job at 2 AM UTC
    await this.scheduleJob('cleanup', 'daily-cleanup', '0 2 * * *', {
      type: 'daily',
      cleanupType: 'logs',
    })

    // Weekly data sync on Sunday at 3 AM UTC
    await this.scheduleJob('dataSync', 'weekly-sync', '0 3 * * 0', {
      type: 'weekly',
      syncType: 'analytics',
    })

    // Monthly commission report on 1st at 4 AM UTC
    await this.scheduleJob('reports', 'monthly-commission-report', '0 4 1 * *', {
      type: 'monthly',
      reportType: 'commission',
    })

    // Hourly cache refresh
    await this.scheduleJob('dataSync', 'cache-refresh', '0 * * * *', {
      type: 'hourly',
      syncType: 'cache',
    })

    // Daily affiliate tier recalculation
    await this.scheduleJob('dataSync', 'tier-recalculation', '0 5 * * *', {
      type: 'daily',
      syncType: 'tiers',
    })

    console.log('📅 Scheduled jobs started')
  }

  private async scheduleJob(
    queueName: string,
    jobName: string,
    cronExpression: string,
    data: any
  ): Promise<void> {
    const queue = this.queues[queueName]
    
    // Remove existing job with same name
    await queue.removeRepeatable(jobName, { every: cronExpression })
    
    // Add new repeatable job
    await queue.add(
      jobName,
      data,
      {
        repeat: { every: cronExpression },
        jobId: jobName,
      }
    )
    
    console.log(`📅 Scheduled job: ${jobName} with cron: ${cronExpression}`)
  }

  async stopScheduledJobs(): Promise<void> {
    for (const [queueName, queue] of Object.entries(this.queues)) {
      const repeatableJobs = await queue.getRepeatableJobs()
      
      for (const job of repeatableJobs) {
        await queue.removeRepeatable(job.key, job.opts)
      }
    }
    
    console.log('📅 Scheduled jobs stopped')
  }
}
```

### Cleanup Jobs

```typescript
// src/queues/processors/cleanup.processor.ts
import { Worker, Job } from 'bullmq'
import { DatabaseManager } from '@/lib/database'
import { createRedisConnection } from '../redis'

interface CleanupJobData {
  type: 'logs' | 'sessions' | 'temp-files' | 'jobs'
  olderThan?: number // days
}

export class CleanupProcessor {
  private db: DatabaseManager
  private worker: Worker

  constructor() {
    this.db = DatabaseManager.getInstance()
    this.worker = new Worker(
      'cleanup',
      this.processCleanupJob.bind(this),
      {
        connection: createRedisConnection(),
        concurrency: 1, // Run cleanup jobs sequentially
      }
    )
    
    this.setupEventHandlers()
  }

  private async processCleanupJob(job: Job<CleanupJobData>): Promise<JobResult> {
    const { type, olderThan = 30 } = job.data
    
    try {
      job.log(`Processing cleanup job: ${type}`)
      
      switch (type) {
        case 'logs':
          return await this.cleanupLogs(olderThan)
        case 'sessions':
          return await this.cleanupSessions(olderThan)
        case 'temp-files':
          return await this.cleanupTempFiles(olderThan)
        case 'jobs':
          return await this.cleanupOldJobs(olderThan)
        default:
          throw new Error(`Unknown cleanup type: ${type}`)
      }
    } catch (error) {
      job.log(`Cleanup job failed: ${error.message}`)
      
      return {
        success: false,
        error: error.message,
      }
    }
  }

  private async cleanupLogs(olderThan: number): Promise<JobResult> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThan)
    
    const result = await this.db.query(
      'DELETE FROM audit_logs WHERE timestamp < $1',
      [cutoffDate.toISOString()]
    )
    
    job.log(`Cleaned up ${result.rowCount} old log entries`)
    
    return {
      success: true,
      data: { deletedCount: result.rowCount },
    }
  }

  private async cleanupSessions(olderThan: number): Promise<JobResult> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThan)
    
    const result = await this.db.query(
      'DELETE FROM user_sessions WHERE created_at < $1 OR expires_at < $2',
      [cutoffDate.toISOString(), new Date().toISOString()]
    )
    
    job.log(`Cleaned up ${result.rowCount} old sessions`)
    
    return {
      success: true,
      data: { deletedCount: result.rowCount },
    }
  }

  private async cleanupTempFiles(olderThan: number): Promise<JobResult> {
    // Implementation for cleaning up temporary files
    // This would involve Cloudinary API calls or file system cleanup
    
    return {
      success: true,
      data: { deletedCount: 0 },
    }
  }

  private async cleanupOldJobs(olderThan: number): Promise<JobResult> {
    // BullMQ automatically handles job cleanup based on queue configuration
    // This job could be used for additional cleanup logic
    
    return {
      success: true,
      data: { message: 'Job cleanup handled by queue configuration' },
    }
  }

  private setupEventHandlers(): void {
    this.worker.on('completed', (job, result) => {
      console.log(`✅ Cleanup job completed: ${job.id}`, result)
    })
    
    this.worker.on('failed', (job, error) => {
      console.error(`❌ Cleanup job failed: ${job.id}`, error)
    })
    
    this.worker.on('error', (error) => {
      console.error('🔥 Cleanup worker error:', error)
    })
  }

  async close(): Promise<void> {
    await this.worker.close()
  }
}
```

## 📊 Monitoring & Observability

### Job Metrics

```typescript
// src/queues/monitoring.ts
import { Queue, Worker } from 'bullmq'
import { createRedisConnection } from './queues'

export class JobMonitor {
  private queues: Queue[]
  private workers: Worker[]

  constructor(queues: Queue[], workers: Worker[]) {
    this.queues = queues
    this.workers = workers
  }

  async getMetrics(): Promise<JobMetrics> {
    const queueMetrics = await Promise.all(
      this.queues.map(async queue => ({
        name: queue.name,
        waiting: await queue.getWaiting(),
        active: await queue.getActive(),
        completed: await queue.getCompleted(),
        failed: await queue.getFailed(),
        delayed: await queue.getDelayed(),
        paused: await queue.isPaused(),
      }))
    )

    const workerMetrics = this.workers.map(worker => ({
      name: worker.name,
      running: worker.isRunning(),
    }))

    return {
      queues: queueMetrics,
      workers: workerMetrics,
      timestamp: new Date().toISOString(),
    }
  }

  async getJobStats(queueName: string, jobId: string): Promise<JobStats | null> {
    const queue = this.queues.find(q => q.name === queueName)
    if (!queue) return null

    const job = await queue.getJob(jobId)
    if (!job) return null

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      opts: job.opts,
      progress: job.progress,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      returnvalue: job.returnvalue,
      attemptsMade: job.attemptsMade,
      timestamp: new Date().toISOString(),
    }
  }

  setupHealthChecks(): void {
    this.queues.forEach(queue => {
      queue.on('error', (error) => {
        console.error(`🔥 Queue ${queue.name} error:`, error)
        this.sendAlert({
          type: 'queue_error',
          queue: queue.name,
          error: error.message,
          timestamp: new Date().toISOString(),
        })
      })
    })

    this.workers.forEach(worker => {
      worker.on('error', (error) => {
        console.error(`🔥 Worker ${worker.name} error:`, error)
        this.sendAlert({
          type: 'worker_error',
          worker: worker.name,
          error: error.message,
          timestamp: new Date().toISOString(),
        })
      })
    })
  }

  private sendAlert(alert: any): void {
    // Send alert to monitoring system
    console.log('🚨 Alert:', alert)
  }
}

interface JobMetrics {
  queues: QueueMetric[]
  workers: WorkerMetric[]
  timestamp: string
}

interface QueueMetric {
  name: string
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
  paused: boolean
}

interface WorkerMetric {
  name: string
  running: boolean
}

interface JobStats {
  id: string
  name: string
  data: any
  opts: any
  progress: number
  processedOn: number | null
  finishedOn: number | null
  failedReason: string | null
  returnvalue: any
  attemptsMade: number
  timestamp: string
}
```

---

**Next**: [Admin Panel & RBAC](./admin-rbac.md) → Administrative interface documentation
