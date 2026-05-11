import { Router } from 'express'
import { CommissionController } from '../controllers/commission.controller'
import { rateLimitMiddleware } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Apply authentication to all routes
router.use(authMiddleware)

// Commission calculation routes
router.post('/calculate', 
  rateLimitMiddleware('user', 'calculate_commission'),
  CommissionController.calculateCommission
)

router.put('/confirm/:id', 
  rateLimitMiddleware('user', 'confirm_commission'),
  CommissionController.confirmCommission
)

router.put('/paid/:id', 
  rateLimitMiddleware('user', 'mark_paid'),
  CommissionController.markCommissionPaid
)

// Analytics routes
router.get('/analytics', 
  rateLimitMiddleware('user', 'get_analytics'),
  CommissionController.getAnalytics
)

router.get('/leaderboard', 
  rateLimitMiddleware('user', 'get_leaderboard'),
  CommissionController.getLeaderboard
)

router.get('/details/:id', 
  rateLimitMiddleware('user', 'get_commission_details'),
  CommissionController.getCommissionDetails
)

router.get('/summary', 
  rateLimitMiddleware('user', 'get_commission_summary'),
  CommissionController.getCommissionSummary
)

router.get('/trends', 
  rateLimitMiddleware('user', 'get_commission_trends'),
  CommissionController.getCommissionTrends
)

router.get('/pending', 
  rateLimitMiddleware('user', 'get_pending_commissions'),
  CommissionController.getPendingCommissions
)

router.get('/referral/:referralId', 
  rateLimitMiddleware('user', 'get_commissions_by_referral'),
  CommissionController.getCommissionsByReferral
)

export default router
