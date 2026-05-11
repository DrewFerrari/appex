# AppEx Affiliation Portal

A comprehensive affiliate marketing platform built for Zimbabwean entrepreneurs and businesses.

## 🚀 Features

### Core Features
- **Multi-stage Registration** with email/phone verification and KYC
- **Advanced Authentication** with MFA, device tracking, and session management
- **Affiliate Management** with tiered commission structures
- **Referral Tracking** with multi-level commission calculations
- **Commission Processing** with automated calculations and payouts
- **Admin Dashboard** with RBAC and comprehensive analytics
- **Real-time Analytics** with detailed reporting and insights
- **Payment Integration** with Zimbabwean payment methods

### Security Features
- **Progressive Account Lockout** with CAPTCHA integration
- **Device Fingerprinting** for session security
- **Trust Level System** with feature access control
- **Security Event Logging** with real-time monitoring
- **Data Encryption** at rest and in transit
- **Zimbabwe Compliance** with data localization

## 🏗️ Architecture

```
├── api/                    # Backend API (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration
│   └── prisma/             # Database schema
├── web/                    # Frontend (Next.js + TypeScript)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js pages
│   │   ├── hooks/           # Custom hooks
│   │   ├── contexts/        # React contexts
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Tailwind CSS
│   └── public/              # Static assets
├── shared/                  # Shared types and utilities
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Queue**: BullMQ for background jobs
- **Authentication**: JWT with refresh tokens
- **File Storage**: Local/Cloud storage
- **Email**: Nodemailer
- **SMS**: Africa's Talking API

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Zustand
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom component library
- **HTTP Client**: TanStack Query
- **Notifications**: React Hot Toast

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Environment**: Development/Staging/Production
- **Monitoring**: Winston logging + custom dashboard
- **Testing**: Jest + React Testing Library

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 14+
- Redis 6+
- Docker and Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd appex-affiliation-portal
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:server  # Backend on :3001
npm run dev:client  # Frontend on :3000
```

### 5. Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database Studio**: `npm run db:studio`

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://postgres:andrew@localhost:5432/appex_affiliate_portal"
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="appex_affiliate_portal"
DB_USER="postgres"
DB_PASSWORD="andrew"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="andrewmunyanyi1@gmail.com"
EMAIL_PASS="tkxavyviqcijqxol"
EMAIL_FROM="noreply@appexaffiliation.com"

# SMS (Africa's Talking)
AFRICASTALKING_USERNAME="your-username"
AFRICASTALKING_API_KEY="your-api-key"

# Application
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
API_BASE_URL="http://localhost:3001"
```

## 📚 Documentation

- [Authentication System](./docs/authentication/README.md)
- [API Reference](./docs/api/README.md)
- [Database Schema](./docs/database/README.md)
- [Frontend Components](./docs/frontend/README.md)
- [Deployment Guide](./docs/deployment/README.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Docker deployment
docker-compose up -d
```

## 🔒 Security

- All passwords are hashed with bcrypt (cost 12)
- JWT tokens use RS256 signing
- Rate limiting on all endpoints
- Input validation with Zod schemas
- SQL injection prevention with Prisma
- XSS protection with helmet middleware
- CSRF protection with secure cookies

## 🇿🇼 Zimbabwe Compliance

- Data stored in Zimbabwean data centers
- Zimbabwean phone number validation
- Local payment method integration
- Compliance with Zimbabwe Cyber Act
- Support for local languages (English, Shona, Ndebele)

## 📊 Analytics & Monitoring

- Real-time user activity tracking
- Commission and payout analytics
- Security event monitoring
- Performance metrics dashboard
- Automated alerting system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@appex.co.zw
- **Phone**: +263 242 123 456
- **Address**: 123 Samora Machel Ave, Harare, Zimbabwe

## 🙏 Acknowledgments

- Built for Zimbabwean entrepreneurs
- Powered by modern web technologies
- Designed with security and scalability in mind
