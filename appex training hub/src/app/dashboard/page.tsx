"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  Play,
  Download,
  ExternalLink,
  Star,
  Users,
  Video
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface DashboardStats {
  coursesEnrolled: number
  coursesCompleted: number
  hoursLearned: number
  certificatesEarned: number
  learningStreak: number
}

interface Course {
  id: string
  title: string
  progress: number
  lastAccessed: string
  thumbnail?: string
  duration: number
  modules: number
  lessons: number
  businessType: string
  level: string
}

interface Webinar {
  id: string
  title: string
  date: string
  time: string
  duration: string
  registered: boolean
}

interface Certificate {
  id: string
  courseTitle: string
  earnedDate: string
  certificateUrl: string
  score: number
}

import { PullToRefresh } from "@/components/ui/pull-to-refresh"
import { FAB } from "@/components/ui/fab"

// ... existing code, I will recreate the entire component since imports need to change

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    hoursLearned: 0,
    certificatesEarned: 0,
    learningStreak: 0
  })
  const [continueLearning, setContinueLearning] = useState<Course[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([])
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - will be replaced with API calls
      // simulating network delay for pull to refresh effect
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        coursesEnrolled: 5,
        coursesCompleted: 2,
        hoursLearned: 24,
        certificatesEarned: 2,
        learningStreak: 7
      })

      setContinueLearning([
        {
          id: "1",
          title: "Retail POS Operations",
          progress: 65,
          lastAccessed: "2024-01-15",
          duration: 8,
          modules: 6,
          lessons: 24,
          businessType: "Retail",
          level: "Beginner"
        },
        {
          id: "2",
          title: "Inventory Management",
          progress: 40,
          lastAccessed: "2024-01-14",
          duration: 6,
          modules: 4,
          lessons: 16,
          businessType: "Retail",
          level: "Intermediate"
        }
      ])

      setRecommendedCourses([
        {
          id: "3",
          title: "Customer Service Excellence",
          progress: 0,
          lastAccessed: "",
          duration: 4,
          modules: 3,
          lessons: 12,
          businessType: "General",
          level: "Beginner"
        }
      ])

      setUpcomingWebinars([
        {
          id: "1",
          title: "Advanced Reporting Techniques",
          date: "Jan 20, 2024",
          time: "2:00 PM",
          duration: "1 hour",
          registered: false
        }
      ])

      setRecentCertificates([
        {
          id: "1",
          courseTitle: "Getting Started with AppEx",
          earnedDate: "Jan 10, 2024",
          certificateUrl: "#",
          score: 92
        }
      ])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResumeCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handleEnrollCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handleRegisterWebinar = (webinarId: string) => {
    console.log("Register for webinar:", webinarId)
  }

  const handleViewCertificate = (certificateId: string) => {
    router.push(`/certificates/${certificateId}`)
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

  return (
    <MainLayout>
      <div className="h-[calc(100vh-140px)] md:h-auto overflow-hidden md:overflow-visible">
        <PullToRefresh onRefresh={fetchDashboardData}>
          <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 md:p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, {session.user?.name}!
                  </h1>
                  <p className="text-emerald-100 mb-4 text-sm md:text-base">
                    Ready to continue your learning journey?
                  </p>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <div className="flex items-center space-x-2 bg-black/10 px-3 py-1.5 rounded-full">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base font-semibold">{stats.learningStreak} day streak</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/10 px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base font-semibold">{stats.hoursLearned} hrs learned</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold">{stats.coursesCompleted}</div>
                    <div className="text-sm text-emerald-100 uppercase tracking-wider mt-1">Courses Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards (Horizontal Scroll on Mobile) */}
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbar">
              <Card className="min-w-[240px] md:min-w-0 snap-center">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
                  <p className="text-xs text-muted-foreground">
                    Active learning paths
                  </p>
                </CardContent>
              </Card>

              <Card className="min-w-[240px] md:min-w-0 snap-center">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.coursesCompleted}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully finished
                  </p>
                </CardContent>
              </Card>

              <Card className="min-w-[240px] md:min-w-0 snap-center">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.hoursLearned}</div>
                  <p className="text-xs text-muted-foreground">
                    Total training time
                  </p>
                </CardContent>
              </Card>

              <Card className="min-w-[240px] md:min-w-0 snap-center">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
                  <p className="text-xs text-muted-foreground">
                    Professional certifications
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning Section */}
            {continueLearning.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold">Continue Learning</h2>
                  <Button variant="ghost" size="sm" className="md:hidden">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {continueLearning.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4 md:p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-[10px] md:text-xs">{course.businessType}</Badge>
                          <Badge variant="outline" className="text-[10px] md:text-xs">{course.level}</Badge>
                        </div>
                        <CardTitle className="text-base md:text-lg line-clamp-1">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-xs md:text-sm mb-2 font-medium">
                              <span>Progress</span>
                              <span className="text-emerald-600">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{course.duration}h</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{course.modules} modules</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleResumeCourse(course.id)}
                            className="w-full h-10 md:h-11"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Courses Section */}
            {recommendedCourses.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-bold">Recommended for You</h2>
                  <Button variant="ghost" size="sm" className="md:hidden">Explore</Button>
                </div>
                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbar">
                  {recommendedCourses.map((course) => (
                    <Card key={course.id} className="min-w-[280px] md:min-w-0 snap-center hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4 md:p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-[10px] md:text-xs">{course.businessType}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs md:text-sm font-medium">4.8</span>
                          </div>
                        </div>
                        <CardTitle className="text-base md:text-lg line-clamp-1">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{course.duration}h</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{course.lessons} lessons</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleEnrollCourse(course.id)}
                            variant="outline"
                            className="w-full h-10 md:h-11"
                          >
                            View Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-6">
              {/* Upcoming Webinars */}
              {upcomingWebinars.length > 0 && (
                <Card>
                  <CardHeader className="p-4 md:p-6 pb-2">
                    <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                      <Video className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Live Webinars</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-2">
                    <div className="space-y-3 md:space-y-4">
                      {upcomingWebinars.map((webinar) => (
                        <div key={webinar.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                          <div>
                            <h4 className="font-medium text-sm md:text-base">{webinar.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs md:text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                <span>{webinar.date}</span>
                              </div>
                              <span className="hidden sm:inline">•</span>
                              <div className="flex items-center bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{webinar.time}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            variant={webinar.registered ? "secondary" : "default"}
                            onClick={() => handleRegisterWebinar(webinar.id)}
                            className="w-full sm:w-auto"
                          >
                            {webinar.registered ? "Registered" : "Register"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Certificates */}
              {recentCertificates.length > 0 && (
                <Card>
                  <CardHeader className="p-4 md:p-6 pb-2">
                    <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                      <Award className="h-4 w-4 md:h-5 md:w-5" />
                      <span>Recent Certificates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-2">
                    <div className="space-y-3 md:space-y-4">
                      {recentCertificates.map((certificate) => (
                        <div key={certificate.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                          <div>
                            <h4 className="font-medium text-sm md:text-base">{certificate.courseTitle}</h4>
                            <div className="flex items-center space-x-2 mt-1 text-xs md:text-sm text-muted-foreground">
                              <span>Earned: {certificate.earnedDate}</span>
                              <span className="text-emerald-600 font-medium ml-2 bg-emerald-50 px-2 py-0.5 rounded">Score: {certificate.score}%</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              className="flex-1 sm:flex-none"
                              onClick={() => handleViewCertificate(certificate.id)}
                            >
                              <ExternalLink className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              className="flex-1 sm:flex-none"
                              onClick={() => window.open(certificate.certificateUrl, '_blank')}
                            >
                              <Download className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </PullToRefresh>
      </div>

      <FAB 
        icon={<BookOpen className="w-6 h-6" />} 
        onClick={() => router.push('/courses')}
      />
    </MainLayout>
  )
}
