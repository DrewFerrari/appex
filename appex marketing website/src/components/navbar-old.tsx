'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
import { generateWhatsAppMessage } from '@/lib/utils'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Features', href: '/features' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Why Appex', href: '/why-appex' },
    { name: 'Customers', href: '/customers' },
  ]

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-appex-dark/95 backdrop-blur-md shadow-lg' 
          : 'bg-white dark:bg-appex-dark'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-appex rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-gradient">Appex POS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-appex-teal dark:hover:text-appex-cyan transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-appex-teal hover:text-appex-cyan"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="appexOutline">
                Start Free Trial
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-appex-dark border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-appex-teal dark:hover:text-appex-cyan hover:bg-gray-50 dark:hover:bg-appex-charcoal rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-appex-teal hover:text-appex-cyan mb-2"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
                <Button variant="appexOutline" className="w-full">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Button
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-glow"
          onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop Floating WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <Button
          size="icon"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-glow animate-pulse"
          onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}

export default Navbar
