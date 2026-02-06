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
import Image from 'next/image'

const HomePage = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  // Industry Solutions matching the design
  const solutions = [
    {
      icon: ShoppingCart,
      title: 'Retail Solution',
      description: 'Complete POS system for retail stores, boutiques, and supermarkets with inventory management and customer loyalty.',
      features: ['Barcode scanning', 'Real-time inventory', 'Customer loyalty', 'Multi-store management'],
      color: 'from-blue-500 to-cyan-500',
      href: '/solutions/retail',
      stats: ['500+ stores', '40% faster checkout', '98% inventory accuracy'],
      image: '🏪'
    },
    {
      icon: Utensils,
      title: 'Restaurant Solution',
      description: 'Streamline restaurant operations with table management, kitchen display, and reservation systems.',
      features: ['Table management', 'Kitchen display', 'Bill splitting', 'Online reservations'],
      color: 'from-orange-500 to-red-500',
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
      color: 'from-green-500 to-emerald-500',
      href: '/solutions/grocery',
      stats: ['150+ stores', '30% less waste', '24/7 inventory'],
      image: '🛒'
    }
  ]

  // Core Features matching the design
  const coreFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile POS App',
      description: 'Complete point-of-sale functionality on your phone or tablet. Process sales anywhere, anytime.',
      features: ['Touch-optimized interface', 'Barcode scanning', 'Digital receipts', 'Offline mode'],
      color: 'bg-appex-teal/10 text-appex-teal'
    },
    {
      icon: DollarSign,
      title: 'Payment Processing',
      description: 'Accept all Zimbabwean payment methods with seamless integration and instant confirmations.',
      features: ['EcoCash integration', 'Paynow support', 'Card payments', 'Cash handling'],
      color: 'bg-green-500/10 text-green-600'
    },
    {
      icon: Shield,
      title: 'Offline-First Architecture',
      description: 'Never lose a sale during load shedding. Works completely offline with automatic sync.',
      features: ['Load shedding proof', 'Auto-sync when online', 'Local data backup', 'No internet required'],
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Multi-Currency Support',
      description: 'Handle USD, ZWL, and multiple currencies with real-time exchange rates and dual pricing.',
      features: ['USD/ZWL pricing', 'Auto exchange rates', 'Currency switching', 'Inflation tracking'],
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track stock levels, set reorder points, and manage suppliers with advanced inventory tools.',
      features: ['Real-time stock tracking', 'Low stock alerts', 'Supplier management', 'Batch tracking'],
      color: 'bg-orange-500/10 text-orange-600'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Build customer relationships with loyalty programs, profiles, and purchase history.',
      features: ['Customer database', 'Loyalty points', 'Purchase history', 'Credit accounts'],
      color: 'bg-pink-500/10 text-pink-600'
    },
    {
      icon: UserCheck,
      title: 'Staff Management',
      description: 'Manage employees, permissions, shifts, and performance with comprehensive staff tools.',
      features: ['Employee profiles', 'Permission levels', 'Time tracking', 'Performance reports'],
      color: 'bg-indigo-500/10 text-indigo-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into your business with detailed reports and real-time analytics.',
      features: ['Sales reports', 'Profit analysis', 'Customer insights', 'Custom dashboards'],
      color: 'bg-cyan-500/10 text-cyan-600'
    }
  ]

  // Zimbabwe-Specific Features
  const zimFeatures = [
    {
      icon: WifiOff,
      title: 'Load Shedding Mode',
      description: 'Specifically designed to work during Zimbabwe power cuts without interruption.',
      features: ['Battery optimization', 'Offline transactions', 'Queue management', 'Power-saving mode'],
      color: 'bg-red-500/10 text-red-600'
    },
    {
      icon: CreditCard,
      title: 'Local Payment Integration',
      description: 'Native support for all Zimbabwean payment methods and mobile money platforms.',
      features: ['EcoCash API', 'Paynow integration', 'ZimSwitch support', 'ZIPIT transfers'],
      color: 'bg-green-600/10 text-green-700'
    },
    {
      icon: Globe,
      title: 'Zimbabwe Market Ready',
      description: 'Built specifically for Zimbabwean business challenges and opportunities.',
      features: ['Local tax support', 'ZIMRA compliance', 'RBZ guidelines', 'Local support'],
      color: 'bg-appex-cyan/10 text-appex-cyan'
    },
    {
      icon: Lock,
      title: 'Data Security & Privacy',
      description: 'Bank-level security with data residency options for compliance and peace of mind.',
      features: ['Data encryption', 'Local data storage', 'Privacy controls', 'Audit trails'],
      color: 'bg-slate-500/10 text-slate-600'
    }
  ]

  // Stats
  const stats = [
    { value: '10,000+', label: 'Businesses', icon: Building },
    { value: '4.8★', label: 'Rating', icon: Star },
    { value: '99.9%', label: 'Uptime', icon: Target },
    { value: '24/7', label: 'Support', icon: HeadphonesIcon }
  ]

  // Testimonials
  const testimonials = [
    {
      name: 'Grace Moyo',
      business: 'Fashion Boutique, Harare',
      content: 'Appex POS transformed our boutique. We reduced inventory losses by 40% and our customers love the loyalty program.',
      rating: 5,
      industry: 'Retail'
    },
    {
      name: 'Tatenda Moyo',
      business: 'The Garden Restaurant, Harare',
      content: 'Table turnover increased by 40% and order accuracy went from 85% to 99%. Our customers love the quick bill splitting.',
      rating: 5,
      industry: 'Restaurant'
    },
    {
      name: 'Peter Nyoni',
      business: 'BuildPro Hardware, Harare',
      content: 'Contractor account management and special order tracking are game-changers. Our contractor sales increased by 50%!',
      rating: 5,
      industry: 'Hardware'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-appex-dark">
      <Navbar />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
      
      {/* Hero Section - Matching the design */}
      <section className="py-20 bg-gradient-to-br from-appex-teal/10 to-appex-cyan/10 dark:from-appex-teal/20 dark:to-appex-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-appex-teal/10 rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4 text-appex-teal" />
                <span className="text-sm font-medium text-appex-teal">Zimbabwe's #1 POS System</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Complete POS <span className="text-gradient">Solutions</span> for Zimbabwean Businesses
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Transform your business with industry-specific POS solutions designed for Zimbabwe. 
                From retail to restaurants, hardware to groceries - we've got you covered.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="xl" 
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS solutions"))}
                >
                  Schedule Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 mr-1" />
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-white dark:bg-appex-charcoal rounded-2xl shadow-2xl p-8">
                  <div className="aspect-square bg-gradient-to-br from-appex-teal/10 to-appex-cyan/10 dark:from-appex-teal/20 dark:to-appex-cyan/20 rounded-xl flex items-center justify-center mb-6">
                    <Image 
                      src="/appex logo.png" 
                      alt="Appex POS Logo" 
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Load shedding proof</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">EcoCash ready</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Multi-currency support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">24/7 local support</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-appex-teal/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-appex-cyan/20 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industry Solutions - Matching the design */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Industry-Specific <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tailored POS solutions designed for your specific industry needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group cursor-pointer">
                  <CardHeader>
                    <div className={`w-20 h-20 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <solution.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{solution.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {solution.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="bg-gray-50 dark:bg-appex-dark rounded-lg p-2">
                            <div className="text-lg font-bold text-appex-teal">{stat}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        {solution.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
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

      {/* Core Features - Matching the design */}
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful <span className="text-gradient">Core Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to run your business efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => (
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
                    <div className="space-y-1">
                      {feature.features.slice(0, 2).map((item, itemIndex) => (
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

      {/* Zimbabwe-Specific Features - Matching the design */}
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
                      {feature.features.map((item, itemIndex) => (
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

      {/* Testimonials - Matching the design */}
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from Zimbabwean businesses thriving with Appex POS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {testimonial.business}
                      </div>
                      <div className="text-xs text-appex-teal font-medium">
                        {testimonial.industry} Industry
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Matching the design */}
      <section className="py-20 bg-gradient-appex text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join 10,000+ Zimbabwean businesses already growing with Appex POS. 
              Start your free 14-day trial today.
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
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo to see how Appex POS can transform my business"))}
              >
                Schedule Demo
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
