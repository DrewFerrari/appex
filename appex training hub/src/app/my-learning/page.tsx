"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Clock, 
  Award, 
  Star,
  Play,
  Filter,
  Search,
  Grid3X3,
  List,
  Store,
  Utensils,
  Wrench,
  ShoppingCart,
  Pill,
  Beef
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface Course {
  id: string
  title: string
  description: string
  businessType: string
  level: string
  duration: number
  modules: number
  lessons: number
  rating: number
  enrolledCount: number
  thumbnail?: string
  progress?: number
  completedAt?: string
  lastAccessed?: string
  streak?: number
  certificateUrl?: string
  score?: number
}

const businessTypeIcons = {
  RETAIL: Store,
  RESTAURANT: Utensils,
  HARDWARE: Wrench,
  GROCERY: ShoppingCart,
  PHARMACY: Pill,
  BUTCHERY: Beef,
  GENERAL: BookOpen
}

const businessTypeColors = {
  RETAIL: "bg-blue-100 text-blue-800",
  RESTAURANT: "bg-orange-100 text-orange-800",
  HARDWARE: "bg-gray-100 text-gray-800",
  GROCERY: "bg-green-100 text-green-800",
  PHARMACY: "bg-purple-100 text-purple-800",
  BUTCHERY: "bg-red-100 text-red-800",
  GENERAL: "bg-emerald-100 text-emerald-800"
}

export default function MyLearningPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [completedCourses, setCompletedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchCoursesData()
    }
  }, [status, router])

  const fetchCoursesData = async () => {
    try {
      // Mock data for now - will be replaced with API calls
      const mockAllCourses: Course[] = [
        {
          id: "1",
          title: "Retail POS Operations",
          description: "Master the complete point-of-sale system for retail environments",
          businessType: "RETAIL",
          level: "Beginner",
          duration: 8,
          modules: 6,
          lessons: 24,
          rating: 4.8,
          enrolledCount: 1250
        },
        {
          id: "2",
          title: "Inventory Management",
          description: "Learn to efficiently manage stock, suppliers, and purchase orders",
          businessType: "RETAIL",
          level: "Intermediate",
          duration: 6,
          modules: 4,
          lessons: 16,
          rating: 4.7,
          enrolledCount: 980
        },
        {
          id: "3",
          title: "Restaurant Management",
          description: "Complete restaurant operations from front of house to kitchen",
          businessType: "RESTAURANT",
          level: "Beginner",
          duration: 10,
          modules: 8,
          lessons: 32,
          rating: 4.9,
          enrolledCount: 750
        },
        {
          id: "4",
          title: "Hardware Store Operations",
          description: "Specialized training for hardware store management and contractor accounts",
          businessType: "HARDWARE",
          level: "Intermediate",
          duration: 7,
          modules: 5,
          lessons: 20,
          rating: 4.6,
          enrolledCount: 420
        }
      ]

      const mockEnrolledCourses: Course[] = [
        {
          id: "1",
          title: "Retail POS Operations",
          description: "Master the complete point-of-sale system for retail environments",
          businessType: "RETAIL",
          level: "Beginner",
          duration: 8,
          modules: 6,
          lessons: 24,
          rating: 4.8,
          enrolledCount: 1250,
          progress: 65,
          lastAccessed: "2024-01-15",
          streak: 7
        },
        {
          id: "2",
          title: "Inventory Management",
          description: "Learn to efficiently manage stock, suppliers, and purchase orders",
          businessType: "RETAIL",
          level: "Intermediate",
          duration: 6,
          modules: 4,
          lessons: 16,
          rating: 4.7,
          enrolledCount: 980,
          progress: 40,
          lastAccessed: "2024-01-14",
          streak: 3
        }
      ]

      const mockCompletedCourses: Course[] = [
        {
          id: "5",
          title: "Getting Started with AppEx",
          description: "Introduction to the AppEx ecosystem and basic navigation",
          businessType: "GENERAL",
          level: "Beginner",
          duration: 2,
          modules: 2,
          lessons: 8,
          rating: 4.9,
          enrolledCount: 2500,
          progress: 100,
          completedAt: "2024-01-10",
          certificateUrl: "#",
          score: 92
        }
      ]

      setAllCourses(mockAllCourses)
      setEnrolledCourses(mockEnrolledCourses)
      setCompletedCourses(mockCompletedCourses)
    } catch (error) {
      console.error("Error fetching courses data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrollCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handleContinueCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handleViewCertificate = (courseId: string) => {
    router.push(`/certificates/${courseId}`)
  }

  const filterCourses = (courses: Course[]) => {
    let filtered = courses

    // Filter by business type
    if (selectedBusinessType !== "all") {
      filtered = filtered.filter(course => course.businessType === selectedBusinessType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.enrolledCount - a.enrolledCount
        case "rating":
          return b.rating - a.rating
        case "newest":
          return 0 // Will be implemented with actual dates
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }

  const renderCourseCard = (course: Course, isEnrolled: boolean = false, isCompleted: boolean = false) => {
    const BusinessIcon = businessTypeIcons[course.businessType as keyof typeof businessTypeIcons] || BookOpen
    const businessColor = businessTypeColors[course.businessType as keyof typeof businessTypeColors] || businessTypeColors.GENERAL

    return (
      <Card key={course.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={businessColor}>
              <BusinessIcon className="h-3 w-3 mr-1" />
              {course.businessType}
            </Badge>
            <Badge variant="outline">{course.level}</Badge>
          </div>
          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules} modules</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            </div>

            {isEnrolled && course.progress !== undefined && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                {course.streak && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {course.streak} day streak
                  </p>
                )}
              </div>
            )}

            {isCompleted && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">Completed</span>
                <span>Score: {course.score}%</span>
              </div>
            )}

            <div className="flex space-x-2">
              {isEnrolled ? (
                <Button 
                  onClick={() => handleContinueCourse(course.id)}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              ) : isCompleted ? (
                <>
                  <Button 
                    onClick={() => handleViewCertificate(course.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                  <Button 
                    onClick={() => handleEnrollCourse(course.id)}
                    variant="outline"
                  >
                    Review
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => handleEnrollCourse(course.id)}
                  className="flex-1"
                >
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "loading" || isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </MainLayout>
    )
  }

  if (!session) {
    return null
  }

  const filteredAllCourses = filterCourses(allCourses)

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Learning</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all-courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-courses">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Enrolled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all-courses" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedBusinessType}
                  onChange={(e) => setSelectedBusinessType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Business Types</option>
                  <option value="RETAIL">Retail</option>
                  <option value="RESTAURANT">Restaurant</option>
                  <option value="HARDWARE">Hardware</option>
                  <option value="GROCERY">Grocery</option>
                  <option value="PHARMACY">Pharmacy</option>
                  <option value="BUTCHERY">Butchery</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Course Grid */}
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredAllCourses.map((course) => renderCourseCard(course))}
            </div>
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Enrolled Courses</h2>
              <span className="text-sm text-muted-foreground">
                {enrolledCourses.length} courses enrolled
              </span>
            </div>
            
            {enrolledCourses.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {enrolledCourses.map((course) => renderCourseCard(course, true))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No enrolled courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your learning journey by enrolling in a course from the All Courses tab.
                  </p>
                  <Button onClick={() => router.push("/my-learning?tab=all-courses")}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Completed Courses</h2>
              <span className="text-sm text-muted-foreground">
                {completedCourses.length} courses completed
              </span>
            </div>
            
            {completedCourses.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {completedCourses.map((course) => renderCourseCard(course, false, true))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No completed courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your enrolled courses to earn certificates and track your progress.
                  </p>
                  <Button onClick={() => router.push("/my-learning?tab=enrolled")}>
                    View Enrolled Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
