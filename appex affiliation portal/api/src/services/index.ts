// Export all services from a single index file
export { AuthService } from './auth.service'
export { PasswordHashingService } from './password-hashing.service'
export { DeviceFingerprintService } from './device-fingerprint.service'
export { RateLimitingService } from './rate-limiting.service'
export { SecurityLoggingService } from './security-logging.service'
export { EmailService } from './email.service'
export { SMSService } from './sms.service'
export { AffiliateService } from './affiliate.service'

// Export types
export type {
  User,
  Session,
  LoginCredentials,
  RegisterData,
  AuthTokens,
  LoginResult,
  MfaSetupData,
  MfaVerificationData,
  MfaResult,
  PasswordResetData,
  PasswordResetConfirmData,
  ChangePasswordData,
  EmailVerificationData,
  PhoneVerificationData,
  ResendVerificationData,
  CurrentSessionResult,
  AuthState,
  DeviceInfo,
  LocationData,
  SecurityEvent,
  TrustLevelInfo,
  FeatureAccessResult
} from '../types/auth'
