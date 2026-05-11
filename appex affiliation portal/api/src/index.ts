import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { checkDatabaseHealth, checkRedisHealth, disconnectDatabase } from './config/database'
import authRoutes from './routes/auth.routes'
import affiliateRoutes from './routes/affiliate.routes'
import commissionRoutes from './routes/commission.routes'
import adminRoutes from './routes/admin.routes'
const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Fingerprint']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.url
  const ip = req.ip
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`)
  
  next()
})

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const [dbHealth, redisHealth] = await Promise.all([
      checkDatabaseHealth(),
      checkRedisHealth(require('./config/database').redis, 'main'),
      checkRedisHealth(require('./config/database').sessionRedis, 'sessions'),
      checkRedisHealth(require('./config/database').cacheRedis, 'cache')
    ])
    
    const allHealthy = dbHealth.status === 'healthy' && 
                      redisHealth.status === 'healthy'
    
    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        redis: redisHealth
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/affiliate', affiliateRoutes)
app.use('/api/commission', commissionRoutes)
app.use('/api/admin', adminRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'The requested resource was not found',
    path: req.originalUrl,
    method: req.method
  })
})

// Global error handler
app.use((error: any, req, res, next) => {
  console.error('Unhandled error:', error)
  
  // Don't send error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  res.status(error.status || 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: isDevelopment ? error.message : 'An unexpected error occurred',
    ...(isDevelopment && { stack: error.stack })
  })
})

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`)
  
  try {
    await disconnectDatabase()
    console.log('Database connections closed.')
    
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  gracefulShutdown('uncaughtException')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  gracefulShutdown('unhandledRejection')
})

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 AppEx Affiliation Portal API Server`)
  console.log(`📍 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`)
  
  // Initial health check
  const dbHealth = await checkDatabaseHealth()
  if (dbHealth.status !== 'healthy') {
    console.error('⚠️  Database health check failed:', dbHealth)
  }
})

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`)
  } else {
    console.error('❌ Server error:', error)
  }
  process.exit(1)
})

export default app
