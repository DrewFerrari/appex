"use client"

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
  Award,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<any>(null)
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      fetchCourseData()
    }
  }, [id, status, router])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/courses/${id}`)
      if (!response.ok) throw new Error("Failed to fetch course")
      const data = await response.json()
      setCourse(data)
      
      // Fetch progress
      const progressResponse = await fetch(`/api/learning/progress?courseId=${id}`)
      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        setOverallProgress(progressData.overallProgress)
        
        // Find first incomplete lesson or first lesson
        const firstIncomplete = progressData.lessons.find((p: any) => p.status !== "COMPLETED")
        if (firstIncomplete) {
          const lesson = data.modules.flatMap((m: any) => m.lessons).find((l: any) => l.id === firstIncomplete.lessonId)
          setActiveLesson(lesson || data.modules[0].lessons[0])
        } else {
          setActiveLesson(data.modules[0].lessons[0])
        }
      } else {
        setActiveLesson(data.modules[0].lessons[0])
      }
    } catch (error) {
      console.error("Error loading course:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProgressUpdate = async (lessonId: string, percentage: number, lastPosition: number, isCompleted: boolean = false) => {
    try {
      await fetch('/api/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          progressPercentage: Math.round(percentage),
          lastPositionSeconds: Math.round(lastPosition),
          status: isCompleted ? "COMPLETED" : "IN_PROGRESS"
        })
      })
      
      if (isCompleted) {
        // Refresh progress data to update UI
        const progressResponse = await fetch(`/api/learning/progress?courseId=${id}`)
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          setOverallProgress(progressData.overallProgress)
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
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
    await fetchCourseData()
  }

  if (loading || !course) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-muted-foreground font-medium">Loading course content...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-140px)] md:h-auto overflow-hidden md:overflow-visible pb-20 md:pb-0">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-8 p-0 md:p-6">
            
            {/* Mobile Video Player Header */}
            <div className="md:hidden sticky top-0 z-20 bg-black">
              <VideoPlayer
                key={activeLesson?.id}
                videoUrl={activeLesson?.videoUrl || course.videoIntroUrl}
                thumbnail={course.thumbnailUrl}
                onProgress={(p) => handleProgressUpdate(activeLesson?.id, p, 0)}
                onComplete={() => handleProgressUpdate(activeLesson?.id, 100, 0, true)}
                className="w-full rounded-none"
              />
            </div>

            {/* Course Header (Desktop) */}
            <div className="bg-white md:rounded-xl p-4 md:p-6 md:border md:border-gray-200 shadow-sm md:shadow-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Desktop Video Player */}
                <div className="hidden md:block lg:col-span-2">
                  <VideoPlayer
                    key={activeLesson?.id}
                    videoUrl={activeLesson?.videoUrl || course.videoIntroUrl}
                    thumbnail={course.thumbnailUrl}
                    onProgress={(p) => handleProgressUpdate(activeLesson?.id, p, 0)}
                    onComplete={() => handleProgressUpdate(activeLesson?.id, 100, 0, true)}
                    className="rounded-lg overflow-hidden shadow-md"
                  />
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{activeLesson?.title || "Course Introduction"}</h3>
                      <p className="text-sm text-gray-500">Currently playing</p>
                    </div>
                    {activeLesson && (
                      <Badge variant="outline" className="bg-white">
                        {activeLesson.durationMinutes} minutes
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Course Info */}
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getLevelColor(course.level)} variant="outline">
                        {course.level.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{course.businessType}</Badge>
                    </div>
                    
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      {course.title}
                    </h1>
                    
                    <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3 md:line-clamp-none">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-6 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                      <div className="flex justify-between text-xs md:text-sm mb-2">
                        <span className="font-medium text-emerald-800">Your Progress</span>
                        <span className="text-emerald-600 font-bold">{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-2 bg-emerald-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 bg-white border border-gray-100 rounded-lg text-center">
                        <div className="text-lg font-bold">{course.modules.length}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Modules</div>
                      </div>
                      <div className="p-3 bg-white border border-gray-100 rounded-lg text-center">
                        <div className="text-lg font-bold">{Math.floor(course.durationMinutes / 60)}h {course.durationMinutes % 60}m</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Duration</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:block space-y-3">
                      {overallProgress < 100 ? (
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Continue Learning
                        </Button>
                      ) : (
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg" onClick={() => router.push(`/assessments?course=${id}`)}>
                          <Award className="mr-2 h-5 w-5" />
                          Claim Certificate
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/solutions-training">
                          <ChevronLeft className="mr-2 h-5 w-5" />
                          Back to Training Hub
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <div className="px-4 md:px-0">
              <Tabs defaultValue="modules" className="w-full">
                <TabsList className="w-full grid grid-cols-3 h-12">
                  <TabsTrigger value="modules" className="text-sm">Curriculum</TabsTrigger>
                  <TabsTrigger value="resources" className="text-sm">Resources</TabsTrigger>
                  <TabsTrigger value="certificate" className="text-sm">Certificate</TabsTrigger>
                </TabsList>

                <div className="mt-4 pb-6">
                  <TabsContent value="modules" className="space-y-4 m-0">
                    {course.modules.map((module: any) => (
                      <Card key={module.id} className="shadow-sm border-gray-100 overflow-hidden">
                        <CardHeader className="p-4 md:p-6 bg-gray-50/50">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <CardTitle className="text-base md:text-lg">{module.title}</CardTitle>
                            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 font-medium">
                              <Clock className="h-3 w-3 md:h-4 md:w-4" />
                              <span>{module.durationMinutes}m</span>
                            </div>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">{module.description}</p>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y divide-gray-100">
                            {module.lessons.map((lesson: any) => (
                              <div 
                                key={lesson.id} 
                                onClick={() => setActiveLesson(lesson)}
                                className={`flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${activeLesson?.id === lesson.id ? 'bg-emerald-50/50 border-l-4 border-emerald-500' : ''}`}
                              >
                                <div className="flex-shrink-0">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-medium text-sm md:text-base ${activeLesson?.id === lesson.id ? 'text-emerald-700' : 'text-gray-900'} truncate`}>{lesson.title}</h4>
                                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
                                    <span className="capitalize">{lesson.contentType.toLowerCase()}</span>
                                    <span>•</span>
                                    <span>{lesson.durationMinutes}m</span>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${activeLesson?.id === lesson.id ? 'text-emerald-600' : 'text-gray-400'}`}>
                                  <PlayCircle className="h-5 w-5" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4 m-0">
                    <Card className="shadow-sm border-gray-100 p-6">
                      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-medium">Training PowerPoint</h4>
                            <p className="text-sm text-gray-500">Detailed curriculum slides</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="certificate" className="space-y-4 m-0">
                    <Card className="shadow-sm border-gray-100 p-8 text-center">
                      <div className="w-24 h-24 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-4 ring-4 ring-emerald-100">
                        <Award className="h-12 w-12 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Industry Certification</h3>
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Complete all modules to 100% and pass the final assessment to earn your official AppEx Specialist certificate.
                      </p>
                      <Button 
                        size="lg" 
                        disabled={overallProgress < 100}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {overallProgress < 100 ? `Locked (${overallProgress}%)` : 'Claim Certificate'}
                      </Button>
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
        <Button className="flex-1 h-12 bg-emerald-600" onClick={() => setActiveLesson(course.modules[0].lessons[0])}>
          <PlayCircle className="mr-2 h-5 w-5" />
          {overallProgress > 0 ? 'Continue' : 'Start'}
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12 border-emerald-200 text-emerald-600 bg-emerald-50">
          <Award className="h-5 w-5" />
        </Button>
      </div>
    </MainLayout>
  )
}
