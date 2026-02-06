'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Quote, ArrowRight, Play, TrendingUp, Users, Store } from 'lucide-react'
import { generateWhatsAppMessage } from '@/lib/utils'

export default function CustomersPage() {
  const stats = [
    { label: 'Active Businesses', value: '10,000+', icon: Store },
    { label: 'Happy Users', value: '45,000+', icon: Users },
    { label: 'Growth Rate', value: '150%', icon: TrendingUp },
  ]

  const testimonials = [
    {
      name: "Tendai Moyo",
      role: "Owner, Madokero Hardware",
      content: "Since switching to Appex, our inventory shrinkage dropped by 40%. The ability to track every screw and bolt, even when the power is out, is a lifesaver.",
      rating: 5,
      image: "/avatars/user1.jpg" // Placeholder
    },
    {
      name: "Sarah Chengeta",
      role: "Manager, Café Nush",
      content: "The kitchen display system completely organized our chaotic lunch rush. Validated features like split bills make our customers happier too.",
      rating: 5,
      image: "/avatars/user2.jpg"
    },
    {
      name: "Blessing Gumbo",
      role: "Director, Gumbo General Dealers",
      content: "I manage 3 shops from my house using the Appex dashboard. I can see sales in real-time and transfer stock between branches instantly.",
      rating: 5,
      image: "/avatars/user3.jpg"
    },
    {
      name: "Michelle Nkosi",
      role: "Owner, Velvet Hair Studio",
      content: "Booking appointments and taking payments is so smooth. My clients love the professional receipts sent via WhatsApp.",
      rating: 5,
      image: "/avatars/user4.jpg"
    },
    {
      name: "Peter Katsande",
      role: "MD, Quick Mart",
      content: "We tried 3 other POS systems before Appex. None of them handled the USD/ZWL conversion properly. Appex just works.",
      rating: 5,
      image: "/avatars/user5.jpg"
    },
    {
      name: "Grace Mutasa",
      role: "Founder, Green Grocer",
      content: "The scale integration is fantastic. Weighing veggies and checking out happens in seconds. Highly recommended!",
      rating: 5,
      image: "/avatars/user6.jpg"
    }
  ]

  const caseStudies = [
    {
      title: "How Madokero Hardware Reduced Theft by 37%",
      category: "Retail / Hardware",
      summary: "Facing rising stock losses, Madokero Hardware implemented Appex's strict inventory controls and staff permission levels.",
      results: ["37% reduction in shrinkage", "15 hours/week admin flexibility", "100% stock accuracy"],
      color: "bg-blue-600"
    },
    {
      title: "Three Guys Restaurant: Surviving Hyperinflation",
      category: "Restaurant",
      summary: "Using Appex's dynamic multi-currency pricing, Three Guys maintained margins despite daily exchange rate fluctuations.",
      results: ["Zero margin loss", "Instant menu pricing updates", "30% faster checkout"],
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-appex-dark">
      {/* Hero Section */}
      <section className="relative py-20 bg-appex-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-appex opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Join 10,000+ Businesses <br />
                <span className="text-gradient">Growing with Appex</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                From corner shops to retail chains, see how Zimbabwean businesses are transforming their operations.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex justify-center mb-4">
                    <stat.icon className="w-8 h-8 text-appex-teal" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonial Section (Placeholder) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Real Stories, Real Results</h2>
            <p className="text-gray-600 dark:text-gray-400">Hear directly from business owners who rely on Appex.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-0 shadow-lg group cursor-pointer relative aspect-video">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
              <img src="/api/placeholder/800/450" alt="Video Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 z-20 text-white">
                <h3 className="font-bold text-lg">Hardware Store Success Story</h3>
                <p className="text-sm opacity-90">Munyaradzi, Hwange</p>
              </div>
            </Card>
            <Card className="overflow-hidden border-0 shadow-lg group cursor-pointer relative aspect-video">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
              <img src="/api/placeholder/800/450" alt="Video Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 z-20 text-white">
                <h3 className="font-bold text-lg">Restaurant Workflow Transformation</h3>
                <p className="text-sm opacity-90">Sarah, Harare</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-white dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Customer Love</h2>
            <p className="text-gray-600 dark:text-gray-400">Rated 4.9/5 by 500+ local businesses.</p>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="break-inside-avoid"
              >
                <Card className="border-0 shadow-md bg-gray-50 dark:bg-appex-dark/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic mb-6">"{t.content}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-appex-teal/20 flex items-center justify-center text-appex-teal font-bold mr-3">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Deep Dive Case Studies</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg flex flex-col h-full">
                <div className={`${study.color} h-2 w-full`} />
                <CardHeader>
                  <div className="uppercase tracking-wide text-xs font-bold text-gray-500 mb-1">{study.category}</div>
                  <CardTitle className="text-2xl mb-2">{study.title}</CardTitle>
                  <CardDescription className="text-base">{study.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3 mt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Key Results:</h4>
                    {study.results.map((result, rIndex) => (
                      <div key={rIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <ArrowRight className="w-4 h-4 text-appex-teal mr-2" />
                        {result}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full">Read Full Story</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-appex text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Write Your Success Story?</h2>
          <p className="text-xl opacity-90 mb-8">Join the growing community of smart Zimbabwean business owners.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-appex-teal hover:bg-gray-100"
              onClick={() => window.open(generateWhatsAppMessage("I want to know more about Appex POS"))}
            >
              Chat with Us
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-appex-teal"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
