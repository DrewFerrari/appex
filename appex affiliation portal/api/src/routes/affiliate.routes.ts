import { Router } from 'express'
import { AffiliateController } from '../controllers/affiliate.controller'
import { rateLimitMiddleware } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Apply authentication to all routes
router.use(authMiddleware)

// Dashboard routes
router.get('/dashboard', 
  rateLimitMiddleware('user', 'dashboard'),
  AffiliateController.getDashboard
)

router.get('/stats', 
  rateLimitMiddleware('user', 'stats'),
  AffiliateController.getStats
)

// Referral routes
router.post('/referrals', 
  rateLimitMiddleware('user', 'create_referral'),
  AffiliateController.createReferral
)

router.put('/referrals/:id', 
  rateLimitMiddleware('user', 'update_referral'),
  AffiliateController.updateReferral
)

router.get('/referrals', 
  rateLimitMiddleware('user', 'get_referrals'),
  AffiliateController.getReferrals
)

router.get('/referrals/link', 
  rateLimitMiddleware('user', 'get_referral_link'),
  AffiliateController.getReferralLink
)

// Commission routes
router.get('/commissions', 
  rateLimitMiddleware('user', 'get_commissions'),
  AffiliateController.getCommissions
)

// Payout routes
router.get('/payouts', 
  rateLimitMiddleware('user', 'get_payouts'),
  AffiliateController.getPayouts
)

router.post('/payouts/request', 
  rateLimitMiddleware('user', 'request_payout'),
  AffiliateController.requestPayout
)

// Analytics routes
router.get('/earnings', 
  rateLimitMiddleware('user', 'get_earnings'),
  AffiliateController.getEarningsSummary
)



export default router
