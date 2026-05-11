import { MainLayout } from "@/components/layout/main-layout"
import { VideoPlayer } from "@/components/player/video-player"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  Circle, 
  PlayCircle,
  FileText,
  Download,
  Award
} from "lucide-react"
import Link from "next/link"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  // Mock course data
  const course = {
    id: resolvedParams.id,
    title: "Getting Started with AppEx Retail",
    description: "Learn the fundamentals of AppEx Retail Management System, from initial setup to daily operations. This comprehensive course covers everything you need to know to efficiently run your retail business using AppEx.",
    level: "BEGINNER" as const,
    duration: 180,
    modules: 5,
    rating: 4.8,
    reviews: 324,
    enrolledCount: 1247,
    thumbnail: "/api/placeholder/800/450",
    videoIntroUrl: "https://example.com/intro-video.mp4",
    businessType: "RETAIL",
    progress: 75,
    instructor: {
      name: "Sarah Chen",
      avatar: "/api/placeholder/40/40",
      bio: "Retail Management Expert with 10+ years of experience"
    } as const,
    learningObjectives: [
      "Set up and configure AppEx Retail for your business",
      "Master daily POS operations and transactions",
      "Manage inventory and stock levels effectively",
      "Handle customer management and loyalty programs",
      "Generate and analyze business reports"
    ] as const,
    prerequisites: [
      "Basic computer skills",
      "Understanding of retail operations"
    ] as const,
    certificate: {
      available: true,
      requirements: "Complete all modules and pass final assessment with 80% or higher"
    }
  }

  const modules = [
    {
      id: "1",
      title: "Module 1: Getting Started",
      description: "Introduction to AppEx Retail and initial setup",
      duration: 45,
      lessons: [
        { id: "1-1", title: "Course Introduction", type: "video", duration: 10, completed: true },
        { id: "1-2", title: "System Requirements", type: "video", duration: 15, completed: true },
        { id: "1-3", title: "Account Setup", type: "video", duration: 20, completed: true }
      ]
    },
    {
      id: "2", 
      title: "Module 2: POS Operations",
      description: "Master point of sale operations and transactions",
      duration: 60,
      lessons: [
        { id: "2-1", title: "Sales Transactions", type: "video", duration: 25, completed: true },
        { id: "2-2", title: "Payment Methods", type: "video", duration: 20, completed: true },
        { id: "2-3", title: "Returns and Refunds", type: "video", duration: 15, completed: false }
      ]
    },
    {
      id: "3",
      title: "Module 3: Inventory Management", 
      description: "Learn to manage stock levels and inventory",
      duration: 75,
      lessons: [
        { id: "3-1", title: "Adding Products", type: "video", duration: 30, completed: false },
        { id: "3-2", title: "Stock Management", type: "video", duration: 25, completed: false },
        { id: "3-3", title: "Low Stock Alerts", type: "video", duration: 20, completed: false }
      ]
    }
  ]

  const getLevelColor = (level: "BEGINNER" | "intermediate" | "advanced") => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-700 border-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-140px)] md:h-auto overflow-hidden md:overflow-visible pb-20 md:pb-0">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-8 p-0 md:p-6">
            
            {/* Mobile Video Player Header */}
            <div className="md:hidden sticky top-0 z-20 bg-black">
              <VideoPlayer
                videoUrl={course.videoIntroUrl}
                thumbnail={course.thumbnail}
                onProgress={(progress) => console.log("Progress:", progress)}
                onComplete={() => console.log("Video completed")}
                className="w-full rounded-none"
              />
            </div>

            {/* Course Header (Desktop) */}
            <div className="bg-white md:rounded-xl p-4 md:p-6 md:border md:border-gray-200 shadow-sm md:shadow-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Desktop Video Player */}
                <div className="hidden md:block lg:col-span-2">
                  <VideoPlayer
                    videoUrl={course.videoIntroUrl}
                    thumbnail={course.thumbnail}
                    onProgress={(progress) => console.log("Progress:", progress)}
                    onComplete={() => console.log("Video completed")}
                    className="rounded-lg overflow-hidden shadow-md"
                  />
                </div>

                {/* Course Info */}
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getLevelColor(course.level)} variant="outline">
                        {course.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{course.businessType}</Badge>
                    </div>
                    
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      {course.title}
                    </h1>
                    
                    <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3 md:line-clamp-none">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs md:text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.modules} modules</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-6 bg-yellow-50/50 p-2 rounded-lg w-fit">
                      <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-sm md:text-base">{course.rating}</span>
                      <span className="text-xs md:text-sm text-gray-500">({course.reviews} reviews)</span>
                    </div>

                    {/* Progress */}
                    <div className="mb-6 bg-emerald-50/50 p-3 rounded-lg">
                      <div className="flex justify-between text-xs md:text-sm mb-2">
                        <span className="font-medium text-emerald-800">Your Progress</span>
                        <span className="text-emerald-600 font-bold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-emerald-100" />
                    </div>

                    {/* Action Buttons (Desktop only, Mobile is sticky bottom) */}
                    <div className="hidden md:block space-y-3">
                      <Button className="w-full" size="lg">
                        <PlayCircle className="mr-2 h-5 w-5" />
                        Continue Learning
                      </Button>
                      <Button variant="outline" className="w-full">
                        <BookOpen className="mr-2 h-5 w-5" />
                        View Resources
                      </Button>
                      <Button 
                        onClick={() => window.location.href = `/assessments?course=${resolvedParams.id}`}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Award className="mr-2 h-5 w-5" />
                        Take Assessment
                      </Button>
                    </div>
                  </div>

                  {/* Instructor Info */}
                  <Card className="shadow-none border-gray-100 bg-gray-50/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base md:text-lg">Instructor</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center space-x-3 mb-2">
                        <img 
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full ring-2 ring-white shadow-sm"
                        />
                        <div>
                          <h4 className="font-semibold text-sm md:text-base">{course.instructor.name}</h4>
                          <p className="text-xs text-gray-500">Expert Instructor</p>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">
                        {course.instructor.bio}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <div className="px-4 md:px-0">
              <Tabs defaultValue="modules" className="w-full">
                <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
                  <TabsList className="w-max md:w-full grid-cols-4 min-w-[500px] h-11 md:h-12">
                    <TabsTrigger value="modules" className="text-xs md:text-sm">Modules</TabsTrigger>
                    <TabsTrigger value="objectives" className="text-xs md:text-sm">Objectives</TabsTrigger>
                    <TabsTrigger value="resources" className="text-xs md:text-sm">Resources</TabsTrigger>
                    <TabsTrigger value="certificate" className="text-xs md:text-sm">Certificate</TabsTrigger>
                  </TabsList>
                </div>

                <div className="mt-4 pb-6">
                  <TabsContent value="modules" className="space-y-4 m-0">
                    {modules.map((module) => (
                      <Card key={module.id} className="shadow-sm border-gray-100">
                        <CardHeader className="p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <CardTitle className="text-base md:text-lg">{module.title}</CardTitle>
                            <div className="flex items-center space-x-2 text-xs md:text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded w-fit">
                              <Clock className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{Math.floor(module.duration / 60)}h {module.duration % 60}m</span>
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mt-2">{module.description}</p>
                        </CardHeader>
                        <CardContent className="p-3 md:p-6 md:pt-0">
                          <div className="space-y-2 md:space-y-3">
                            {module.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center space-x-3 p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                                <div className="flex-shrink-0">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm md:text-base text-gray-900 truncate">{lesson.title}</h4>
                                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
                                    <span className="capitalize">{lesson.type}</span>
                                    <span>•</span>
                                    <span>{Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600">
                                  <PlayCircle className="h-5 w-5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="objectives" className="space-y-4 m-0">
                    <Card className="shadow-sm border-gray-100">
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg">What You'll Learn</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <ul className="space-y-3 md:space-y-4">
                          {course.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="text-sm md:text-base text-gray-700">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-100">
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg">Prerequisites</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <ul className="space-y-2 md:space-y-3">
                          {course.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                              <span className="text-sm md:text-base text-gray-700">{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4 m-0">
                    <Card className="shadow-sm border-gray-100">
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg">Course Resources</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center justify-between p-3 md:p-4 border border-gray-100 rounded-lg hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors group">
                            <div className="flex items-center space-x-3 md:space-x-4">
                              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm md:text-base">Course Guide</h4>
                                <p className="text-xs md:text-sm text-gray-500 line-clamp-1">Complete course documentation</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 md:w-auto md:px-3 text-emerald-600 hover:bg-emerald-100">
                              <Download className="h-4 w-4 md:mr-2" />
                              <span className="hidden md:inline">Download</span>
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-3 md:p-4 border border-gray-100 rounded-lg hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors group">
                            <div className="flex items-center space-x-3 md:space-x-4">
                              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm md:text-base">Quick Reference</h4>
                                <p className="text-xs md:text-sm text-gray-500 line-clamp-1">Cheat sheet and shortcuts</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 md:w-auto md:px-3 text-blue-600 hover:bg-blue-100">
                              <Download className="h-4 w-4 md:mr-2" />
                              <span className="hidden md:inline">Download</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="certificate" className="space-y-4 m-0">
                    <Card className="shadow-sm border-gray-100">
                      <CardHeader className="p-4 md:p-6">
                        <CardTitle className="text-base md:text-lg">Certificate of Completion</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 pt-0">
                        <div className="text-center space-y-6 max-w-md mx-auto">
                          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-emerald-50 rounded-full flex items-center justify-center ring-4 ring-emerald-100">
                            <Award className="h-12 w-12 md:h-16 md:w-16 text-emerald-600" />
                          </div>
                          
                          <div>
                            <h3 className="text-lg md:text-xl font-semibold mb-2">
                              {course.certificate.available ? "Certificate Available" : "Certificate Locked"}
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 mb-6">
                              {course.certificate.requirements}
                            </p>
                            
                            {course.certificate.available && course.progress === 100 ? (
                              <Button size="lg" className="w-full sm:w-auto min-h-[48px]">
                                <Award className="mr-2 h-5 w-5" />
                                Download Certificate
                              </Button>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                  Complete the course to unlock
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                  <div 
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">
                                  {course.progress}% Complete
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </PullToRefresh>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 z-30 flex gap-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] safe-area-pb">
        <Button className="flex-1 h-12 shadow-sm">
          <PlayCircle className="mr-2 h-5 w-5" />
          Continue
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 border-emerald-200 text-emerald-600 bg-emerald-50" onClick={() => window.location.href = `/assessments?course=${resolvedParams.id}`}>
          <Award className="h-5 w-5" />
        </Button>
      </div>
    </MainLayout>
  )
}
