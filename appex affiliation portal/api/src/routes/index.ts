import { Router } from 'express'
import authRoutes from './auth.routes'
import affiliateRoutes from './affiliate.routes'
import commissionRoutes from './commission.routes'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API routes
router.use('/auth', authRoutes)
router.use('/affiliate', affiliateRoutes)
router.use('/commission', commissionRoutes)

// API documentation
router.get('/', (req, res) => {
  res.json({
    name: 'AppEx Affiliation Portal API',
    version: '1.0.0',
    description: 'Complete affiliate marketing platform for Zimbabwean entrepreneurs',
    endpoints: {
      auth: '/api/auth',
      affiliate: '/api/affiliate',
      commission: '/api/commission'
    },
    documentation: '/api/docs',
    health: '/api/health'
  })
})

export default router
