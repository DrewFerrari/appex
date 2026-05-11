"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  BookOpen,
  FileText,
  Video,
  Download
} from "lucide-react"

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("courses")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - replace with actual API calls
  const courses = [
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      businessType: "RETAIL",
      level: "BEGINNER",
      status: "published",
      enrolledCount: 1247,
      completionRate: 78.5,
      createdAt: "2024-03-15",
      updatedAt: "2024-03-20"
    },
    {
      id: "2",
      title: "Advanced Inventory Management",
      businessType: "RETAIL",
      level: "ADVANCED",
      status: "draft",
      enrolledCount: 0,
      completionRate: 0,
      createdAt: "2024-03-18",
      updatedAt: "2024-03-22"
    }
  ]

  const articles = [
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      category: "getting-started",
      businessType: "RETAIL",
      status: "published",
      viewCount: 2341,
      helpfulCount: 156,
      publishedAt: "2024-03-15"
    },
    {
      id: "2",
      title: "POS Operations Guide",
      category: "features",
      businessType: "RETAIL",
      status: "published",
      viewCount: 1876,
      helpfulCount: 142,
      publishedAt: "2024-03-10"
    }
  ]

  const videos = [
    {
      id: "1",
      title: "POS Operations Tutorial",
      businessType: "RETAIL",
      duration: 1800, // seconds
      status: "published",
      viewCount: 3421,
      createdAt: "2024-03-12"
    },
    {
      id: "2",
      title: "Inventory Management Basics",
      businessType: "RETAIL",
      duration: 2400,
      status: "processing",
      viewCount: 0,
      createdAt: "2024-03-20"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "processing":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes}m`
  }

  const renderCoursesTable = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-medium text-gray-900">Course</th>
              <th className="text-left p-4 font-medium text-gray-900">Type</th>
              <th className="text-left p-4 font-medium text-gray-900">Status</th>
              <th className="text-left p-4 font-medium text-gray-900">Students</th>
              <th className="text-left p-4 font-medium text-gray-900">Completion</th>
              <th className="text-left p-4 font-medium text-gray-900">Updated</th>
              <th className="text-left p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-gray-100">
                <td className="p-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-500">ID: {course.id}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {course.businessType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {course.level.toLowerCase()}
                    </Badge>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium">{course.enrolledCount.toLocaleString()}</div>
                    <div className="text-gray-500">enrolled</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium">{course.completionRate}%</div>
                    <div className="text-gray-500">avg completion</div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderArticlesTable = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-medium text-gray-900">Article</th>
              <th className="text-left p-4 font-medium text-gray-900">Category</th>
              <th className="text-left p-4 font-medium text-gray-900">Status</th>
              <th className="text-left p-4 font-medium text-gray-900">Views</th>
              <th className="text-left p-4 font-medium text-gray-900">Helpful</th>
              <th className="text-left p-4 font-medium text-gray-900">Published</th>
              <th className="text-left p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-gray-100">
                <td className="p-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-500">ID: {article.id}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    {article.businessType && (
                      <Badge variant="outline" className="text-xs">
                        {article.businessType}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(article.status)}>
                    {article.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium">{article.viewCount.toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium">{article.helpfulCount}</div>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderVideosTable = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-medium text-gray-900">Video</th>
              <th className="text-left p-4 font-medium text-gray-900">Type</th>
              <th className="text-left p-4 font-medium text-gray-900">Duration</th>
              <th className="text-left p-4 font-medium text-gray-900">Status</th>
              <th className="text-left p-4 font-medium text-gray-900">Views</th>
              <th className="text-left p-4 font-medium text-gray-900">Created</th>
              <th className="text-left p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-b border-gray-100">
                <td className="p-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <p className="text-sm text-gray-500">ID: {video.id}</p>
                  </div>
                </td>
                <td className="p-4">
                  {video.businessType && (
                    <Badge variant="outline" className="text-xs">
                      {video.businessType}
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-sm">
                  {formatDuration(video.duration)}
                </td>
                <td className="p-4">
                  <Badge className={getStatusColor(video.status)}>
                    {video.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium">{video.viewCount.toLocaleString()}</div>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(video.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === "courses" 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Courses</span>
        </button>
        
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === "articles" 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Articles</span>
        </button>
        
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            activeTab === "videos" 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Videos</span>
        </button>
      </div>

      {activeTab === "courses" && renderCoursesTable()}
      {activeTab === "articles" && renderArticlesTable()}
      {activeTab === "videos" && renderVideosTable()}
    </div>
  )
}
