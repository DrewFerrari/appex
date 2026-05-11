import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") // "all", "courses", "articles", "videos"
    const businessType = searchParams.get("businessType")
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!query || query.length < 2) {
      return NextResponse.json({
        results: [],
        message: "Query must be at least 2 characters"
      })
    }

    const results: any[] = []

    // Search courses
    if (!type || type === "all" || type === "courses") {
      const courseWhere: any = {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      }

      if (businessType && businessType !== "all") {
        courseWhere.businessType = businessType.toUpperCase()
      }

      const courses = await prisma.course.findMany({
        where: courseWhere,
        include: {
          _count: {
            select: {
              enrollments: true,
              certificates: true
            }
          }
        },
        take: limit,
        orderBy: { displayOrder: "asc" }
      })

      results.push(...courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        type: "course",
        url: `/courses/${course.id}`,
        thumbnail: course.thumbnailUrl,
        businessType: course.businessType,
        level: course.level.toLowerCase(),
        duration: course.durationMinutes,
        enrolledCount: course._count.enrollments,
        rating: 4.5, // Mock rating - would calculate from reviews
        createdAt: course.createdAt
      })))
    }

    // Search articles
    if (!type || type === "all" || type === "articles") {
      const articleWhere: any = {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } }
        ]
      }

      if (businessType && businessType !== "all") {
        articleWhere.businessType = businessType.toUpperCase()
      }

      const articles = await prisma.article.findMany({
        where: articleWhere,
        include: {
          author: {
            select: {
              name: true,
              avatarUrl: true
            }
          }
        },
        take: limit,
        orderBy: { publishedAt: "desc" }
      })

      results.push(...articles.map(article => ({
        id: article.id,
        title: article.title,
        description: article.excerpt,
        type: "article",
        url: `/docs/${article.slug}`,
        thumbnail: null,
        businessType: article.businessType,
        category: article.category,
        tags: article.tags,
        readTime: Math.ceil(article.content.length / 1000),
        viewCount: article.viewCount,
        author: article.author ? {
          name: article.author.name,
          avatar: article.author.avatarUrl
        } : null,
        publishedAt: article.publishedAt
      })))
    }

    // Search video tutorials
    if (!type || type === "all" || type === "videos") {
      const videoWhere: any = {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      }

      if (businessType && businessType !== "all") {
        videoWhere.businessType = businessType.toUpperCase()
      }

      const videos = await prisma.videoTutorial.findMany({
        where: videoWhere,
        take: limit,
        orderBy: { createdAt: "desc" }
      })

      results.push(...videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        type: "video",
        url: `/videos/${video.id}`,
        thumbnail: video.thumbnailUrl,
        businessType: video.businessType,
        duration: video.durationSeconds ? Math.floor(video.durationSeconds / 60) : null,
        viewCount: video.viewCount,
        tags: video.tags,
        createdAt: video.createdAt
      })))
    }

    // Sort results by relevance (simple implementation)
    const sortedResults = results.sort((a, b) => {
      const aScore = getRelevanceScore(a, query)
      const bScore = getRelevanceScore(b, query)
      return bScore - aScore
    })

    // Limit total results
    const limitedResults = sortedResults.slice(0, limit * 3)

    return NextResponse.json({
      query,
      results: limitedResults,
      total: limitedResults.length,
      hasMore: limitedResults.length >= limit * 3
    })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}

function getRelevanceScore(item: any, query: string): number {
  let score = 0
  const queryLower = query.toLowerCase()

  // Exact title match
  if (item.title.toLowerCase() === queryLower) {
    score += 100
  }
  // Title starts with query
  else if (item.title.toLowerCase().startsWith(queryLower)) {
    score += 80
  }
  // Title contains query
  else if (item.title.toLowerCase().includes(queryLower)) {
    score += 60
  }

  // Description contains query
  if (item.description && item.description.toLowerCase().includes(queryLower)) {
    score += 40
  }

  // Tag matches
  if (item.tags && Array.isArray(item.tags)) {
    item.tags.forEach((tag: string) => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 30
      }
    })
  }

  // Recent items get bonus
  if (item.createdAt) {
    const daysSinceCreation = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreation < 30) {
      score += 10
    }
  }

  return score
}
