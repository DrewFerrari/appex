"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp,
  FileText,
  Video,
  Clock,
  Target
} from "lucide-react"

export function AdminStats() {
  // Mock stats data - replace with actual API calls
  const stats = [
    {
      title: "Total Users",
      value: "5,234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Courses",
      value: "24",
      change: "+2 new",
      trend: "up",
      icon: BookOpen,
      color: "bg-emerald-500"
    },
    {
      title: "Certificates Issued",
      value: "892",
      change: "+18.2%",
      trend: "up",
      icon: Award,
      color: "bg-purple-500"
    },
    {
      title: "Completion Rate",
      value: "76.8%",
      change: "+3.4%",
      trend: "up",
      icon: Target,
      color: "bg-orange-500"
    }
  ]

  const contentStats = [
    {
      title: "Documentation Articles",
      value: "156",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Video Tutorials",
      value: "89",
      icon: Video,
      color: "bg-purple-500"
    },
    {
      title: "FAQ Items",
      value: "234",
      icon: Clock,
      color: "bg-green-500"
    },
    {
      title: "Downloads",
      value: "45",
      icon: FileText,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.trend === "up" && (
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">{stat.change}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contentStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
