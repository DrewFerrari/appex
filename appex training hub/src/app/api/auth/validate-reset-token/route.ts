import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token") as string

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      )
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date() // Token must not be expired
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { valid: false, error: "Invalid reset token" },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { valid: false, error: "Reset token has expired" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { valid: true, email: user.email },
      { status: 200 }
    )

  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
