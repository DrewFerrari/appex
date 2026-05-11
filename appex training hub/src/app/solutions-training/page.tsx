"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Store, 
  Utensils, 
  Wrench, 
  ShoppingCart, 
  Pill, 
  Beef, 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Target,
  Download,
  Calendar,
  DollarSign,
  BarChart3,
  Package,
  ShoppingCart as ShoppingCartIcon,
  Receipt,
  CreditCard,
  Truck,
  Headphones,
  FileText,
  Video,
  ChevronRight
} from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"


interface Resource {
  id: string
  title: string
  description: string
  type: "guide" | "video" | "template" | "checklist"
  downloadUrl: string
  fileSize: string
  category: string
}

import { solutionsData, BusinessSolution } from "@/lib/data/solutions"

export default function SolutionsTrainingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedSolution, setSelectedSolution] = useState<string>("retail-management")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }
    if (status !== "loading") {
      setIsLoading(false)
    }
  }, [status, router])

  const solutions = solutionsData

  const currentSolution = solutions.find(s => s.id === selectedSolution)

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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Solutions Training</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized training programs for your specific business type. 
            Master AppEx solutions tailored to your industry.
          </p>
        </div>

        {/* Business Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {solutions.map((solution) => {
            const Icon = solution.icon
            return (
              <Card 
                key={solution.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSolution === solution.id 
                    ? `${solution.borderColor} border-2 ${solution.bgColor}` 
                    : 'border hover:border-gray-300'
                }`}
                onClick={() => setSelectedSolution(solution.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`p-3 rounded-lg ${solution.bgColor} mb-3 mx-auto w-fit`}>
                    <Icon className={`h-6 w-6 ${solution.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{solution.name}</h3>
                  <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span>{solution.stats.averageRating}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {currentSolution && (
          <>
            {/* Solution Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${currentSolution.bgColor} ${currentSolution.borderColor} border`}>
                    <currentSolution.icon className={`h-8 w-8 ${currentSolution.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{currentSolution.name}</CardTitle>
                    <p className="text-gray-600 mb-4">{currentSolution.description}</p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {currentSolution.stats.businessesServed.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Businesses Served</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                          <Star className="h-5 w-5 text-yellow-500 mr-1" />
                          {currentSolution.stats.averageRating}
                        </div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {currentSolution.stats.trainingHours}h
                        </div>
                        <div className="text-sm text-gray-600">Training Content</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {currentSolution.stats.successRate}%
                        </div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="modules" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-64 grid-cols-2">
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href={`/solutions-training/${currentSolution.id}`}>
                    View Full Program
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* Training Modules */}
              <TabsContent value="modules" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Training Modules</h2>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning Path
                  </Button>
                </div>

                <div className="grid gap-4">
                  {currentSolution.modules.map((module, index) => (
                    <Card key={module.id} className={`hover:shadow-md transition-shadow ${module.isLocked ? 'opacity-75' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                module.isCompleted ? 'bg-green-100' : 
                                module.progress > 0 ? 'bg-blue-100' : 
                                module.isLocked ? 'bg-gray-100' : 'bg-gray-100'
                              }`}>
                                {module.isCompleted ? (
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                ) : module.isLocked ? (
                                  <Target className="h-6 w-6 text-gray-400" />
                                ) : (
                                  <Play className="h-6 w-6 text-blue-600" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold">{module.title}</h3>
                                {module.isCompleted && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    Completed
                                  </Badge>
                                )}
                                {module.isLocked && (
                                  <Badge variant="outline" className="text-xs">
                                    Locked
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {module.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {module.type}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-3">{module.description}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{module.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{module.topics.length} topics</span>
                                </div>
                              </div>
                              
                              {module.progress > 0 && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{module.progress}%</span>
                                  </div>
                                  <Progress value={module.progress} className="h-2" />
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-1">
                                {module.topics.map((topic, topicIndex) => (
                                  <Badge key={topicIndex} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <Button 
                              disabled={module.isLocked}
                              variant={module.isCompleted ? "outline" : "default"}
                            >
                              {module.isCompleted ? "Review" : 
                               module.progress > 0 ? "Continue" : 
                               module.isLocked ? "Locked" : "Start"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Features */}
              <TabsContent value="features" className="space-y-6">
                <h2 className="text-xl font-semibold">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentSolution.features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${currentSolution.bgColor}`}>
                          <CheckCircle className={`h-6 w-6 ${currentSolution.color}`} />
                        </div>
                        <h3 className="font-semibold">{feature}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Resources & Downloads</h2>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <div className="grid gap-4">
                  {[
                    {
                      title: "Implementation Guide",
                      description: "Step-by-step guide for implementing AppEx in your business",
                      type: "guide" as const,
                      fileSize: "2.5 MB"
                    },
                    {
                      title: "Training Videos",
                      description: "Video library covering all features and best practices",
                      type: "video" as const,
                      fileSize: "150 MB"
                    },
                    {
                      title: "Checklist Templates",
                      description: "Ready-to-use checklists for daily operations",
                      type: "checklist" as const,
                      fileSize: "500 KB"
                    }
                  ].map((resource, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {resource.type === 'guide' && <FileText className="h-6 w-6 text-gray-600" />}
                              {resource.type === 'video' && <Video className="h-6 w-6 text-gray-600" />}
                              {resource.type === 'checklist' && <FileText className="h-6 w-6 text-gray-600" />}
                            </div>
                            <div>
                              <h3 className="font-semibold">{resource.title}</h3>
                              <p className="text-sm text-gray-600">{resource.description}</p>
                              <span className="text-xs text-muted-foreground">{resource.fileSize}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Testimonials */}
              <TabsContent value="testimonials" className="space-y-6">
                <h2 className="text-xl font-semibold">Success Stories</h2>
                <div className="grid gap-6">
                  {currentSolution.testimonials.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={testimonial.avatar} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{testimonial.name}</h3>
                              <span className="text-sm text-gray-600">•</span>
                              <span className="text-sm text-gray-600">{testimonial.role}</span>
                              <span className="text-sm text-gray-600">•</span>
                              <span className="text-sm text-gray-600">{testimonial.company}</span>
                            </div>
                            <div className="flex items-center space-x-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-600 italic">"{testimonial.content}"</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  )
}
