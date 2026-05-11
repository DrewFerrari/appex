"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Calendar, 
  Clock, 
  Eye,
  Share2,
  Bookmark,
  FileText,
  Link as LinkIcon
} from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"

interface DocumentationViewerProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    businessType?: string | null
    tags: string[]
    readTime: number
    viewCount: number
    helpfulCount: number
    notHelpfulCount: number
    author: {
      name: string
      avatar: string
      bio?: string
    }
    publishedAt: string
    updatedAt: string
    toc: { id: string; title: string }[]
    related: {
      id: string
      title: string
      slug: string
      excerpt: string
    }[]
  }
  onHelpful?: (helpful: boolean) => void
}

export function DocumentationViewer({ article, onHelpful }: DocumentationViewerProps) {
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  const handleHelpful = (isHelpful: boolean) => {
    setHelpful(isHelpful ? "yes" : "no")
    onHelpful?.(isHelpful)
    
    if (!isHelpful) {
      setShowFeedbackForm(true)
    }
  }

  const handleFeedbackSubmit = () => {
    // TODO: Submit feedback to API
    console.log("Feedback submitted:", feedback)
    setShowFeedbackForm(false)
    setFeedback("")
  }

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

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-8">
      {/* Article Header */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(article.category)}>
              {getCategoryLabel(article.category)}
            </Badge>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">
              {article.readTime} min read
            </span>
            {article.businessType && (
              <>
                <span className="text-sm text-gray-500">•</span>
                <Badge variant="outline" className="text-xs">
                  {article.businessType}
                </Badge>
              </>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <p className="text-gray-600 text-lg">
            {article.excerpt}
          </p>

          {/* Author and Meta */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-3">
              <Image 
                src={article.author.avatar}
                alt={article.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h4 className="font-medium text-gray-900">{article.author.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount.toLocaleString()} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{article.helpfulCount} helpful</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Table of Contents */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {article.toc.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToHeading(item.id)}
                  className="text-emerald-600 hover:text-emerald-700 text-sm transition-colors text-left"
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Article Content */}
      <Card>
        <CardContent className="p-8">
          <div className="prose prose-emerald max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children, ...props }) => (
                  <h1 {...props} className="text-3xl font-bold text-gray-900 mb-6 scroll-mt-20" id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 {...props} className="text-2xl font-bold text-gray-900 mb-4 mt-8 scroll-mt-20" id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 {...props} className="text-xl font-bold text-gray-900 mb-3 mt-6 scroll-mt-20" id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
                    {children}
                  </h3>
                ),
                img: ({ src, alt, ...props }) => (
                  <img 
                    {...props} 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg shadow-md my-6 max-w-full h-auto"
                  />
                ),
                pre: ({ children, ...props }) => (
                  <pre {...props} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
                    {children}
                  </pre>
                ),
                code: ({ children, ...props }) => (
                  <code {...props} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                a: ({ href, children, ...props }) => (
                  <a 
                    {...props} 
                    href={href} 
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children, ...props }) => (
                  <ul {...props} className="list-disc list-inside space-y-2 my-4">
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol {...props} className="list-decimal list-inside space-y-2 my-4">
                    {children}
                  </ol>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote {...props} className="border-l-4 border-emerald-500 pl-4 my-6 italic text-gray-600">
                    {children}
                  </blockquote>
                )
              }}
              rehypePlugins={[rehypeHighlight]}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Helpful Section */}
      <Card>
        <CardContent className="p-6 bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Was this article helpful?</p>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => handleHelpful(true)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  helpful === "yes" 
                    ? "bg-emerald-600 text-white" 
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Yes
              </button>
              <button
                onClick={() => handleHelpful(false)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  helpful === "no" 
                    ? "bg-red-600 text-white" 
                    : "bg-white border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                No
              </button>
            </div>
            
            {showFeedbackForm && (
              <div className="text-left max-w-md mx-auto">
                <Textarea
                  placeholder="How can we improve this article?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <div className="flex justify-center">
                  <Button onClick={handleFeedbackSubmit}>
                    Submit Feedback
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Share and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              Last updated: {new Date(article.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      {article.related.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold text-gray-900">Related Articles</h3>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {article.related.map((related) => (
                <Link
                  key={related.id}
                  href={`/docs/${related.slug}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {related.excerpt}
                  </p>
                  <div className="flex items-center text-emerald-600 text-sm mt-2">
                    Read more →
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
