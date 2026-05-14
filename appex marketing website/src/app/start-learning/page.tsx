'use client'

import React from 'react'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  BookOpen,
  PlayCircle,
  Award,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Users,
  MessageCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const StartLearningPage = () => {
  const learningTracks = [
    {
      icon: PlayCircle,
      title: 'Video Tutorials',
      description: 'Quick, easy-to-follow videos covering every feature of the AppEx platform.',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: GraduationCap,
      title: 'Certified Courses',
      description: 'Deep-dive into business management with our structured certification programs.',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: Users,
      title: 'Live Webinars',
      description: 'Join our weekly sessions with industry experts and successful business owners.',
      color: 'bg-green-500/10 text-green-600'
    },
    {
      icon: BookOpen,
      title: 'Documentation',
      description: 'Detailed guides and technical resources for every part of the ecosystem.',
      color: 'bg-orange-500/10 text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-light-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-dark-primary to-dark-secondary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-blue/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-accent-purple/10 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-blue/20 rounded-full px-4 py-2 mb-8">
                <GraduationCap className="w-5 h-5 text-accent-blue" />
                <span className="text-sm font-medium text-accent-blue">AppEx Academy</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Unlock Your Business <span className="text-gradient">Potential</span>
              </h1>
              <p className="text-xl text-text-muted mb-10 leading-relaxed">
                Welcome to the AppEx Learning Hub. Whether you're just starting out or looking to optimize your operations, our comprehensive training resources are here to guide you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="xl" variant="appex" asChild>
                  <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer">
                    Go to Learning Hub
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-dark-primary">
                  View Course Catalog
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-dark-primary mb-6">Explore Our Learning Tracks</h2>
            <p className="text-xl text-muted-gray max-w-2xl mx-auto">
              Choose the learning style that works best for you and your team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningTracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer">
                  <CardHeader>
                    <div className={`w-14 h-14 ${track.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <track.icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{track.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {track.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose AppEx Academy */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark-primary mb-8">Why Learn with AppEx Academy?</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: 'Practical Knowledge',
                    text: 'Our content is designed for immediate application in your business.'
                  },
                  {
                    icon: Shield,
                    title: 'Expert Guidance',
                    text: 'Learn from specialists who understand the Zimbabwean market.'
                  },
                  {
                    icon: Award,
                    title: 'Recognized Certificates',
                    text: 'Earn badges and certificates to showcase your expertise.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-accent-blue/10 p-2 rounded-lg">
                      <item.icon className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark-primary mb-1">{item.title}</h3>
                      <p className="text-muted-gray">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-dark-secondary rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border border-gray-800">
                <PlayCircle className="w-20 h-20 text-accent-blue opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/80 to-transparent flex items-end p-8">
                  <div>
                    <p className="text-white font-bold text-xl mb-2">Introduction to AppEx POS</p>
                    <p className="text-text-muted">Watch our 2-minute overview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of business owners who are mastering their operations with AppEx Academy.
          </p>
          <Button size="xl" variant="secondary" asChild>
            <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer">
              Access the Learning Hub Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default StartLearningPage
