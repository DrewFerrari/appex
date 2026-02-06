'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, MessageCircle, ChevronDown, Monitor, Smartphone, ShoppingCart, Store, Utensils, Hammer, PlusCircle } from 'lucide-react'
import { generateWhatsAppMessage } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import DownloadModal from '@/components/download-modal' // Will refactor location later

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const solutions = [
        { name: 'Retail Stores', href: '/solutions/retail', icon: Store, desc: 'For supermarkets, boutiques & shops' },
        { name: 'Restaurants', href: '/solutions/restaurant', icon: Utensils, desc: 'For cafes, fast food & dining' },
        { name: 'Hardware', href: '/solutions/hardware', icon: Hammer, desc: 'For builders & hardware suppliers' },
        { name: 'All Industries', href: '/solutions', icon: PlusCircle, desc: 'View all supported industries' },
    ]

    const products = [
        { name: 'POS Software', href: '/features', icon: Monitor },
        { name: 'Mobile App', href: '/download', icon: Smartphone },
        { name: 'Hardware', href: '/hardware', icon: ShoppingCart },
    ]

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 dark:bg-appex-dark/95 backdrop-blur-md shadow-lg'
                    : 'bg-white dark:bg-appex-dark border-b border-transparent dark:border-gray-800'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 z-50">
                            <div className="w-8 h-8 bg-gradient-appex rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <span className="font-bold text-xl text-gradient">Appex POS</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">

                            {/* Solutions Dropdown */}
                            <div
                                className="relative group"
                                onMouseEnter={() => setActiveDropdown('solutions')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-appex-teal dark:hover:text-appex-cyan font-medium transition-colors">
                                    Solutions <ChevronDown className="ml-1 w-4 h-4" />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === 'solutions' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-80 bg-white dark:bg-appex-navy rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 mt-2 grid gap-2"
                                        >
                                            {solutions.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-appex-charcoal transition-colors"
                                                >
                                                    <div className={`p-2 rounded-md bg-appex-teal/10 text-appex-teal mr-3`}>
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Product Link */}
                            <Link href="/features" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-appex-teal font-medium transition-colors">
                                Product
                            </Link>

                            {/* Resources - Simple Link for now, can be dropdown later */}
                            <Link href="/tools" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-appex-teal font-medium transition-colors">
                                Free Tools
                            </Link>

                            <Link href="/pricing" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-appex-teal font-medium transition-colors">
                                Pricing
                            </Link>
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden md:flex items-center space-x-3">
                            <Button
                                variant="ghost"
                                className="text-appex-teal hover:text-appex-cyan font-semibold hidden lg:flex"
                                onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
                            >
                                <div className="flex items-center">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    WhatsApp
                                </div>
                            </Button>
                            <Button
                                variant="appexOutline"
                                onClick={() => setIsDownloadModalOpen(true)}
                            >
                                Download App
                            </Button>
                            <Button
                                variant="appex"
                                onClick={() => window.open('/demo')} // Or trigger demo modal
                            >
                                Get Started
                            </Button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
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
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white dark:bg-appex-dark border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                        >
                            <div className="px-4 pt-4 pb-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="font-semibold text-gray-400 uppercase text-xs tracking-wider mb-2">Solutions</div>
                                    {solutions.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-appex-charcoal rounded-lg"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <item.icon className="w-4 h-4 mr-3 text-appex-teal" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <Link href="/pricing" className="block py-2 font-medium text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>Pricing</Link>
                                    <Link href="/tools" className="block py-2 font-medium text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>Free Tools</Link>
                                    <Link href="/why-appex" className="block py-2 font-medium text-gray-700 dark:text-gray-300" onClick={() => setIsOpen(false)}>Why Appex</Link>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button
                                        variant="appexOutline"
                                        className="w-full justify-center"
                                        onClick={() => { setIsOpen(false); setIsDownloadModalOpen(true); }}
                                    >
                                        Download App
                                    </Button>
                                    <Button
                                        variant="appex"
                                        className="w-full justify-center"
                                    >
                                        Start Free Trial
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Global Download Modal */}
            <DownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
            />
        </>
    )
}

export default Navbar
