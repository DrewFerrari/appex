import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessType = searchParams.get("businessType")
    const level = searchParams.get("level")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      isPublished: true
    }

    if (businessType && businessType !== "all") {
      where.businessType = businessType.toUpperCase()
    }

    if (level && level !== "all") {
      where.level = level.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    // Get courses with counts
    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          modules: {
            include: {
              lessons: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              certificates: true
            }
          }
        },
        orderBy: [
          { displayOrder: "asc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit
      }),
      prisma.course.count({ where })
    ])

    // Format response
    const formattedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      businessType: course.businessType,
      level: course.level.toLowerCase(),
      durationMinutes: course.durationMinutes,
      thumbnailUrl: course.thumbnailUrl,
      videoIntroUrl: course.videoIntroUrl,
      modules: course.modules.length,
      enrolledCount: course._count.enrollments,
      completedCount: course._count.certificates,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }))

    return NextResponse.json({
      courses: formattedCourses,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, businessType, level, durationMinutes, thumbnailUrl, videoIntroUrl } = body

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        businessType: businessType.toUpperCase(),
        level: level.toUpperCase(),
        durationMinutes,
        thumbnailUrl,
        videoIntroUrl,
        isPublished: false
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}
