# Authentication API Reference

## 📋 Overview

This document provides a comprehensive reference for all authentication-related API endpoints in the AppEx Affiliation Portal. All endpoints follow RESTful conventions and include detailed request/response schemas, authentication requirements, and error handling.

## 🔐 Authentication

### Base URL
```
https://api.appex.co.zw/auth
```

### Authentication Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
X-Device-Fingerprint: <device_fingerprint>
```

### Rate Limiting
- **Public endpoints**: 10 requests per minute per IP
- **Protected endpoints**: 100 requests per minute per user
- **Sensitive operations**: 5 requests per minute per user

---

## 📝 Registration Endpoints

### Register New User

```http
POST /auth/register
```

**Description**: Initiates user registration with email and phone verification.

**Authentication**: None (public endpoint)

**Request Body**:
```json
{
  "email": "user@example.co.zw",
  "phone": "0771234567",
  "fullName": "John Doe",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "nationalId": "631234567K",
  "referralCode": "ABC12345",
  "acceptTerms": true,
  "acceptPrivacyPolicy": true,
  "marketingConsent": false,
  "preferredLanguage": "en"
}
```

**Response**:
```json
{
  "userId": "uuid",
  "stage": "INITIATED",
  "message": "Verification codes sent to email and phone",
  "nextStep": "verify-email-phone",
  "expiresIn": 900
}
```

**Error Responses**:
```json
// 400 Bad Request - Validation Error
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

// 409 Conflict - Account Exists
{
  "error": "ACCOUNT_EXISTS",
  "message": "An account with this email already exists"
}

// 429 Too Many Requests
{
  "error": "TOO_MANY_ATTEMPTS",
  "message": "Too many registration attempts. Please try again later.",
  "retryAfter": 3600
}
```

### Verify Email

```http
POST /auth/verify-email
```

**Description**: Verifies email address using OTP code.

**Authentication**: None

**Request Body**:
```json
{
  "otp": "123456",
  "userId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "trustLevel": 1,
  "nextStep": "complete-profile"
}
```

### Verify Phone

```http
POST /auth/verify-phone
```

**Description**: Verifies phone number using OTP code.

**Authentication**: None

**Request Body**:
```json
{
  "otp": "123456",
  "userId": "uuid"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "trustLevel": 2
}
```

### Resend Verification Code

```http
POST /auth/resend-verification
```

**Description**: Resends email or phone verification code.

**Authentication**: None

**Request Body**:
```json
{
  "userId": "uuid",
  "type": "EMAIL" | "PHONE"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Verification code sent",
  "expiresIn": 900
}
```

---

## 🔑 Login Endpoints

### Login

```http
POST /auth/login
```

**Description**: Authenticates user with email and password.

**Authentication**: None

**Request Body**:
```json
{
  "email": "user@example.co.zw",
  "password": "SecurePass123!",
  "deviceName": "My Laptop",
  "deviceType": "desktop",
  "rememberMe": false,
  "otp": "123456"
}
```

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.co.zw",
    "fullName": "John Doe",
    "affiliateTier": "BRONZE",
    "roles": ["AFFILIATE"],
    "trustLevel": 3,
    "mfaEnabled": true
  },
  "expiresIn": 900,
  "isNewDevice": false,
  "suspiciousActivity": false
}
```

**MFA Required Response**:
```json
{
  "requiresMfa": true,
  "mfaSessionId": "uuid",
  "availableMethods": ["TOTP", "SMS"],
  "isNewDevice": true,
  "suspiciousActivity": false
}
```

### Refresh Token

```http
POST /auth/refresh
```

**Description**: Refreshes access token using refresh token.

**Authentication**: Refresh token (HTTP-only cookie)

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.co.zw",
    "fullName": "John Doe",
    "affiliateTier": "BRONZE",
    "roles": ["AFFILIATE"],
    "trustLevel": 3,
    "mfaEnabled": true
  }
}
```

### Logout

```http
POST /auth/logout
```

**Description**: Logs out user and invalidates session.

**Authentication**: Access token

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔐 Multi-Factor Authentication

### Setup TOTP

```http
POST /auth/mfa/setup-totp
```

**Description**: Initiates TOTP (Time-based One-Time Password) setup.

**Authentication**: Access token

**Response**:
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "manualEntryKey": "JBSWY3DPEHPK3PXP",
  "backupCodes": ["ABCD1234", "EFGH5678", "IJKL9012"],
  "instructions": {
    "step1": "Scan the QR code with your authenticator app",
    "step2": "Or manually enter the key in your app",
    "step3": "Enter the 6-digit code to verify setup",
    "step4": "Save your backup codes in a secure location"
  },
  "supportedApps": [
    "Google Authenticator",
    "Microsoft Authenticator",
    "Authy"
  ]
}
```

### Verify and Enable TOTP

```http
POST /auth/mfa/verify-totp
```

**Description**: Verifies TOTP setup and enables MFA.

**Authentication**: Access token

**Request Body**:
```json
{
  "otp": "123456",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

**Response**:
```json
{
  "success": true,
  "message": "TOTP authentication enabled successfully",
  "nextSteps": [
    "Save your backup codes securely",
    "Test your authenticator app"
  ]
}
```

### Setup SMS MFA

```http
POST /auth/mfa/setup-sms
```

**Description**: Sets up SMS-based MFA.

**Authentication**: Access token

**Request Body**:
```json
{
  "phoneNumber": "0771234567"
}
```

**Response**:
```json
{
  "message": "Verification code sent to your phone",
  "phoneNumber": "077****567",
  "expiresIn": 600,
  "nextStep": "verify_sms_otp"
}
```

### Generate Backup Codes

```http
POST /auth/mfa/backup-codes
```

**Description**: Generates new backup codes for MFA recovery.

**Authentication**: Access token

**Response**:
```json
{
  "backupCodes": ["ABCD1234", "EFGH5678", "IJKL9012"],
  "instructions": [
    "Save these codes in a secure location",
    "Each code can only be used once",
    "Generate new codes if you suspect compromise"
  ],
  "warning": "These codes will not be shown again. Save them securely!"
}
```

---

## 🔑 Password Management

### Forgot Password

```http
POST /auth/forgot-password
```

**Description**: Initiates password reset process.

**Authentication**: None

**Request Body**:
```json
{
  "email": "user@example.co.zw"
}
```

**Response**:
```json
{
  "message": "If an account exists with this email, you will receive password reset instructions.",
  "nextStep": "check_email"
}
```

### Reset Password

```http
POST /auth/reset-password
```

**Description**: Resets password using reset token.

**Authentication**: None

**Request Body**:
```json
{
  "token": "reset_token_here",
  "email": "user@example.co.zw",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successful. Please login with your new password.",
  "nextStep": "login"
}
```

### Change Password

```http
POST /auth/change-password
```

**Description**: Changes password for authenticated user.

**Authentication**: Access token

**Request Body**:
```json
{
  "currentPassword": "OldSecurePass123!",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully",
  "strength": "STRONG"
}
```

---

## 🔗 Social Authentication

### Google OAuth Initiate

```http
GET /auth/google
```

**Description**: Initiates Google OAuth authentication flow.

**Authentication**: None

**Query Parameters**:
```
state: string (optional)
```

**Response**: Redirect to Google OAuth

### Google OAuth Callback

```http
GET /auth/google/callback
```

**Description**: Handles Google OAuth callback.

**Authentication**: None

**Query Parameters**:
```
code: string
state: string
error: string (optional)
```

**Response**: Redirect to frontend with tokens

### Facebook OAuth Initiate

```http
GET /auth/facebook
```

**Description**: Initiates Facebook OAuth authentication flow.

**Authentication**: None

**Response**: Redirect to Facebook OAuth

### Facebook OAuth Callback

```http
GET /auth/facebook/callback
```

**Description**: Handles Facebook OAuth callback.

**Authentication**: None

**Response**: Redirect to frontend with tokens

### Link Social Account

```http
POST /auth/link-social
```

**Description**: Links social account to existing user.

**Authentication**: Access token

**Request Body**:
```json
{
  "provider": "google" | "facebook",
  "code": "oauth_code_here"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Google account linked successfully",
  "provider": "google",
  "email": "user@gmail.com"
}
```

### Unlink Social Account

```http
DELETE /auth/unlink-social/{provider}
```

**Description**: Unlinks social account from user.

**Authentication**: Access token

**Response**:
```json
{
  "success": true,
  "message": "Google account unlinked successfully"
}
```

---

## 📱 Session Management

### List Sessions

```http
GET /auth/sessions
```

**Description**: Lists all active sessions for the user.

**Authentication**: Access token

**Response**:
```json
{
  "sessions": [
    {
      "id": "uuid",
      "deviceName": "My Laptop",
      "deviceFingerprint": "hash",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "location": {
        "city": "Harare",
        "country": "Zimbabwe",
        "latitude": -17.8292,
        "longitude": 31.0522
      },
      "deviceInfo": {
        "browser": "chrome",
        "os": "windows",
        "deviceType": "desktop"
      },
      "isCurrentSession": true,
      "riskLevel": "LOW",
      "lastUsedAt": "2026-04-17T10:30:00Z",
      "createdAt": "2026-04-17T09:00:00Z",
      "expiresAt": "2026-04-24T09:00:00Z"
    }
  ]
}
```

### Revoke Session

```http
DELETE /auth/sessions/{sessionId}
```

**Description**: Revokes a specific session.

**Authentication**: Access token

**Response**:
```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

### Revoke All Other Sessions

```http
DELETE /auth/sessions/others
```

**Description**: Revokes all sessions except the current one.

**Authentication**: Access token

**Response**:
```json
{
  "success": true,
  "revokedCount": 3
}
```

---

## 👤 User Profile

### Get Current User

```http
GET /auth/me
```

**Description**: Gets current user profile information.

**Authentication**: Access token

**Response**:
```json
{
  "id": "uuid",
  "email": "user@example.co.zw",
  "fullName": "John Doe",
  "phone": "0771234567",
  "affiliateTier": "BRONZE",
  "roles": ["AFFILIATE"],
  "trustLevel": 3,
  "mfaEnabled": true,
  "emailVerified": true,
  "phoneVerified": true,
  "kycStatus": "APPROVED",
  "status": "ACTIVE",
  "registrationStage": "ACTIVE",
  "createdAt": "2026-01-01T00:00:00Z",
  "lastLoginAt": "2026-04-17T10:30:00Z",
  "referralCode": "JOHNDOE12",
  "referredBy": null,
  "unlockedFeatures": [
    "VIEW_DASHBOARD",
    "REQUEST_PAYOUT",
    "INSTANT_PAYOUT"
  ]
}
```

### Update Profile

```http
PUT /auth/profile
```

**Description**: Updates user profile information.

**Authentication**: Access token

**Request Body**:
```json
{
  "fullName": "John Smith",
  "preferredLanguage": "en",
  "preferredCommunicationChannel": "email",
  "marketingConsent": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 🔒 Security Endpoints

### Get Security Events

```http
GET /auth/security-events
```

**Description**: Gets security events for the user.

**Authentication**: Access token

**Query Parameters**:
```
limit: number (default: 50)
offset: number (default: 0)
severity: LOW | MEDIUM | HIGH | CRITICAL (optional)
```

**Response**:
```json
{
  "events": [
    {
      "id": "uuid",
      "eventType": "LOGIN_SUCCESS",
      "severity": "LOW",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "location": {
        "city": "Harare",
        "country": "Zimbabwe"
      },
      "metadata": {
        "deviceFingerprint": "hash",
        "isNewDevice": false
      },
      "createdAt": "2026-04-17T10:30:00Z"
    }
  ],
  "total": 25,
  "hasMore": true
}
```

### Enable Trusted Device

```http
POST /auth/trusted-devices
```

**Description**: Adds current device as trusted.

**Authentication**: Access token

**Request Body**:
```json
{
  "deviceName": "My Laptop",
  "duration": 30
}
```

**Response**:
```json
{
  "success": true,
  "message": "Device added to trusted devices",
  "expiresAt": "2026-05-17T10:30:00Z"
}
```

### Remove Trusted Device

```http
DELETE /auth/trusted-devices/{deviceId}
```

**Description**: Removes device from trusted devices.

**Authentication**: Access token

**Response**:
```json
{
  "success": true,
  "message": "Trusted device removed successfully"
}
```

---

## 📊 Analytics Endpoints

### Get Trust Level Info

```http
GET /auth/trust-level
```

**Description**: Gets current trust level and requirements.

**Authentication**: Access token

**Response**:
```json
{
  "currentLevel": 3,
  "label": "Trusted",
  "nextLevel": 4,
  "nextLevelLabel": "High Trust",
  "requirements": {
    "current": [
      {
        "type": "EMAIL_VERIFIED",
        "achieved": true,
        "description": "Email address verified"
      },
      {
        "type": "THIRTY_DAY_ACTIVITY",
        "achieved": true,
        "description": "Account active for 30+ days"
      }
    ],
    "next": [
      "Earn $10,000 in commissions",
      "Wait 6 months"
    ]
  },
  "unlockedFeatures": [
    "VIEW_DASHBOARD",
    "REQUEST_PAYOUT",
    "INSTANT_PAYOUT"
  ],
  "canUpgrade": false
}
```

---

## 🚨 Error Responses

### Standard Error Format

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2026-04-17T10:30:00Z",
  "requestId": "uuid"
}
```

### Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_CREDENTIALS` | 401 | Email or password incorrect |
| `ACCOUNT_LOCKED` | 423 | Account is temporarily locked |
| `PERMANENTLY_LOCKED` | 423 | Account is permanently locked |
| `MFA_REQUIRED` | 200 | Multi-factor authentication required |
| `INVALID_MFA_CODE` | 401 | MFA verification code incorrect |
| `TOKEN_EXPIRED` | 401 | Access token has expired |
| `INVALID_TOKEN` | 401 | Token is invalid or malformed |
| `INSUFFICIENT_TRUST_LEVEL` | 403 | User doesn't have required trust level |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `CAPTCHA_REQUIRED` | 400 | CAPTCHA verification required |
| `INVALID_CAPTCHA` | 400 | CAPTCHA verification failed |

---

## 🔄 Webhooks

### Security Event Webhook

**Endpoint**: Your configured webhook URL

**Method**: POST

**Headers**:
```http
X-AppEx-Signature: <signature>
X-AppEx-Event: security.event
```

**Payload**:
```json
{
  "event": "security.event",
  "data": {
    "userId": "uuid",
    "eventType": "LOGIN_SUCCESS",
    "severity": "LOW",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2026-04-17T10:30:00Z",
    "metadata": {
      "deviceFingerprint": "hash",
      "isNewDevice": false
    }
  }
}
```

---

## 📋 SDK Examples

### JavaScript/TypeScript

```typescript
import { AppExAuth } from '@appex/auth-client'

const auth = new AppExAuth({
  baseURL: 'https://api.appex.co.zw',
  clientId: 'your-client-id'
})

// Register user
const user = await auth.register({
  email: 'user@example.co.zw',
  phone: '0771234567',
  fullName: 'John Doe',
  password: 'SecurePass123!',
  acceptTerms: true
})

// Login
const loginResult = await auth.login({
  email: 'user@example.co.zw',
  password: 'SecurePass123!'
})

// Get current user
const currentUser = await auth.getCurrentUser()
```

### Python

```python
import requests

class AppExAuth:
    def __init__(self, base_url='https://api.appex.co.zw'):
        self.base_url = base_url
        self.session = requests.Session()
    
    def login(self, email, password):
        response = self.session.post(f'{self.base_url}/auth/login', json={
            'email': email,
            'password': password
        })
        return response.json()
    
    def get_current_user(self):
        response = self.session.get(f'{self.base_url}/auth/me')
        return response.json()

# Usage
auth = AppExAuth()
result = auth.login('user@example.co.zw', 'SecurePass123!')
user = auth.get_current_user()
```

---

## 📚 Testing

### Test Credentials

For testing purposes, use these credentials:

```
Email: test@appex.co.zw
Password: TestPass123!
```

### Test Scenarios

1. **Successful Registration**: Complete flow from registration to active account
2. **MFA Setup**: Enable and test TOTP authentication
3. **Session Management**: Test multiple sessions and revocation
4. **Password Reset**: Test forgot password flow
5. **Social Auth**: Test Google/Facebook OAuth integration
6. **Trust Levels**: Test feature access based on trust levels

---

## 🔄 API Versioning

Current version: `v1`

Version is included in the URL:
```
https://api.appex.co.zw/v1/auth/login
```

Previous versions are supported for 6 months after deprecation notice.

---

## 📞 Support

For API support and questions:

- **Email**: api-support@appex.co.zw
- **Documentation**: https://docs.appex.co.zw
- **Status Page**: https://status.appex.co.zw
- **Support Phone**: +263 242 123 456

---

**Next**: [Auth Database Schema](./database-schema.md) → Database design and relationships documentation
