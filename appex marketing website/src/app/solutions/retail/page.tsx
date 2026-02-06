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
  Barcode,
  ShoppingBag,
  Tag,
  Truck,
  Users2,
  Store,
  TrendingDown,
  ThumbsUp,
  AlertTriangle,
  Gift,
  Percent,
  Eye,
  RefreshCw,
  Archive,
  ShoppingCartIcon,
  CreditCard as CardIcon,
  QrCode,
  Camera,
  Printer as PrinterIcon,
  PackageOpen,
  TagIcon,
  Calculator,
  FileSpreadsheet,
  TrendingUpIcon,
  UserCheck as UserIcon,
  Clock as TimeIcon
} from 'lucide-react'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'
import Link from 'next/link'

export default function RetailSolutionPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  // Comprehensive Retail Features
  const coreFeatures = [
    {
      icon: Barcode,
      title: 'Advanced Barcode Management',
      description: 'Complete barcode scanning and management system for fast, accurate checkout.',
      features: [
        'Multiple scanner support',
        'Custom barcode generation',
        'Weight-based barcodes',
        'Batch scanning',
        'Mobile camera scanning',
        'Barcode label printing'
      ],
      color: 'bg-accent-blue/10 text-accent-blue'
    },
    {
      icon: Package,
      title: 'Intelligent Inventory Management',
      description: 'Real-time inventory tracking with automated reordering and stock optimization.',
      features: [
        'Real-time stock levels',
        'Automated reordering',
        'Low stock alerts',
        'Supplier management',
        'Purchase order tracking',
        'Stock transfer between stores'
      ],
      color: 'bg-accent-green/10 text-accent-green'
    },
    {
      icon: Users,
      title: 'Customer Relationship Management',
      description: 'Build lasting customer relationships with loyalty programs and personalized service.',
      features: [
        'Customer database',
        'Loyalty points system',
        'Purchase history tracking',
        'Customer segmentation',
        'Birthday rewards',
        'Credit account management'
      ],
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: Tag,
      title: 'Dynamic Pricing & Promotions',
      description: 'Flexible pricing strategies with automated promotions and discount management.',
      features: [
        'Dynamic pricing rules',
        'Automated promotions',
        'Discount campaigns',
        'Seasonal pricing',
        'Bundle deals',
        'Flash sales management'
      ],
      color: 'bg-orange-500/10 text-orange-600'
    },
    {
      icon: ShoppingCart,
      title: 'Multi-Channel Sales',
      description: 'Sell across multiple channels with unified inventory and order management.',
      features: [
        'In-store POS',
        'E-commerce integration',
        'Mobile sales',
        'Social media selling',
        'Click & collect',
        'Delivery management'
      ],
      color: 'bg-cyan-500/10 text-cyan-600'
    },
    {
      icon: BarChart3,
      title: 'Retail Analytics & Reporting',
      description: 'Deep insights into sales performance, customer behavior, and inventory optimization.',
      features: [
        'Sales trend analysis',
        'Customer behavior insights',
        'Product performance tracking',
        'Staff performance metrics',
        'Profit margin analysis',
        'Custom dashboards'
      ],
      color: 'bg-pink-500/10 text-pink-600'
    }
  ]

  // Retail Types
  const retailTypes = [
    {
      title: 'Fashion & Apparel',
      icon: ShoppingBag,
      features: ['Size/variant management', 'Seasonal collections', 'Style recommendations', 'Return management'],
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Electronics Store',
      icon: Smartphone,
      features: ['Serial number tracking', 'Warranty management', 'Repair tracking', 'Accessory bundling'],
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Supermarket',
      icon: ShoppingCartIcon,
      features: ['Perishable tracking', 'Weight-based pricing', 'Bulk discounts', 'Loyalty programs'],
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'Pharmacy',
      icon: Package,
      features: ['Prescription management', 'Expiry tracking', 'Regulatory compliance', 'Patient records'],
      color: 'from-red-500 to-red-700'
    },
    {
      title: 'Bookstore',
      icon: PackageOpen,
      features: ['ISBN management', 'Author tracking', 'Category organization', 'Special orders'],
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      title: 'Hardware Store',
      icon: Wrench,
      features: ['Project-based selling', 'Contractor accounts', 'Special orders', 'Bulk pricing'],
      color: 'from-gray-500 to-gray-700'
    }
  ]

  // Business Impact
  const businessImpact = [
    {
      icon: TrendingUp,
      title: '40% Faster Checkout',
      description: 'Reduce customer wait times with efficient barcode scanning and payment processing.'
    },
    {
      icon: Users,
      title: '35% More Customers',
      description: 'Increase customer retention with loyalty programs and personalized service.'
    },
    {
      icon: DollarSign,
      title: '30% Higher Revenue',
      description: 'Boost sales through upselling prompts and targeted promotions.'
    },
    {
      icon: TrendingDown,
      title: '25% Less Shrinkage',
      description: 'Reduce inventory loss with better tracking and security measures.'
    }
  ]

  // Daily Workflows
  const workflows = [
    {
      title: 'Opening Procedures',
      steps: [
        'Daily inventory check',
        'Price updates verification',
        'Promotional setup',
        'Staff shift assignment',
        'Cash register preparation',
        'System health check'
      ]
    },
    {
      title: 'Customer Service',
      steps: [
        'Product lookup and scanning',
        'Price inquiries',
        'Loyalty program enrollment',
        'Special order processing',
        'Return/exchange handling',
        'Customer assistance'
      ]
    },
    {
      title: 'Inventory Management',
      steps: [
        'Real-time stock monitoring',
        'Receiving new shipments',
        'Stock level adjustments',
        'Supplier coordination',
        'Damage/loss recording',
        'Automated reordering'
      ]
    },
    {
      title: 'Closing Procedures',
      steps: [
        'End-of-day sales reporting',
        'Cash reconciliation',
        'Inventory count verification',
        'Staff performance review',
        'Tomorrow\'s preparation',
        'System backup and sync'
      ]
    }
  ]

  // Advanced Features
  const advancedFeatures = [
    {
      icon: Eye,
      title: 'Loss Prevention',
      description: 'Advanced security features to prevent theft and reduce shrinkage.',
      features: ['Transaction monitoring', 'Suspicious activity alerts', 'CCTV integration', 'Staff access controls']
    },
    {
      icon: Gift,
      title: 'Gift Card & Vouchers',
      description: 'Complete gift card and voucher management system for increased sales.',
      features: ['Physical/digital gift cards', 'Promotional vouchers', 'Balance tracking', 'Multi-store redemption']
    },
    {
      icon: RefreshCw,
      title: 'Returns & Exchanges',
      description: 'Streamlined returns and exchange process with customer satisfaction focus.',
      features: ['Easy return processing', 'Exchange management', 'Refund tracking', 'Return reason analysis']
    },
    {
      icon: Archive,
      title: 'Multi-Store Management',
      description: 'Manage multiple retail locations from a centralized dashboard.',
      features: ['Centralized inventory', 'Cross-store transfers', 'Unified reporting', 'Staff coordination']
    }
  ]

  // Testimonials
  const testimonials = [
    {
      name: 'Grace Moyo',
      business: 'Fashion Boutique, Harare',
      content: 'Appex POS transformed our boutique operations. Inventory management is now seamless, and our customer loyalty program has increased repeat business by 45%. The barcode scanning is incredibly fast!',
      rating: 5,
      type: 'Fashion Retail'
    },
    {
      name: 'Peter Chen',
      business: 'TechZone Electronics, Bulawayo',
      content: 'The serial number tracking and warranty management features have saved us countless hours. Our customer satisfaction has improved dramatically since implementing Appex POS.',
      rating: 5,
      type: 'Electronics'
    },
    {
      name: 'Sarah Ndlovu',
      business: 'FreshMart Supermarket, Mutare',
      content: 'The multi-channel sales capability has been a game-changer. We can now sell online and in-store with unified inventory. Our online sales have grown 300% in 6 months!',
      rating: 5,
      type: 'Supermarket'
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
              <div className="inline-flex items-center space-x-2 bg-accent-blue/10 rounded-full px-4 py-2 mb-8">
                <ShoppingBag className="w-4 h-4 text-accent-blue" />
                <span className="text-sm font-medium text-accent-blue">Retail Solution</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-light-primary mb-8 leading-tight">
                Complete <span className="text-gradient">Retail</span> Management
              </h1>
              <p className="text-xl text-light-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
                Transform your retail business with comprehensive POS solutions for inventory management, 
                customer relationships, and multi-channel sales designed for Zimbabwe's retail sector.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="xl" 
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in the Retail Solution for my store"))}
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
              Retail <span className="text-gradient">Core Features</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Everything you need to run a successful retail operation
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

      {/* Retail Types */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Perfect for Every <span className="text-gradient">Retail Type</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Specialized features for different retail sectors and business models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailTypes.map((type, index) => (
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
                      {type.features.slice(0, 3).map((feature, featureIndex) => (
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
              Real results from retail businesses using Appex POS
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
              Streamlined workflows for efficient retail management
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
              Cutting-edge features for modern retail operations
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
              Hear from retail owners thriving with Appex POS
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
              Ready to Transform Your Retail Business?
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of retail stores already increasing efficiency and profits with Appex POS.
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
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo of the Retail Solution"))}
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
