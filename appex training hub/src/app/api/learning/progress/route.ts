import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get("lessonId")
    const courseId = searchParams.get("courseId")

    if (lessonId) {
      // Get progress for specific lesson
      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        }
      })

      return NextResponse.json(progress || { status: "not_started", progressPercentage: 0 })
    }

    if (courseId) {
      // Get progress for entire course
      const courseProgress = await prisma.userProgress.findMany({
        where: {
          userId,
          lesson: {
            module: {
              courseId
            }
          }
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              durationMinutes: true,
              module: {
                select: {
                  id: true,
                  title: true,
                  moduleOrder: true
                }
              }
            }
          }
        }
      })

      // Calculate overall course progress
      const totalLessons = courseProgress.length
      const completedLessons = courseProgress.filter(p => p.status === "COMPLETED").length
      const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      return NextResponse.json({
        courseId,
        overallProgress,
        totalLessons,
        completedLessons,
        lessons: courseProgress.map(progress => ({
          lessonId: progress.lessonId,
          lessonTitle: progress.lesson.title,
          moduleId: progress.lesson.module.id,
          moduleTitle: progress.lesson.module.title,
          moduleOrder: progress.lesson.module.moduleOrder,
          status: progress.status,
          progressPercentage: progress.progressPercentage,
          lastPositionSeconds: progress.lastPositionSeconds,
          completedAt: progress.completedAt
        }))
      })
    }

    // Get all user progress
    const allProgress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            contentType: true,
            module: {
              select: {
                id: true,
                title: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                    businessType: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({
      progress: allProgress.map(p => ({
        id: p.id,
        lessonId: p.lessonId,
        lessonTitle: p.lesson.title,
        lessonType: p.lesson.contentType,
        courseId: p.lesson.module.course.id,
        courseTitle: p.lesson.module.course.title,
        businessType: p.lesson.module.course.businessType,
        moduleId: p.lesson.module.id,
        moduleTitle: p.lesson.module.title,
        status: p.status,
        progressPercentage: p.progressPercentage,
        lastPositionSeconds: p.lastPositionSeconds,
        completedAt: p.completedAt,
        updatedAt: p.updatedAt
      }))
    })
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { lessonId, status, progressPercentage, lastPositionSeconds } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID required" },
        { status: 400 }
      )
    }

    // Get courseId from lesson through module
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          select: { courseId: true }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      )
    }

    const courseId = lesson.module.courseId

    // Update or create progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        status: status || "in_progress",
        progressPercentage: progressPercentage || 0,
        lastPositionSeconds: lastPositionSeconds || 0,
        completedAt: status === "completed" ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        userId,
        courseId,
        lessonId,
        status: status || "IN_PROGRESS",
        progressPercentage: progressPercentage || 0,
        lastPositionSeconds: lastPositionSeconds || 0,
        completedAt: status === "completed" ? new Date() : null
      }
    })

    return NextResponse.json(progress, { status: 201 })
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}
