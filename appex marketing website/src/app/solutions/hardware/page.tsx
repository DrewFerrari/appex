'use client'

import React from 'react'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CheckCircle, Wrench, Package, Users, BarChart3, Printer, Smartphone, TrendingUp, Shield, Target, Award, Zap, DollarSign, Star, Hammer, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'
import Link from 'next/link'

const HardwareSolutionPage = () => {
  const features = [
    {
      icon: Package,
      title: 'Advanced Inventory Tracking',
      description: 'Track thousands of SKUs with serial numbers, batch tracking, and supplier management.',
      benefits: ['Serial number tracking', 'Batch management', 'Supplier integration', 'Stock alerts']
    },
    {
      icon: Wrench,
      title: 'Special Orders & Projects',
      description: 'Manage custom orders, project-based sales, and installation services with ease.',
      benefits: ['Custom orders', 'Project tracking', 'Installation scheduling', 'Progress updates']
    },
    {
      icon: Users,
      title: 'Customer Account Management',
      description: 'Handle contractor accounts, credit lines, and bulk purchasing with detailed tracking.',
      benefits: ['Contractor accounts', 'Credit management', 'Bulk pricing', 'Purchase history']
    },
    {
      icon: BarChart3,
      title: 'Hardware Analytics',
      description: 'Get insights into product performance, seasonal trends, and contractor preferences.',
      benefits: ['Sales analytics', 'Product performance', 'Seasonal trends', 'Contractor insights']
    }
  ]

  const workflows = [
    {
      title: 'Morning Setup',
      steps: [
        'Check inventory levels for high-demand items',
        'Review pending special orders and projects',
        'Update contractor account statuses and credit limits',
        'Prepare daily promotions and bulk deals'
      ],
      icon: Wrench,
      duration: '15 minutes'
    },
    {
      title: 'Customer Service',
      steps: [
        'Assist contractors with bulk purchasing and quotes',
        'Process special orders with delivery scheduling',
        'Handle returns and exchanges with warranty tracking',
        'Update customer accounts and purchase history'
      ],
      icon: Users,
      duration: 'Continuous'
    },
    {
      title: 'End of Day',
      steps: [
        'Process contractor invoices and account settlements',
        'Update inventory based on sales and deliveries',
        'Generate daily sales and profit reports',
        'Schedule next day deliveries and installations'
      ],
      icon: BarChart3,
      duration: '20 minutes'
    }
  ]

  const benefits = [
    {
      title: 'Reduce Stockouts',
      description: 'Advanced inventory tracking reduces stockouts by 45% and improves availability',
      icon: Package,
      stat: '-45%',
      color: 'text-green-600'
    },
    {
      title: 'Increase Contractor Sales',
      description: 'Account management and bulk pricing increase contractor sales by 32%',
      icon: Users,
      stat: '+32%',
      color: 'text-blue-600'
    },
    {
      title: 'Improve Order Accuracy',
      description: 'Special order tracking improves accuracy and customer satisfaction by 40%',
      icon: Shield,
      stat: '+40%',
      color: 'text-purple-600'
    },
    {
      title: 'Boost Margins',
      description: 'Better inventory control and pricing optimization increase margins by 18%',
      icon: DollarSign,
      stat: '+18%',
      color: 'text-orange-600'
    }
  ]

  const testimonials = [
    {
      name: 'Peter Nyoni',
      business: 'BuildPro Hardware, Harare',
      content: 'Appex POS transformed our hardware business. Contractor account management and special order tracking are game-changers. Our contractor sales increased by 50%!',
      rating: 5,
      results: 'Contractor sales up 50%, inventory accuracy improved to 96%'
    },
    {
      name: 'Susan Masuku',
      business: 'HomeBase Supplies, Mutare',
      content: 'The serial number tracking and batch management features are perfect for our hardware store. We can now track every item from supplier to customer.',
      rating: 5,
      results: 'Inventory accuracy 98%, returns reduced by 35%'
    },
    {
      name: 'Tawanda Chidzikwe',
      business: 'ToolMaster, Gweru',
      content: 'Special orders and project management have opened up new revenue streams. Our installation services revenue is up 40% and customers love the tracking.',
      rating: 5,
      results: 'Installation revenue up 40%, customer satisfaction 35% higher'
    }
  ]

  const hardwareTypes = [
    { name: 'Building Materials', description: 'Lumber, cement, roofing, and construction', icon: '🏗️' },
    { name: 'Tools & Equipment', description: 'Power tools, hand tools, and accessories', icon: '🔧' },
    { name: 'Plumbing Supplies', description: 'Pipes, fittings, and bathroom fixtures', icon: '🔩' },
    { name: 'Electrical', description: 'Wiring, switches, and electrical components', icon: '⚡' },
    { name: 'Paint & Decorating', description: 'Paint, brushes, and decorating supplies', icon: '🎨' },
    { name: 'Garden & Outdoor', description: 'Garden tools, outdoor equipment, and supplies', icon: '🌱' }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-appex-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-900/30 rounded-full px-4 py-2 mb-6">
                <Wrench className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Hardware Solution</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Complete POS System for <span className="text-gradient">Hardware Excellence</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Transform your hardware store with Zimbabwe's most trusted POS system.
                From building materials to tools, Appex POS handles everything.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="xl" variant="appex" asChild>
                  <Link href="/download">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="xl"
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in the hardware POS solution"))}
                >
                  Schedule Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Serial tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Contractor accounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Special orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Project tracking</span>
                </div>
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
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Mobile Inventory</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Track items anywhere</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-gray-600 pl-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        "Our contractor business grew 60% with the account management features!"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">- James, Hardware Owner</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-appex-dark rounded-lg p-3">
                        <div className="text-2xl font-bold text-gray-600">98%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Inventory Accuracy</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-appex-dark rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600">45%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Fewer Stockouts</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gray-600/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-slate-600/20 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything Your Hardware <span className="text-gradient">Business Needs</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful features designed specifically for Zimbabwean hardware challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-white dark:bg-appex-charcoal border border-gray-100 dark:border-gray-800">
                  <CardHeader className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="font-semibold tracking-tight text-2xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
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
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real <span className="text-gradient">Hardware Impact</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how Appex POS transforms hardware businesses across Zimbabwe
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
                <Card className="text-center h-full border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-appex-charcoal group cursor-pointer">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-10 h-10" />
                    </div>
                    <div className={`text-4xl font-bold mb-3 ${benefit.color}`}>
                      {benefit.stat}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Types */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perfect for Every <span className="text-gradient">Hardware Type</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you specialize in building materials or tools, we have the right solution
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {hardwareTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-appex-charcoal group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{type.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {type.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Workflows */}
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Daily <span className="text-gradient">Hardware Workflow</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how Appex POS fits seamlessly into your daily hardware operations
            </p>
          </div>

          <div className="space-y-8">
            {workflows.map((workflow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-appex rounded-full flex items-center justify-center">
                      <workflow.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {workflow.title}
                      </h3>
                      <p className="text-gray-600 font-medium">{workflow.duration}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {workflow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 font-semibold text-sm">{stepIndex + 1}</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg flex items-center justify-center">
                        <workflow.icon className="w-16 h-16 text-gray-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Hardware <span className="text-gradient">Success Stories</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from hardware store owners who transformed their operations with Appex POS
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
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg bg-white dark:bg-appex-charcoal border border-gray-100 dark:border-gray-800">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {testimonial.name}
                      </div>
                      <div className="text-md text-gray-600 dark:text-gray-400 mb-3">
                        {testimonial.business}
                      </div>
                      <div className="text-sm text-gray-600 font-semibold">
                        {testimonial.results}
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
      <section className="py-20 bg-gradient-appex text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Hardware Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join hundreds of Zimbabwean hardware stores who are already growing their business
              with Appex POS. Start your free 14-day trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="secondary" asChild>
                <Link href="/download">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-appex-teal"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo of the hardware POS solution"))}
              >
                Schedule Hardware Demo
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">200+</div>
                <div className="text-sm opacity-80">Hardware Stores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.7★</div>
                <div className="text-sm opacity-80">Hardware Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-sm opacity-80">Inventory Accuracy</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HardwareSolutionPage
