"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { solutionsData, BusinessSolution } from "@/lib/data/solutions"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Download,
  Video,
  FileText,
  ChevronRight,
  ArrowLeft,
  Lock
} from "lucide-react"
import Link from "next/link"

export default function SolutionLandingPage() {
  const { solutionId } = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [solution, setSolution] = useState<BusinessSolution | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    const found = solutionsData.find(s => s.id === solutionId)
    if (found) {
      setSolution(found)
    }
  }, [solutionId, status, router])

  if (!solution) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-muted-foreground">Loading training program...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Breadcrumbs / Back */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/solutions-training" className="hover:text-emerald-600 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Solutions
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{solution.name}</span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${solution.bgColor} border ${solution.borderColor}`}>
                  <solution.icon className={`h-6 w-6 ${solution.color}`} />
                </div>
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                  {solution.certificateName}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">{solution.name}</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {solution.description}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{solution.totalModules}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Modules</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{solution.totalDuration}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Duration</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{solution.passingScore}%</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Passing Score</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{solution.stats.averageRating}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg Rating</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                <Play className="h-4 w-4 mr-2" />
                Start Training
              </Button>
              <Button size="lg" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Syllabus
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Award className="h-10 w-10 text-emerald-200" />
                  <div className="text-right">
                    <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Earned Upon Completion</p>
                    <p className="font-bold text-lg">Industry Certificate</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-emerald-50 leading-relaxed italic">
                    "Get certified and demonstrate your expertise in {solution.name} with AppEx's industry-recognized credentials."
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span>Downloadable immediately</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    <span>Valid for life</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Key Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 space-x-8">
            <TabsTrigger value="modules" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent px-0 py-4 text-sm font-medium">Training Curriculum</TabsTrigger>
            <TabsTrigger value="case-studies" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent px-0 py-4 text-sm font-medium">Industry Case Studies</TabsTrigger>
            <TabsTrigger value="testimonials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent px-0 py-4 text-sm font-medium">Student Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            <div className="grid gap-4">
              {solution.modules.length > 0 ? (
                solution.modules.map((module, index) => (
                  <Card key={module.id} className="group hover:shadow-md transition-all cursor-pointer border-gray-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                            module.isCompleted ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">{module.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-1.5" />
                            {module.duration}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1.5" />
                            {module.difficulty}
                          </div>
                          {module.isLocked ? (
                            <Lock className="h-4 w-4 text-gray-300" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Module content for this section is currently being finalized.</p>
                  <p className="text-sm text-gray-400">Please check back soon for the full curriculum.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-gray-100 hover:shadow-lg transition-all">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h3 className="text-white font-bold text-xl">Efficiency Peak</h3>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    How a leading {solution.name.toLowerCase()} business implemented AppEx and saw a significant ROI within the first 3 months.
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">Success Story</Badge>
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 p-0">Read Case Study →</Button>
                  </div>
                </CardContent>
              </Card>
              {/* More placeholders */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
