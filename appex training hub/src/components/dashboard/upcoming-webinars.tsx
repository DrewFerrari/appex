"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Video } from "lucide-react"
import Link from "next/link"

interface Webinar {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  maxAttendees: number
  currentAttendees: number
  isLive: boolean
  isRecorded: boolean
  businessType: string
}

function WebinarCard({ webinar }: { webinar: Webinar }) {
  const spotsLeft = webinar.maxAttendees - webinar.currentAttendees
  const isAlmostFull = spotsLeft <= 10 && spotsLeft > 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {webinar.isLive && (
                <Badge className="bg-red-100 text-red-700 animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  LIVE NOW
                </Badge>
              )}
              {webinar.isRecorded && (
                <Badge variant="outline">
                  <Video className="h-3 w-3 mr-1" />
                  Recorded
                </Badge>
              )}
              <Badge variant="outline">{webinar.businessType}</Badge>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">
              {webinar.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {webinar.description}
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {webinar.date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            {webinar.time} ({webinar.duration})
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2" />
            <span className={isAlmostFull ? "text-orange-600 font-medium" : "text-gray-500"}>
              {webinar.currentAttendees}/{webinar.maxAttendees} attendees
              {isAlmostFull && ` (${spotsLeft} spots left!)`}
            </span>
          </div>
        </div>
        
        <Link href={`/webinars/${webinar.id}`} className="block">
          <Button 
            className="w-full"
            variant={webinar.isLive ? "default" : "outline"}
          >
            {webinar.isLive ? "Join Now" : "Register"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function UpcomingWebinars() {
  const webinars: Webinar[] = [
    {
      id: "1",
      title: "Advanced Retail Analytics Workshop",
      description: "Learn how to leverage AppEx analytics to make data-driven business decisions and optimize your retail operations.",
      date: "Apr 25, 2026",
      time: "2:00 PM CAT",
      duration: "90 min",
      maxAttendees: 100,
      currentAttendees: 87,
      isLive: false,
      isRecorded: false,
      businessType: "Retail"
    },
    {
      id: "2",
      title: "Restaurant Menu Management Masterclass",
      description: "Complete guide to menu setup, pricing strategies, and inventory integration for restaurant businesses.",
      date: "Apr 27, 2026", 
      time: "10:00 AM CAT",
      duration: "2 hours",
      maxAttendees: 50,
      currentAttendees: 42,
      isLive: false,
      isRecorded: false,
      businessType: "Restaurant"
    },
    {
      id: "3",
      title: "Hardware Store Inventory Best Practices",
      description: "Live Q&A session on managing serial numbers, special orders, and contractor accounts in hardware stores.",
      date: "Apr 28, 2026",
      time: "3:00 PM CAT",
      duration: "60 min",
      maxAttendees: 75,
      currentAttendees: 23,
      isLive: false,
      isRecorded: false,
      businessType: "Hardware"
    },
    {
      id: "4",
      title: "Grocery Store Perishable Management",
      description: "Master the art of managing fresh produce, expiration dates, and seasonal inventory in grocery stores.",
      date: "Apr 29, 2026",
      time: "11:00 AM CAT",
      duration: "90 min",
      maxAttendees: 80,
      currentAttendees: 45,
      isLive: false,
      isRecorded: false,
      businessType: "Grocery"
    },
    {
      id: "5",
      title: "Pharmacy Compliance & Reporting",
      description: "Essential webinar on regulatory compliance, prescription tracking, and automated reporting for pharmacies.",
      date: "Apr 30, 2026",
      time: "1:00 PM CAT",
      duration: "2 hours",
      maxAttendees: 60,
      currentAttendees: 38,
      isLive: false,
      isRecorded: false,
      businessType: "Pharmacy"
    },
    {
      id: "6",
      title: "Butchery Quality Control & Cutting",
      description: "Comprehensive guide to meat cutting specifications, quality standards, and inventory management for butcher shops.",
      date: "May 1, 2026",
      time: "9:00 AM CAT",
      duration: "75 min",
      maxAttendees: 40,
      currentAttendees: 15,
      isLive: false,
      isRecorded: false,
      businessType: "Butchery"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Upcoming Webinars</span>
          <Link href="/webinars" className="block">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {webinars.map((webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
          <h4 className="font-semibold text-emerald-900 mb-2">
            🎓 Earn Certificates
          </h4>
          <p className="text-sm text-emerald-700 mb-3">
            Attend live webinars and complete the assessment to earn professional certificates.
          </p>
          <Link href="/certifications" className="block">
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
