import bcrypt from 'bcryptjs'
import { prisma } from '../config/database'

export class PasswordHashingService {
  private static readonly BCRYPT_ROUNDS = 12

  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.BCRYPT_ROUNDS)
      return await bcrypt.hash(password, salt)
    } catch (error) {
      console.error('Password hashing error:', error)
      throw new Error('Failed to hash password')
    }
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.error('Password verification error:', error)
      return false
    }
  }

  static async checkPasswordHistory(userId: string, newPassword: string): Promise<boolean> {
    try {
      const recentPasswords = await prisma.passwordHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5 // Check last 5 passwords
      })

      for (const oldPassword of recentPasswords) {
        const isReused = await this.verifyPassword(newPassword, oldPassword.passwordHash)
        if (isReused) {
          return false // Password was reused
        }
      }

      return true // Password is not in recent history
    } catch (error) {
      console.error('Password history check error:', error)
      return false
    }
  }

  static async savePasswordHistory(userId: string, passwordHash: string): Promise<void> {
    try {
      await prisma.passwordHistory.create({
        data: {
          userId,
          passwordHash
        }
      })

      // Clean up old password history (keep only last 5)
      const oldPasswords = await prisma.passwordHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 5,
        select: { id: true }
      })

      if (oldPasswords.length > 0) {
        await prisma.passwordHistory.deleteMany({
          where: {
            id: { in: oldPasswords.map(p => p.id) }
          }
        })
      }
    } catch (error) {
      console.error('Save password history error:', error)
      throw error
    }
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean
    score: number
    feedback: string[]
    requirements: string[]
  } {
    const requirements = []
    const feedback = []
    let score = 0

    // Length requirement (12 minimum)
    if (password.length >= 12) {
      score += 20
    } else {
      requirements.push('At least 12 characters')
      feedback.push('Password should be at least 12 characters long')
    }

    // Uppercase letter
    if (/[A-Z]/.test(password)) {
      score += 20
    } else {
      requirements.push('At least one uppercase letter')
      feedback.push('Include at least one uppercase letter (A-Z)')
    }

    // Lowercase letter
    if (/[a-z]/.test(password)) {
      score += 20
    } else {
      requirements.push('At least one lowercase letter')
      feedback.push('Include at least one lowercase letter (a-z)')
    }

    // Number
    if (/[0-9]/.test(password)) {
      score += 20
    } else {
      requirements.push('At least one number')
      feedback.push('Include at least one number (0-9)')
    }

    // Special character
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20
    } else {
      requirements.push('At least one special character')
      feedback.push('Include at least one special character (!@#$%^&*)')
    }

    const isValid = score >= 80 && requirements.length === 0

    return {
      isValid,
      score,
      feedback,
      requirements
    }
  }
}
