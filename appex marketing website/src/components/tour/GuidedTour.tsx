'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Search, Menu, User, Settings, CreditCard, Check, ArrowRight, ArrowLeft } from 'lucide-react'

const tourSteps = [
    {
        id: 'sale',
        title: 'Making a Sale',
        description: 'Process a transaction in seconds. Just tap, check out, and you\'re done.',
        highlight: 'checkout'
    },
    {
        id: 'inventory',
        title: 'Inventory Lookup',
        description: 'Instantly see what\'s in stock across all your branches provided by the cloud sync.',
        highlight: 'inventory'
    },
    {
        id: 'customer',
        title: 'Customer Loyalty',
        description: 'Add a customer to the sale to track their purchase history and award points.',
        highlight: 'customer'
    }
]

export default function GuidedTour() {
    const [currentStep, setCurrentStep] = useState(0)
    const [cart, setCart] = useState<{ name: string, price: number }[]>([])

    // Mock POS Actions
    const addToCart = (item: { name: string, price: number }) => {
        setCart([...cart, item])
    }

    return (
        <div className="flex flex-col lg:flex-row h-[600px] w-full max-w-6xl mx-auto bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">

            {/* Sidebar / Tour Guide */}
            <div className="w-full lg:w-1/3 p-8 bg-white dark:bg-appex-navy z-10 flex flex-col justify-center border-r dark:border-gray-700">
                <div className="mb-8">
                    <span className="text-appex-teal font-bold tracking-wider text-sm uppercase mb-2 block">
                        Step {currentStep + 1} of {tourSteps.length}
                    </span>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                        {tourSteps[currentStep].title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        {tourSteps[currentStep].description}
                    </p>
                </div>

                <div className="flex space-x-4 mb-8">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </Button>
                    <Button
                        variant="appex"
                        onClick={() => setCurrentStep(prev => Math.min(tourSteps.length - 1, prev + 1))}
                        disabled={currentStep === tourSteps.length - 1}
                    >
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex items-start">
                    <div className="mr-3 mt-1">💡</div>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Try it yourself:</strong> Click the product buttons on the right to simulate adding items to the cart!
                    </div>
                </div>
            </div>

            {/* Mock Interface Area */}
            <div className="w-full lg:w-2/3 bg-gray-100 dark:bg-gray-900 p-4 relative overflow-hidden flex items-center justify-center">

                {/* Mock POS Device Frame */}
                <div className="w-full h-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border dark:border-gray-700 flex flex-col">

                    {/* Header */}
                    <div className="h-14 bg-appex-teal flex items-center justify-between px-4 text-white">
                        <Menu className="w-6 h-6" />
                        <div className="font-bold">Appex POS <span className="opacity-70 font-normal text-sm">| Register 1</span></div>
                        <Search className="w-6 h-6" />
                    </div>

                    <div className="flex flex-1 overflow-hidden">

                        {/* Product Grid */}
                        <div className="w-2/3 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { name: 'Bread', price: 1.00, color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-200' },
                                    { name: 'Milk', price: 1.50, color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200' },
                                    { name: 'Eggs', price: 3.50, color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200' },
                                    { name: 'Sugar', price: 2.00, color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200' },
                                    { name: 'Coke', price: 0.75, color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200' },
                                    { name: 'Chips', price: 0.50, color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200' },
                                ].map((item, i) => (
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        key={i}
                                        onClick={() => addToCart(item)}
                                        className={`${item.color} p-4 rounded-xl flex flex-col items-center justify-center h-24 shadow-sm border border-transparent hover:border-appex-teal transition-all`}
                                    >
                                        <span className="font-semibold mb-1">{item.name}</span>
                                        <span className="text-xs opacity-80">${item.price.toFixed(2)}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Cart Panel */}
                        <div className="w-1/3 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
                            <div className="flex-1 p-3 overflow-y-auto space-y-2">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                                        <ShoppingCart className="w-8 h-8 mb-2 opacity-50" />
                                        <span className="text-xs">Cart Empty</span>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {cart.map((item, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={i}
                                                className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded"
                                            >
                                                <span>{item.name}</span>
                                                <span className="font-medium">${item.price.toFixed(2)}</span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t dark:border-gray-700">
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>${cart.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-4 text-xl font-bold text-appex-teal">
                                    <span>Total</span>
                                    <span>${cart.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
                                </div>
                                <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={() => setCart([])}>
                                    Charge
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
