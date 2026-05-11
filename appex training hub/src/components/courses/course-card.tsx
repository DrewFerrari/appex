"use client"

import { useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { useDrag } from "@use-gesture/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Star, Clock, BookOpen, Users, Play, Archive, Share2, MoreVertical, Heart } from "lucide-react"
import Link from "next/link"
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  BottomSheetTrigger
} from "@/components/ui/bottom-sheet"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    level: "beginner" | "intermediate" | "advanced"
    duration: number
    modules: number
    rating: number
    reviews: number
    enrolledCount: number
    thumbnail: string
    businessType: string
    progress?: number
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const [showSheet, setShowSheet] = useState(false)
  const [isSwiped, setIsSwiped] = useState(false)
  const controls = useAnimation()
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  
  const getLevelColor = (level: CourseCardProps["course"]["level"]) => {
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

  const hasProgress = course.progress !== undefined && course.progress > 0

  // Drag handler for swipe actions
  const bindDrag = useDrag(({ movement: [mx], down, cancel }) => {
    if (mx < -80 && !down) {
      setIsSwiped(true)
      controls.start({ x: -100 })
    } else if (mx > 50 && !down && isSwiped) {
      setIsSwiped(false)
      controls.start({ x: 0 })
    } else if (down && !isSwiped) {
      controls.set({ x: Math.max(mx, -100) })
    }
  }, { axis: 'x' })

  // Long press handler
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowSheet(true)
      // Vibrate if supported
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Swipe Actions Background */}
        <div className="absolute inset-y-0 right-0 w-[100px] bg-gray-100 flex items-center justify-center space-x-2 rounded-xl z-0 pl-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-emerald-600 rounded-full bg-white shadow-sm">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-blue-600 rounded-full bg-white shadow-sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Card Content */}
        <motion.div
          {...(bindDrag() as any)}
          animate={controls}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative z-10 touch-pan-y"
        >
          <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
            <div className="relative">
              <div className="aspect-video bg-gray-200 overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                />
              </div>
              
              {/* Context Menu Trigger (Visible on Desktop, or tap on Mobile) */}
              <div className="absolute top-2 right-2 md:block hidden">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 text-white rounded-full hover:bg-black/70" onClick={() => setShowSheet(true)}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              {hasProgress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300" 
                    style={{ width: `${course.progress}%` }} 
                  />
                </div>
              )}
              
              {/* Duration Badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {Math.floor(course.duration / 60)}h {course.duration % 60}m
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  {course.businessType}
                </Badge>
                <Badge className={getLevelColor(course.level)} variant="secondary">
                  {course.level}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors text-sm sm:text-base">
                {course.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  <span className="text-xs sm:text-sm font-medium">{course.rating}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{course.modules}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{course.enrolledCount >= 1000 ? `${(course.enrolledCount / 1000).toFixed(1)}k` : course.enrolledCount}</span>
                  </div>
                </div>
              </div>
              
              <Link href={`/courses/${course.id}`} className="block">
                <Button className="w-full h-10 sm:h-11">
                  {hasProgress ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Continue ({course.progress}%)
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Start Course
                    </>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Context Menu Bottom Sheet */}
      <BottomSheet open={showSheet} onOpenChange={setShowSheet}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetTitle className="line-clamp-1">{course.title}</BottomSheetTitle>
            <BottomSheetDescription>
              Select an action for this course
            </BottomSheetDescription>
          </BottomSheetHeader>
          <div className="p-4 space-y-2 pb-8">
            <Link href={`/courses/${course.id}`} onClick={() => setShowSheet(false)}>
              <Button variant="ghost" className="w-full justify-start h-12 text-base font-normal">
                <BookOpen className="mr-3 h-5 w-5 text-emerald-600" />
                View Details
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start h-12 text-base font-normal" onClick={() => setShowSheet(false)}>
              <Heart className="mr-3 h-5 w-5 text-rose-500" />
              Add to Wishlist
            </Button>
            <Button variant="ghost" className="w-full justify-start h-12 text-base font-normal" onClick={() => setShowSheet(false)}>
              <Share2 className="mr-3 h-5 w-5 text-blue-500" />
              Share Course
            </Button>
            {hasProgress && (
              <Button variant="ghost" className="w-full justify-start h-12 text-base font-normal" onClick={() => setShowSheet(false)}>
                <Archive className="mr-3 h-5 w-5 text-gray-500" />
                Archive
              </Button>
            )}
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
}
