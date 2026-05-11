# Security Hardening Guide

## 📋 Overview

This document outlines the comprehensive security measures implemented in the AppEx Affiliation Portal to protect against modern threats while maintaining compliance with Zimbabwean regulations including the Cyber and Data Protection Act and Reserve Bank of Zimbabwe (RBZ) guidelines.

## 🛡️ Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Security Layers                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Application   │    │   Network       │    │   Infrastructure│ │
│  │   Security      │    │   Security      │    │   Security      │ │
│  │                 │    │                 │    │                 │ │
│  │ • JWT Auth      │    │ • WAF Rules     │    │ • VPC Isolation │ │
│  │ • RBAC          │    │ • DDoS Protection│    │ • Firewalls     │ │
│  │ • Input Validation│   │ • SSL/TLS       │    │ • Access Control│ │
│  │ • Rate Limiting │    │ • CORS Policy   │    │ • Monitoring    │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Data Security │    │   Compliance     │    │   Monitoring    │ │
│  │                 │    │                 │    │                 │ │
│  │ • Encryption    │    │ • Cyber Act     │    │ • SIEM          │ │
│  │ • Hashing       │    │ • RBZ Guidelines │    │ • Alerting      │ │
│  │ • Key Management│    │ • GDPR-like     │    │ • Audit Trails  │ │
│  │ • Backup        │    │ • Data Privacy  │    │ • Forensics     │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication & Authorization

### Dual-Token JWT Implementation

```typescript
// src/lib/auth/jwt.ts
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

interface TokenPayload {
  userId: string
  email: string
  role: string
  familyId: string
  type: 'access' | 'refresh'
}

interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: {
    access: number
    refresh: number
  }
}

export class JWTService {
  private readonly accessSecret: string
  private readonly refreshSecret: string
  private readonly accessExpiry = 15 * 60 // 15 minutes
  private readonly refreshExpiry = 7 * 24 * 60 * 60 // 7 days
  
  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET!
    this.refreshSecret = process.env.JWT_REFRESH_SECRET!
  }
  
  generateTokenPair(user: User): TokenPair {
    const familyId = crypto.randomUUID()
    const now = Math.floor(Date.now() / 1000)
    
    const accessPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      familyId,
      type: 'access',
    }
    
    const refreshPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      familyId,
      type: 'refresh',
    }
    
    const accessToken = jwt.sign(accessPayload, this.accessSecret, {
      expiresIn: this.accessExpiry,
      issuer: 'appex-affiliation',
      audience: 'appex-users',
    })
    
    const refreshToken = jwt.sign(refreshPayload, this.refreshSecret, {
      expiresIn: this.refreshExpiry,
      issuer: 'appex-affiliation',
      audience: 'appex-users',
    })
    
    return {
      accessToken,
      refreshToken,
      expiresIn: {
        access: this.accessExpiry,
        refresh: this.refreshExpiry,
      },
    }
  }
  
  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessSecret, {
        issuer: 'appex-affiliation',
        audience: 'appex-users',
      }) as TokenPayload
      
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type')
      }
      
      return decoded
    } catch (error) {
      throw new Error('Invalid access token')
    }
  }
  
  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        issuer: 'appex-affiliation',
        audience: 'appex-users',
      }) as TokenPayload
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type')
      }
      
      return decoded
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }
  
  revokeTokenFamily(familyId: string): void {
    // Add family ID to revocation list
    // This is checked during token verification
    TokenRevocationService.addFamilyToRevocationList(familyId)
  }
}
```

### Role-Based Access Control (RBAC)

```typescript
// src/lib/auth/rbac.ts
export enum Role {
  AFFILIATE = 'affiliate',
  TRAINER = 'trainer',
  RESELLER = 'reseller',
  SUPER_AFFILIATE = 'super_affiliate',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum Permission {
  // User permissions
  READ_OWN_PROFILE = 'read_own_profile',
  UPDATE_OWN_PROFILE = 'update_own_profile',
  
  // Referral permissions
  CREATE_REFERRAL = 'create_referral',
  READ_OWN_REFERRALS = 'read_own_referrals',
  UPDATE_OWN_REFERRALS = 'update_own_referrals',
  
  // Commission permissions
  READ_OWN_COMMISSIONS = 'read_own_commissions',
  REQUEST_PAYOUT = 'request_payout',
  
  // Training permissions
  ACCESS_TRAINING = 'access_training',
  DOWNLOAD_CERTIFICATES = 'download_certificates',
  
  // Admin permissions
  READ_ALL_USERS = 'read_all_users',
  MANAGE_USERS = 'manage_users',
  READ_ALL_REFERRALS = 'read_all_referrals',
  APPROVE_COMMISSIONS = 'approve_commissions',
  PROCESS_PAYOUTS = 'process_payouts',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SYSTEM = 'manage_system',
  
  // Super admin permissions
  MANAGE_ADMINS = 'manage_admins',
  SYSTEM_CONFIG = 'system_config',
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.AFFILIATE]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.READ_OWN_COMMISSIONS,
    Permission.REQUEST_PAYOUT,
  ],
  
  [Role.TRAINER]: [
    ...ROLE_PERMISSIONS[Role.AFFILIATE],
    Permission.CREATE_REFERRAL,
    Permission.READ_OWN_REFERRALS,
    Permission.UPDATE_OWN_REFERRALS,
    Permission.ACCESS_TRAINING,
    Permission.DOWNLOAD_CERTIFICATES,
  ],
  
  [Role.RESELLER]: [
    ...ROLE_PERMISSIONS[Role.AFFILIATE],
    Permission.CREATE_REFERRAL,
    Permission.READ_OWN_REFERRALS,
    Permission.UPDATE_OWN_REFERRALS,
    Permission.ACCESS_TRAINING,
  ],
  
  [Role.SUPER_AFFILIATE]: [
    ...ROLE_PERMISSIONS[Role.TRAINER],
    Permission.VIEW_ANALYTICS,
  ],
  
  [Role.ADMIN]: [
    ...ROLE_PERMISSIONS[Role.SUPER_AFFILIATE],
    Permission.READ_ALL_USERS,
    Permission.MANAGE_USERS,
    Permission.READ_ALL_REFERRALS,
    Permission.APPROVE_COMMISSIONS,
    Permission.PROCESS_PAYOUTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SYSTEM,
  ],
  
  [Role.SUPER_ADMIN]: [
    ...ROLE_PERMISSIONS[Role.ADMIN],
    Permission.MANAGE_ADMINS,
    Permission.SYSTEM_CONFIG,
  ],
}

export class RBACService {
  static hasPermission(userRole: Role, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[userRole] || []
    return permissions.includes(permission)
  }
  
  static hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission))
  }
  
  static hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission))
  }
  
  static getPermissions(userRole: Role): Permission[] {
    return ROLE_PERMISSIONS[userRole] || []
  }
}
```

### Authorization Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { JWTService } from '@/lib/auth/jwt'
import { RBACService, Permission } from '@/lib/auth/rbac'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
    familyId: string
  }
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
    }
    
    const token = authHeader.substring(7)
    const jwtService = new JWTService()
    const payload = jwtService.verifyAccessToken(token)
    
    // Check if token family is revoked
    if (await TokenRevocationService.isFamilyRevoked(payload.familyId)) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REVOKED',
          message: 'Token has been revoked',
        },
      })
    }
    
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      familyId: payload.familyId,
    }
    
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      },
    })
  }
}

export const authorize = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
    }
    
    if (!RBACService.hasPermission(req.user.role as any, permission)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      })
    }
    
    next()
  }
}
```

## 🔒 Data Protection

### Encryption at Rest

```typescript
// src/lib/encryption/field-encryption.ts
import crypto from 'crypto'

export class FieldEncryption {
  private readonly algorithm = 'aes-256-gcm'
  private readonly secretKey: Buffer
  
  constructor() {
    const key = process.env.ENCRYPTION_KEY
    if (!key || key.length !== 64) {
      throw new Error('Invalid encryption key')
    }
    this.secretKey = Buffer.from(key, 'hex')
  }
  
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, this.secretKey, iv)
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }
  
  decrypt(encryptedData: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':')
    
    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted data format')
    }
    
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
}

// Usage in database models
export class AffiliateModel {
  private encryption = new FieldEncryption()
  
  async create(data: CreateAffiliateDto): Promise<Affiliate> {
    const encryptedData = {
      ...data,
      // Encrypt sensitive fields
      accountNumber: data.accountNumber 
        ? this.encryption.encrypt(data.accountNumber)
        : null,
      bankName: data.bankName 
        ? this.encryption.encrypt(data.bankName)
        : null,
    }
    
    return await this.database.create(encryptedData)
  }
  
  async findById(id: string): Promise<Affiliate | null> {
    const affiliate = await this.database.findById(id)
    
    if (affiliate) {
      // Decrypt sensitive fields
      return {
        ...affiliate,
        accountNumber: affiliate.accountNumber 
          ? this.encryption.decrypt(affiliate.accountNumber)
          : null,
        bankName: affiliate.bankName 
          ? this.encryption.decrypt(affiliate.bankName)
          : null,
      }
    }
    
    return null
  }
}
```

### Secure Password Hashing

```typescript
// src/lib/auth/password.ts
import bcrypt from 'bcrypt'

export class PasswordService {
  private readonly saltRounds = 12
  
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
  
  validateStrength(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    // Check for common passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin']
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
```

## 🌐 Network Security

### CORS Configuration

```typescript
// src/middleware/cors.ts
import cors from 'cors'

const allowedOrigins = [
  'https://appexaffiliation.com',
  'https://www.appexaffiliation.com',
  'https://admin.appexaffiliation.com',
  'http://localhost:3000',
  'http://localhost:5173',
]

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
})
```

### Rate Limiting

```typescript
// src/middleware/rate-limiting.ts
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export const createRateLimit = (options: {
  windowMs: number
  max: number
  message: string
  skipSuccessfulRequests?: boolean
}) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMITED',
        message: options.message,
      },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    keyGenerator: (req) => {
      return `rate_limit:${req.ip}:${req.path}`
    },
  })
}

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again later',
})

export const generalRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests, please try again later',
})

export const uploadRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many upload attempts, please try again later',
})
```

### Security Headers

```typescript
// src/middleware/security-headers.ts
import helmet from 'helmet'

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "https://cdn.appexaffiliation.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.appexaffiliation.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
})
```

## 🔍 Input Validation & Sanitization

### Zod Schema Validation

```typescript
// src/schemas/validation.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const createReferralSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^\+263\d{9}$/, 'Invalid Zimbabwe phone number'),
  businessName: z.string()
    .min(1, 'Business name is required')
    .max(200, 'Business name too long'),
  productInterest: z.enum(['pos', 'inventory', 'payroll', 'all']),
  notes: z.string()
    .max(500, 'Notes too long')
    .optional(),
})

export const payoutRequestSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .min(10, 'Minimum payout amount is $10')
    .max(10000, 'Maximum payout amount is $10,000'),
  method: z.enum(['ecocash', 'bank_transfer', 'mobile_money']),
  accountNumber: z.string()
    .min(1, 'Account number is required')
    .max(50, 'Account number too long'),
  accountName: z.string()
    .min(1, 'Account name is required')
    .max(255, 'Account name too long'),
  bankName: z.string()
    .max(100, 'Bank name too long')
    .optional(),
})

// Validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        })
      }
      next(error)
    }
  }
}
```

### SQL Injection Prevention

```typescript
// src/lib/database/query-builder.ts
export class QueryBuilder {
  private query: string = ''
  private params: any[] = []
  
  select(columns: string[]): this {
    this.query = `SELECT ${columns.join(', ')}`
    return this
  }
  
  from(table: string): this {
    this.query += ` FROM ${this.escapeIdentifier(table)}`
    return this
  }
  
  where(conditions: Record<string, any>): this {
    const whereClauses: string[] = []
    
    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined && value !== null) {
        whereClauses.push(`${this.escapeIdentifier(key)} = $${this.params.length + 1}`)
        this.params.push(value)
      }
    }
    
    if (whereClauses.length > 0) {
      this.query += ` WHERE ${whereClauses.join(' AND ')}`
    }
    
    return this
  }
  
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.query += ` ORDER BY ${this.escapeIdentifier(column)} ${direction}`
    return this
  }
  
  limit(count: number): this {
    this.query += ` LIMIT $${this.params.length + 1}`
    this.params.push(count)
    return this
  }
  
  offset(count: number): this {
    this.query += ` OFFSET $${this.params.length + 1}`
    this.params.push(count)
    return this
  }
  
  private escapeIdentifier(identifier: string): string {
    // Only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error('Invalid identifier')
    }
    return `"${identifier}"`
  }
  
  build(): { query: string; params: any[] } {
    return {
      query: this.query,
      params: [...this.params],
    }
  }
}

// Usage example
export class AffiliateRepository {
  async findByFilters(filters: {
    status?: string
    affiliateType?: string
    limit?: number
    offset?: number
  }): Promise<Affiliate[]> {
    const builder = new QueryBuilder()
      .select(['id', 'affiliate_code', 'first_name', 'last_name', 'status'])
      .from('affiliates')
    
    if (filters.status) {
      builder.where({ status: filters.status })
    }
    
    if (filters.affiliateType) {
      builder.where({ affiliate_type: filters.affiliateType })
    }
    
    if (filters.limit) {
      builder.limit(filters.limit)
    }
    
    if (filters.offset) {
      builder.offset(filters.offset)
    }
    
    const { query, params } = builder.build()
    return await this.database.query(query, params)
  }
}
```

## 🔐 Webhook Security

### HMAC Signature Verification

```typescript
// src/lib/webhooks/verification.ts
import crypto from 'crypto'
import { Request, Response, NextFunction } from 'express'

export class WebhookVerification {
  private readonly secret: string
  
  constructor() {
    this.secret = process.env.PAYNOW_WEBHOOK_SECRET!
  }
  
  verifySignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }
  
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const signature = req.headers['x-paynow-signature'] as string
      
      if (!signature) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'WEBHOOK_MISSING_SIGNATURE',
            message: 'Webhook signature is required',
          },
        })
      }
      
      const payload = JSON.stringify(req.body)
      
      if (!this.verifySignature(payload, signature)) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'WEBHOOK_INVALID_SIGNATURE',
            message: 'Invalid webhook signature',
          },
        })
      }
      
      next()
    }
  }
  
  // Idempotency check to prevent duplicate processing
  async checkIdempotency(idempotencyKey: string): Promise<boolean> {
    const existing = await this.redis.get(`webhook:${idempotencyKey}`)
    return existing !== null
  }
  
  async markProcessed(idempotencyKey: string, ttl: number = 3600): Promise<void> {
    await this.redis.setex(`webhook:${idempotencyKey}`, ttl, 'processed')
  }
}
```

## 📊 Monitoring & Logging

### Security Event Logging

```typescript
// src/lib/security/audit-logger.ts
export class SecurityAuditLogger {
  private static instance: SecurityAuditLogger
  
  static getInstance(): SecurityAuditLogger {
    if (!this.instance) {
      this.instance = new SecurityAuditLogger()
    }
    return this.instance
  }
  
  logSecurityEvent(event: {
    type: 'login_success' | 'login_failure' | 'permission_denied' | 'suspicious_activity'
    userId?: string
    email?: string
    ip: string
    userAgent?: string
    details?: Record<string, any>
    severity: 'low' | 'medium' | 'high' | 'critical'
  }): void {
    const auditLog = {
      timestamp: new Date().toISOString(),
      eventType: `security_${event.type}`,
      userId: event.userId,
      email: event.email,
      ipAddress: event.ip,
      userAgent: event.userAgent,
      details: event.details,
      severity: event.severity,
      sessionId: this.getCurrentSessionId(),
    }
    
    // Log to structured logging system
    console.log(JSON.stringify(auditLog))
    
    // Store in database for audit trail
    this.storeAuditLog(auditLog)
    
    // Trigger alerts for high-severity events
    if (event.severity === 'high' || event.severity === 'critical') {
      this.triggerSecurityAlert(auditLog)
    }
  }
  
  private async storeAuditLog(log: any): Promise<void> {
    try {
      await this.database.query(`
        INSERT INTO audit_logs (user_id, action, resource_type, ip_address, user_agent, details, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        log.userId,
        log.eventType,
        'security',
        log.ipAddress,
        log.userAgent,
        JSON.stringify(log.details),
        log.timestamp,
      ])
    } catch (error) {
      console.error('Failed to store audit log:', error)
    }
  }
  
  private triggerSecurityAlert(log: any): void {
    // Send to SIEM system
    // Send email to security team
    // Create incident in monitoring system
  }
  
  private getCurrentSessionId(): string | null {
    // Extract session ID from current context
    return null
  }
}
```

### Intrusion Detection

```typescript
// src/lib/security/intrusion-detection.ts
export class IntrusionDetection {
  private readonly suspiciousPatterns = [
    // SQL injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|SCRIPT)\b)/i,
    // XSS patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    // Path traversal
    /\.\.[\/\\]/,
    // Command injection
    /[;&|`$(){}[\]]/,
  ]
  
  detectSuspiciousActivity(req: Request): {
    isSuspicious: boolean
    patterns: string[]
    details: Record<string, any>
  } {
    const detectedPatterns: string[] = []
    const details: Record<string, any> = {}
    
    // Check URL parameters
    for (const [key, value] of Object.entries(req.query)) {
      const suspiciousPatterns = this.checkString(value as string)
      if (suspiciousPatterns.length > 0) {
        detectedPatterns.push(...suspiciousPatterns)
        details[`query_${key}`] = value
      }
    }
    
    // Check request body
    if (req.body && typeof req.body === 'object') {
      const bodyString = JSON.stringify(req.body)
      const suspiciousPatterns = this.checkString(bodyString)
      if (suspiciousPatterns.length > 0) {
        detectedPatterns.push(...suspiciousPatterns)
        details.body = req.body
      }
    }
    
    // Check for unusual request patterns
    const unusualPatterns = this.checkUnusualPatterns(req)
    if (unusualPatterns.length > 0) {
      detectedPatterns.push(...unusualPatterns)
    }
    
    return {
      isSuspicious: detectedPatterns.length > 0,
      patterns: [...new Set(detectedPatterns)],
      details,
    }
  }
  
  private checkString(input: string): string[] {
    const patterns: string[] = []
    
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        patterns.push(pattern.source)
      }
    }
    
    return patterns
  }
  
  private checkUnusualPatterns(req: Request): string[] {
    const patterns: string[] []
    
    // Check for too many parameters
    const paramCount = Object.keys(req.query).length + Object.keys(req.body).length
    if (paramCount > 50) {
      patterns.push('too_many_parameters')
    }
    
    // Check for unusually long parameter values
    for (const [key, value] of Object.entries(req.query)) {
      if (value && value.length > 1000) {
        patterns.push('long_parameter_value')
        break
      }
    }
    
    // Check for missing required headers
    if (!req.headers['user-agent']) {
      patterns.push('missing_user_agent')
    }
    
    return patterns
  }
}
```

## 🇿🇼 Zimbabwe Compliance

### Cyber and Data Protection Act Compliance

```typescript
// src/lib/compliance/zimbabwe-cyber-act.ts
export class ZimbabweCyberActCompliance {
  // Data subject rights implementation
  async getDataSubjectRequest(userId: string, requestType: 'access' | 'deletion'): Promise<any> {
    switch (requestType) {
      case 'access':
        return await this.exportUserData(userId)
      case 'deletion':
        return await this.deleteUserData(userId)
      default:
        throw new Error('Invalid request type')
    }
  }
  
  private async exportUserData(userId: string): Promise<any> {
    // Collect all user data
    const [user, affiliate, referrals, commissions, payouts] = await Promise.all([
      this.usersRepository.findById(userId),
      this.affiliatesRepository.findByUserId(userId),
      this.referralsRepository.findByAffiliateId(userId),
      this.commissionsRepository.findByAffiliateId(userId),
      this.payoutsRepository.findByAffiliateId(userId),
    ])
    
    return {
      personalData: user,
      affiliateData: affiliate,
      activityData: {
        referrals,
        commissions,
        payouts,
      },
      exportDate: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    }
  }
  
  private async deleteUserData(userId: string): Promise<void> {
    // Implement right to be forgotten
    // Anonymize data instead of hard delete for audit purposes
    await this.usersRepository.anonymize(userId)
    await this.affiliatesRepository.anonymize(userId)
    
    // Log deletion for compliance
    await this.auditLogger.log({
      action: 'data_deletion',
      userId,
      timestamp: new Date().toISOString(),
      reason: 'data_subject_request',
    })
  }
  
  // Data breach notification
  async notifyDataBreach(breach: {
    affectedUsers: string[]
    dataTypes: string[]
    discoveryDate: Date
    containmentDate?: Date
    description: string
  }): Promise<void> {
    // Notify affected users within 72 hours
    for (const userId of breach.affectedUsers) {
      await this.notificationService.sendDataBreachNotification(userId, {
        breachType: breach.dataTypes.join(', '),
        discoveryDate: breach.discoveryDate,
        protectiveMeasures: 'We have implemented additional security measures',
      })
    }
    
    // Report to regulatory authority if required
    if (breach.affectedUsers.length > 100) {
      await this.reportToRegulatoryAuthority(breach)
    }
  }
}
```

### RBZ Payment Processing Compliance

```typescript
// src/lib/compliance/rbz-compliance.ts
export class RBZCompliance {
  // Transaction monitoring
  async monitorTransaction(transaction: {
    amount: number
    userId: string
    method: string
    recipientAccount: string
  }): Promise<{
    isSuspicious: boolean
    riskScore: number
    alerts: string[]
  }> {
    const alerts: string[] = []
    let riskScore = 0
    
    // Check against transaction limits
    if (transaction.amount > 10000) {
      alerts.push('high_value_transaction')
      riskScore += 30
    }
    
    // Check frequency
    const recentTransactions = await this.getRecentTransactions(transaction.userId, 24)
    if (recentTransactions.length > 10) {
      alerts.push('high_frequency_transactions')
      riskScore += 20
    }
    
    // Check for unusual patterns
    const usualAmount = await this.getUsualTransactionAmount(transaction.userId)
    if (transaction.amount > usualAmount * 5) {
      alerts.push('unusual_amount')
      riskScore += 25
    }
    
    // Check recipient account
    const isHighRiskRecipient = await this.checkHighRiskRecipient(transaction.recipientAccount)
    if (isHighRiskRecipient) {
      alerts.push('high_risk_recipient')
      riskScore += 40
    }
    
    return {
      isSuspicious: riskScore > 50,
      riskScore,
      alerts,
    }
  }
  
  // AML/KYC verification
  async verifyCustomer(userId: string): Promise<{
    isVerified: boolean
    verificationLevel: 'basic' | 'enhanced' | 'full'
    missingDocuments: string[]
  }> {
    const user = await this.usersRepository.findById(userId)
    const documents = await this.documentsRepository.findByUserId(userId)
    
    const requiredDocuments = ['id_document', 'proof_of_address', 'business_registration']
    const missingDocuments = requiredDocuments.filter(doc => 
      !documents.find(d => d.type === doc && d.status === 'verified')
    )
    
    let verificationLevel: 'basic' | 'enhanced' | 'full' = 'basic'
    
    if (missingDocuments.length === 0) {
      verificationLevel = 'full'
    } else if (missingDocuments.length <= 1) {
      verificationLevel = 'enhanced'
    }
    
    return {
      isVerified: missingDocuments.length === 0,
      verificationLevel,
      missingDocuments,
    }
  }
}
```

## 🔄 Security Monitoring

### Real-time Threat Detection

```typescript
// src/lib/security/threat-detection.ts
export class ThreatDetection {
  private readonly threatIndicators = {
    // Brute force attack indicators
    bruteForce: {
      threshold: 5, // failed attempts
      window: 300, // 5 minutes
      action: 'block_ip',
    },
    // Credential stuffing indicators
    credentialStuffing: {
      threshold: 10, // failed logins across accounts
      window: 600, // 10 minutes
      action: 'block_ip',
    },
    // DDoS indicators
    ddos: {
      threshold: 1000, // requests per minute
      window: 60, // 1 minute
      action: 'rate_limit',
    },
  }
  
  async analyzeRequest(req: Request): Promise<{
    threats: string[]
    actions: string[]
    riskScore: number
  }> {
    const threats: string[] = []
    const actions: string[] = []
    let riskScore = 0
    
    // Check for brute force
    const bruteForceThreat = await this.checkBruteForce(req.ip)
    if (bruteForceThreat detected) {
      threats.push('brute_force')
      actions.push('block_ip')
      riskScore += 40
    }
    
    // Check for credential stuffing
    const credentialStuffingThreat = await this.checkCredentialStuffing(req.ip)
    if (credentialStuffingThreat) {
      threats.push('credential_stuffing')
      actions.push('block_ip')
      riskScore += 50
    }
    
    // Check for DDoS
    const ddosThreat = await this.checkDDoS(req.ip)
    if (ddosThreat) {
      threats.push('ddos')
      actions.push('rate_limit')
      riskScore += 30
    }
    
    return { threats, actions, riskScore }
  }
  
  private async checkBruteForce(ip: string): Promise<boolean> {
    const failedAttempts = await this.redis.get(`failed_attempts:${ip}`)
    return parseInt(failedAttempts || '0') >= this.threatIndicators.bruteForce.threshold
  }
  
  private async checkCredentialStuffing(ip: string): Promise<boolean> {
    const key = `credential_stuffing:${ip}`
    const attempts = await this.redis.incr(key)
    await this.redis.expire(key, this.threatIndicators.credentialStuffing.window)
    
    return attempts >= this.threatIndicators.credentialStuffing.threshold
  }
  
  private async checkDDoS(ip: string): Promise<boolean> {
    const key = `request_rate:${ip}`
    const requests = await this.redis.incr(key)
    await this.redis.expire(key, this.threatIndicators.ddos.window)
    
    return requests >= this.threatIndicators.ddos.threshold
  }
}
```

---

**Next**: [Testing Strategy](../engineering/testing.md) → Comprehensive testing approach documentation
