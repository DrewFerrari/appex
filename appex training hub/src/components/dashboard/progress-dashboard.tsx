"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, Clock, Award } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CourseProgressProps {
  title: string
  progress: number
  lastAccessed: string
  thumbnail: string
}

function CourseProgress({ title, progress, lastAccessed, thumbnail }: CourseProgressProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-500 mb-2">Last accessed {lastAccessed}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProgressDashboard() {
  const stats = [
    {
      title: "Courses Enrolled",
      value: 12,
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-100"
    },
    {
      title: "Completed", 
      value: 8,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: "bg-green-100"
    },
    {
      title: "Hours Learned",
      value: "42.5",
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-100"
    },
    {
      title: "Certificates",
      value: 6,
      icon: <Award className="h-6 w-6 text-orange-600" />,
      color: "bg-orange-100"
    }
  ]

  const inProgressCourses = [
    {
      title: "Getting Started with AppEx Retail",
      progress: 75,
      lastAccessed: "2 days ago",
      thumbnail: "/api/placeholder/64/64"
    },
    {
      title: "Advanced Inventory Management",
      progress: 45,
      lastAccessed: "1 week ago", 
      thumbnail: "/api/placeholder/64/64"
    },
    {
      title: "Restaurant POS Operations",
      progress: 90,
      lastAccessed: "3 hours ago",
      thumbnail: "/api/placeholder/64/64"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}
