'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, CheckCircle, Zap, Shield, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'

const HeroSection = () => {
  const stats = [
    { label: 'Businesses', value: '10,000+', icon: CheckCircle },
    { label: 'Transactions', value: '$50M+', icon: Zap },
    { label: 'Uptime', value: '99.9%', icon: Shield },
    { label: 'Mobile Ready', value: '100%', icon: Smartphone },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-appex-gradient-subtle dark:from-appex-dark dark:via-appex-charcoal dark:to-appex-navy overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-appex-teal via-appex-cyan to-appex-violet" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-appex-teal/10 dark:bg-appex-teal/20 rounded-full px-4 py-2 mb-6"
          >
            <Zap className="w-4 h-4 text-appex-teal" />
            <span className="text-sm font-medium text-appex-teal">Zimbabwe's #1 POS System</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="block">Simplify Your</span>
            <span className="block text-gradient">Business with</span>
            <span className="block text-gradient">Appex POS</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Offline-first POS built for Zimbabwean businesses. Works during load shedding, 
            supports EcoCash & multi-currency. Start selling in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="xl" variant="appex" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="xl" variant="appexOutline" className="group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-appex-gradient-subtle rounded-lg">
                    <stat.icon className="w-6 h-6 text-appex-teal" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Zimbabwe-specific Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-appex-charcoal rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Built for Zimbabwe, by Zimbabweans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">Load Shedding Proof</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Works completely offline</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">EcoCash Ready</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Native mobile money support</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-white">USD/ZWL Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Multi-currency pricing</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-appex-dark to-transparent" />
    </section>
  )
}

export default HeroSection
