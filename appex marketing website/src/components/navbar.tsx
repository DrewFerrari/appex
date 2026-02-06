'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
import { generateWhatsAppMessage } from '@/lib/utils'
import ThemeToggle from './theme-toggle'

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
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Affiliation', href: 'http://localhost:5174', external: true },
    { name: 'Business Portal', href: 'http://localhost:5173', external: true },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-dark-primary/95 backdrop-blur-md shadow-lg border-b border-dark-tertiary'
        : 'bg-dark-primary'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-blue rounded-lg flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  alt="Appex POS Logo"
                  width={32}
                  height={32}
                  className="object-contain w-full h-full filter brightness-0 invert"
                />
              </div>
              <span className="font-bold text-xl text-light-primary">Appex</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="text-text-muted hover:text-light-primary transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
                className="text-text-muted hover:text-light-primary"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="appex"
                size="sm"
                onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to start a free trial"))}
              >
                Start Free Trial
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-text-muted hover:text-light-primary p-2"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="bg-dark-secondary border-t border-dark-tertiary">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="block px-3 py-2 text-text-muted hover:text-light-primary hover:bg-dark-tertiary rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-dark-tertiary">
              <div className="px-2 flex items-center justify-between mb-4">
                <span className="text-text-muted px-3 font-medium">Appearance</span>
                <ThemeToggle />
              </div>
              <div className="px-2 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
                  className="w-full justify-start text-text-muted hover:text-light-primary"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
                <Button
                  variant="appex"
                  size="sm"
                  onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to start a free trial"))}
                  className="w-full"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => window.open(generateWhatsAppMessage("Hi! I need help with Appex POS"))}
          className="bg-accent-green hover:bg-accent-green text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </>
  )
}

export default Navbar
