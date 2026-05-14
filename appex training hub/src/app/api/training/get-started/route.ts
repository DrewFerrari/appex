import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userEmail = session.user.email.toLowerCase()
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        profile: true,
        courseEnrollments: {
          include: {
            course: true
          }
        },
        userProgress: {
          include: {
            course: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userId = user.id
    
    // 1. Check for New User (No enrollments AND no profile)
    if (user.courseEnrollments.length === 0 && !user.profile) {
      return NextResponse.json({
        status: "new_user",
        nextAction: "onboarding",
        message: "Welcome to AppEx Learning Hub! Let's get you started."
      })
    }
    
    // 2. Check for Incomplete Previous Learning
    const incompleteEnrollments = user.courseEnrollments.filter(e => !e.completedAt)
    const inProgressLessons = user.userProgress.filter(p => p.status === "IN_PROGRESS")
    
    if (incompleteEnrollments.length > 0 || inProgressLessons.length > 0) {
      // Get the most recently updated progress
      const recentProgress = [...user.userProgress].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ).slice(0, 3)

      return NextResponse.json({
        status: "incomplete_previous",
        nextAction: "resume_learning",
        data: {
          incompleteCourses: recentProgress.map(p => ({
            id: p.courseId,
            title: p.course.title,
            progress: p.progressPercentage,
            lastAccessed: p.updatedAt
          }))
        },
        message: "You have incomplete courses to resume"
      })
    }
    
    // 3. Check if completed everything
    const totalPublishedCourses = await prisma.course.count({ where: { isPublished: true } })
    const completedEnrollments = user.courseEnrollments.filter(e => e.completedAt)
    
    if (completedEnrollments.length > 0 && completedEnrollments.length >= totalPublishedCourses) {
      return NextResponse.json({
        status: "completed_all",
        nextAction: "advanced_learning",
        data: {
          completedCourses: completedEnrollments.length,
          totalCourses: totalPublishedCourses,
          certificates: await prisma.certificate.count({ where: { userId } })
        },
        message: "Congratulations! You've completed all available courses"
      })
    }

    // 4. Default to returning user
    return NextResponse.json({
      status: "returning_user",
      nextAction: "dashboard",
      data: {
        completedCourses: completedEnrollments.length,
        totalCourses: totalPublishedCourses
      },
      message: "Welcome back! Continue your learning journey."
    })

  } catch (error) {
    console.error("Error in get-started:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
