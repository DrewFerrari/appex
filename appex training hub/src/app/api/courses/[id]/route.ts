import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id || request.headers.get("x-user-id")
    
    if (!userId && session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      userId = user?.id
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { moduleOrder: "asc" },
          include: {
            lessons: {
              orderBy: { lessonOrder: "asc" }
            }
          }
        },
        enrollments: {
          where: { userId: userId || "" },
          take: 1
        },
        certificates: {
          where: { userId: userId || "" },
          take: 1
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      )
    }

    // Check if user is enrolled
    const isEnrolled = course.enrollments.length > 0
    const hasCertificate = course.certificates.length > 0

    // Format response
    const formattedCourse = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      businessType: course.businessType,
      level: course.level.toLowerCase(),
      durationMinutes: course.durationMinutes,
      thumbnailUrl: course.thumbnailUrl,
      videoIntroUrl: course.videoIntroUrl,
      isPublished: course.isPublished,
      displayOrder: course.displayOrder,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      modules: course.modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        moduleOrder: module.moduleOrder,
        durationMinutes: module.durationMinutes,
        videoUrl: module.videoUrl,
        lessons: module.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          contentType: lesson.contentType.toLowerCase(),
          content: lesson.content,
          videoUrl: lesson.videoUrl,
          documentUrl: lesson.documentUrl,
          durationMinutes: lesson.durationMinutes,
          lessonOrder: lesson.lessonOrder,
          isFreePreview: lesson.isFreePreview
        }))
      })),
      userProgress: {
        isEnrolled,
        hasCertificate,
        enrollmentDate: isEnrolled ? course.enrollments[0].enrolledAt : null,
        completedDate: hasCertificate ? course.certificates[0].issueDate : null
      }
    }

    return NextResponse.json(formattedCourse)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params
    const session = await getServerSession(authOptions)
    let userId = session?.user?.id || request.headers.get("x-user-id")
    
    if (!userId && session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      userId = user?.id
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case "enroll":
        // Check if already enrolled
        const existingEnrollment = await prisma.courseEnrollment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId
            }
          }
        })

        if (existingEnrollment) {
          return NextResponse.json(
            { error: "Already enrolled in this course" },
            { status: 400 }
          )
        }

        // Create enrollment
        const enrollment = await prisma.courseEnrollment.create({
          data: {
            userId,
            courseId
          }
        })

        return NextResponse.json(enrollment, { status: 201 })

      case "complete":
        // Mark course as completed
        const completedEnrollment = await prisma.courseEnrollment.update({
          where: {
            userId_courseId: {
              userId,
              courseId
            }
          },
          data: {
            completedAt: new Date()
          }
        })

        // Generate certificate
        const certificateNumber = `APPX-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        
        const certificate = await prisma.certificate.create({
          data: {
            userId,
            courseId,
            certificateNumber,
            recipientName: "Certificate Holder",
            courseTitle: "Course Completion",
            issueDate: new Date(),
            learningOutcomes: JSON.stringify(["Demonstrate comprehensive understanding of AppEx system"])
          }
        })

        return NextResponse.json({
          enrollment: completedEnrollment,
          certificate
        })

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error updating course:", error)
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    )
  }
}
