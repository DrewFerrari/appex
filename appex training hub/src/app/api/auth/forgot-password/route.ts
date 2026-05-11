import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import crypto from "crypto"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { 
          message: "Password reset link sent successfully",
          email: email
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      }
    })

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    // Send email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #10b981; margin-bottom: 20px; font-size: 24px;">Password Reset Request</h1>
            
            <div style="background: #10b981; color: white; padding: 15px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px;">
              <img src="https://appex.co.zw/logo.png" alt="AppEx Logo" style="width: 40px; height: 40px;">
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              Hi ${user.name || 'there'},
            </p>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
              We received a request to reset your password for your AppEx Learning Hub account. Click the button below to reset your password:
            </p>
            
            <a href="${resetLink}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 20px 0;">
              Reset Password
            </a>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 20px;">
              This link will expire in 1 hour for security reasons. If you didn't request this password reset, you can safely ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                This is an automated message from AppEx Learning Hub. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      </div>
    `

    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'AppEx Support <support@appex.co.zw>',
        to: [email],
        subject: 'Reset Your AppEx Learning Hub Password',
        html: emailContent,
      })

      return NextResponse.json(
        { 
          message: "Password reset link sent successfully",
          email: email
        },
        { status: 200 }
      )
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
