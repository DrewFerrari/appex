export interface User {
  id: string
  email: string
  phone?: string
  fullName: string
  nationalId?: string
  idDocumentType?: 'NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE'
  businessName?: string
  businessType?: 'INDIVIDUAL' | 'SOLE_PROPRIETOR' | 'COMPANY'
  businessRegistrationNumber?: string
  referralCode: string
  referredBy?: string
  affiliateTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  roles: string[]
  trustLevel: number
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'PERMANENTLY_LOCKED'
  registrationStage: 'INITIATED' | 'EMAIL_VERIFIED' | 'PROFILE_SET' | 'KYC_SUBMITTED' | 'APPROVED' | 'ACTIVE' | 'REJECTED'
  emailVerified: boolean
  emailVerifiedAt?: Date
  phoneVerified: boolean
  phoneVerifiedAt?: Date
  mfaEnabled: boolean
  mfaSecret?: string
  passwordChangedAt: Date
  lastPasswordChange?: Date
  failedLoginAttempts: number
  lockedUntil?: Date
  lockReason?: string
  residentialAddress?: any
  preferredLanguage: string
  preferredCommunicationChannel: 'email' | 'sms' | 'whatsapp'
  termsAcceptedAt: Date
  privacyPolicyAcceptedAt: Date
  marketingConsent: boolean
  dataProcessingConsent: boolean
  oauthOnly: boolean
  lastLoginAt?: Date
  lastLoginIp?: string
  lastLoginDevice?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  refreshTokenJti: string
  deviceFingerprint: string
  deviceName?: string
  deviceType?: 'desktop' | 'mobile' | 'tablet'
  ipAddress: string
  userAgent?: string
  location?: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  isActive: boolean
  isTrusted: boolean
  oauthProvider?: string
  createdAt: Date
  lastUsedAt: Date
  expiresAt: Date
  revokedAt?: Date
  revokeReason?: string
}

export interface LoginCredentials {
  email: string
  password: string
  deviceName?: string
  deviceType?: 'desktop' | 'mobile' | 'tablet'
  rememberMe?: boolean
  otp?: string
}

export interface RegisterData {
  email: string
  phone: string
  fullName: string
  password: string
  confirmPassword: string
  nationalId: string
  referralCode?: string
  acceptTerms: boolean
  acceptPrivacyPolicy: boolean
  marketingConsent?: boolean
  preferredLanguage?: string
}

export interface MfaSetupData {
  method: 'TOTP' | 'SMS'
  phoneNumber?: string
}

export interface MfaVerificationData {
  sessionId: string
  code: string
  rememberDevice?: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshTokenJti: string
}

export interface LoginResult {
  user: User
  session: Session
  requiresMfa: boolean
  mfaSessionId?: string
  availableMethods?: string[]
  isNewDevice?: boolean
  suspiciousActivity?: boolean
}

export interface MfaResult {
  user: User
  session: Session
}

export interface CurrentSessionResult {
  user: User | null
  session: Session | null
}

export type AuthState = 
  | 'UNAUTHENTICATED'
  | 'AUTHENTICATING'
  | 'AUTHENTICATED'
  | 'MFA_REQUIRED'
  | 'SESSION_EXPIRED'
  | 'ERROR'
  | 'LOCKED'
  | 'SUSPENDED'

export interface DashboardData {
  user: User
  totalCommissions: number
  totalSales: number
  monthlyCommissions: number
  monthlySales: number
  totalReferrals: number
  recentReferrals: Referral[]
  activeSessions: number
  lastPayout?: Payout
  commissionRates: CommissionRates
  nextTier?: AffiliateTier
  stats: {
    averageCommission: number
    conversionRate: number
    topReferralSource: string
  }
}

export interface Referral {
  id: string
  referredEmail: string
  referredName: string
  businessName?: string
  status: 'PENDING' | 'CONTACTED' | 'INTERESTED' | 'CONVERTED' | 'NOT_INTERESTED'
  nextFollowUp: Date
  createdAt: Date
  convertedAt?: Date
  commissionEarned?: number
}

export interface Commission {
  id: string
  userId: string
  referralId?: string
  amount: number
  type: 'STANDARD' | 'BONUS' | 'RECURRING' | 'REFERRAL'
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED'
  earnedDate: Date
  confirmedDate?: Date
  paidDate?: Date
  payoutId?: string
  metadata?: any
}

export interface Payout {
  id: string
  userId: string
  amount: number
  method: 'BANK_TRANSFER' | 'ECOCASH' | 'PAYNOW' | 'MOBILE_MONEY'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  bankAccount?: {
    accountName: string
    accountNumber: string
    bankName: string
    branch?: string
  }
  mobileMoney?: {
    provider: string
    phoneNumber: string
    accountName: string
  }
  processingDate?: Date
  completedDate?: Date
  reference?: string
  notes?: string
  createdAt: Date
}

export interface CommissionRates {
  standard: number
  bonus: number
  recurring: number
  referral: number
}

export type AffiliateTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
  }
}
