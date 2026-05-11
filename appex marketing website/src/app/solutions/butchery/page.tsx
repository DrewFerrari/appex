'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import DownloadModal from '@/components/download-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Scale, 
  Truck, 
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  WifiOff,
  CreditCard,
  Globe,
  Shield,
  Smartphone,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Printer,
  HeadphonesIcon,
  Target,
  Award,
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
import Link from 'next/link'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'

const ButcherySolution: React.FC = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const features = [
    {
      icon: Package,
      title: 'Meat Processing',
      description: 'Track meat processing stages from raw to finished products',
      benefits: ['Stage tracking', 'Quality control', 'Yield calculation', 'Processing reports']
    },
    {
      icon: Scale,
      title: 'Weight Management',
      description: 'Precise weight tracking and pricing for all meat products',
      benefits: ['Digital scales integration', 'Variable pricing', 'Weight-based inventory', 'Loss tracking']
    },
    {
      icon: Truck,
      title: 'Supplier Management',
      description: 'Manage relationships with meat suppliers and track deliveries',
      benefits: ['Supplier database', 'Delivery scheduling', 'Quality grading', 'Price tracking']
    },
    {
      icon: Clock,
      title: 'Freshness Tracking',
      description: 'Monitor product freshness and expiry dates',
      benefits: ['Expiry alerts', 'Freshness indicators', 'Auto-discounting', 'Waste reduction']
    }
  ]

  // Additional benefits
  const additionalBenefits = [
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

  // Technical features
  const technicalFeatures = [
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Manage your butchery from anywhere with our mobile app.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get insights into sales trends, customer behavior, and performance.'
    },
    {
      icon: Settings,
      title: 'Customizable Settings',
      description: 'Tailor the system to match your specific butchery workflows.'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Stay informed about low stock, expiry alerts, and important updates.'
    }
  ]

  // Support features
  const supportFeatures = [
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock Zimbabwe-based support team.'
    },
    {
      icon: FileText,
      title: 'Training Materials',
      description: 'Comprehensive documentation and video tutorials.'
    },
    {
      icon: Printer,
      title: 'Receipt Printing',
      description: 'Professional receipts with branding and details.'
    },
    {
      icon: Target,
      title: 'Customer Management',
      description: 'Track customer preferences and purchase history.'
    }
  ]

  const stats = [
    { value: '15%', label: 'Reduced Waste', description: 'Better inventory management' },
    { value: '25%', label: 'Increased Sales', description: 'Accurate weight tracking' },
    { value: '30%', label: 'Time Saved', description: 'Automated processing' },
    { value: '20%', label: 'Better Margins', description: 'Yield optimization' }
  ]

  const testimonials = [
    {
      name: 'James Moyo',
      business: 'Moyo Butchery, Harare',
      content: 'Appex transformed our meat processing. We now track everything from slaughter to sale with perfect accuracy.',
      results: 'Reduced waste by 18% and increased profits by 22%'
    },
    {
      name: 'Sarah Chenje',
      business: 'Premium Meats, Bulawayo',
      content: 'The weight management and freshness tracking features are game-changers for our business.',
      results: 'Improved customer satisfaction and reduced spoilage'
    }
  ]

  const pricing = [
    {
      name: 'Basic Butchery',
      price: '$45',
      period: '/month',
      features: [
        'Meat processing tracking',
        'Weight management',
        'Basic supplier management',
        'POS system',
        'Inventory tracking',
        'Basic reports'
      ],
      popular: false
    },
    {
      name: 'Professional Butchery',
      price: '$85',
      period: '/month',
      features: [
        'Advanced processing stages',
        'Digital scales integration',
        'Supplier relationship management',
        'Freshness tracking',
        'Advanced analytics',
        'Quality control tools',
        'Yield optimization',
        'Customer management'
      ],
      popular: true
    },
    {
      name: 'Enterprise Butchery',
      price: '$150',
      period: '/month',
      features: [
        'Multi-location management',
        'Advanced processing workflows',
        'Supplier network management',
        'Comprehensive quality control',
        'Business intelligence',
        'Custom reporting',
        'API access',
        'Dedicated support',
        'Training programs'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-light-primary">
      <Navbar />
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-600/30">
              Specialized for Butcheries
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-light-primary mb-6 leading-tight">
              Complete Butchery Management
              <span className="block text-3xl md:text-4xl mt-2 text-gradient">From Processing to Point of Sale</span>
            </h1>
            <p className="text-xl text-light-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
              Specialized POS and management system designed for Zimbabwean butcheries. 
              Track meat processing, manage weights, control quality, and optimize your entire operation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button
                size="xl"
                variant="appexOutline"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to learn more about the Butchery Solution"))}
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-dark-primary to-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">{stat.value}</div>
                <div className="text-xl font-semibold text-light-primary mb-1">{stat.label}</div>
                <div className="text-light-secondary">{stat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Butchery-Specific <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Tools designed specifically for meat processing and sales operations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-light-primary border border-gray-200">
                  <CardHeader className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-600/20 rounded-lg group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-dark-primary">{feature.title}</CardTitle>
                        <CardDescription className="text-muted-gray">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-center gap-3 text-muted-gray">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-dark-primary to-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-light-primary mb-6">
              Why Choose <span className="text-gradient">Appex Butchery</span>
            </h2>
            <p className="text-xl text-light-secondary max-w-3xl mx-auto leading-relaxed">
              Built specifically for Zimbabwean butcheries with local challenges in mind
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalBenefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center bg-slate-800/50 border-gray-700 hover:bg-slate-800/70 transition-colors h-full">
                  <CardHeader className="p-6">
                    <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-8 w-8 text-red-400" />
                    </div>
                    <CardTitle className="text-xl text-light-primary">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-light-secondary">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Advanced <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Powerful features to modernize your butchery operations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center bg-light-primary border border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="p-6">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-dark-primary">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-gray">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-dark-primary to-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-light-primary mb-6">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-light-secondary max-w-3xl mx-auto leading-relaxed">
              How Zimbabwean butcheries are thriving with Appex
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-gray-700 hover:bg-slate-800/70 transition-colors">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-6">
                          <div className="font-semibold text-xl text-light-primary mb-2">{testimonial.name}</div>
                          <div className="text-sm text-light-secondary">{testimonial.business}</div>
                        </div>
                        <p className="text-light-secondary mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>
                        <div className="flex items-center gap-2 text-green-400 font-semibold">
                          <Award className="h-5 w-5" />
                          {testimonial.results}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Dedicated <span className="text-gradient">Support</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              We're here to help you succeed every step of the way
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center bg-light-primary border border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="p-6">
                    <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-dark-primary">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-gray">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-dark-primary to-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-light-primary mb-6">
              Simple <span className="text-gradient">Pricing</span>
            </h2>
            <p className="text-xl text-light-secondary max-w-3xl mx-auto leading-relaxed">
              Choose the right plan for your butchery business
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`bg-slate-800/50 border-gray-700 hover:bg-slate-800/70 transition-all duration-300 ${plan.popular ? 'ring-2 ring-red-500 scale-105' : ''}`}>
                  <CardHeader className="text-center p-8">
                    {plan.popular && (
                      <Badge className="mb-4 bg-red-600 text-white">Most Popular</Badge>
                    )}
                    <CardTitle className="text-2xl text-light-primary mb-4">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1 mb-6">
                      <span className="text-5xl font-bold text-light-primary">{plan.price}</span>
                      <span className="text-light-secondary">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-light-secondary">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="lg" 
                      className={`w-full ${plan.popular ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-600'}`}
                      onClick={() => setIsDownloadModalOpen(true)}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600/20 to-orange-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-light-primary mb-6">
              Ready to Transform Your <span className="text-gradient">Butchery?</span>
            </h2>
            <p className="text-xl text-light-secondary mb-12 leading-relaxed">
              Join hundreds of Zimbabwean butcheries using Appex to streamline their operations
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                Start 14-Day Free Trial
              </Button>
              <Button
                size="xl"
                variant="appexOutline"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to discuss the Butchery Solution for my business"))}
              >
                Talk to Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ButcherySolution
