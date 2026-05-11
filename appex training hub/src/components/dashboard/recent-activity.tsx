"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Award, Play, FileText, Clock } from "lucide-react"

interface ActivityItem {
  id: string
  type: "course" | "certificate" | "video" | "article"
  title: string
  description: string
  timestamp: string
  progress?: number
  icon: React.ReactNode
  badgeColor: string
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "course":
      return <BookOpen className="h-4 w-4" />
    case "certificate":
      return <Award className="h-4 w-4" />
    case "video":
      return <Play className="h-4 w-4" />
    case "article":
      return <FileText className="h-4 w-4" />
    default:
      return <BookOpen className="h-4 w-4" />
  }
}

function getBadgeColor(type: ActivityItem["type"]) {
  switch (type) {
    case "course":
      return "bg-blue-100 text-blue-700"
    case "certificate":
      return "bg-green-100 text-green-700"
    case "video":
      return "bg-purple-100 text-purple-700"
    case "article":
      return "bg-orange-100 text-orange-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "course",
      title: "Getting Started with AppEx Retail",
      description: "Completed Module 3: Customer Management",
      timestamp: "2 hours ago",
      progress: 75,
      icon: getActivityIcon("course"),
      badgeColor: getBadgeColor("course")
    },
    {
      id: "2",
      type: "certificate",
      title: "AppEx Certified User",
      description: "Earned certification for Retail Management",
      timestamp: "1 day ago",
      icon: getActivityIcon("certificate"),
      badgeColor: getBadgeColor("certificate")
    },
    {
      id: "3",
      type: "video",
      title: "POS Operations Tutorial",
      description: "Watched 15 minutes of advanced POS features",
      timestamp: "2 days ago",
      icon: getActivityIcon("video"),
      badgeColor: getBadgeColor("video")
    },
    {
      id: "4",
      type: "article",
      title: "Inventory Best Practices",
      description: "Read guide on managing stock levels",
      timestamp: "3 days ago",
      icon: getActivityIcon("article"),
      badgeColor: getBadgeColor("article")
    },
    {
      id: "5",
      type: "course",
      title: "Restaurant Management Fundamentals",
      description: "Started new course module",
      timestamp: "1 week ago",
      progress: 15,
      icon: getActivityIcon("course"),
      badgeColor: getBadgeColor("course")
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${activity.badgeColor} mt-1`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">
                    {activity.title}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {activity.description}
                </p>
                {activity.progress && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div 
                      className="bg-emerald-600 h-1.5 rounded-full" 
                      style={{ width: `${activity.progress}%` }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
