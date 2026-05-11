"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Award, 
  Clock, 
  Users, 
  Target, 
  CheckCircle, 
  Circle,
  Lock,
  Download,
  Share2,
  Calendar,
  Star,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

interface CertificationCardProps {
  certification: {
    id: string
    title: string
    description: string
    level: string
    duration: string
    requirements: string[]
    enrolledCount: number
    completedCount: number
    icon: string
    color: string
    progress: number
    status: "completed" | "in-progress" | "not-started" | "locked"
    earnedDate?: string | null
    certificateNumber?: string | null
    courses: {
      id: string
      title: string
      completed: boolean
    }[]
  }
}

export function CertificationCard({ certification }: CertificationCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return Award
      case "TrendingUp":
        return TrendingUp
      case "Users":
        return Users
      case "Target":
        return Target
      case "Star":
        return Star
      default:
        return Award
    }
  }
  
  const Icon = getIcon(certification.icon)
  
  const getStatusColor = (status: typeof certification.status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "not-started":
        return "bg-gray-100 text-gray-700"
      case "locked":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: typeof certification.status) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      case "not-started":
        return "Not Started"
      case "locked":
        return "Locked"
      default:
        return status
    }
  }

  const renderActionButton = () => {
    switch (certification.status) {
      case "completed":
        return (
          <div className="space-y-3">
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share Certificate
            </Button>
          </div>
        )
      case "in-progress":
        return (
          <Button className="w-full">
            <Target className="mr-2 h-4 w-4" />
            Continue Learning
          </Button>
        )
      case "not-started":
        return (
          <Button className="w-full">
            <Award className="mr-2 h-4 w-4" />
            Start Certification
          </Button>
        )
      case "locked":
        return (
          <Button className="w-full" disabled>
            <Lock className="mr-2 h-4 w-4" />
            Unlock Previous Certifications
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${certification.color}`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {certification.title}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{certification.level}</Badge>
                <Badge className={getStatusColor(certification.status)}>
                  {getStatusLabel(certification.status)}
                </Badge>
              </div>
            </div>
          </div>
          
          {certification.status === "completed" && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Certificate #</div>
              <div className="font-mono text-sm">{certification.certificateNumber}</div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Description */}
        <p className="text-gray-600">
          {certification.description}
        </p>

        {/* Progress */}
        {certification.status !== "not-started" && certification.status !== "locked" && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progress</span>
              <span className="text-gray-600">{certification.progress}%</span>
            </div>
            <Progress value={certification.progress} className="h-2" />
          </div>
        )}

        {/* Requirements */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
          <ul className="space-y-2">
            {certification.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Course Progress */}
        {certification.courses.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Course Progress</h4>
            <div className="space-y-2">
              {certification.courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {course.completed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-700">{course.title}</span>
                  </div>
                  {course.completed && (
                    <span className="text-xs text-emerald-600">Completed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{certification.enrolledCount.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>{certification.completedCount.toLocaleString()} certified</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{certification.duration}</span>
          </div>
        </div>

        {/* Completion Date */}
        {certification.earnedDate && (
          <div className="flex items-center space-x-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span>Earned on {new Date(certification.earnedDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Action Button */}
        {renderActionButton()}
      </CardContent>
    </Card>
  )
}
