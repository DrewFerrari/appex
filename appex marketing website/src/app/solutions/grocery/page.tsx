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

export default function GrocerySolutionPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  // Key Features for Grocery
  const keyFeatures = [
    {
      icon: Package,
      title: 'Perishable Tracking',
      description: 'Track expiration dates and manage perishable inventory with automated alerts.',
      features: ['Expiration tracking', 'Waste reduction', 'Automated alerts', 'Batch management'],
      color: 'bg-accent-green/10 text-accent-green'
    },
    {
      icon: BarChart3,
      title: 'Bulk Pricing',
      description: 'Flexible pricing options for bulk purchases and wholesale customers.',
      features: ['Volume discounts', 'Tiered pricing', 'Customer-specific pricing', 'Promotional pricing'],
      color: 'bg-accent-blue/10 text-accent-blue'
    },
    {
      icon: Users,
      title: 'Supplier Management',
      description: 'Manage relationships with multiple suppliers and streamline procurement.',
      features: ['Supplier database', 'Purchase orders', 'Delivery tracking', 'Automated reordering'],
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: Smartphone,
      title: 'Weight Scale Integration',
      description: 'Connect directly to digital scales for accurate weight-based pricing.',
      features: ['Scale integration', 'Weight-based pricing', 'Label printing', 'Barcode generation'],
      color: 'bg-orange-500/10 text-orange-600'
    }
  ]

  // Business Impact
  const businessImpact = [
    {
      icon: TrendingUp,
      title: '30% Less Waste',
      description: 'Reduce food waste with better inventory management and expiration tracking.'
    },
    {
      icon: Users,
      title: '25% More Customers',
      description: 'Attract more customers with competitive pricing and better service.'
    },
    {
      icon: DollarSign,
      title: '20% Higher Margins',
      description: 'Improve profit margins with better pricing control and reduced waste.'
    },
    {
      icon: Clock,
      title: '50% Faster Checkout',
      description: 'Speed up checkout times with barcode scanning and efficient workflows.'
    }
  ]

  // Daily Workflows
  const workflows = [
    {
      title: 'Morning Setup',
      steps: [
        'Check inventory levels',
        'Review expiration alerts',
        'Update daily specials',
        'Prepare promotional displays'
      ]
    },
    {
      title: 'Customer Service',
      steps: [
        'Quick barcode scanning',
        'Weight-based pricing',
        'Loyalty program integration',
        'Multiple payment options'
      ]
    },
    {
      title: 'Inventory Management',
      steps: [
        'Real-time stock tracking',
        'Automated reordering',
        'Supplier coordination',
        'Waste reporting'
      ]
    },
    {
      title: 'End of Day',
      steps: [
        'Sales reporting',
        'Inventory reconciliation',
        'Waste analysis',
        'Tomorrow\'s preparation'
      ]
    }
  ]

  // Testimonials
  const testimonials = [
    {
      name: 'Sarah Chen',
      business: 'FreshMart Grocery, Harare',
      content: 'Appex POS reduced our food waste by 35% and helped us manage perishable inventory much better. The bulk pricing feature is fantastic for our wholesale customers.',
      rating: 5
    },
    {
      name: 'John Moyo',
      business: 'Community Market, Bulawayo',
      content: 'The scale integration and weight-based pricing have transformed our checkout process. Our customers love the accuracy and speed.',
      rating: 5
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
              <div className="inline-flex items-center space-x-2 bg-accent-green/10 rounded-full px-4 py-2 mb-8">
                <Package className="w-4 h-4 text-accent-green" />
                <span className="text-sm font-medium text-accent-green">Grocery Solution</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-light-primary mb-8 leading-tight">
                Complete <span className="text-gradient">Grocery Store</span> Management
              </h1>
              <p className="text-xl text-light-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
                Transform your grocery store with specialized POS features for perishable tracking, 
                bulk pricing, and efficient inventory management designed for Zimbabwean markets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="xl" 
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in the Grocery Solution for my store"))}
                >
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Grocery-Specific <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Everything you need to run a modern grocery store efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-light-primary border border-gray-200">
                  <CardHeader>
                    <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl text-dark-primary">{feature.title}</CardTitle>
                    <CardDescription className="text-lg text-muted-gray">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                          <span className="text-muted-gray">{item}</span>
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

      {/* Business Impact */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Business <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Real results from grocery stores using Appex POS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessImpact.map((impact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-light-primary border border-gray-200">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-accent-blue/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <impact.icon className="w-8 h-8 text-accent-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-accent-blue mb-3">
                      {impact.title}
                    </h3>
                    <p className="text-muted-gray leading-relaxed">
                      {impact.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Workflows */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Daily <span className="text-gradient">Workflows</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Streamlined processes for efficient grocery store operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflows.map((workflow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-light-primary border border-gray-200">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-semibold text-dark-primary mb-4">
                      {workflow.title}
                    </h3>
                    <div className="space-y-3">
                      {workflow.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-accent-green rounded-full flex-shrink-0" />
                          <span className="text-sm text-muted-gray">{step}</span>
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

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Hear from grocery store owners thriving with Appex POS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-md bg-light-primary border border-gray-200">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-gray mb-8 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t pt-6">
                      <div className="font-semibold text-dark-primary mb-2">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-gray">
                        {testimonial.business}
                      </div>
                    </div>
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
              Ready to Transform Your Grocery Store?
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of grocery stores already reducing waste and increasing profits with Appex POS.
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
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo of the Grocery Solution"))}
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
