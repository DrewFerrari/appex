'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import DownloadModal from '@/components/download-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

export default function ContactPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    const whatsappMessage = generateWhatsAppMessage(
      `New Contact Form Submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nBusiness: ${formData.business}\n\nMessage: ${formData.message}`
    )
    window.open(whatsappMessage)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Fastest response time',
      value: '+263 780 808 358',
      action: () => window.open(generateWhatsAppMessage("Hi! I need help with Appex POS")),
      color: 'bg-green-500/10 text-green-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Speak with our team',
      value: '+263 780 808 358',
      action: () => window.open('tel:+263780808358'),
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us a message',
      value: 'support@appexpos.com',
      action: () => window.open('mailto:support@appexpos.com'),
      color: 'bg-purple-500/10 text-purple-600'
    }
  ]

  const offices = [
    {
      city: 'Harare',
      address: '123 Samora Machel Ave, Harare, Zimbabwe',
      phone: '+263 780 808 358',
      email: 'harare@appexpos.com',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM'
    },
    {
      city: 'Bulawayo',
      address: '45 Joshua Nkomo St, Bulawayo, Zimbabwe',
      phone: '+263 780 808 359',
      email: 'bulawayo@appexpos.com',
      hours: 'Mon-Fri: 8AM-5PM'
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
                Get in <span className="text-gradient">Touch</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                We're here to help you transform your business with Appex POS.
                Reach out to our team for support, demos, or any questions you might have.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" variant="appex" onClick={() => setIsDownloadModalOpen(true)}>
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="xl"
                  variant="appexOutline"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
                >
                  WhatsApp Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Reach Out <span className="text-gradient">Anytime</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Multiple ways to connect with our support team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-white dark:bg-appex-charcoal border border-gray-200 dark:border-gray-800" onClick={method.action}>
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <method.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {method.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {method.description}
                    </p>
                    <div className="text-xl font-bold text-appex-teal">
                      {method.value}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50 dark:bg-appex-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us a <span className="text-gradient">Message</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business">Business Name</Label>
                    <Input
                      id="business"
                      name="business"
                      type="text"
                      value={formData.business}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Tell us about your business and how we can help..."
                  />
                </div>

                <Button type="submit" size="xl" variant="appex" className="w-full">
                  Send Message
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-appex-charcoal">
                <CardHeader className="p-8">
                  <CardTitle className="text-3xl font-bold">Why Choose Appex POS?</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">24/7 Support</h4>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Round-the-clock assistance when you need it most</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Local Expertise</h4>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Zimbabwe-based team who understands your market</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Free Training</h4>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Comprehensive onboarding and ongoing support</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Quick Response</h4>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Average response time under 2 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-appex-teal/5 dark:bg-appex-teal/10 rounded-2xl p-8 mt-10 border border-appex-teal/20">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Emergency Support?
                    </h4>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      For urgent issues, call us directly or use WhatsApp for immediate assistance.
                    </p>
                    <Button
                      variant="appex"
                      className="w-full h-14 text-lg"
                      onClick={() => window.open(generateWhatsAppMessage("URGENT: I need immediate support with Appex POS"))}
                    >
                      Emergency Support
                      <MessageCircle className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-white dark:bg-appex-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Visit Our <span className="text-gradient">Offices</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet our team in person at one of our locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-appex-charcoal group cursor-pointer">
                  <CardHeader className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 bg-appex-teal/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-8 h-8 text-appex-teal" />
                      </div>
                      <CardTitle className="text-3xl font-bold">{office.city}</CardTitle>
                    </div>
                    <CardDescription className="text-xl leading-relaxed">
                      {office.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Phone className="w-6 h-6 text-gray-400" />
                        <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{office.phone}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Mail className="w-6 h-6 text-gray-400" />
                        <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{office.email}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Clock className="w-6 h-6 text-gray-400" />
                        <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{office.hours}</span>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of Zimbabwean businesses using Appex POS. Start your free trial today.
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
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to schedule a demo"))}
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
