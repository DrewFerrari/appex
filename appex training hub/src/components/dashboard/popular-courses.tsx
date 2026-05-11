"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, BookOpen } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  enrolledCount: number
  rating: number
  reviewCount: number
  thumbnail: string
  businessType: string
}

function CourseCard({ course }: { course: Course }) {
  const getLevelColor = (level: Course["level"]) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-700"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={`${getLevelColor(course.level)} text-xs font-medium`}>
            {course.level}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="text-xs bg-white/90">
            {course.businessType}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-xs text-gray-500">({course.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span className="font-medium">{course.enrolledCount.toLocaleString()}</span>
            <span className="text-xs ml-1">students</span>
          </div>
        </div>
        
        <Link href={`/courses/${course.id}`} className="block">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            <BookOpen className="mr-2 h-4 w-4" />
            Start Course
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function PopularCourses() {
  const popularCourses: Course[] = [
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      description: "Learn the fundamentals of AppEx Retail Management System, from initial setup to daily operations.",
      level: "beginner",
      duration: "3 hours",
      enrolledCount: 1247,
      rating: 4.8,
      reviewCount: 324,
      thumbnail: "/images/courses/retail-course.jpg",
      businessType: "Retail"
    },
    {
      id: "2", 
      title: "Advanced Inventory Management",
      description: "Master inventory control, stock tracking, and automated reordering for optimal efficiency.",
      level: "advanced",
      duration: "2.5 hours",
      enrolledCount: 892,
      rating: 4.9,
      reviewCount: 189,
      thumbnail: "/images/courses/inventory-course.jpg",
      businessType: "Retail"
    },
    {
      id: "3",
      title: "Restaurant POS Operations",
      description: "Complete guide to restaurant point of sale, table management, and order processing.",
      level: "intermediate",
      duration: "2 hours",
      enrolledCount: 756,
      rating: 4.7,
      reviewCount: 156,
      thumbnail: "/images/courses/restaurant-course.jpg",
      businessType: "Restaurant"
    },
    {
      id: "4",
      title: "Hardware Store Management",
      description: "Learn to manage hardware store operations, serial number tracking, and contractor accounts.",
      level: "intermediate",
      duration: "3 hours 20 min",
      enrolledCount: 432,
      rating: 4.6,
      reviewCount: 98,
      thumbnail: "/images/courses/hardware-course.jpg",
      businessType: "Hardware"
    },
    {
      id: "5",
      title: "Pharmacy Management Essentials",
      description: "Comprehensive training on prescription management, inventory control, and compliance.",
      level: "beginner",
      duration: "4 hours",
      enrolledCount: 1567,
      rating: 4.8,
      reviewCount: 267,
      thumbnail: "/images/courses/pharmacy-course.jpg",
      businessType: "Pharmacy"
    },
    {
      id: "6",
      title: "Butchery Management System",
      description: "Master meat processing, freshness tracking, and quality control workflows.",
      level: "intermediate",
      duration: "3 hours",
      enrolledCount: 0,
      rating: 4.5,
      reviewCount: 87,
      thumbnail: "/images/courses/butchery-course.jpg",
      businessType: "Butchery"
    }
  ]

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
        <CardTitle className="text-2xl font-bold flex items-center">
          <BookOpen className="mr-3 h-6 w-6" />
          Popular Courses
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link href="/courses" className="block">
            <Button variant="outline" className="w-full h-12 text-emerald-600 border-emerald-300 hover:bg-emerald-50 font-semibold">
              Browse All Courses →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
