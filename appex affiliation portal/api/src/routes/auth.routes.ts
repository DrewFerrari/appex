import { Router } from 'express'
import { 
  AuthController,
  deviceFingerprintMiddleware,
  rateLimitMiddleware
} from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// Apply device fingerprinting to all routes
router.use(deviceFingerprintMiddleware)

// Public routes (no authentication required)
router.post('/register', 
  rateLimitMiddleware('user', 'register'),
  AuthController.register
)

router.post('/login', 
  rateLimitMiddleware('user', 'login'),
  AuthController.login
)

router.post('/verify-email', 
  rateLimitMiddleware('user', 'verify'),
  AuthController.verifyEmail
)

router.post('/verify-phone', 
  rateLimitMiddleware('user', 'verify'),
  AuthController.verifyPhone
)

router.post('/resend-verification', 
  rateLimitMiddleware('user', 'resend'),
  AuthController.resendVerification
)

router.post('/forgot-password', 
  rateLimitMiddleware('user', 'password_reset'),
  AuthController.forgotPassword
)

router.post('/reset-password', 
  rateLimitMiddleware('user', 'password_reset'),
  AuthController.resetPassword
)

router.post('/refresh', 
  rateLimitMiddleware('user', 'refresh'),
  AuthController.refreshToken
)

// Protected routes (authentication required)
router.use(authMiddleware)

router.post('/verify-mfa', 
  rateLimitMiddleware('user', 'mfa_verify'),
  AuthController.verifyMfa
)

router.post('/logout', 
  rateLimitMiddleware('user', 'logout'),
  AuthController.logout
)

router.post('/change-password', 
  rateLimitMiddleware('user', 'change_password'),
  AuthController.changePassword
)

router.get('/me', AuthController.getCurrentUser)

export default router
