import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.article.update({
      where: { id: article.id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    // Generate table of contents from content
    const generateTOC = (content: string) => {
      const headings = content.match(/^#{1,3}\s+(.+)$/gm) || []
      return headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 1
        const title = heading.replace(/^#+\s+/, '')
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return { id, title, level }
      })
    }

    // Find related articles
    const relatedArticles = await prisma.article.findMany({
      where: {
        id: { not: article.id },
        isPublished: true,
        OR: [
          { category: article.category },
          { businessType: article.businessType },
          { tags: { contains: article.tags } }
        ]
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true
      }
    })

    // Format response
    const formattedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      businessType: article.businessType,
      tags: article.tags,
      readTime: Math.ceil(article.content.length / 1000),
      viewCount: article.viewCount + 1,
      helpfulCount: article.helpfulCount,
      notHelpfulCount: article.notHelpfulCount,
      author: article.author ? {
        name: article.author.name,
        avatar: article.author.avatarUrl
      } : null,
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      toc: generateTOC(article.content),
      related: relatedArticles
    }

    return NextResponse.json(formattedArticle)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { action, userId } = body

    const article = await prisma.article.findUnique({
      where: { slug }
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    switch (action) {
      case "helpful":
        const { helpful } = body
        
        // Check if user already voted
        const existingVote = await prisma.article.findUnique({
          where: { id: article.id },
          select: { helpfulCount: true, notHelpfulCount: true }
        })

        if (!existingVote) {
          return NextResponse.json(
            { error: "Article not found" },
            { status: 404 }
          )
        }

        // Update helpful count (in a real app, you'd track per user)
        const updatedArticle = await prisma.article.update({
          where: { id: article.id },
          data: {
            [helpful ? "helpfulCount" : "notHelpfulCount"]: {
              increment: 1
            }
          }
        })

        return NextResponse.json({
          helpfulCount: updatedArticle.helpfulCount,
          notHelpfulCount: updatedArticle.notHelpfulCount
        })

      case "feedback":
        const { feedback } = body
        
        // In a real app, you'd save this feedback to a separate table
        console.log(`Feedback for article ${article.id}:`, feedback)
        
        return NextResponse.json({ message: "Feedback submitted" })

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}
