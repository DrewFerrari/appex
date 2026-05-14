import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id

    if (!userId && session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      userId = user?.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get courses count
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { userId }
    })

    const coursesEnrolled = enrollments.length
    const coursesCompleted = enrollments.filter(e => e.completedAt).length

    // Get certificates
    const certificatesCount = await prisma.certificate.count({
      where: { userId }
    })

    // Get total time (sum of completed lessons duration)
    const completedLessons = await prisma.userProgress.findMany({
      where: {
        userId,
        status: "COMPLETED"
      },
      include: {
        lesson: {
          select: { durationMinutes: true }
        }
      }
    })

    const totalMinutes = completedLessons.reduce((sum, p) => sum + (p.lesson.durationMinutes || 0), 0)
    const hoursLearned = Math.round(totalMinutes / 60)

    // Calculate streak (consecutive days with activity)
    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true }
    })

    let learningStreak = 0
    if (activities.length > 0) {
      const uniqueDays = Array.from(new Set(activities.map(a => a.createdAt.toISOString().split('T')[0])))
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      
      if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
        learningStreak = 1
        for (let i = 0; i < uniqueDays.length - 1; i++) {
          const current = new Date(uniqueDays[i])
          const next = new Date(uniqueDays[i+1])
          const diff = (current.getTime() - next.getTime()) / 86400000
          if (diff === 1) {
            learningStreak++
          } else {
            break
          }
        }
      }
    }

    return NextResponse.json({
      coursesEnrolled,
      coursesCompleted,
      hoursLearned,
      certificatesEarned: certificatesCount,
      learningStreak
    })

  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
