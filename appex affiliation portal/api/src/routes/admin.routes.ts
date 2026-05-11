import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Apply authentication to all routes
router.use(authMiddleware)

// Apply admin middleware to all routes
router.use(AdminController.requireAdmin)

// Dashboard routes
router.get('/dashboard', 
  AdminController.getDashboard
)

// User management routes
router.get('/users', 
  AdminController.getUsers
)

router.get('/users/:id', 
  AdminController.getUserDetails
)

router.put('/users/:id/status', 
  AdminController.updateUserStatus
)

// Analytics routes
router.get('/analytics', 
  AdminController.getSystemAnalytics
)

router.get('/leaderboard', 
  AdminController.getCommissionLeaderboard
)

// Security and monitoring routes
router.get('/security-events', 
  AdminController.getSecurityEvents
)

router.get('/system-logs', 
  AdminController.getSystemLogs
)

// Payout management routes
router.get('/payouts', 
  AdminController.getPayoutRequests
)

router.put('/payouts/:id/approve', 
  AdminController.approvePayoutRequest
)

router.put('/payouts/:id/reject', 
  AdminController.rejectPayoutRequest
)

// KYC management routes
router.get('/kyc', 
  AdminController.getKycSubmissions
)

router.put('/kyc/:id/approve', 
  AdminController.approveKycSubmission
)

router.put('/kyc/:id/reject', 
  AdminController.rejectKycSubmission
)

export default router
