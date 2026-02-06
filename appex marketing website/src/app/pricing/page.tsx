'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import DownloadModal from '@/components/download-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle, 
  ArrowRight, 
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
  Crown,
  Rocket,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'
import Link from 'next/link'

export default function PricingPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses just getting started',
      price: isAnnual ? 29 : 35,
      annualPrice: 29,
      monthlyPrice: 35,
      icon: Smartphone,
      color: 'from-gray-500 to-slate-600',
      features: [
        '1 Device',
        'Basic POS Features',
        'Inventory Management',
        'Customer Database',
        'Daily Reports',
        'Email Support',
        'Mobile App',
        'Offline Mode'
      ],
      notIncluded: [
        'Multi-Store Management',
        'Advanced Analytics',
        'API Access',
        'Priority Support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses with multiple needs',
      price: isAnnual ? 59 : 79,
      annualPrice: 59,
      monthlyPrice: 79,
      icon: BarChart3,
      color: 'from-appex-teal to-appex-cyan',
      features: [
        '5 Devices',
        'All Starter Features',
        'Multi-Store Management',
        'Advanced Analytics',
        'Staff Management',
        'Customer Loyalty',
        'API Access',
        'Priority Support',
        'Custom Reports',
        'Data Export'
      ],
      notIncluded: [
        'White Label',
        'Dedicated Account Manager'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for large-scale operations',
      price: isAnnual ? 149 : 199,
      annualPrice: 149,
      monthlyPrice: 199,
      icon: Building2,
      color: 'from-purple-500 to-violet-600',
      features: [
        'Unlimited Devices',
        'All Professional Features',
        'White Label Options',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Advanced Security',
        'SLA Guarantee',
        'On-site Training',
        'Custom Development',
        'Priority Phone Support'
      ],
      notIncluded: [],
      popular: false
    }
  ]

  const addOns = [
    {
      name: 'Hardware Package',
      price: 499,
      description: 'Complete POS hardware bundle',
      features: ['POS Terminal', 'Barcode Scanner', 'Receipt Printer', 'Cash Drawer'],
      icon: Package
    },
    {
      name: 'Advanced Analytics',
      price: 29,
      description: 'Deep business insights and forecasting',
      features: ['AI Predictions', 'Custom Dashboards', 'Advanced Reporting', 'Data Science Support'],
      icon: PieChart
    },
    {
      name: 'Priority Support',
      price: 49,
      description: '24/7 dedicated support team',
      features: ['24/7 Phone Support', 'Dedicated Account Manager', 'Priority Response', 'On-site Support'],
      icon: HeadphonesIcon
    }
  ]

  const faqs = [
    {
      question: 'Is there a setup fee?',
      answer: 'No, there are no setup fees for any of our plans. You only pay the monthly or annual subscription fee.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept EcoCash, Paynow, bank transfers, Visa/Mastercard, and cash payments for Zimbabwean customers.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level encryption, regular backups, and comply with data protection regulations.'
    },
    {
      question: 'Do you offer training?',
      answer: 'Yes, we provide free online training for all plans. Enterprise plans include on-site training.'
    },
    {
      question: 'What about load shedding?',
      answer: 'Appex POS works completely offline during load shedding and syncs automatically when power returns.'
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
                Simple, Transparent <span className="text-gradient">Pricing</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Choose the perfect plan for your business. All plans include our core features 
                and are designed to grow with your success.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <span className={`text-lg ${!isAnnual ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    isAnnual ? 'bg-appex-teal' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isAnnual ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-lg ${isAnnual ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                  Annual
                </span>
                <span className="bg-appex-teal/10 text-appex-teal px-3 py-1 rounded-full text-sm font-medium">
                  Save 20%
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-appex-teal text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <Card className={`h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg ${
                  plan.popular ? 'ring-2 ring-appex-teal scale-105' : ''
                }`}>
                  <CardHeader className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-lg mb-4">
                      {plan.description}
                    </CardDescription>
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        /{isAnnual ? 'month' : 'month'}
                      </div>
                      {isAnnual && (
                        <div className="text-sm text-appex-teal font-medium">
                          Billed annually (${plan.annualPrice * 12}/year)
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {plan.notIncluded.length > 0 && (
                        <div className="space-y-3 pt-4 border-t">
                          {plan.notIncluded.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-3 opacity-50">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                              <span className="text-gray-500 dark:text-gray-400 line-through">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "appex" : "outline"}
                        onClick={() => setIsDownloadModalOpen(true)}
                      >
                        {plan.popular ? 'Start Free Trial' : 'Get Started'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enhance Your <span className="text-gradient">Experience</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful add-ons to extend your Appex POS capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {addOns.map((addOn, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="w-16 h-16 bg-appex-teal/10 rounded-xl flex items-center justify-center mb-4">
                      <addOn.icon className="w-8 h-8 text-appex-teal" />
                    </div>
                    <CardTitle className="text-xl">{addOn.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {addOn.description}
                    </CardDescription>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${addOn.price}
                      <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {addOn.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
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

      {/* FAQs */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Got questions? We've got answers about our pricing and features
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Start your free 14-day trial today. No credit card required. Cancel anytime.
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
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to discuss pricing options for my business"))}
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
