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
      color: 'from-accent-blue to-accent-blue',
      href: '/solutions/retail',
      stats: ['500+ stores', '40% faster checkout', '98% inventory accuracy'],
      image: '🏪'
    },
    {
      icon: Utensils,
      title: 'Restaurant Solution',
      description: 'Streamline restaurant operations with table management, kitchen display, and reservation systems.',
      features: ['Table management', 'Kitchen display', 'Bill splitting', 'Online reservations'],
      color: 'from-accent-green to-accent-green',
      href: '/solutions/restaurant',
      stats: ['300+ restaurants', '35% faster service', '99% order accuracy'],
      image: '🍽️'
    },
    {
      icon: Wrench,
      title: 'Hardware Solution',
      description: 'Perfect for hardware stores with serial tracking, contractor accounts, and special order management.',
      features: ['Serial tracking', 'Contractor accounts', 'Special orders', 'Batch management'],
      color: 'from-accent-purple to-accent-purple',
      href: '/solutions/hardware',
      stats: ['200+ stores', '45% fewer stockouts', '96% accuracy'],
      image: '🔧'
    },
    {
      icon: Package,
      title: 'Grocery Solution',
      description: 'Comprehensive solution for grocery stores with perishable tracking and bulk pricing.',
      features: ['Perishable tracking', 'Bulk pricing', 'Supplier management', 'Weight scales'],
      color: 'from-accent-green to-accent-green',
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
      color: 'bg-accent-blue/10 text-accent-blue'
    },
    {
      icon: DollarSign,
      title: 'Payment Processing',
      description: 'Accept all Zimbabwean payment methods with seamless integration and instant confirmations.',
      features: ['EcoCash integration', 'Paynow support', 'Card payments', 'Cash handling'],
      color: 'bg-accent-green/10 text-accent-green'
    },
    {
      icon: Shield,
      title: 'Offline-First Architecture',
      description: 'Never lose a sale during load shedding. Works completely offline with automatic sync.',
      features: ['Load shedding proof', 'Auto-sync when online', 'Local data backup', 'No internet required'],
      color: 'bg-accent-blue/10 text-accent-blue'
    },
    {
      icon: TrendingUp,
      title: 'Multi-Currency Support',
      description: 'Handle USD, ZWL, and multiple currencies with real-time exchange rates and dual pricing.',
      features: ['USD/ZWL pricing', 'Auto exchange rates', 'Currency switching', 'Inflation tracking'],
      color: 'bg-accent-purple/10 text-accent-purple'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track stock levels, set reorder points, and manage suppliers with advanced inventory tools.',
      features: ['Real-time stock tracking', 'Low stock alerts', 'Supplier management', 'Batch tracking'],
      color: 'bg-status-warning/10 text-status-warning'
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Build customer relationships with loyalty programs, profiles, and purchase history.',
      features: ['Customer database', 'Loyalty points', 'Purchase history', 'Credit accounts'],
      color: 'bg-accent-blue/10 text-accent-blue'
    },
    {
      icon: UserCheck,
      title: 'Staff Management',
      description: 'Manage employees, permissions, shifts, and performance with comprehensive staff tools.',
      features: ['Employee profiles', 'Permission levels', 'Time tracking', 'Performance reports'],
      color: 'bg-accent-purple/10 text-accent-purple'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into your business with detailed reports and real-time analytics.',
      features: ['Sales reports', 'Profit analysis', 'Customer insights', 'Custom dashboards'],
      color: 'bg-accent-green/10 text-accent-green'
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
      color: 'bg-accent-green/10 text-accent-green-dark'
    },
    {
      icon: Globe,
      title: 'Zimbabwe Market Ready',
      description: 'Built specifically for Zimbabwean business challenges and opportunities.',
      features: ['Local tax support', 'ZIMRA compliance', 'RBZ guidelines', 'Local support'],
      color: 'bg-accent-blue/10 text-accent-blue-dark'
    },
    {
      icon: Lock,
      title: 'Data Security & Privacy',
      description: 'Bank-level security with data residency options for compliance and peace of mind.',
      color: 'bg-slate-500/10 text-slate-600',
      features: ['Data encryption', 'Local data storage', 'Privacy controls', 'Audit trails']
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
    <div className="min-h-screen bg-light-primary">
      <Navbar />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />

      {/* Hero Section - Modern Design */}
      <section className="py-24 bg-gradient-to-br from-dark-primary to-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-accent-blue/10 rounded-full px-4 py-2 mb-8">
                <Shield className="w-4 h-4 text-accent-blue" />
                <span className="text-sm font-medium text-accent-blue">Zimbabwe's #1 POS System</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-light-primary mb-8 leading-tight">
                Complete POS <span className="text-gradient">Solutions</span> for Zimbabwean Businesses
              </h1>
              <p className="text-xl text-text-muted mb-10 leading-relaxed">
                Transform your business with industry-specific POS solutions designed for Zimbabwe.
                From retail to restaurants, hardware to groceries - we've got you covered.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-12">
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

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-light-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-gray flex items-center justify-center">
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
                <div className="bg-dark-secondary rounded-2xl shadow-2xl p-8 border border-gray-800">
                  <div className="w-64 h-64 bg-gradient-to-br from-accent-blue/10 to-accent-green/10 rounded-xl flex items-center justify-center mb-8 p-6">
                    <Image
                      src="/logo.png"
                      alt="Appex POS Logo"
                      width={240}
                      height={240}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                      <span className="text-text-muted">Load shedding proof</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                      <span className="text-text-muted">EcoCash ready</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                      <span className="text-text-muted">Multi-currency support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-green" />
                      <span className="text-text-muted">24/7 local support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-accent-blue/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-accent-green/20 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industry Solutions - Modern Design */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Industry-Specific <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Tailored POS solutions designed for your specific industry needs
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

      {/* Core Features - Modern Design */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Powerful <span className="text-gradient">Core Features</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Everything you need to run your business efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-light-primary border border-gray-200">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold tracking-tight text-2xl mb-3 text-dark-primary">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-muted-gray mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.features.slice(0, 2).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-accent-green flex-shrink-0" />
                          <span className="text-sm text-muted-gray">{item}</span>
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

      {/* Zimbabwe-Specific Features - Modern Design */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Built for <span className="text-gradient">Zimbabwe</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Features specifically designed to solve Zimbabwean business challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {zimFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-light-primary border border-gray-200">
                  <CardHeader className="p-8">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-semibold tracking-tight text-2xl text-dark-primary">{feature.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-gray leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="space-y-4">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                          <span className="text-lg text-muted-gray">{item}</span>
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

      {/* Testimonials - Modern Design */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
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
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg bg-light-primary border border-gray-200">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-lg text-muted-gray mb-8 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t border-gray-100 pt-6">
                      <div className="text-xl font-bold text-dark-primary mb-2">
                        {testimonial.name}
                      </div>
                      <div className="text-md text-muted-gray mb-3">
                        {testimonial.business}
                      </div>
                      <div className="text-sm text-accent-blue font-semibold">
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

      {/* Business Ecosystem Section */}
      <section className="py-24 bg-dark-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-blue/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-accent-purple/5 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Appex <span className="text-gradient">Ecosystem</span>
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              A unified suite of specialized portals designed to empower every segment of your business network.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Business Portal Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-dark-secondary border-dark-tertiary hover:border-accent-blue/50 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden group shadow-xl">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-accent-blue/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Building className="w-8 h-8 text-accent-blue" />
                  </div>
                  <CardTitle className="text-3xl text-white mb-4">Business Management Portal</CardTitle>
                  <CardDescription className="text-xl text-text-muted leading-relaxed">
                    A high-performance command center for business owners. Manage multi-warehouse inventory, view AI-powered sales forecasts, and track real-time analytics across all branches.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-4 mb-8">
                    {[
                      'Multi-Warehouse Inventory Tracking',
                      'AI Sales & Revenue Forecasting',
                      'Real-time Multi-Currency Analytics',
                      'Staff Performance & Shift Management'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-text-muted">
                        <CheckCircle className="w-5 h-5 text-accent-blue mr-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="appex" className="w-full" asChild>
                    <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">
                      Access Business Portal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Affiliation Portal Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-dark-secondary border-dark-tertiary hover:border-accent-purple/50 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden group shadow-xl">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-accent-purple/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-accent-purple" />
                  </div>
                  <CardTitle className="text-3xl text-white mb-4">Partner Affiliation Portal</CardTitle>
                  <CardDescription className="text-xl text-text-muted leading-relaxed">
                    Designed for our growth partners and consultants. Track referrals, manage lead funnels, access marketing assets, and request instant commission payouts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-4 mb-8">
                    {[
                      'Transparent Commission Tracking',
                      'Sophisticated Lead Management Funnel',
                      'Premium Marketing Creative Library',
                      'Tiered Reward & Growth System'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-text-muted">
                        <CheckCircle className="w-5 h-5 text-accent-purple mr-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white" asChild>
                    <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer">
                      Join Partner Program
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Design */}
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
              Join 10,000+ Zimbabwean businesses already growing with Appex POS.
              Start your free 14-day trial today.
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
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo to see how Appex POS can transform my business"))}
              >
                Schedule Demo
              </Button>
            </div>

            <div className="mt-16 flex items-center justify-center space-x-12">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6" />
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
