import { MainLayout } from "@/components/layout/main-layout"
import { DocumentationCard } from "@/components/docs/documentation-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data - in production, this would come from API
const getDocumentationByCategory = (category: string) => {
  const allDocs = [
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      slug: "getting-started-retail",
      excerpt: "Complete guide to setting up and configuring AppEx Retail Management System for your business.",
      category: "getting-started",
      businessType: "Retail",
      tags: ["setup", "configuration", "retail"],
      readTime: 15,
      viewCount: 2341,
      helpfulCount: 156,
      author: {
        name: "Sarah Chen",
        avatar: "/logo.png"
      },
      publishedAt: "2024-03-15",
      updatedAt: "2024-03-20"
    },
    {
      id: "2",
      title: "POS Operations Guide",
      slug: "pos-operations",
      excerpt: "Learn how to process sales, handle payments, and manage daily POS operations efficiently.",
      category: "features",
      businessType: "Retail",
      tags: ["pos", "sales", "payments"],
      readTime: 12,
      viewCount: 1876,
      helpfulCount: 142,
      author: {
        name: "Mike Johnson",
        avatar: "/logo.png"
      },
      publishedAt: "2024-03-10",
      updatedAt: "2024-03-18"
    },
    {
      id: "3",
      title: "Inventory Management Best Practices",
      slug: "inventory-best-practices",
      excerpt: "Master inventory control, stock tracking, and automated reordering for optimal efficiency.",
      category: "best-practices",
      businessType: "Retail",
      tags: ["inventory", "stock", "reordering"],
      readTime: 18,
      viewCount: 1543,
      helpfulCount: 98,
      author: {
        name: "Sarah Chen",
        avatar: "/logo.png"
      },
      publishedAt: "2024-03-08",
      updatedAt: "2024-03-16"
    }
  ]

  if (category === "all") {
    return allDocs
  }

  return allDocs.filter(doc => doc.category === category)
}

const getCategoryInfo = (category: string) => {
  switch (category) {
    case "getting-started":
      return {
        title: "Getting Started Guides",
        description: "Complete setup and configuration guides for new users"
      }
    case "features":
      return {
        title: "Feature Guides",
        description: "In-depth guides for all AppEx features and modules"
      }
    case "best-practices":
      return {
        title: "Best Practices",
        description: "Expert tips and industry best practices for optimal system usage"
      }
    case "troubleshooting":
      return {
        title: "Troubleshooting",
        description: "Solutions to common issues and error messages"
      }
    default:
      return {
        title: category,
        description: `All ${category} documentation`
      }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const docs = getDocumentationByCategory(resolvedParams.category)
  const categoryInfo = getCategoryInfo(resolvedParams.category)

  if (!docs.length && resolvedParams.category !== "all") {
    notFound()
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="outline" asChild nativeButton={false}>
            <Link href="/docs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documentation
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryInfo.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <DocumentationCard key={doc.id} doc={doc} />
          ))}
        </div>

        {/* No Results */}
        {docs.length === 0 && resolvedParams.category !== "all" && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No documentation found
            </h3>
            <p className="text-gray-600 mb-6">
              There are currently no articles in this category.
            </p>
            <Button asChild nativeButton={false}>
              <Link href="/docs">
                Browse All Documentation
              </Link>
            </Button>
          </div>
        )}

        {/* Load More */}
        {docs.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
