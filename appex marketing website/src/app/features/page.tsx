'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import DownloadModal from '@/components/download-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  BarChart3, 
  Users, 
  Box, 
  Smartphone, 
  WifiOff, 
  FileText, 
  Lock,
  DollarSign,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Target,
  Award,
  PieChart,
  Clock,
  CreditCard,
  Globe,
  Database,
  Settings,
  Bell,
  Printer,
  HeadphonesIcon,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'
import Link from 'next/link'

export default function FeaturesPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  // Core POS Features
  const coreFeatures = [
    {
      title: "Point of Sale",
      description: "Fast, intuitive checkout designed for speed. Handle intense queues with ease.",
      icon: Smartphone,
      color: 'bg-appex-teal/10 text-appex-teal',
      list: ["Barcode Scanning", "Quick keys for top items", "Split payments", "Discounts & Notes"]
    },
    {
      title: "Inventory Management",
      description: "Track every item in real-time. Know exactly what you have and what you need.",
      icon: Box,
      color: 'bg-blue-500/10 text-blue-600',
      list: ["Stock counts & adjustments", "Low stock alerts", "Supplier orders", "Transfer between stores"]
    },
    {
      title: "Payment Processing",
      description: "Accept all payment methods with instant confirmations and secure processing.",
      icon: CreditCard,
      color: 'bg-green-500/10 text-green-600',
      list: ["EcoCash integration", "Card payments", "Cash handling", "Mobile money"]
    },
    {
      title: "Customer Management",
      description: "Build lasting relationships with comprehensive customer profiles and loyalty programs.",
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600',
      list: ["Customer database", "Loyalty points", "Purchase history", "Credit accounts"]
    }
  ]

  // Business Management Features
  const businessFeatures = [
    {
      title: "Staff Management",
      description: "Control what your staff can do and track their performance effectively.",
      icon: Users,
      color: 'bg-orange-500/10 text-orange-600',
      list: ["Employee profiles", "Permission levels", "Time tracking", "Performance reports"]
    },
    {
      title: "Analytics & Reports",
      description: "Get deep insights into your business with comprehensive reporting tools.",
      icon: BarChart3,
      color: 'bg-cyan-500/10 text-cyan-600',
      list: ["Sales reports", "Profit analysis", "Customer insights", "Custom dashboards"]
    },
    {
      title: "Multi-Store Management",
      description: "Manage multiple locations from one dashboard with centralized control.",
      icon: Target,
      color: 'bg-indigo-500/10 text-indigo-600',
      list: ["Centralized inventory", "Cross-store transfers", "Unified reporting", "Staff coordination"]
    },
    {
      title: "Supplier Management",
      description: "Streamline your supply chain with automated ordering and tracking.",
      icon: ShoppingCart,
      color: 'bg-pink-500/10 text-pink-600',
      list: ["Supplier database", "Purchase orders", "Delivery tracking", "Automated reordering"]
    }
  ]

  // Zimbabwe-Specific Features
  const zimFeatures = [
    {
      title: "Load Shedding Mode",
      description: "Never stop selling during power cuts. Appex works perfectly offline.",
      icon: WifiOff,
      color: 'bg-red-500/10 text-red-600',
      list: ["Full offline functionality", "Auto-sync when online", "Local database encryption", "No data loss"]
    },
    {
      title: "Multi-Currency Support",
      description: "Handle USD, ZWL and multiple currencies with real-time exchange rates.",
      icon: DollarSign,
      color: 'bg-green-600/10 text-green-700',
      list: ["USD/ZWL pricing", "Auto exchange rates", "Currency switching", "Inflation tracking"]
    },
    {
      title: "Local Payment Integration",
      description: "Native support for all Zimbabwean payment methods and mobile money platforms.",
      icon: Globe,
      color: 'bg-appex-cyan/10 text-appex-cyan',
      list: ["EcoCash API", "Paynow integration", "ZimSwitch support", "ZIPIT transfers"]
    },
    {
      title: "Zimbabwe Tax Compliance",
      description: "Built-in compliance with Zimbabwean tax regulations and reporting requirements.",
      icon: FileText,
      color: 'bg-amber-500/10 text-amber-600',
      list: ["ZIMRA compliance", "Tax reports", "VAT calculations", "Audit trails"]
    }
  ]

  // Advanced Features
  const advancedFeatures = [
    {
      title: "Cloud Sync & Backup",
      description: "Automatic cloud backup with multi-device sync and enterprise-grade security.",
      icon: Database,
      color: 'bg-sky-500/10 text-sky-600',
      list: ["Real-time sync", "Automatic backup", "Data encryption", "Multi-device access"]
    },
    {
      title: "API Integration",
      description: "Connect with your favorite tools and automate your workflows.",
      icon: Settings,
      color: 'bg-violet-500/10 text-violet-600',
      list: ["REST API", "Webhook support", "Third-party integrations", "Custom workflows"]
    },
    {
      title: "Advanced Reporting",
      description: "Create custom reports and export data in multiple formats for analysis.",
      icon: PieChart,
      color: 'bg-emerald-500/10 text-emerald-600',
      list: ["Custom reports", "Data export", "Scheduled reports", "Advanced filters"]
    },
    {
      title: "Security & Compliance",
      description: "Bank-level security with comprehensive compliance and audit features.",
      icon: Lock,
      color: 'bg-slate-500/10 text-slate-600',
      list: ["Data encryption", "Access controls", "Audit logs", "Compliance reporting"]
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-appex-dark">
      <Navbar />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-appex-teal/10 to-appex-cyan/10 dark:from-appex-teal/20 dark:to-appex-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Complete <span className="text-gradient">Feature Set</span> for Modern Business
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Everything you need to run your business efficiently, from point of sale to advanced analytics. 
                Built specifically for Zimbabwean business challenges.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="xl" 
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to learn more about Appex POS features"))}
                >
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core POS Features */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Core <span className="text-gradient">POS Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Essential point-of-sale functionality designed for speed and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.list.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Management Features */}
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Business <span className="text-gradient">Management</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful tools to manage and grow your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.list.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zimbabwe-Specific Features */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for <span className="text-gradient">Zimbabwe</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Features specifically designed to solve Zimbabwean business challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {zimFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.list.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Enterprise-grade features for growing businesses and advanced operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.list.slice(0, 3).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-appex text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start your free 14-day trial and see how Appex POS can transform your business operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="secondary" onClick={() => setIsDownloadModalOpen(true)}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-appex-teal"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo to see all the features in action"))}
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
