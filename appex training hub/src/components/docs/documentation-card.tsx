"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Clock, 
  Eye, 
  ThumbsUp, 
  User,
  Calendar,
  Tag
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface DocumentationCardProps {
  doc: {
    id: string
    title: string
    slug: string
    excerpt: string
    category: string
    businessType?: string | null
    tags: string[]
    readTime: number
    viewCount: number
    helpfulCount: number
    author: {
      name: string
      avatar: string
    }
    publishedAt: string
    updatedAt: string
  }
}

export function DocumentationCard({ doc }: DocumentationCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "getting-started":
        return "bg-green-100 text-green-700"
      case "features":
        return "bg-blue-100 text-blue-700"
      case "best-practices":
        return "bg-purple-100 text-purple-700"
      case "troubleshooting":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "getting-started":
        return "Getting Started"
      case "features":
        return "Features"
      case "best-practices":
        return "Best Practices"
      case "troubleshooting":
        return "Troubleshooting"
      default:
        return category
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(doc.category)}>
              {getCategoryLabel(doc.category)}
            </Badge>
            {doc.businessType && (
              <Badge variant="outline" className="text-xs">
                {doc.businessType}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <FileText className="h-3 w-3 mr-1" />
            <span>Article</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          <Link href={`/docs/${doc.slug}`} className="hover:text-emerald-600">
            {doc.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {doc.excerpt}
        </p>

        {/* Tags */}
        {doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {doc.tags.slice(0, 3).map((tag) => (
              <div key={tag} className="flex items-center text-xs text-gray-500">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
            {doc.tags.length > 3 && (
              <span className="text-xs text-gray-400">
                +{doc.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{doc.readTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{doc.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{doc.helpfulCount}</span>
            </div>
          </div>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Image 
              src={doc.author.avatar}
              alt={doc.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">{doc.author.name}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(doc.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Read Button */}
        <div className="mt-auto">
          <Link href={`/docs/${doc.slug}`} className="block">
            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Read Article
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
