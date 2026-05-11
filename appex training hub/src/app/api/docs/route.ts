import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const businessType = searchParams.get("businessType")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      isPublished: true
    }

    if (category && category !== "all") {
      where.category = category
    }

    if (businessType && businessType !== "all") {
      where.businessType = businessType.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    }

    // Get articles with author info
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        },
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" }
        ],
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ])

    // Format response
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      businessType: article.businessType,
      tags: article.tags,
      readTime: Math.ceil(article.content.length / 1000), // Rough estimate
      viewCount: article.viewCount,
      helpfulCount: article.helpfulCount,
      notHelpfulCount: article.notHelpfulCount,
      author: article.author ? {
        name: article.author.name,
        avatar: article.author.avatarUrl
      } : null,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }))

    return NextResponse.json({
      articles: formattedArticles,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching documentation:", error)
    return NextResponse.json(
      { error: "Failed to fetch documentation" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, excerpt, content, category, businessType, tags, authorId } = body

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        businessType: businessType ? businessType.toUpperCase() : null,
        tags: tags || [],
        authorId,
        isPublished: false
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}
