# CI/CD Pipeline

## 📋 Overview

The AppEx Affiliation Portal uses a comprehensive CI/CD pipeline built on GitHub Actions and Railway for automated testing, building, and deployment. This ensures consistent, reliable deployments while maintaining high code quality and security standards.

## 🔄 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Code Commit   │    │   Build & Test  │    │   Deploy        │ │
│  │                 │    │                 │    │                 │ │
│  │ • Git Push      │    │ • Lint          │    │ • Staging       │ │
│  │ • Pull Request  │    │ • Type Check    │    │ • Production    │ │
│  │ • Branch Merge  │    │ • Unit Tests    │    │ • Rollback      │ │
│  └─────────────────┘    │ • E2E Tests     │    │ • Monitoring    │ │
│                         │ • Security Scan │    └─────────────────┘ │
│                         └─────────────────┘                         │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Quality Gates │    │   Artifacts     │    │   Environment   │ │
│  │                 │    │                 │    │                 │ │
│  │ • Coverage      │    │ • Docker Images │    │ • Development   │ │
│  │ • Performance   │    │ • Build Cache   │    │ • Staging       │ │
│  │ • Security      │    │ • Test Results  │    │ • Production    │ │
│  │ • Approvals     │    │ • Reports       │    │ • Disaster      │ │
│  └─────────────────┘    └─────────────────┘    │   Recovery      │ │
│                                                   └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 🚀 Pipeline Configuration

### Main CI/CD Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  release:
    types: [published]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Code Quality & Security
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Security audit
        run: npm audit --audit-level moderate

      - name: Check formatting
        run: npm run format:check

  # Testing
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # E2E Testing
  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Start application
        run: npm run test:e2e:server &
        env:
          NODE_ENV: test

      - name: Wait for application
        run: npx wait-on http://localhost:3000/api/health

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # Build & Deploy to Staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [quality-checks, test, e2e-test]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: staging

      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE_ID_STAGING }}
          command: deploy

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}

      - name: Update deployment status
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          environment-url: ${{ secrets.STAGING_URL }}
          deployment-id: ${{ github.event.deployment.id }}

  # Build & Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [quality-checks, test, e2e-test]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production

      - name: Create production backup
        run: |
          kubectl exec -it postgres-pod -- pg_dump -U postgres appex_affiliate_portal > backup_$(date +%Y%m%d_%H%M%S).sql
          gsutil cp backup_*.sql gs://appex-backups/production/

      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE_ID_PRODUCTION }}
          command: deploy

      - name: Run database migrations
        run: npm run db:migrate:production

      - name: Health check
        run: |
          timeout 300 bash -c 'until curl -f ${{ secrets.PRODUCTION_URL }}/api/health; do sleep 5; done'

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          BASE_URL: ${{ secrets.PRODUCTION_URL }}

      - name: Update deployment status
        uses: chrnorm/deployment-status@v2
        with:
          token: '${{ github.token }}'
          environment-url: ${{ secrets.PRODUCTION_URL }}
          deployment-id: ${{ github.event.deployment.id }}

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  # Performance Testing
  performance-test:
    name: Performance Tests
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            ${{ secrets.STAGING_URL }}
            ${{ secrets.STAGING_URL }}/dashboard
            ${{ secrets.STAGING_URL }}/login
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true

  # Security Scanning
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: [quality-checks]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### Database Migration Workflow

```yaml
# .github/workflows/database-migrations.yml
name: Database Migrations

on:
  push:
    paths:
      - 'drizzle/**'
      - 'src/schema/**'
  pull_request:
    paths:
      - 'drizzle/**'
      - 'src/schema/**'

jobs:
  test-migrations:
    name: Test Migrations
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate migrations
        run: npm run db:generate

      - name: Test migration forward
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Test rollback
        run: npm run db:rollback
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Verify data integrity
        run: npm run test:db
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  deploy-migrations:
    name: Deploy Migrations
    runs-on: ubuntu-latest
    needs: test-migrations
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create database backup
        run: |
          kubectl exec -it postgres-pod -- pg_dump -U postgres appex_affiliate_portal > backup_$(date +%Y%m%d_%H%M%S).sql
          gsutil cp backup_*.sql gs://appex-backups/production/

      - name: Deploy migrations
        run: npm run db:migrate:production

      - name: Verify migration
        run: npm run db:verify:production
```

## 🔧 Environment Configuration

### Environment Variables

```typescript
// src/config/environment.ts
export interface EnvironmentConfig {
  nodeEnv: string
  port: number
  database: {
    url: string
    ssl: boolean
    poolSize: number
  }
  redis: {
    url: string
    maxRetries: number
  }
  jwt: {
    accessSecret: string
    refreshSecret: string
    accessExpiry: number
    refreshExpiry: number
  }
  email: {
    provider: string
    smtp: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
  }
  storage: {
    provider: string
    cloudinary: {
      cloudName: string
      apiKey: string
      apiSecret: string
    }
  }
  monitoring: {
    sentry: {
      dsn: string
    }
    prometheus: {
      enabled: boolean
    }
  }
  features: {
    newDashboard: boolean
    betaFeatures: boolean
    maintenanceMode: boolean
  }
}

export const config: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  
  database: {
    url: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === 'production',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '20'),
  },
  
  redis: {
    url: process.env.REDIS_URL!,
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
  },
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiry: parseInt(process.env.JWT_ACCESS_EXPIRY || '900'), // 15 minutes
    refreshExpiry: parseInt(process.env.JWT_REFRESH_EXPIRY || '604800'), // 7 days
  },
  
  email: {
    provider: process.env.EMAIL_PROVIDER || 'gmail',
    smtp: {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    },
  },
  
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'cloudinary',
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      apiSecret: process.env.CLOUDINARY_API_SECRET!,
    },
  },
  
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN || '',
    },
    prometheus: {
      enabled: process.env.PROMETHEUS_ENABLED === 'true',
    },
  },
  
  features: {
    newDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true',
    betaFeatures: process.env.FEATURE_BETA === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  },
}
```

### Railway Service Configuration

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "services": {
    "api": {
      "source": {
        "root": "."
      },
      "environment": [
        {
          "key": "NODE_ENV",
          "value": "production"
        },
        {
          "key": "PORT",
          "value": "3000"
        }
      ]
    },
    "worker": {
      "source": {
        "root": "."
      },
      "startCommand": "npm run worker",
      "environment": [
        {
          "key": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  }
}
```

## 🔍 Quality Gates

### Code Quality Requirements

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on:
  pull_request:
    branches: [main]

jobs:
  quality-checks:
    name: Quality Gates
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check code coverage
        run: |
          npm run test:unit -- --coverage
          npx nyc report --check-coverage --lines 90 --functions 90 --branches 90 --statements 90

      - name: Check bundle size
        run: |
          npm run build
          npx bundlesize

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Security audit
        run: npm audit --audit-level moderate

      - name: Check for breaking changes
        run: npx @changesets/cli status

      - name: Documentation check
        run: |
          # Ensure all API endpoints are documented
          npm run docs:check
```

### Performance Gates

```typescript
// tests/performance/gates.test.ts
import { test, expect } from '@playwright/test'

test.describe('Performance Gates', () => {
  test('API response times', async ({ request }) => {
    const startTime = Date.now()
    
    const response = await request.get('/api/dashboard')
    const responseTime = Date.now() - startTime
    
    expect(response.status()).toBe(200)
    expect(responseTime).toBeLessThan(500) // 500ms threshold
  })

  test('Page load performance', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000) // 3 seconds threshold
    
    // Check Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals = {
            lcp: entries.find(e => e.name === 'largest-contentful-paint')?.startTime || 0,
            fid: entries.find(e => e.name === 'first-input')?.processingStart || 0,
            cls: entries.find(e => e.name === 'cumulative-layout-shift')?.value || 0,
          }
          resolve(vitals)
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] })
      })
    })

    expect(vitals.lcp).toBeLessThan(2500) // 2.5s
    expect(vitals.fid).toBeLessThan(100) // 100ms
    expect(vitals.cls).toBeLessThan(0.1) // 0.1
  })
})
```

## 📊 Monitoring & Observability

### Deployment Monitoring

```typescript
// src/monitoring/deployment.ts
export class DeploymentMonitor {
  async monitorDeployment(deploymentId: string): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Monitor deployment progress
      await this.watchDeploymentProgress(deploymentId)
      
      // Health checks
      await this.runHealthChecks()
      
      // Performance validation
      await this.validatePerformance()
      
      // Rollback if needed
      const deploymentTime = Date.now() - startTime
      console.log(`Deployment completed in ${deploymentTime}ms`)
      
    } catch (error) {
      console.error('Deployment monitoring failed:', error)
      await this.triggerRollback(deploymentId)
      throw error
    }
  }

  private async watchDeploymentProgress(deploymentId: string): Promise<void> {
    // Watch Railway deployment logs
    // Monitor pod status
    // Check service endpoints
  }

  private async runHealthChecks(): Promise<void> {
    const healthChecks = [
      this.checkAPIHealth(),
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
      this.checkQueueHealth(),
    ]

    const results = await Promise.allSettled(healthChecks)
    
    for (const result of results) {
      if (result.status === 'rejected') {
        throw new Error(`Health check failed: ${result.reason}`)
      }
    }
  }

  private async validatePerformance(): Promise<void> {
    // Run smoke tests
    // Check response times
    // Validate error rates
  }

  private async triggerRollback(deploymentId: string): Promise<void> {
    // Implement rollback logic
    console.log('Triggering rollback for deployment:', deploymentId)
  }
}
```

### Alert Configuration

```yaml
# prometheus-alerts.yml
groups:
  - name: deployment-alerts
    rules:
      - alert: DeploymentFailed
        expr: deployment_status == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Deployment failed"
          description: "Deployment {{ $labels.deployment }} failed"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"
```

## 🚀 Release Management

### Semantic Versioning

```json
// package.json
{
  "name": "appex-affiliation-portal",
  "version": "2.1.0",
  "scripts": {
    "release": "changeset publish",
    "version": "changeset version",
    "release:alpha": "changeset pre enter alpha",
    "release:beta": "changeset pre enter beta",
    "release:stable": "changeset pre exit"
  }
}
```

### Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run tests
        run: npm run test:all

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      - name: Deploy to production
        run: npm run deploy:production

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: success
          channel: '#releases'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📋 Deployment Checklist

### Pre-Deployment Checklist
- [ ] All tests passing in CI
- [ ] Code coverage meets requirements (>90%)
- [ ] Security scan passed
- [ ] Performance tests passed
- [ ] Documentation updated
- [ ] Migration scripts tested
- [ ] Backup strategy confirmed
- [ ] Rollback plan tested
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled (if needed)

### Post-Deployment Checklist
- [ ] Deployment successful
- [ ] Health checks passing
- [ ] Database migrations applied
- [ ] Monitoring alerts normal
- [ ] Error rates within threshold
- [ ] Performance metrics acceptable
- [ ] User feedback collected
- [ ] Documentation updated
- [ ] Team debrief conducted
- [ ] Post-release retrospective scheduled

---

**Next**: [Interactive Navigation](../README.md) → Return to main documentation index
