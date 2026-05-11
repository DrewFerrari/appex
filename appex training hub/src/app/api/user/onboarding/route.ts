import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface OnboardingData {
  business_type?: string
  experience_level?: string
  learning_goals?: string[]
  time_commitment?: string
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Find user by email since NextAuth session doesn't include id by default
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const userId = user.id
    const data: OnboardingData = await request.json()

    // Save or update user profile
    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        businessType: (data.business_type as any) || 'RETAIL',
        experienceLevel: (data.experience_level as any) || 'BEGINNER',
        learningGoals: data.learning_goals?.join(',') || 'basic_ops',
        timeCommitment: data.time_commitment || '3-5',
        completedAt: new Date(),
      },
      create: {
        userId,
        businessType: (data.business_type as any) || 'RETAIL',
        experienceLevel: (data.experience_level as any) || 'BEGINNER',
        learningGoals: data.learning_goals?.join(',') || 'basic_ops',
        timeCommitment: data.time_commitment || '3-5',
        completedAt: new Date(),
      }
    })

    // Generate personalized learning path
    const learningPath = await generateLearningPath(userId, data)

    // Create user progress records for recommended courses
    for (const course of learningPath.recommendedCourses) {
      // First get a lesson for this course (assuming first lesson)
      const firstLesson = await prisma.lesson.findFirst({
        where: {
          module: {
            courseId: course.id
          }
        }
      })

      if (firstLesson) {
        await prisma.userProgress.upsert({
          where: {
            userId_lessonId: {
              userId,
              lessonId: firstLesson.id
            }
          },
          update: {
            status: 'NOT_STARTED'
          },
          create: {
            userId,
            courseId: course.id,
            lessonId: firstLesson.id,
            status: 'NOT_STARTED'
          }
        })
      }
    }

    // Track onboarding completion
    await prisma.userActivity.create({
      data: {
        userId,
        activityType: 'onboarding_completed',
        metadata: {
          business_type: data.business_type,
          experience_level: data.experience_level,
          learning_goals: data.learning_goals,
          time_commitment: data.time_commitment,
          courses_recommended: learningPath.recommendedCourses.length
        }
      }
    })

    return NextResponse.json({
      success: true,
      learningPath,
      message: 'Onboarding completed successfully'
    })

  } catch (error) {
    console.error('Error saving onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}

async function generateLearningPath(userId: string, data: OnboardingData) {
  const { business_type, experience_level, learning_goals, time_commitment } = data

  // Get all available courses
  const allCourses = await prisma.course.findMany({
    where: {
      isPublished: true
    },
    orderBy: {
      displayOrder: 'asc'
    }
  })

  // Filter and rank courses based on user preferences
  let recommendedCourses = allCourses.map((course: any) => {
    let score = 0

    // Business type matching
    if (course.businessType === business_type) {
      score += 10
    }

    // Experience level matching
    if (course.level === experience_level) {
      score += 5
    } else if (experience_level === 'BEGINNER' && course.level === 'BEGINNER') {
      score += 8
    }

    // Learning goals matching
    if (learning_goals?.includes('basic_ops') && course.title.toLowerCase().includes('getting started')) {
      score += 7
    }
    if (learning_goals?.includes('inventory') && course.title.toLowerCase().includes('inventory')) {
      score += 7
    }
    if (learning_goals?.includes('sales') && course.title.toLowerCase().includes('sales')) {
      score += 7
    }
    if (learning_goals?.includes('staff') && course.title.toLowerCase().includes('staff')) {
      score += 7
    }
    if (learning_goals?.includes('advanced') && course.level === 'ADVANCED') {
      score += 7
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      businessType: course.businessType,
      duration: course.durationMinutes || 60, // Default to 60 minutes if null
      displayOrder: course.displayOrder,
      score,
      mandatory: course.businessType === business_type || course.level === 'BEGINNER'
    }
  })

  // Sort by score (highest first) then by displayOrder
  recommendedCourses.sort((a: any, b: any) => {
    if (a.score !== b.score) {
      return b.score - a.score
    }
    return a.displayOrder - b.displayOrder
  })

  // Select top courses based on time commitment
  const hoursPerWeek = parseInt(time_commitment?.split('-')[0] || '3')
  let totalHours = 0
  const selectedCourses: any[] = []

  for (const course of recommendedCourses) {
    if (totalHours + course.duration <= hoursPerWeek * 4) { // 4 weeks of content
      selectedCourses.push(course)
      totalHours += course.duration
    }
    if (selectedCourses.length >= 5) break // Limit to 5 courses initially
  }

  // Ensure at least 3 courses are selected
  if (selectedCourses.length < 3) {
    const additionalCourses = recommendedCourses
      .filter((c: any) => !selectedCourses.find((s: any) => s.id === c.id))
      .slice(0, 3 - selectedCourses.length)
    
    selectedCourses.push(...additionalCourses)
  }

  const estimatedWeeks = Math.ceil(totalHours / Math.max(1, hoursPerWeek))

  return {
    recommendedCourses: selectedCourses.map((course: any, index: number) => ({
      ...course,
      order: index + 1
    })),
    estimatedWeeks,
    totalHours,
    weeklySchedule: generateWeeklySchedule(selectedCourses, hoursPerWeek)
  }
}

function generateWeeklySchedule(courses: any[], hoursPerWeek: number) {
  const schedule: any[] = []
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  
  courses.forEach((course: any, courseIndex: number) => {
    const sessionsPerWeek = Math.ceil(course.duration / 4) // Spread over 4 weeks
    const hoursPerSession = Math.min(2, hoursPerWeek / sessionsPerWeek)
    
    for (let week = 1; week <= 4; week++) {
      for (let session = 0; session < sessionsPerWeek && session < daysOfWeek.length; session++) {
        schedule.push({
          week,
          day: daysOfWeek[session],
          courseId: course.id,
          courseTitle: course.title,
          duration: hoursPerSession,
          order: week * 10 + session
        })
      }
    }
  })

  return schedule.sort((a, b) => a.order - b.order).slice(0, 20) // Limit to 20 sessions
}
