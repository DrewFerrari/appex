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
  Lock,
  ChefHat,
  Calendar,
  Timer,
  Coffee,
  Pizza,
  Wine,
  Truck,
  QrCode,
  CreditCard as PaymentIcon,
  UtensilsCrossed,
  Store,
  TrendingDown,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'
import Link from 'next/link'

export default function RestaurantSolutionPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  // Comprehensive Restaurant Features
  const coreFeatures = [
    {
      icon: UtensilsCrossed,
      title: 'Advanced Table Management',
      description: 'Complete restaurant floor plan management with real-time table status and smart seating.',
      features: [
        'Visual floor plan designer',
        'Real-time table status tracking',
        'Smart seating suggestions',
        'Table merging and splitting',
        'Waitlist management',
        'Guest history tracking'
      ],
      color: 'bg-accent-blue/10 text-accent-blue'
    },
    {
      icon: ChefHat,
      title: 'Kitchen Display System (KDS)',
      description: 'Professional kitchen management with order routing, timing, and communication tools.',
      features: [
        'Multi-station order routing',
        'Preparation time tracking',
        'Order modifications handling',
        'Chef communication system',
        'Recipe management',
        'Allergy alerts'
      ],
      color: 'bg-accent-green/10 text-accent-green'
    },
    {
      icon: Receipt,
      title: 'Flexible Billing & Payments',
      description: 'Handle complex billing scenarios with split payments, tips, and multiple payment methods.',
      features: [
        'Split bills by person/item',
        'Automatic tip calculations',
        'Multiple payment methods',
        'Gift card integration',
        'Loyalty program integration',
        'Digital receipts via WhatsApp'
      ],
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: Calendar,
      title: 'Reservation Management',
      description: 'Complete booking system with availability management and customer communication.',
      features: [
        'Online booking portal',
        'Automated confirmations',
        'Waitlist management',
        'Table turnover optimization',
        'Customer preferences tracking',
        'Special occasion handling'
      ],
      color: 'bg-orange-500/10 text-orange-600'
    },
    {
      icon: Smartphone,
      title: 'Customer Ordering Apps',
      description: 'Allow customers to order directly from their tables with QR code scanning.',
      features: [
        'QR code table ordering',
        'Self-service kiosk mode',
        'Mobile app integration',
        'Order customization options',
        'Real-time order tracking',
        'Payment integration'
      ],
      color: 'bg-cyan-500/10 text-cyan-600'
    },
    {
      icon: BarChart3,
      title: 'Restaurant Analytics',
      description: 'Deep insights into restaurant performance with detailed reporting and forecasting.',
      features: [
        'Sales by menu item analysis',
        'Peak hour optimization',
        'Staff performance tracking',
        'Customer behavior insights',
        'Inventory cost analysis',
        'Profit margin reporting'
      ],
      color: 'bg-pink-500/10 text-pink-600'
    }
  ]

  // Restaurant Types
  const restaurantTypes = [
    {
      title: 'Fine Dining',
      icon: Wine,
      features: ['Tableside ordering', 'Wine inventory management', 'Guest preference tracking', 'Advanced reservations'],
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Quick Service',
      icon: Coffee,
      features: ['Fast checkout', 'Kitchen display integration', 'Order tracking screens', 'Drive-thru support'],
      color: 'from-orange-500 to-orange-700'
    },
    {
      title: 'Café & Bakery',
      icon: Pizza,
      features: ['Ingredient tracking', 'Recipe costing', 'Loyalty programs', 'Catering orders'],
      color: 'from-amber-500 to-amber-700'
    },
    {
      title: 'Bar & Lounge',
      icon: Wine,
      features: ['Tab management', 'Drink recipes', 'Inventory control', 'Happy hour pricing'],
      color: 'from-indigo-500 to-indigo-700'
    }
  ]

  // Business Impact
  const businessImpact = [
    {
      icon: TrendingUp,
      title: '35% Faster Service',
      description: 'Reduce order-to-delivery time with streamlined kitchen operations and table management.'
    },
    {
      icon: Users,
      title: '40% More Customers',
      description: 'Increase table turnover and customer satisfaction with efficient service.'
    },
    {
      icon: DollarSign,
      title: '25% Higher Revenue',
      description: 'Boost average check size with upselling prompts and better inventory management.'
    },
    {
      icon: TrendingDown,
      title: '30% Less Waste',
      description: 'Reduce food waste with better inventory tracking and order forecasting.'
    }
  ]

  // Daily Workflows
  const workflows = [
    {
      title: 'Opening Setup',
      steps: [
        'Daily inventory check',
        'Staff shift assignment',
        'Table setup verification',
        'Special menu preparation',
        'Reservation review',
        'System health check'
      ]
    },
    {
      title: 'Service Hours',
      steps: [
        'Guest seating and ordering',
        'Kitchen order processing',
        'Table status monitoring',
        'Payment processing',
        'Customer service management',
        'Real-time issue resolution'
      ]
    },
    {
      title: 'Kitchen Operations',
      steps: [
        'Order queue management',
        'Preparation time tracking',
        'Quality control checks',
        'Inventory usage tracking',
        'Staff coordination',
        'Waste monitoring'
      ]
    },
    {
      title: 'Closing Procedures',
      steps: [
        'Daily sales reporting',
        'Inventory reconciliation',
        'Staff performance review',
        'Cleaning schedules',
        'Tomorrow\'s preparation',
        'System backup'
      ]
    }
  ]

  // Advanced Features
  const advancedFeatures = [
    {
      icon: Truck,
      title: 'Delivery Management',
      description: 'Complete delivery operations with driver tracking and route optimization.',
      features: ['Driver management', 'Route optimization', 'Delivery tracking', 'Customer notifications']
    },
    {
      icon: QrCode,
      title: 'Contactless Solutions',
      description: 'Modern contactless ordering and payment options for enhanced safety.',
      features: ['QR code menus', 'Mobile payments', 'Digital receipts', 'Contactless pickup']
    },
    {
      icon: Bell,
      title: 'Customer Engagement',
      description: 'Build customer loyalty with personalized experiences and rewards.',
      features: ['Loyalty programs', 'Birthday rewards', 'Feedback collection', 'Marketing campaigns']
    },
    {
      icon: AlertTriangle,
      title: 'Compliance & Safety',
      description: 'Ensure food safety and regulatory compliance with automated tracking.',
      features: ['Food safety tracking', 'Allergen management', 'Staff certifications', 'Health department reporting']
    }
  ]

  // Testimonials
  const testimonials = [
    {
      name: 'Chef Michael Chen',
      business: 'The Golden Fork, Harare',
      content: 'Appex POS transformed our fine dining restaurant. Table turnover increased by 40% and our kitchen efficiency improved dramatically. The KDS system is a game-changer.',
      rating: 5,
      type: 'Fine Dining'
    },
    {
      name: 'Sarah Moyo',
      business: 'QuickBite Café, Bulawayo',
      content: 'The QR code ordering system has reduced our labor costs by 25% while increasing customer satisfaction. Our customers love the convenience!',
      rating: 5,
      type: 'Quick Service'
    },
    {
      name: 'James Ndlovu',
      business: 'The Wine Cellar, Victoria Falls',
      content: 'The inventory management and wine tracking features have saved us thousands in reduced waste. The customer preference tracking helps us provide personalized service.',
      rating: 5,
      type: 'Bar & Lounge'
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
                <UtensilsCrossed className="w-4 h-4 text-accent-green" />
                <span className="text-sm font-medium text-accent-green">Restaurant Solution</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-light-primary mb-8 leading-tight">
                Complete <span className="text-gradient">Restaurant</span> Management
              </h1>
              <p className="text-xl text-light-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
                Transform your restaurant with comprehensive POS solutions for table management, 
                kitchen operations, and customer service designed for Zimbabwe's dining industry.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="xl" 
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in the Restaurant Solution for my restaurant"))}
                >
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Restaurant <span className="text-gradient">Core Features</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Everything you need to run a successful restaurant operation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
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
                    <CardTitle className="text-xl text-dark-primary">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-gray">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.features.slice(0, 4).map((item, itemIndex) => (
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

      {/* Restaurant Types */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Perfect for Every <span className="text-gradient">Restaurant Type</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Specialized features for different restaurant concepts and service styles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurantTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-light-primary border border-gray-200">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-primary mb-3">
                      {type.title}
                    </h3>
                    <div className="space-y-2">
                      {Array.isArray(type.features) ? type.features.slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-accent-green flex-shrink-0" />
                          <span className="text-xs text-muted-gray">{feature}</span>
                        </div>
                      )) : (type.features as string).split(', ').slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-accent-green flex-shrink-0" />
                          <span className="text-xs text-muted-gray">{feature}</span>
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
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Business <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Real results from restaurants using Appex POS
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
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Daily <span className="text-gradient">Operations</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Streamlined workflows for efficient restaurant management
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

      {/* Advanced Features */}
      <section className="py-24 bg-light-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Advanced <span className="text-gradient">Capabilities</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Cutting-edge features for modern restaurant operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-light-primary border border-gray-200">
                  <CardHeader>
                    <div className="w-16 h-16 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-6">
                      <feature.icon className="w-8 h-8 text-accent-blue" />
                    </div>
                    <CardTitle className="text-xl text-dark-primary">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-gray">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
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

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Hear from restaurant owners thriving with Appex POS
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
                      <div className="text-sm text-muted-gray mb-2">
                        {testimonial.business}
                      </div>
                      <div className="text-xs text-accent-blue font-medium">
                        {testimonial.type}
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
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of restaurants already increasing efficiency and profits with Appex POS.
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
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo of the Restaurant Solution"))}
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
