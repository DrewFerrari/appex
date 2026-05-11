import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Mock user state based on email for demonstration
    const userEmail = session.user.email.toLowerCase()
    
    // Simulate different user states based on email
    if (userEmail.includes('new') || userEmail.includes('demo')) {
      return NextResponse.json({
        status: "new_user",
        nextAction: "onboarding",
        message: "Welcome to AppEx Learning Hub!"
      })
    }
    
    if (userEmail.includes('progress') || userEmail.includes('incomplete')) {
      return NextResponse.json({
        status: "incomplete_previous",
        nextAction: "resume_learning",
        data: {
          incompleteCourses: [
            {
              id: "1",
              title: "Getting Started with AppEx Retail",
              progress: 65,
              lastAccessed: new Date().toISOString()
            },
            {
              id: "2", 
              title: "Advanced Inventory Management",
              progress: 30,
              lastAccessed: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        },
        message: "You have incomplete courses to resume"
      })
    }
    
    if (userEmail.includes('completed') || userEmail.includes('advanced')) {
      return NextResponse.json({
        status: "completed_all",
        nextAction: "advanced_learning",
        data: {
          completedCourses: 12,
          totalCourses: 12,
          certificates: 3
        },
        message: "Congratulations! You've completed all courses"
      })
    }

    // Default to returning user with some progress
    return NextResponse.json({
      status: "returning_user",
      nextAction: "dashboard",
      data: {
        completedCourses: 3,
        totalCourses: 12
      },
      message: "Continue your learning journey"
    })

  } catch (error) {
    console.error("Error in get-started:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
