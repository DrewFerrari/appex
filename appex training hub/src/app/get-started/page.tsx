"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Rocket, ArrowRight } from "lucide-react"

interface UserState {
  status: 'new_user' | 'returning_user' | 'incomplete_previous' | 'completed_all'
  nextAction: string
  data?: any
  message?: string
}

export default function GetStartedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userState, setUserState] = useState<UserState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      detectUserState()
    }
  }, [status, router])

  const detectUserState = async (isRetry = false) => {
    try {
      if (isRetry) setIsRetrying(true)
      const response = await fetch("/api/training/get-started")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setUserState(data)
    } catch (error) {
      console.error("Error detecting user state:", error)
      // Set a fallback state to prevent infinite loading
      setUserState({
        status: "returning_user",
        nextAction: "dashboard",
        message: "Unable to detect your state. Redirecting to dashboard..."
      })
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    detectUserState(true)
  }

  const handleGetStarted = async () => {
    if (!userState) return

    switch (userState.status) {
      case "new_user":
        router.push("/onboarding")
        break
      case "returning_user":
        router.push("/dashboard")
        break
      case "incomplete_previous":
        router.push("/courses")
        break
      case "completed_all":
        router.push("/certifications")
        break
      default:
        router.push("/dashboard")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {isRetrying ? "Retrying..." : "Preparing your learning journey..."}
          </p>
          {userState?.message?.includes("Unable to detect") && (
            <Button 
              onClick={handleRetry} 
              variant="outline" 
              className="mt-4"
              disabled={isRetrying}
            >
              {isRetrying ? "Retrying..." : "Retry"}
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <img 
                src="/logo.png" 
                alt="AppEx Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to AppEx Learning Hub{session.user?.name && `, ${session.user.name.split(' ')[0]}`}!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master your business management system with comprehensive training for retail, restaurant, hardware, grocery, pharmacy, and butchery solutions.
            </p>
          </div>

          {/* User State Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900">
                Your Learning Journey Awaits
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {userState?.status === "new_user" && (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">Welcome!</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">New to AppEx?</h3>
                    <p className="text-gray-600 mb-4">
                      Let's personalize your learning experience with a quick onboarding questionnaire.
                    </p>
                    <p className="text-sm text-gray-500">
                      This will take about 2 minutes and help us create the perfect learning path for you.
                    </p>
                  </div>
                </div>
              )}

              {userState?.status === "returning_user" && (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">Welcome Back!</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Continue Learning?</h3>
                    <p className="text-gray-600 mb-4">
                      Let's explore new courses and continue your AppEx journey.
                    </p>
                    <p className="text-sm text-gray-500">
                      You can access your dashboard to see all available courses and track your progress.
                    </p>
                  </div>
                </div>
              )}

              {userState?.status === "incomplete_previous" && (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">Resume!</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pick Up Where You Left Off</h3>
                    <p className="text-gray-600 mb-4">
                      You have incomplete courses. Let's get you back on track!
                    </p>
                    <p className="text-sm text-gray-500">
                      We'll show you exactly where to continue and what's next in your learning journey.
                    </p>
                  </div>
                </div>
              )}

              {userState?.status === "completed_all" && (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">Congratulations!</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">You're a Master!</h3>
                    <p className="text-gray-600 mb-4">
                      You've completed all courses! Ready for advanced challenges?
                    </p>
                    <p className="text-sm text-gray-500">
                      Explore certifications, become a trainer, or join our expert community.
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Rocket className="w-5 h-5" />
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
              <div className="text-gray-600">Expert Courses</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Professionals Trained</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Business Operations</h3>
                  <p className="text-gray-600 text-sm">Master daily operations, customer management, and sales processes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Inventory Management</h3>
                  <p className="text-gray-600 text-sm">Learn stock control, reordering, and automated inventory systems</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reporting & Analytics</h3>
                  <p className="text-gray-600 text-sm">Understand business metrics and make data-driven decisions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Advanced Features</h3>
                  <p className="text-gray-600 text-sm">Explore loyalty programs, promotions, and customer engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
