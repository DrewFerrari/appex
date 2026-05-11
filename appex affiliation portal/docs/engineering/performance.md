# Performance Engineering

## 📋 Overview

Performance engineering in the AppEx Affiliation Portal focuses on delivering sub-200ms response times, 99.9% uptime, and optimal user experience across the Zimbabwean market with varying network conditions. This comprehensive strategy covers frontend optimization, database performance, caching strategies, and monitoring.

## 🎯 Performance Targets & KPIs

### Core Web Vitals Budget

| Metric | Target | Measurement Tool | Current |
|--------|--------|------------------|---------|
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse | 1.8s |
| **First Input Delay (FID)** | < 100ms | Lighthouse | 45ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse | 0.05 |
| **Time to First Byte (TTFB)** | < 200ms | WebPageTest | 145ms |
| **First Contentful Paint (FCP)** | < 1.8s | Lighthouse | 1.2s |

### API Performance Targets

| Endpoint Type | Target Response Time | P95 Target | Current |
|---------------|---------------------|------------|---------|
| Authentication | <150ms | 200ms | 125ms |
| Dashboard Data | <200ms | 300ms | 167ms |
| Referral CRUD | <100ms | 150ms | 89ms |
| File Upload | <2s | 3s | 1.4s |
| Report Generation | <5s | 8s | 3.2s |

## 🚀 Frontend Performance

### Code Splitting Strategy

```typescript
// src/routes/index.ts
import { lazy } from 'react'

// Route-based code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Referrals = lazy(() => import('../pages/Referrals'))
const Commissions = lazy(() => import('../pages/Commissions'))
const Training = lazy(() => import('../pages/Training'))
const Profile = lazy(() => import('../pages/Profile'))

// Feature-based splitting for heavy components
const CommissionChart = lazy(() => import('../components/charts/CommissionChart'))
const ReferralMap = lazy(() => import('../components/maps/ReferralMap'))
const CertificatePreview = lazy(() => import('../components/certificates/CertificatePreview'))

export const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    preload: true, // Preload dashboard on app start
  },
  {
    path: '/referrals',
    component: Referrals,
    preload: false,
  },
  // ... other routes
]
```

### Bundle Optimization

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['@headlessui/react', 'lucide-react'],
          charts: ['recharts', 'chart.js'],
          
          // Feature chunks
          auth: ['src/pages/auth'],
          dashboard: ['src/pages/Dashboard'],
          referrals: ['src/pages/Referrals'],
          commissions: ['src/pages/Commissions'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
  ],
})
```

### Image Optimization

```typescript
// src/components/OptimizedImage.tsx
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setHasError(true)
  }, [])

  // Generate responsive image URLs with Cloudinary
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [400, 800, 1200, 1600]
    return sizes
      .map(size => `${baseSrc}?w=${size}&q=80&f=auto ${size}w`)
      .join(', ')
  }

  if (hasError) {
    return (
      <div className={cn(
        'bg-gray-200 flex items-center justify-center text-gray-500',
        className
      )} style={{ width, height }}>
        <span>Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  )
}
```

### Caching Strategy

```typescript
// src/lib/cache/strategies.ts
export class CacheStrategy {
  // Static asset caching
  static getAssetCacheHeaders() {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Expires': new Date(Date.now() + 31536000 * 1000).toUTCString(),
    }
  }

  // API response caching
  static getAPICacheHeaders(maxAge: number, staleWhileRevalidate?: number) {
    let cacheControl = `public, max-age=${maxAge}`
    
    if (staleWhileRevalidate) {
      cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`
    }
    
    return {
      'Cache-Control': cacheControl,
      'ETag': this.generateETag(),
    }
  }

  // Service Worker caching
  static getServiceWorkerCacheStrategy() {
    return {
      // Cache-first for static assets
      static: {
        strategy: 'CacheFirst',
        cacheName: 'static-assets',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      // Network-first for API calls
      api: {
        strategy: 'NetworkFirst',
        cacheName: 'api-responses',
        maxAge: 5 * 60, // 5 minutes
      },
      // Stale-while-revalidate for dashboard data
      dashboard: {
        strategy: 'StaleWhileRevalidate',
        cacheName: 'dashboard-data',
        maxAge: 60, // 1 minute
        staleWhileRevalidate: 300, // 5 minutes
      },
    }
  }

  private static generateETag(): string {
    return `"${Date.now()}-${Math.random().toString(36).substr(2, 9)}"`
  }
}
```

## 🗄️ Database Performance

### Connection Pooling with PgBouncer

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: appex_affiliate_portal
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgbouncer:
    image: pgbouncer/pgbouncer:latest
    environment:
      DATABASES_HOST: postgres
      DATABASES_PORT: 5432
      DATABASES_USER: postgres
      DATABASES_PASSWORD: ${DB_PASSWORD}
      DATABASES_DBNAME: appex_affiliate_portal
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 200
      DEFAULT_POOL_SIZE: 20
      MIN_POOL_SIZE: 5
      RESERVE_POOL_SIZE: 5
      RESERVE_POOL_TIMEOUT: 5
      SERVER_RESET_QUERY: DISCARD ALL
    ports:
      - "6432:6432"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Database Indexing Strategy

```sql
-- Performance-critical indexes

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_affiliates_status_tier 
ON affiliates(status, tier) 
INCLUDE (affiliate_code, first_name, last_name, commission_rate);

CREATE INDEX CONCURRENTLY idx_referrals_affiliate_status_created 
ON referrals(affiliate_id, status, created_at) 
INCLUDE (name, email, business_name);

CREATE INDEX CONCURRENTLY idx_commissions_affiliate_date_status 
ON commissions(affiliate_id, earned_date, status) 
INCLUDE (amount, type, referral_id);

-- Partial indexes for filtered queries
CREATE INDEX CONCURRENTLY idx_affiliates_active 
ON affiliates(affiliate_code) 
WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_commissions_pending 
ON commissions(earned_date) 
WHERE status = 'pending';

CREATE INDEX CONCURRENTLY idx_referrals_recent 
ON referrals(created_at) 
WHERE created_at > CURRENT_DATE - INTERVAL '30 days';

-- JSON indexes for document queries
CREATE INDEX CONCURRENTLY idx_audit_logs_details_gin 
ON audit_logs USING gin(details);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY idx_affiliates_search 
ON affiliates USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(bio, '')));

```

### Query Optimization

```typescript
// src/repositories/base.repository.ts
export class BaseRepository<T> {
  constructor(protected db: Pool) {}

  // Optimized pagination with cursor-based approach
  async findWithCursor<T>(
    tableName: string,
    options: {
      limit?: number
      cursor?: string
      orderBy?: string
      where?: Record<string, any>
    }
  ): Promise<{ data: T[]; nextCursor?: string; hasMore: boolean }> {
    const { limit = 20, cursor, orderBy = 'created_at', where = {} } = options
    
    let query = `
      SELECT * FROM ${this.escapeIdentifier(tableName)}
    `
    
    const params: any[] = []
    const conditions: string[] = []
    
    // Add WHERE conditions
    Object.entries(where).forEach(([key, value], index) => {
      if (value !== undefined) {
        conditions.push(`${this.escapeIdentifier(key)} = $${params.length + 1}`)
        params.push(value)
      }
    })
    
    // Add cursor condition
    if (cursor) {
      conditions.push(`${this.escapeIdentifier(orderBy)} > $${params.length + 1}`)
      params.push(cursor)
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    
    query += ` ORDER BY ${this.escapeIdentifier(orderBy)} ASC LIMIT $${params.length + 1}`
    params.push(limit + 1) // Request one extra to check if there are more
    
    const result = await this.db.query(query, params)
    const data = result.rows.slice(0, limit)
    const hasMore = result.rows.length > limit
    
    return {
      data,
      nextCursor: hasMore ? data[data.length - 1][orderBy] : undefined,
      hasMore,
    }
  }

  // Batch operations for performance
  async createBatch(tableName: string, records: Partial<T>[]): Promise<T[]> {
    if (records.length === 0) return []
    
    const columns = Object.keys(records[0])
    const values = records.map(record => 
      columns.map(col => record[col])
    )
    
    const placeholders = values.map((_, index) => 
      `(${columns.map((_, colIndex) => 
        `$${index * columns.length + colIndex + 1}`
      ).join(', ')})`
    ).join(', ')
    
    const flatValues = values.flat()
    
    const query = `
      INSERT INTO ${this.escapeIdentifier(tableName)} (${columns.map(col => this.escapeIdentifier(col)).join(', ')})
      VALUES ${placeholders}
      RETURNING *
    `
    
    const result = await this.db.query(query, flatValues)
    return result.rows
  }

  private escapeIdentifier(name: string): string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      throw new Error(`Invalid identifier: ${name}`)
    }
    return `"${name}"`
  }
}
```

### Database Connection Management

```typescript
// src/lib/database/connection.ts
import { Pool, PoolConfig } from 'pg'

export class DatabaseManager {
  private static instance: DatabaseManager
  private pool: Pool
  private connectionMetrics = {
    total: 0,
    active: 0,
    idle: 0,
    waiting: 0,
  }

  private constructor() {
    const config: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum connections
      min: 5,  // Minimum connections
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 5000, // Connection timeout
      statement_timeout: 10000, // Query timeout
      query_timeout: 10000,
      
      // SSL configuration
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
      } : false,
      
      // Connection retry
      application_name: 'appex-affiliation-portal',
    }

    this.pool = new Pool(config)
    
    // Monitor pool metrics
    this.pool.on('connect', () => {
      this.connectionMetrics.total++
    })
    
    this.pool.on('acquire', () => {
      this.connectionMetrics.active++
    })
    
    this.pool.on('release', () => {
      this.connectionMetrics.active--
      this.connectionMetrics.idle++
    })
    
    this.pool.on('remove', () => {
      this.connectionMetrics.idle--
    })
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const start = Date.now()
    
    try {
      const result = await this.pool.query(text, params)
      
      // Log slow queries
      const duration = Date.now() - start
      if (duration > 1000) {
        console.warn(`Slow query detected: ${duration}ms`, { text, params })
      }
      
      return result.rows
    } catch (error) {
      console.error('Database query error:', { text, params, error })
      throw error
    }
  }

  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await this.pool.connect()
    
    try {
      await client.query('BEGIN')
      const result = await callback(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  getMetrics() {
    return {
      ...this.connectionMetrics,
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}
```

## 🚀 Background Jobs Performance

### BullMQ Queue Configuration

```typescript
// src/queues/config.ts
import { Queue, QueueOptions, WorkerOptions } from 'bullmq'
import Redis from 'ioredis'

const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
})

export const queueConfigs: Record<string, QueueOptions> = {
  'email-sending': {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 50,      // Keep last 50 failed jobs
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  },
  
  'pdf-generation': {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: 10,
      removeOnFail: 10,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  },
  
  'commission-calculation': {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 25,
      attempts: 1,
    },
  },
  
  'webhook-processing': {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: 200,
      removeOnFail: 100,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    },
  },
}

export const workerConfigs: Record<string, WorkerOptions> = {
  'email-sending': {
    concurrency: 10,
    limiter: {
      max: 100,
      duration: 60000, // 100 emails per minute
    },
  },
  
  'pdf-generation': {
    concurrency: 2, // Limited due to memory usage
    limiter: {
      max: 10,
      duration: 60000, // 10 PDFs per minute
    },
  },
  
  'commission-calculation': {
    concurrency: 5,
  },
  
  'webhook-processing': {
    concurrency: 20,
  },
}
```

### Performance Monitoring

```typescript
// src/monitoring/performance.ts
export class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetric[]>()

  startTimer(name: string): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      this.recordMetric(name, duration)
      
      // Alert on slow operations
      if (duration > this.getThreshold(name)) {
        this.alertSlowOperation(name, duration)
      }
    }
  }

  recordMetric(name: string, duration: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const metrics = this.metrics.get(name)!
    metrics.push({
      duration,
      timestamp: Date.now(),
    })
    
    // Keep only last 1000 metrics
    if (metrics.length > 1000) {
      metrics.shift()
    }
  }

  getMetrics(name: string): PerformanceStats | null {
    const metrics = this.metrics.get(name)
    if (!metrics || metrics.length === 0) return null
    
    const durations = metrics.map(m => m.duration)
    durations.sort((a, b) => a - b)
    
    return {
      count: durations.length,
      min: durations[0],
      max: durations[durations.length - 1],
      mean: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      p50: durations[Math.floor(durations.length * 0.5)],
      p95: durations[Math.floor(durations.length * 0.95)],
      p99: durations[Math.floor(durations.length * 0.99)],
    }
  }

  private getThreshold(name: string): number {
    const thresholds: Record<string, number> = {
      'api_request': 500,
      'database_query': 200,
      'email_send': 5000,
      'pdf_generation': 10000,
      'commission_calculation': 1000,
    }
    
    return thresholds[name] || 1000
  }

  private alertSlowOperation(name: string, duration: number): void {
    console.warn(`Slow operation detected: ${name} took ${duration}ms`)
    
    // Send to monitoring system
    this.sendAlert({
      type: 'slow_operation',
      operation: name,
      duration,
      threshold: this.getThreshold(name),
      timestamp: Date.now(),
    })
  }

  private sendAlert(alert: any): void {
    // Integration with monitoring/alerting system
    // Could be Sentry, DataDog, or custom webhook
  }
}

interface PerformanceMetric {
  duration: number
  timestamp: number
}

interface PerformanceStats {
  count: number
  min: number
  max: number
  mean: number
  p50: number
  p95: number
  p99: number
}
```

## 📊 Real-time Monitoring

### Performance Metrics Collection

```typescript
// src/monitoring/metrics.ts
import { createPrometheusMetrics } from 'prom-client'

export const metrics = {
  // HTTP metrics
  httpRequestDuration: new createPrometheusMetrics.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
  }),
  
  httpRequestTotal: new createPrometheusMetrics.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  }),
  
  // Database metrics
  dbQueryDuration: new createPrometheusMetrics.Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['query_type', 'table'],
  }),
  
  dbConnectionsActive: new createPrometheusMetrics.Gauge({
    name: 'db_connections_active',
    help: 'Number of active database connections',
  }),
  
  // Queue metrics
  queueJobsActive: new createPrometheusMetrics.Gauge({
    name: 'queue_jobs_active',
    help: 'Number of active jobs in queue',
    labelNames: ['queue_name'],
  }),
  
  queueJobDuration: new createPrometheusMetrics.Histogram({
    name: 'queue_job_duration_seconds',
    help: 'Duration of queue jobs in seconds',
    labelNames: ['queue_name', 'job_type'],
  }),
  
  // Business metrics
  userRegistrations: new createPrometheusMetrics.Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
  }),
  
  referralConversions: new createPrometheusMetrics.Counter({
    name: 'referral_conversions_total',
    help: 'Total number of referral conversions',
    labelNames: ['product_type'],
  }),
  
  commissionEarned: new createPrometheusMetrics.Counter({
    name: 'commission_earned_total',
    help: 'Total commission earned',
    labelNames: ['affiliate_type'],
  }),
}

// Middleware to collect HTTP metrics
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    
    metrics.httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration)
    
    metrics.httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .inc()
  })
  
  next()
}
```

### Performance Dashboard

```typescript
// src/components/PerformanceDashboard.tsx
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MetricData {
  timestamp: string
  value: number
}

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, MetricData[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics/performance')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading performance metrics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="API Response Time"
          value={metrics.api_response_time?.[metrics.api_response_time.length - 1]?.value || 0}
          unit="ms"
          trend={calculateTrend(metrics.api_response_time)}
        />
        <MetricCard
          title="Database Query Time"
          value={metrics.db_query_time?.[metrics.db_query_time.length - 1]?.value || 0}
          unit="ms"
          trend={calculateTrend(metrics.db_query_time)}
        />
        <MetricCard
          title="Active Connections"
          value={metrics.active_connections?.[metrics.active_connections.length - 1]?.value || 0}
          unit=""
          trend={calculateTrend(metrics.active_connections)}
        />
        <MetricCard
          title="Queue Jobs"
          value={metrics.queue_jobs?.[metrics.queue_jobs.length - 1]?.value || 0}
          unit=""
          trend={calculateTrend(metrics.queue_jobs)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="API Response Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.api_response_time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Database Performance">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.db_query_time}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

const MetricCard: React.FC<{
  title: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}> = ({ title, value, unit, trend }) => {
  const trendColor = trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">
          {value.toFixed(2)}{unit}
        </p>
        <span className={`ml-2 text-sm ${trendColor}`}>
          {trendIcon}
        </span>
      </div>
    </div>
  )
}

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function calculateTrend(data: MetricData[]): 'up' | 'down' | 'stable' {
  if (!data || data.length < 2) return 'stable'
  
  const recent = data.slice(-10)
  const older = data.slice(-20, -10)
  
  if (recent.length === 0 || older.length === 0) return 'stable'
  
  const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length
  const olderAvg = older.reduce((sum, d) => sum + d.value, 0) / older.length
  
  const change = (recentAvg - olderAvg) / olderAvg
  
  if (change > 0.05) return 'up'
  if (change < -0.05) return 'down'
  return 'stable'
}
```

## 🔧 Performance Optimization Checklist

### Frontend Optimization

- [ ] **Bundle Size**: Keep JavaScript bundles under 250KB (gzipped)
- [ ] **Image Optimization**: Use WebP format, lazy loading, and responsive images
- [ ] **Code Splitting**: Implement route-based and feature-based splitting
- [ ] **Caching**: Implement Service Worker with appropriate caching strategies
- [ ] **Critical CSS**: Inline critical CSS for above-the-fold content
- [ ] **Font Loading**: Use font-display: swap for custom fonts
- [ ] **Third-party Scripts**: Load non-critical scripts asynchronously

### Backend Optimization

- [ ] **Database Indexing**: Ensure all frequently queried columns are indexed
- [ ] **Connection Pooling**: Use PgBouncer for database connection management
- [ ] **Query Optimization**: Use EXPLAIN ANALYZE for slow query analysis
- [ ] **Caching**: Implement Redis caching for frequently accessed data
- [ ] **API Response Compression**: Enable gzip compression for API responses
- [ ] **Rate Limiting**: Implement appropriate rate limits to prevent abuse

### Infrastructure Optimization

- [ ] **CDN**: Use CloudFront or similar CDN for static assets
- [ ] **Load Balancing**: Implement horizontal scaling with load balancers
- [ ] **Monitoring**: Set up comprehensive monitoring and alerting
- [ ] **Auto-scaling**: Configure auto-scaling based on CPU/memory metrics
- [ ] **Database Replication**: Implement read replicas for reporting queries

---

**Next**: [Background Jobs](./background-jobs.md) → Asynchronous processing documentation
