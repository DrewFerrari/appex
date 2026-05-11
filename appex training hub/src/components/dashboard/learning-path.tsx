"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  PlayCircle, 
  CheckCircle, 
  Lock, 
  Star, 
  Clock,
  Target,
  BookOpen
} from "lucide-react"
import Link from "next/link"

interface PathStep {
  id: string
  title: string
  description: string
  duration: string
  status: "completed" | "current" | "locked"
  type: "course" | "video" | "quiz"
}

function StepItem({ step }: { step: PathStep }) {
  const getIcon = () => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "current":
        return <PlayCircle className="h-5 w-5 text-emerald-600" />
      case "locked":
        return <Lock className="h-5 w-5 text-gray-400" />
    }
  }

  const getTypeIcon = () => {
    switch (step.type) {
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <PlayCircle className="h-4 w-4" />
      case "quiz":
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg ${
      step.status === "completed" ? "bg-green-50 border border-green-200" :
      step.status === "current" ? "bg-emerald-50 border border-emerald-200" :
      "bg-gray-50 border border-gray-200"
    }`}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className={`font-medium ${
            step.status === "completed" ? "text-green-900" :
            step.status === "current" ? "text-emerald-900" :
            "text-gray-500"
          }`}>
            {step.title}
          </h4>
          <Badge variant="outline" className="text-xs">
            {getTypeIcon()}
            <span className="ml-1">{step.type}</span>
          </Badge>
        </div>
        <p className={`text-sm mb-2 ${
          step.status === "completed" ? "text-green-700" :
          step.status === "current" ? "text-emerald-700" :
          "text-gray-500"
        }`}>
          {step.description}
        </p>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {step.duration}
          </div>
          {step.status === "current" && (
            <span className="text-emerald-600 font-medium">In Progress</span>
          )}
          {step.status === "completed" && (
            <span className="text-green-600 font-medium">Completed</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function LearningPath() {
  const currentPath = {
    title: "AppEx Retail Fundamentals",
    description: "Complete this learning path to earn your Retail Management certification",
    progress: 65,
    totalSteps: 6,
    completedSteps: 4
  }

  const steps: PathStep[] = [
    {
      id: "1",
      title: "Getting Started with AppEx",
      description: "Learn the basics of AppEx interface and navigation",
      duration: "30 min",
      status: "completed",
      type: "course"
    },
    {
      id: "2", 
      title: "System Setup & Configuration",
      description: "Configure your business settings and preferences",
      duration: "45 min",
      status: "completed",
      type: "course"
    },
    {
      id: "3",
      title: "Product Management",
      description: "Add and manage your product catalog",
      duration: "1 hour",
      status: "completed",
      type: "course"
    },
    {
      id: "4",
      title: "POS Operations Video",
      description: "Watch tutorial on processing sales and payments",
      duration: "20 min",
      status: "completed",
      type: "video"
    },
    {
      id: "5",
      title: "Inventory Management",
      description: "Master stock control and reordering",
      duration: "1.5 hours",
      status: "current",
      type: "course"
    },
    {
      id: "6",
      title: "Final Assessment Quiz",
      description: "Test your knowledge and earn certification",
      duration: "30 min",
      status: "locked",
      type: "quiz"
    }
  ]

  return (
    <Card className="h-fit">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="text-lg font-bold flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Your Learning Path
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{currentPath.title}</h3>
            <Badge className="bg-blue-100 text-blue-700">
              {currentPath.completedSteps}/{currentPath.totalSteps}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{currentPath.description}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{currentPath.progress}%</span>
            </div>
            <Progress value={currentPath.progress} className="h-2" />
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <StepItem key={step.id} step={step} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link href="/learning-path" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              View Full Learning Path
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
