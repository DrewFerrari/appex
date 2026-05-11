"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Award,
  Eye,
  Clock,
  Target,
  Calendar,
  Download
} from "lucide-react"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock analytics data - replace with actual API calls
  const overviewStats = {
    totalUsers: 5234,
    activeUsers: 1247,
    newUsers: 156,
    totalCourses: 24,
    totalEnrollments: 892,
    completionRate: 76.8,
    totalCertificates: 892,
    avgSessionDuration: 15.2
  }

  const userGrowth = [
    { date: "2024-03-17", users: 4850, newUsers: 12 },
    { date: "2024-03-18", users: 4862, newUsers: 18 },
    { date: "2024-03-19", users: 4880, newUsers: 22 },
    { date: "2024-03-20", users: 4905, newUsers: 25 },
    { date: "2024-03-21", users: 4934, newUsers: 29 },
    { date: "2024-03-22", users: 4968, newUsers: 34 },
    { date: "2024-03-23", users: 5001, newUsers: 33 },
    { date: "2024-03-24", users: 5034, newUsers: 38 },
    { date: "2024-03-25", users: 5078, newUsers: 44 },
    { date: "2024-03-26", users: 5123, newUsers: 45 },
    { date: "2024-03-27", users: 5167, newUsers: 47 },
    { date: "2024-03-28", users: 5201, newUsers: 51 },
    { date: "2024-03-29", users: 5234, newUsers: 52 }
  ]

  const coursePerformance = [
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      enrollments: 1247,
      completions: 892,
      completionRate: 71.5,
      avgRating: 4.8,
      totalHours: 2341,
      businessType: "RETAIL"
    },
    {
      id: "2",
      title: "Advanced Inventory Management",
      enrollments: 456,
      completions: 234,
      completionRate: 51.3,
      avgRating: 4.9,
      totalHours: 1234,
      businessType: "RETAIL"
    },
    {
      id: "3",
      title: "Restaurant POS Operations",
      enrollments: 789,
      completions: 567,
      completionRate: 71.9,
      avgRating: 4.7,
      totalHours: 1876,
      businessType: "RESTAURANT"
    }
  ]

  const topContent = [
    {
      type: "article",
      title: "Getting Started with AppEx Retail",
      views: 2341,
      uniqueViews: 1876,
      avgReadTime: 12.5,
      helpfulCount: 156
    },
    {
      type: "video",
      title: "POS Operations Tutorial",
      views: 3421,
      uniqueViews: 2890,
      avgWatchTime: 18.2,
      engagement: 78.5
    },
    {
      type: "course",
      title: "Getting Started with AppEx Retail",
      enrollments: 1247,
      completions: 892,
      completionRate: 71.5
    }
  ]

  const businessTypeStats = [
    { type: "RETAIL", users: 2341, courses: 8, enrollments: 1567, completionRate: 74.2 },
    { type: "RESTAURANT", users: 1234, courses: 6, enrollments: 890, completionRate: 68.9 },
    { type: "HARDWARE", users: 567, courses: 4, enrollments: 234, completionRate: 71.2 },
    { type: "GROCERY", users: 456, courses: 3, enrollments: 189, completionRate: 76.5 },
    { type: "PHARMACY", users: 345, courses: 2, enrollments: 123, completionRate: 81.3 },
    { type: "BUTCHERY", users: 291, courses: 1, enrollments: 89, completionRate: 69.2 }
  ]

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center space-x-1 text-sm">
                  {getTrendIcon("up")}
                  <span className={getTrendColor("up")}>+12.5%</span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.activeUsers.toLocaleString()}</p>
                <div className="flex items-center space-x-1 text-sm">
                  {getTrendIcon("up")}
                  <span className={getTrendColor("up")}>+8.3%</span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.completionRate}%</p>
                <div className="flex items-center space-x-1 text-sm">
                  {getTrendIcon("up")}
                  <span className={getTrendColor("up")}>+3.4%</span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900">{overviewStats.avgSessionDuration}m</p>
                <div className="flex items-center space-x-1 text-sm">
                  {getTrendIcon("down")}
                  <span className={getTrendColor("down")}>-1.2%</span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursePerformance.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {course.businessType}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {course.enrollments} enrolled
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.totalHours.toLocaleString()} total hours
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="font-medium">{course.completionRate}%</span>
                      <span className="text-gray-500 ml-1">completion</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{course.avgRating}</span>
                      <span className="text-gray-500 ml-1">rating</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Type Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Type Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessTypeStats.map((stat) => (
                <div key={stat.type} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{stat.type}</h4>
                      <Badge variant="outline" className="text-xs">
                        {stat.courses} courses
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {stat.users.toLocaleString()} users
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{stat.completionRate}%</div>
                    <div className="text-sm text-gray-500">completion rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((content, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    content.type === "article" ? "bg-blue-100" :
                    content.type === "video" ? "bg-purple-100" :
                    "bg-green-100"
                  }`}>
                    {
                      content.type === "article" ? <BookOpen className="h-4 w-4 text-blue-600" /> :
                      content.type === "video" ? <Eye className="h-4 w-4 text-purple-600" /> :
                      <Award className="h-4 w-4 text-green-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{content.title}</h4>
                    <div className="text-xs text-gray-500">
                      {content.type === "article" && `${content.views} views, ${content.helpfulCount} helpful`}
                      {content.type === "video" && `${content.views} views, ${content.engagement}% engagement`}
                      {content.type === "course" && `${content.enrollments} enrolled, ${content.completionRate}% completion`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
