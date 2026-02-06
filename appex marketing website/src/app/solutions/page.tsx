'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import DownloadModal from '@/components/download-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  DollarSign,
  Zap,
  ShoppingCart,
  Utensils,
  Wrench,
  Package,
  BarChart3,
  Clock,
  WifiOff,
  CreditCard,
  Globe,
  Database,
  Settings,
  Bell,
  FileText,
  Printer,
  HeadphonesIcon,
  Target,
  Award,
  PieChart,
  Receipt,
  UserCheck,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Building,
  Cloud,
  Lock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'
import Link from 'next/link'

export default function SolutionsPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  // Industry Solutions matching the design
  const solutions = [
    {
      icon: ShoppingCart,
      title: 'Retail Solution',
      description: 'Complete POS system for retail stores, boutiques, and supermarkets with inventory management and customer loyalty.',
      features: ['Barcode scanning', 'Real-time inventory', 'Customer loyalty', 'Multi-store management'],
      color: 'from-blue-500 to-accent-blue-dark',
      href: '/solutions/retail',
      stats: ['500+ stores', '40% faster checkout', '98% inventory accuracy'],
      image: '🏪'
    },
    {
      icon: Utensils,
      title: 'Restaurant Solution',
      description: 'Streamline restaurant operations with table management, kitchen display, and reservation systems.',
      features: ['Table management', 'Kitchen display', 'Bill splitting', 'Online reservations'],
      color: 'from-accent-green to-accent-green-dark',
      href: '/solutions/restaurant',
      stats: ['300+ restaurants', '35% faster service', '99% order accuracy'],
      image: '🍽️'
    },
    {
      icon: Wrench,
      title: 'Hardware Solution',
      description: 'Perfect for hardware stores with serial tracking, contractor accounts, and special order management.',
      features: ['Serial tracking', 'Contractor accounts', 'Special orders', 'Batch management'],
      color: 'from-gray-600 to-slate-600',
      href: '/solutions/hardware',
      stats: ['200+ stores', '45% fewer stockouts', '96% accuracy'],
      image: '🔧'
    },
    {
      icon: Package,
      title: 'Grocery Solution',
      description: 'Comprehensive solution for grocery stores with perishable tracking and bulk pricing.',
      features: ['Perishable tracking', 'Bulk pricing', 'Supplier management', 'Weight scales'],
      color: 'from-emerald-500 to-accent-green-dark',
      href: '/solutions/grocery',
      stats: ['150+ stores', '30% less waste', '24/7 inventory'],
      image: '🛒'
    }
  ]

  // Benefits
  const benefits = [
    {
      icon: WifiOff,
      title: 'Load Shedding Proof',
      description: 'Works perfectly during power cuts with offline-first architecture.'
    },
    {
      icon: CreditCard,
      title: 'Local Payment Integration',
      description: 'Supports EcoCash, Paynow, and all Zimbabwean payment methods.'
    },
    {
      icon: Globe,
      title: 'Multi-Currency Support',
      description: 'Handle USD, ZWL, and multiple currencies with real-time rates.'
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Bank-level security with local data storage and encryption.'
    }
  ]

  return (
    <div className="min-h-screen bg-light-primary">
      <Navbar />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-dark-primary to-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-light-primary mb-8 leading-tight">
                Industry-Specific <span className="text-gradient">Solutions</span>
              </h1>
              <p className="text-xl text-light-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
                Tailored POS solutions designed for your specific industry needs.
                From retail to restaurants, we have the perfect solution for your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="xl"
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to discuss which solution is right for my business"))}
                >
                  Get Expert Advice
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Choose Your <span className="text-gradient">Industry</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Select your industry to see how Appex POS can transform your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-light-primary border border-gray-200">
                  <CardHeader className="p-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <solution.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="font-semibold tracking-tight text-2xl mb-3 text-dark-primary">{solution.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-gray leading-relaxed">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {solution.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="bg-gray-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-accent-blue">{stat}</div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        {solution.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                            <span className="text-muted-gray">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full" variant="appex" asChild>
                        <Link href={solution.href}>
                          Explore Solution
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Why Choose <span className="text-gradient">Appex POS</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Every solution comes with powerful features built for Zimbabwean businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-light-primary border border-gray-200">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-8 h-8 text-accent-blue" />
                    </div>
                    <h3 className="font-semibold tracking-tight text-2xl text-dark-primary mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-lg text-muted-gray leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-appex text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Get personalized recommendations and see how Appex POS can solve your specific business challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="xl" variant="secondary" onClick={() => setIsDownloadModalOpen(true)}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-accent-blue"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo to see which solution is right for my business"))}
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
