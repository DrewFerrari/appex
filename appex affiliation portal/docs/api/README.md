# AppEx Affiliation Portal API Documentation

## Overview

The AppEx Affiliation Portal API provides a comprehensive set of endpoints for managing affiliate marketing operations, user authentication, commission tracking, and administrative functions.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.appex.co.zw`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

### Authentication Flow

1. **Register**: Create a new user account
2. **Login**: Authenticate with email/password
3. **MFA**: Complete multi-factor authentication if enabled
4. **Access**: Use the JWT token for authenticated requests

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "+263123456789",
  "fullName": "John Doe",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "nationalId": "123456789A",
  "referralCode": "REF123",
  "acceptTerms": true,
  "acceptPrivacyPolicy": true,
  "marketingConsent": false,
  "preferredLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "userId": "uuid-string"
}
```

#### POST `/api/auth/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "deviceName": "Chrome on Windows",
  "deviceType": "desktop",
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "John Doe",
    "affiliateTier": "BRONZE",
    "trustLevel": 1
  },
  "session": {
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600
  }
}
```

#### POST `/api/auth/verify-mfa`
Complete MFA authentication.

**Request Body:**
```json
{
  "sessionId": "mfa-session-id",
  "code": "123456",
  "rememberDevice": false
}
```

#### POST `/api/auth/refresh`
Refresh access token using refresh token.

#### POST `/api/auth/logout`
Logout user and invalidate session.

#### GET `/api/auth/me`
Get current user information.

### Affiliate Management (`/api/affiliate`)

#### GET `/api/affiliate/dashboard`
Get affiliate dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "totalCommissions": 1500.00,
    "totalSales": 25,
    "monthlyCommissions": 300.00,
    "monthlySales": 5,
    "totalReferrals": 15,
    "recentReferrals": [ ... ],
    "activeSessions": 3,
    "commissionRates": {
      "standard": 5.0,
      "bonus": 10.0,
      "recurring": 2.0,
      "referral": 3.0
    }
  }
}
```

#### GET `/api/affiliate/referrals`
Get user's referrals.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (PENDING, CONTACTED, INTERESTED, CONVERTED, NOT_INTERESTED)

#### POST `/api/affiliate/referrals`
Create a new referral.

**Request Body:**
```json
{
  "referredEmail": "referral@example.com",
  "referredName": "Jane Smith",
  "businessName": "Jane's Business",
  "notes": "Interested in affiliate program"
}
```

#### GET `/api/affiliate/commissions`
Get user's commissions.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (PENDING, CONFIRMED, PAID, CANCELLED)
- `type`: Filter by type (STANDARD, BONUS, RECURRING, REFERRAL)

#### GET `/api/affiliate/payouts`
Get user's payout requests.

#### POST `/api/affiliate/payouts`
Request a new payout.

**Request Body:**
```json
{
  "amount": 500.00,
  "method": "BANK_TRANSFER",
  "bankAccount": {
    "accountName": "John Doe",
    "accountNumber": "1234567890",
    "bankName": "Stanbic Bank",
    "branch": "Harare Branch"
  }
}
```

### Commission Management (`/api/commission`)

#### POST `/api/commission/calculate`
Calculate commission for a referral.

**Request Body:**
```json
{
  "referralId": "uuid-string",
  "saleAmount": 1000.00,
  "commissionType": "STANDARD"
}
```

#### PUT `/api/commission/confirm/:id`
Confirm a pending commission.

#### PUT `/api/commission/paid/:id`
Mark commission as paid.

#### GET `/api/commission/analytics`
Get commission analytics.

**Query Parameters:**
- `period`: week, month, quarter, year (default: month)

#### GET `/api/commission/leaderboard`
Get commission leaderboard.

### Admin Management (`/api/admin`)

*Requires admin role*

#### GET `/api/admin/dashboard`
Get admin dashboard data.

#### GET `/api/admin/users`
Get all users with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status
- `trustLevel`: Filter by trust level
- `affiliateTier`: Filter by affiliate tier
- `search`: Search by name or email

#### GET `/api/admin/users/:id`
Get user details.

#### PUT `/api/admin/users/:id/status`
Update user status.

**Request Body:**
```json
{
  "status": "ACTIVE",
  "reason": "Account verified"
}
```

#### GET `/api/admin/analytics`
Get system analytics.

#### GET `/api/admin/kyc`
Get KYC submissions.

#### PUT `/api/admin/kyc/:id/approve`
Approve KYC submission.

#### PUT `/api/admin/kyc/:id/reject`
Reject KYC submission.

## Data Models

### User
```typescript
interface User {
  id: string
  email: string
  phone?: string
  fullName: string
  nationalId?: string
  affiliateTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  trustLevel: number
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'PERMANENTLY_LOCKED'
  emailVerified: boolean
  phoneVerified: boolean
  mfaEnabled: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Commission
```typescript
interface Commission {
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
```

### Referral
```typescript
interface Referral {
  id: string
  affiliateId: string
  referredEmail: string
  referredName: string
  businessName?: string
  status: 'PENDING' | 'CONTACTED' | 'INTERESTED' | 'CONVERTED' | 'NOT_INTERESTED'
  nextFollowUp: Date
  createdAt: Date
  convertedAt?: Date
  commissionEarned?: number
}
```

## Error Handling

The API returns standard HTTP status codes and error responses in the following format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable error message"
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or missing authentication token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Standard endpoints**: 100 requests per minute
- **Admin endpoints**: 200 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Webhooks

The API supports webhooks for real-time notifications:

### Supported Events

- `user.created`: New user registration
- `commission.earned`: Commission earned
- `payout.requested`: Payout requested
- `payout.completed`: Payout completed
- `kyc.submitted`: KYC documents submitted
- `kyc.approved`: KYC approved
- `kyc.rejected`: KYC rejected

### Webhook Configuration

Configure webhook URLs in your account settings or via the admin panel.

## SDK and Libraries

### JavaScript/TypeScript
```bash
npm install @appex/api-client
```

```typescript
import { AppExAPI } from '@appex/api-client'

const api = new AppExAPI({
  baseURL: 'https://api.appex.co.zw',
  apiKey: 'your-api-key'
})

const user = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
})
```

### Python
```bash
pip install appex-api-client
```

```python
from appex_api import AppExAPI

api = AppExAPI(
    base_url='https://api.appex.co.zw',
    api_key='your-api-key'
)

user = api.auth.login(
    email='user@example.com',
    password='password'
)
```

## Testing

### Environment Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the development server: `npm run dev`

### API Testing

Use the provided Postman collection or run the test suite:

```bash
# Run all tests
npm test

# Run API tests only
npm run test:api

# Run with coverage
npm run test:coverage
```

## Support

- **Documentation**: https://docs.appex.co.zw
- **Support Email**: support@appex.co.zw
- **Status Page**: https://status.appex.co.zw
- **Developer Forum**: https://community.appex.co.zw

## Changelog

### Version 1.0.0 (2024-01-15)
- Initial API release
- Authentication endpoints
- Affiliate management
- Commission tracking
- Admin dashboard
- Analytics and reporting

### Version 1.1.0 (2024-02-01)
- KYC document upload
- Enhanced analytics
- Webhook support
- Performance improvements

### Version 1.2.0 (2024-03-01)
- Mobile money payouts
- Advanced filtering
- Export functionality
- Security enhancements
