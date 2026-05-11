import { MainLayout } from "@/components/layout/main-layout"
import { CourseCard } from "@/components/courses/course-card"
import { CourseFilters } from "@/components/courses/course-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Filter, Grid, List } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function CoursesPage() {
  // Mock data - replace with actual API call
  const courses = [
    {
      id: "1",
      title: "Getting Started with AppEx Retail",
      description: "Learn the fundamentals of AppEx Retail Management System, from initial setup to daily operations.",
      level: "beginner" as const,
      duration: 180,
      modules: 5,
      rating: 4.8,
      reviews: 324,
      enrolledCount: 1247,
      thumbnail: "/images/courses/retail-course.jpg",
      businessType: "Retail",
      progress: 75
    },
    {
      id: "2",
      title: "Advanced Inventory Management",
      description: "Master inventory control, stock tracking, and automated reordering for optimal efficiency.",
      level: "advanced" as const,
      duration: 150,
      modules: 4,
      rating: 4.9,
      reviews: 189,
      enrolledCount: 892,
      thumbnail: "/images/courses/inventory-course.jpg",
      businessType: "Retail",
      progress: 45
    },
    {
      id: "3",
      title: "Restaurant POS Operations",
      description: "Complete guide to restaurant point of sale, table management, and order processing.",
      level: "intermediate" as const,
      duration: 120,
      modules: 4,
      rating: 4.7,
      reviews: 156,
      enrolledCount: 756,
      thumbnail: "/images/courses/restaurant-course.jpg",
      businessType: "Restaurant",
      progress: 0
    },
    {
      id: "4",
      title: "Hardware Store Management",
      description: "Learn to manage hardware store operations, serial number tracking, and contractor accounts.",
      level: "intermediate" as const,
      duration: 200,
      modules: 6,
      rating: 4.6,
      reviews: 98,
      enrolledCount: 432,
      thumbnail: "/images/courses/hardware-course.jpg",
      businessType: "Hardware",
      progress: 0
    },
    {
      id: "5",
      title: "Pharmacy Management Essentials",
      description: "Comprehensive training on prescription management, inventory control, and compliance.",
      level: "beginner" as const,
      duration: 240,
      modules: 8,
      rating: 4.8,
      reviews: 267,
      enrolledCount: 1567,
      thumbnail: "/images/courses/pharmacy-course.jpg",
      businessType: "Pharmacy",
      progress: 0
    },
    {
      id: "6",
      title: "Butchery Management System",
      description: "Master meat processing, freshness tracking, and quality control workflows.",
      level: "intermediate" as const,
      duration: 180,
      modules: 5,
      rating: 4.5,
      reviews: 87,
      enrolledCount: 234,
      thumbnail: "/images/courses/butchery-course.jpg",
      businessType: "Butchery",
      progress: 0
    }
  ]

  const businessTypes = ["All", "Retail", "Restaurant", "Hardware", "Grocery", "Pharmacy", "Butchery"]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
            <p className="text-gray-600">
              Master AppEx Business Solutions with our comprehensive training courses
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-l-none">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-emerald-900">24</p>
                <p className="text-sm text-emerald-700">Total Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">6</p>
                <p className="text-sm text-blue-700">Business Types</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-900">6</p>
                <p className="text-sm text-orange-700">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <CourseFilters businessTypes={businessTypes} levels={levels} />

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Load More Courses
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
