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

export interface PasswordResetData {
  email: string
}

export interface PasswordResetConfirmData {
  token: string
  email: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface EmailVerificationData {
  userId: string
  otp: string
}

export interface PhoneVerificationData {
  userId: string
  otp: string
}

export interface ResendVerificationData {
  userId: string
  type: 'EMAIL' | 'PHONE'
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

export interface DeviceInfo {
  browser: string
  version: string
  os: string
  deviceType: string
  trustScore: number
  isBot: boolean
  isMobile: boolean
  isTablet: boolean
}

export interface LocationData {
  ip: string
  country: string
  countryCode: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isProxy: boolean
  isVpn: boolean
}

export interface SecurityEvent {
  id: string
  userId?: string
  eventType: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  ipAddress?: string
  userAgent?: string
  deviceFingerprint?: string
  metadata?: any
  createdAt: Date
}

export interface TrustLevelInfo {
  currentLevel: number
  label: string
  nextLevel: number
  nextLevelLabel: string
  requirements: {
    current: Array<{
      type: string
      achieved: boolean
      description: string
    }>
    next: string[]
  }
  unlockedFeatures: string[]
  canUpgrade: boolean
}

export interface FeatureAccessResult {
  hasAccess: boolean
  reason?: string
  currentLevel?: number
  requiredLevel?: number | null
}
