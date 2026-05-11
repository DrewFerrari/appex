'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import DownloadModal from '@/components/download-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
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
  BarChart3,
  Clock,
  WifiOff,
  CreditCard,
  Globe,
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
  Pill,
  Calendar,
  Activity,
  Heart,
  Package as PackageIcon
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'

const PharmacySolution: React.FC = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

  const features = [
    {
      icon: Pill,
      title: 'Prescription Management',
      description: 'Digital prescription processing with e-prescribing, drug interaction checks, and refill management',
      benefits: ['E-prescribing integration', 'Drug interaction alerts', 'Patient history tracking', 'Refill automation', 'Digital signatures', 'Insurance validation']
    },
    {
      icon: PackageIcon,
      title: 'Drug Inventory',
      description: 'Comprehensive medication tracking with batch numbers, expiry dates, and supplier management',
      benefits: ['Real-time stock levels', 'Expiry date alerts', 'Batch tracking', 'Supplier integration', 'Barcode scanning', 'Multi-location sync', 'Recall management']
    },
    {
      icon: Calendar,
      title: 'Patient Records',
      description: 'Complete patient management with medical history, appointments, and insurance integration',
      benefits: ['Patient profiles', 'Medical history tracking', 'Appointment scheduling', 'Insurance integration', 'Medication adherence monitoring', 'Family account management', 'Consent forms']
    },
    {
      icon: Shield,
      title: 'Compliance & Security',
      description: 'Regulatory compliance with HIPAA standards, secure access controls, and comprehensive audit trails',
      benefits: ['HIPAA compliance', 'Access control', 'Audit trails', 'Data encryption', 'Role-based permissions', 'Electronic signatures', 'Backup & recovery']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Advanced analytics dashboard with sales insights, performance metrics, and regulatory reporting',
      benefits: ['Sales analytics', 'Inventory reports', 'Prescription analytics', 'Patient demographics', 'Financial reporting', 'Compliance dashboards', 'Custom reports']
    },
    {
      icon: Smartphone,
      title: 'Mobile Access',
      description: 'Full-featured mobile app for on-the-go pharmacy management and customer service',
      benefits: ['Mobile POS', 'Inventory management', 'Prescription refills', 'Customer communication', 'Photo capture', 'Offline mode']
    }
  ]

  const stats = [
    { value: '99%', label: 'Compliance Rate', description: 'Regulatory adherence' },
    { value: '24/7', label: 'System Uptime', description: 'Reliable service availability' },
    { value: '500+', label: 'Pharmacies Served', description: 'Across Zimbabwe' },
    { value: '2M+', label: 'Prescriptions Processed', description: 'Annual volume' },
    { value: '99.9%', label: 'Accuracy Rate', description: 'Order fulfillment' }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Chenje',
      business: 'City Pharmacy, Harare',
      content: 'Appex transformed our pharmacy operations. The prescription management and inventory tracking features are exceptional.',
      results: 'Reduced errors by 40% and improved efficiency by 35%'
    },
    {
      name: 'John Moyo',
      business: 'MediCare Pharmacy, Bulawayo',
      content: 'The compliance features and patient management have streamlined our entire workflow.',
      results: 'Achieved 100% compliance rate and increased patient satisfaction'
    }
  ]

  const pricing = [
    {
      name: 'Basic Pharmacy',
      price: '$65',
      period: '/month',
      features: [
        'Prescription management',
        'Drug inventory',
        'Basic patient records',
        'Compliance reporting',
        'POS system'
      ],
      popular: false
    },
    {
      name: 'Professional Pharmacy',
      price: '$120',
      period: '/month',
      features: [
        'Advanced prescription management',
        'Real-time inventory sync',
        'Patient management',
        'Insurance integration',
        'Compliance tools',
        'Analytics dashboard'
      ],
      popular: true
    },
    {
      name: 'Enterprise Pharmacy',
      price: '$200',
      period: '/month',
      features: [
        'Multi-location management',
        'Advanced compliance suite',
        'Custom workflows',
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center p-2">
                  <Image
                    src="/logo.png"
                    alt="Appex POS Logo"
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-light-primary">Appex POS</h2>
                  <p className="text-purple-200">Pharmacy Management System</p>
                </div>
              </div>
            </div>
            <Badge className="mb-6 bg-purple-600/20 text-purple-400 border-purple-600/30">
              Healthcare Compliant
            </Badge>
            <h1 className="text-5xl font-bold text-dark-primary mb-6">
              Complete Pharmacy <span className="text-gradient">Management</span>
              <span className="block text-3xl mt-2 text-purple-400">From Prescriptions to Point of Sale</span>
            </h1>
            <p className="text-xl text-muted-gray mb-8 max-w-3xl mx-auto">
              Specialized POS and management system designed for Zimbabwean pharmacies. 
              Manage prescriptions, track medications, ensure compliance, and serve patients better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <ArrowRight className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background-secondary">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-purple-400 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-dark-primary mb-1">{stat.label}</div>
                <div className="text-muted-gray">{stat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Pharmacy-Specific <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Tools designed specifically for pharmacy operations and patient care
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <div className="p-3 bg-purple-600/20 rounded-lg group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-dark-primary">{feature.title}</CardTitle>
                        <CardDescription className="text-muted-gray">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-center gap-3 text-muted-gray">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
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

      {/* Testimonials Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center p-1">
                  <Image
                    src="/logo.png"
                    alt="Appex POS Logo"
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-dark-primary">Trusted by Zimbabwean Pharmacies</h2>
              </div>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Success <span className="text-gradient">Stories</span>
            </h3>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              How Zimbabwean pharmacies are thriving with Appex
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
                <Card className="bg-light-primary border border-gray-200 hover:bg-gray-50 transition-colors">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <div className="font-semibold text-xl text-dark-primary mb-2">{testimonial.name}</div>
                          <div className="text-sm text-muted-gray">{testimonial.business}</div>
                        </div>
                        <p className="text-muted-gray mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>
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

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center p-1">
                  <Image
                    src="/logo.png"
                    alt="Appex POS Logo"
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h2 className="text-2xl font-bold text-dark-primary">Affordable Pharmacy Solutions</h2>
              </div>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
              Simple <span className="text-gradient">Pricing</span>
            </h3>
            <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
              Choose the right plan for your pharmacy business
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
                <Card className={`bg-light-primary border border-gray-200 hover:bg-gray-50 transition-all duration-300 ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                  <CardHeader className="text-center p-8">
                    {plan.popular && (
                      <Badge className="mb-4 bg-purple-600 text-white">Most Popular</Badge>
                    )}
                    <CardTitle className="text-2xl text-dark-primary mb-4">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1 mb-6">
                      <span className="text-5xl font-bold text-dark-primary">{plan.price}</span>
                      <span className="text-muted-gray">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-muted-gray">
                          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="lg" 
                      className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-800 hover:bg-gray-900'}`}
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
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-light-primary mb-6">
              Ready to Transform Your <span className="text-gradient">Pharmacy?</span>
            </h2>
            <p className="text-xl text-light-secondary mb-8 leading-relaxed max-w-3xl mx-auto">
              Join hundreds of Zimbabwean pharmacies using Appex to streamline their operations and improve patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="xl" className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsDownloadModalOpen(true)}>
                Start 14-Day Free Trial
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-gray-300 text-light-primary hover:bg-gray-800"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to discuss Pharmacy Solution for my business"))}
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

export default PharmacySolution
