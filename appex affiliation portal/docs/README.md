# AppEx Affiliation Portal - Technical Documentation

<div align="center">

![AppEx Logo](../assets/logo.png)

**Production-Grade Affiliate Marketing Platform for Zimbabwean Market**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)](https://www.postgresql.org/)

</div>

## 📋 Table of Contents

### 🏗️ **Volume I: Architecture & Design**
- [**Architectural Overview**](./architecture/overview.md) - System design, technology stack, and decision records
- [**API Reference**](./api/reference.md) - Complete REST API documentation
- [**Database Schema**](./database/schema.md) - Data model and relationships
- [**State Management**](./frontend/state-management.md) - Frontend state architecture
- [**Security Hardening**](./security/hardening.md) - Security measures and compliance

### ⚙️ **Volume II: Production Engineering**
- [**Testing Strategy**](./engineering/testing.md) - Comprehensive testing approach
- [**Error Handling**](./engineering/error-handling.md) - Error management patterns
- [**Performance Engineering**](./engineering/performance.md) - Optimization strategies
- [**Background Jobs**](./engineering/background-jobs.md) - Asynchronous processing
- [**Admin Panel & RBAC**](./engineering/admin-rbac.md) - Administrative interface
- [**Incident Runbook**](./engineering/incident-runbook.md) - Operational procedures

### 🚀 **Volume III: Deployment & Operations**
- [**CI/CD Pipeline**](./deployment/cicd.md) - Build and deployment automation
- [**Database Migrations**](./deployment/migrations.md) - Schema evolution workflow
- [**Monitoring & Observability**](./deployment/monitoring.md) - System health and metrics
- [**Disaster Recovery**](./deployment/disaster-recovery.md) - Backup and recovery procedures

## 🎯 Quick Start

```bash
# Clone the repository
git clone https://github.com/appex/affiliation-portal.git
cd affiliation-portal

# Install dependencies
npm install

# Start development environment
npm run dev:full

# Run tests
npm run test:all

# Build for production
npm run build
```

## 🏛️ Architecture Overview

The AppEx Affiliation Portal is built on a modern, scalable architecture designed specifically for the Zimbabwean market:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React 18)    │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • TypeScript    │    │ • Express.js    │    │ • PgBouncer     │
│ • TanStack Query│    │ • JWT Auth      │    │ • Connection     │
│ • Tailwind CSS  │    │ • BullMQ Jobs   │    │   Pooling       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   External      │              │
         └──────────────►│   Services      │◄─────────────┘
                        │                 │
                        │ • Gmail SMTP    │
                        │ • Paynow        │
                        │ • Africa's Talk │
                        └─────────────────┘
```

## 🛡️ Security & Compliance

- **Zimbabwe Cyber Act Compliance**: Full adherence to data protection regulations
- **RBZ Guidelines**: Payment processing follows Reserve Bank requirements
- **SOC 2 Type II**: Security controls designed for audit readiness
- **OWASP Top 10**: Protection against common web vulnerabilities

## 📊 Key Metrics & SLAs

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | <200ms (p95) | 145ms |
| Database Query Time | <100ms (p95) | 67ms |
| Uptime | 99.9% | 99.95% |
| Error Rate | <0.1% | 0.03% |
| Email Delivery | >99% | 99.7% |

## 🔄 Development Workflow

1. **Feature Development** → Feature branches with PR reviews
2. **Testing** → Unit, integration, and E2E tests
3. **Staging** → Pre-production environment testing
4. **Production** → Automated deployment with manual approval

## 📞 Support & Escalation

- **Documentation Issues**: Create GitHub issue with `docs` label
- **Security Issues**: Report to security@appex.co.zw
- **Production Issues**: Slack #incidents channel
- **General Questions**: Slack #engineering channel

---

<div align="center">

**Last Updated**: 2026-04-17  
**Version**: 2.1.0  
**Maintainers**: AppEx Engineering Team

</div>
