"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { BookOpen, Play, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

export function WelcomeHero() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to AppEx Learning Hub
          </h1>
          <p className="text-xl text-emerald-100 mb-6">
            Master your business management system with comprehensive training for retail, restaurant, hardware, grocery, pharmacy, and butchery solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/courses" className="block">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/docs" className="block">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                <Play className="mr-2 h-5 w-5" />
                Watch Tutorials
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
      <div className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {session.user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-xl text-emerald-100 mb-6">
          Continue your learning journey and master AppEx Business Solutions
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-emerald-100">Courses Enrolled</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-emerald-100">Certificates</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-emerald-100">Completion Rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-emerald-100">Videos Watched</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/my-learning" className="block">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              <BookOpen className="mr-2 h-5 w-5" />
              Continue Learning
            </Button>
          </Link>
          <Link href="/courses" className="block">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
              <Play className="mr-2 h-5 w-5" />
              Explore New Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
