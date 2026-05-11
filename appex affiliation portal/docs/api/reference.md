# API Reference

## 📋 Overview

The AppEx Affiliation Portal REST API provides programmatic access to all platform functionality. All endpoints follow RESTful conventions and return JSON responses.

**Base URL**: `https://api.appexaffiliation.com/v1`  
**Authentication**: Bearer Token (JWT)  
**Content-Type**: `application/json`  
**Rate Limiting**: 100 requests/minute per user

## 🔐 Authentication

### Obtain Access Token

```http
POST /auth/login
```

**Request Body**:
```json
{
  "email": "affiliate@appex.co.zw",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "type": "access"
    },
    "refreshToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 604800,
      "type": "refresh",
      "familyId": "fam_1234567890"
    },
    "user": {
      "id": "usr_1234567890",
      "email": "affiliate@appex.co.zw",
      "firstName": "John",
      "lastName": "Doe",
      "affiliateType": "trainer",
      "status": "active"
    }
  }
}
```

### Refresh Access Token

```http
POST /auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "accessToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "type": "access"
    }
  }
}
```

### Logout

```http
POST /auth/logout
```

**Headers**: `Authorization: Bearer <access_token>`  
**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 👤 User Management

### Get Current User Profile

```http
GET /users/me
```

**Headers**: `Authorization: Bearer <access_token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "usr_1234567890",
    "email": "affiliate@appex.co.zw",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+263712345678",
    "affiliateType": "trainer",
    "status": "active",
    "affiliateCode": "JOHN123",
    "joinDate": "2024-01-15T00:00:00Z",
    "lastLogin": "2024-04-17T10:30:00Z",
    "profile": {
      "avatar": "https://cdn.appexaffiliation.com/avatars/usr_1234567890.jpg",
      "bio": "Experienced trainer specializing in POS systems",
      "location": "Harare, Zimbabwe",
      "website": "https://johntrainer.co.zw"
    },
    "commissions": {
      "rate": 0.10,
      "totalEarned": 2500.00,
      "pendingPayments": 500.00,
      "lastPayout": "2024-04-01T00:00:00Z"
    }
  }
}
```

### Update User Profile

```http
PUT /users/me
```

**Headers**: `Authorization: Bearer <access_token>`  
**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+263712345678",
  "profile": {
    "bio": "Experienced trainer specializing in POS systems",
    "location": "Harare, Zimbabwe",
    "website": "https://johntrainer.co.zw"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "usr_1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+263712345678",
    "profile": {
      "bio": "Experienced trainer specializing in POS systems",
      "location": "Harare, Zimbabwe",
      "website": "https://johntrainer.co.zw"
    },
    "updatedAt": "2024-04-17T10:30:00Z"
  }
}
```

## 📊 Dashboard & Analytics

### Get Dashboard Data

```http
GET /dashboard
```

**Headers**: `Authorization: Bearer <access_token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalReferrals": 45,
      "activeReferrals": 32,
      "conversionRate": 0.71,
      "totalEarnings": 3250.00,
      "pendingEarnings": 750.00,
      "monthlyGrowth": 0.15
    },
    "recentActivity": [
      {
        "id": "act_1234567890",
        "type": "referral",
        "description": "New referral signed up: Sarah Chen",
        "date": "2024-04-17T09:30:00Z",
        "amount": 0.00
      },
      {
        "id": "act_1234567891",
        "type": "commission",
        "description": "Commission earned: Grocery Store POS sale",
        "date": "2024-04-17T08:15:00Z",
        "amount": 150.00
      }
    ],
    "earningsChart": [
      { "date": "2024-04-01", "amount": 250.00 },
      { "date": "2024-04-02", "amount": 180.00 },
      { "date": "2024-04-03", "amount": 320.00 }
    ],
    "referralBreakdown": {
      "trainer": 28,
      "reseller": 17
    }
  }
}
```

### Get Earnings Report

```http
GET /earnings?startDate=2024-04-01&endDate=2024-04-30
```

**Headers**: `Authorization: Bearer <access_token>`

**Query Parameters**:
- `startDate` (string, required): ISO date string
- `endDate` (string, required): ISO date string
- `type` (string, optional): Filter by commission type

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalEarnings": 1250.00,
      "totalReferrals": 15,
      "averageCommission": 83.33,
      "pendingAmount": 300.00
    },
    "commissions": [
      {
        "id": "com_1234567890",
        "referralId": "ref_1234567890",
        "type": "pos_sale",
        "amount": 150.00,
        "rate": 0.10,
        "status": "paid",
        "date": "2024-04-15T14:30:00Z",
        "referral": {
          "id": "ref_1234567890",
          "name": "Sarah Chen",
          "email": "sarah@business.co.zw",
          "product": "Grocery Store POS"
        }
      }
    ],
    "payouts": [
      {
        "id": "pay_1234567890",
        "amount": 950.00,
        "status": "completed",
        "method": "ecocash",
        "date": "2024-04-01T00:00:00Z",
        "reference": "ECO123456789"
      }
    ]
  }
}
```

## 👥 Referral Management

### Create Referral

```http
POST /referrals
```

**Headers**: `Authorization: Bearer <access_token>`  
**Request Body**:
```json
{
  "name": "Sarah Chen",
  "email": "sarah@business.co.zw",
  "phone": "+263712345678",
  "businessName": "Sarah's Grocery",
  "product": "Grocery Store POS",
  "notes": "Interested in POS system with inventory management"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ref_1234567890",
    "name": "Sarah Chen",
    "email": "sarah@business.co.zw",
    "phone": "+263712345678",
    "businessName": "Sarah's Grocery",
    "product": "Grocery Store POS",
    "status": "pending",
    "affiliateId": "usr_1234567890",
    "createdAt": "2024-04-17T10:30:00Z"
  }
}
```

### List Referrals

```http
GET /referrals?page=1&limit=20&status=pending
```

**Headers**: `Authorization: Bearer <access_token>`

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)
- `status` (string, optional): Filter by status
- `search` (string, optional): Search by name or email

**Response**:
```json
{
  "success": true,
  "data": {
    "referrals": [
      {
        "id": "ref_1234567890",
        "name": "Sarah Chen",
        "email": "sarah@business.co.zw",
        "businessName": "Sarah's Grocery",
        "product": "Grocery Store POS",
        "status": "pending",
        "createdAt": "2024-04-17T10:30:00Z",
        "lastContact": "2024-04-17T11:00:00Z",
        "notes": "Follow up on pricing discussion"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Update Referral

```http
PUT /referrals/{referralId}
```

**Headers**: `Authorization: Bearer <access_token>`  
**Request Body**:
```json
{
  "status": "contacted",
  "notes": "Had initial call, interested in demo",
  "nextFollowUp": "2024-04-20T14:00:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "ref_1234567890",
    "status": "contacted",
    "notes": "Had initial call, interested in demo",
    "nextFollowUp": "2024-04-20T14:00:00Z",
    "updatedAt": "2024-04-17T10:30:00Z"
  }
}
```

## 💰 Payouts & Payments

### Request Payout

```http
POST /payouts
```

**Headers**: `Authorization: Bearer <access_token>`  
**Request Body**:
```json
{
  "amount": 500.00,
  "method": "ecocash",
  "accountNumber": "+263712345678",
  "accountName": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "pay_1234567890",
    "amount": 500.00,
    "method": "ecocash",
    "accountNumber": "+263712345678",
    "status": "pending",
    "estimatedProcessing": "2024-04-19T00:00:00Z",
    "createdAt": "2024-04-17T10:30:00Z"
  }
}
```

### Get Payout History

```http
GET /payouts?page=1&limit=20
```

**Headers**: `Authorization: Bearer <access_token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "payouts": [
      {
        "id": "pay_1234567890",
        "amount": 500.00,
        "method": "ecocash",
        "status": "completed",
        "reference": "ECO123456789",
        "processedAt": "2024-04-15T00:00:00Z",
        "createdAt": "2024-04-10T10:30:00Z"
      }
    ],
    "summary": {
      "totalPaid": 3250.00,
      "pendingAmount": 500.00,
      "nextPayoutDate": "2024-04-19T00:00:00Z"
    }
  }
}
```

## 📧 Email Verification

### Send Verification Code

```http
POST /auth/send-verification
```

**Request Body**:
```json
{
  "email": "affiliate@appex.co.zw",
  "name": "John Doe",
  "template": "verification"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "Verification code sent successfully",
    "code": "123456",
    "expiresIn": 600,
    "provider": "gmail-smtp",
    "messageId": "<msg_1234567890@appexaffiliation.com>"
  }
}
```

### Verify Code

```http
POST /auth/verify-code
```

**Request Body**:
```json
{
  "email": "affiliate@appex.co.zw",
  "code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully",
    "verified": true
  }
}
```

## 🎯 Marketing Materials

### Get Marketing Materials

```http
GET /marketing/materials
```

**Headers**: `Authorization: Bearer <access_token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": "mat_1234567890",
        "name": "AppEx POS Brochure",
        "type": "pdf",
        "category": "brochure",
        "url": "https://cdn.appexaffiliation.com/materials/pos-brochure.pdf",
        "thumbnail": "https://cdn.appexaffiliation.com/materials/pos-brochure-thumb.jpg",
        "size": 2048576,
        "downloads": 145,
        "description": "Comprehensive POS system brochure for Zimbabwean businesses"
      },
      {
        "id": "mat_1234567891",
        "name": "Commission Calculator",
        "type": "interactive",
        "category": "tool",
        "url": "https://appexaffiliation.com/calculator",
        "thumbnail": "https://cdn.appexaffiliation.com/materials/calculator-thumb.jpg",
        "description": "Interactive commission calculator for affiliates"
      }
    ]
  }
}
```

### Generate Referral Link

```http
POST /marketing/referral-link
```

**Headers**: `Authorization: Bearer <access_token>`  
**Request Body**:
```json
{
  "campaign": "spring_promotion",
  "customCode": "JOHN2024"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://appexaffiliation.com/signup?ref=JOHN123&campaign=spring_promotion",
    "shortUrl": "https://appex.co.zw/john2024",
    "qrCode": "https://cdn.appexaffiliation.com/qr/john2024.png",
    "customCode": "JOHN2024",
    "campaign": "spring_promotion"
  }
}
```

## 🏆 Training & Certificates

### Get Training Courses

```http
GET /training/courses
```

**Headers**: `Authorization: Bearer <access_token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "crs_1234567890",
        "title": "Grocery Store POS Management",
        "description": "Complete AppEx POS system for grocery stores",
        "category": "retail",
        "duration": "4 modules",
        "level": "beginner",
        "status": "available",
        "progress": {
          "completedModules": 2,
          "totalModules": 4,
          "percentage": 50
        },
        "certificate": {
          "earned": false,
          "available": true
        }
      }
    ]
  }
}
```

### Get Course Progress

```http
GET /training/courses/{courseId}/progress
```

**Headers**: `Authorization: Bearer <access_token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "courseId": "crs_1234567890",
    "progress": {
      "completedModules": ["mod_1", "mod_2"],
      "currentModule": "mod_3",
      "totalModules": 4,
      "percentage": 50,
      "timeSpent": 7200,
      "lastAccessed": "2024-04-17T09:30:00Z"
    },
    "modules": [
      {
        "id": "mod_1",
        "title": "Introduction to POS Systems",
        "status": "completed",
        "completedAt": "2024-04-15T10:30:00Z",
        "score": 95
      }
    ]
  }
}
```

### Download Certificate

```http
GET /training/certificates/{certificateId}/download
```

**Headers**: `Authorization: Bearer <access_token>`

**Response**: PDF file download

## 🔧 Webhooks

### Paynow Payment Webhook

```http
POST /webhooks/paynow/payment
```

**Headers**:
- `X-Paynow-Signature`: HMAC SHA256 signature
- `Content-Type`: `application/json`

**Request Body**:
```json
{
  "reference": "PAY123456789",
  "status": "paid",
  "amount": 150.00,
  "currency": "USD",
  "paymentDate": "2024-04-17T10:30:00Z",
  "payerEmail": "customer@business.co.zw",
  "merchantReference": "REF_123456789"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

## 🚨 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-04-17T10:30:00Z",
  "requestId": "req_1234567890"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## 📝 Request Examples

### Using cURL

```bash
# Login
curl -X POST https://api.appexaffiliation.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"affiliate@appex.co.zw","password":"securePassword123"}'

# Get dashboard data
curl -X GET https://api.appexaffiliation.com/v1/dashboard \
  -H "Authorization: Bearer <access_token>"

# Create referral
curl -X POST https://api.appexaffiliation.com/v1/referrals \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sarah Chen","email":"sarah@business.co.zw","product":"Grocery Store POS"}'
```

### Using JavaScript

```javascript
// Login
const loginResponse = await fetch('https://api.appexaffiliation.com/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'affiliate@appex.co.zw',
    password: 'securePassword123'
  })
});

const { data } = await loginResponse.json();
const token = data.accessToken.token;

// Get dashboard data
const dashboardResponse = await fetch('https://api.appexaffiliation.com/v1/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const dashboard = await dashboardResponse.json();
```

---

**Next**: [Database Schema](../database/schema.md) → Complete data model documentation
