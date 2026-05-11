import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'
import { prisma } from '../config/database'
import { SMSService } from './sms.service'
export class EmailService {
  private static readonly transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || process.env.SMTP_HOST,
    port: Number(process.env.EMAIL_PORT) || Number(process.env.SMTP_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true' || process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || process.env.SMTP_USER,
      pass: process.env.EMAIL_PASS || process.env.SMTP_PASS
    }
  })

  static async sendEmailVerification(userId: string, email: string, fullName: string): Promise<void> {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store OTP in database
      await prisma.verificationToken.create({
        data: {
          userId,
          token: await bcrypt.hash(otp, 10),
          type: 'EMAIL_VERIFICATION',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
      })

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Email - AppEx Affiliation Portal',
        html: this.getEmailVerificationTemplate(fullName, otp)
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Failed to send email verification:', error)
      throw error
    }
  }

  static async sendPhoneVerification(userId: string, phone: string, fullName: string): Promise<void> {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store OTP in database
      await prisma.verificationToken.create({
        data: {
          userId,
          token: await bcrypt.hash(otp, 10),
          type: 'PHONE_VERIFICATION',
          expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
      })

      // Send via SMS service
      await SMSService.sendVerificationSMS(phone, otp, fullName)
    } catch (error) {
      console.error('Failed to send phone verification:', error)
      throw error
    }
  }

  static async sendPasswordReset(email: string, resetLink: string, ipAddress: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Reset Your Password - AppEx Affiliation Portal',
        html: this.getPasswordResetTemplate(resetLink, ipAddress)
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Failed to send password reset email:', error)
      throw error
    }
  }

  static async sendPasswordResetConfirmation(email: string, ipAddress: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Password Reset Successful - AppEx Affiliation Portal',
        html: this.getPasswordResetConfirmationTemplate(ipAddress)
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Failed to send password reset confirmation:', error)
      throw error
    }
  }

  static async sendSecurityAlert(email: string, alertType: string, details: any): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: `Security Alert - ${alertType}`,
        html: this.getSecurityAlertTemplate(alertType, details)
      }

      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Failed to send security alert:', error)
      throw error
    }
  }

  private static getEmailVerificationTemplate(fullName: string, otp: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .otp { background: #f3f4f6; border: 2px solid #e5e7eb; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AppEx Affiliation Portal</h1>
          <p>Email Verification</p>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Thank you for joining AppEx Affiliation Portal! To complete your registration, please verify your email address using the code below:</p>
          <div class="otp">${otp}</div>
          <p><strong>This code will expire in 15 minutes.</strong></p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2026 AppEx Affiliation Portal | Built for Zimbabwean entrepreneurs</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `
  }

  private static getPasswordResetTemplate(resetLink: string, ipAddress: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AppEx Affiliation Portal</h1>
          <p>Password Reset Request</p>
        </div>
        <div class="content">
          <h2>Password Reset</h2>
          <p>We received a request to reset your password for your AppEx Affiliation Portal account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <div class="warning">
            <strong>Security Notice:</strong>
            <ul>
              <li>The reset request was initiated from IP: ${ipAddress}</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will remain unchanged if you don't click the link</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>© 2026 AppEx Affiliation Portal | Built for Zimbabwean entrepreneurs</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `
  }

  private static getPasswordResetConfirmationTemplate(ipAddress: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Changed</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .success { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AppEx Affiliation Portal</h1>
          <p>Password Changed Successfully</p>
        </div>
        <div class="content">
          <h2>Password Changed</h2>
          <div class="success">
            <strong>✅ Your password has been changed successfully!</strong>
          </div>
          <p>Here are the details of your password change:</p>
          <ul>
            <li><strong>Time:</strong> ${new Date().toISOString()}</li>
            <li><strong>IP Address:</strong> ${ipAddress}</li>
          </ul>
          <p>If you didn't change your password, please contact our security team immediately:</p>
          <p>
            📧 Email: security@appex.co.zw<br>
            📞 Phone: +263 242 123 456<br>
            📍 Address: 123 Samora Machel Ave, Harare, Zimbabwe
          </p>
        </div>
        <div class="footer">
          <p>© 2026 AppEx Affiliation Portal | Built for Zimbabwean entrepreneurs</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `
  }

  private static getSecurityAlertTemplate(alertType: string, details: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Security Alert</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #991b1b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .alert { background: #fef2f2; border: 1px solid #ef4444; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AppEx Affiliation Portal</h1>
          <p>Security Alert</p>
        </div>
        <div class="content">
          <h2>Security Alert: ${alertType}</h2>
          <div class="alert">
            <strong>⚠️ Security Alert Detected</strong>
            <p>We detected unusual activity on your account:</p>
            <ul>
              <li><strong>Event:</strong> ${alertType}</li>
              <li><strong>Time:</strong> ${new Date().toISOString()}</li>
              <li><strong>IP Address:</strong> ${details.ipAddress || 'Unknown'}</li>
              <li><strong>Location:</strong> ${details.location || 'Unknown'}</li>
            </ul>
          </div>
          <p><strong>Recommended Actions:</strong></p>
          <ul>
            <li>Review your account activity</li>
            <li>Change your password if you don't recognize this activity</li>
            <li>Enable two-factor authentication</li>
            <li>Contact support if you need assistance</li>
          </ul>
          <p>If you didn't perform this action, please contact our security team immediately:</p>
          <p>
            📧 Email: security@appex.co.zw<br>
            📞 Phone: +263 242 123 456<br>
            📍 Address: 123 Samora Machel Ave, Harare, Zimbabwe
          </p>
        </div>
        <div class="footer">
          <p>© 2026 AppEx Affiliation Portal | Built for Zimbabwean entrepreneurs</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `
  }
}
