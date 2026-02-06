'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import DeviceChecker from '@/components/hardware/device-checker'
import { Printer, Smartphone, Scan, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react'

export default function HardwarePage() {
    const bundles = [
        {
            title: "Starter Kit",
            price: "$250",
            items: ["Android Tablet (Lenovo/Samsung)", "Bluetooth Thermal Printer", "Table Stand"],
            idealFor: "Small Retail, Cafes",
            image: "📦"
        },
        {
            title: "Professional Setup",
            price: "$550",
            items: ["Sunmi T2 Desktop Terminal", "Cash Drawer", "Barcode Scanner", "Receipt Printer"],
            idealFor: "Supermarkets, Busy Hardware Stores",
            image: "🖥️"
        },
        {
            title: "Mobile Trader",
            price: "$180",
            items: ["Sunmi V2 Handheld", "Built-in Printer", "Sim Card Slot"],
            idealFor: "Food Trucks, Van Sales",
            image: "📱"
        }
    ]

    return (
        <div className="min-h-screen bg-white dark:bg-appex-dark">
            {/* Hero */}
            <section className="bg-gray-50 dark:bg-appex-charcoal py-20 border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        Compatible with <span className="text-gradient">Hardware You Own</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Don't buy expensive proprietary equipment. Appex POS works with standard Android phones, tablets, and generic printers.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="appex" size="lg" onClick={() => document.getElementById('checker')?.scrollIntoView({ behavior: 'smooth' })}>
                            Check My Device
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 text-center">
                        <div className="p-8 bg-white dark:bg-appex-charcoal border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <div className="w-16 h-16 bg-appex-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Smartphone className="w-8 h-8 text-appex-teal" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Phones & Tablets</h3>
                            <p className="text-sm text-gray-500 font-medium">Android 8.0+</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-appex-charcoal border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Printer className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Thermal Printers</h3>
                            <p className="text-sm text-gray-500 font-medium">Bluetooth / USB / Network</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-appex-charcoal border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Scan className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Barcode Scanners</h3>
                            <p className="text-sm text-gray-500 font-medium">USB / Bluetooth</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-appex-charcoal border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Accessories</h3>
                            <p className="text-sm text-gray-500 font-medium">Stands, Mounts, Drawers</p>
                        </div>
                    </div>

                    {/* Compatibility Checker */}
                    <div id="checker" className="mb-24 scroll-mt-24">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">Device Checker</h2>
                            <p className="text-gray-600">Type your model number to see if it's compatible.</p>
                        </div>
                        <DeviceChecker />
                    </div>

                    {/* Recommended Bundles */}
                    <div className="mb-20">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">Recommended Hardware Bundles</h2>
                            <p className="text-gray-600">Where to buy? Check our partner suppliers below.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {bundles.map((bundle, idx) => (
                                <Card key={idx} className="bg-white dark:bg-appex-charcoal border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                                    <CardHeader className="text-center p-8 pb-4">
                                        <div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-300">{bundle.image}</div>
                                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{bundle.title}</CardTitle>
                                        <CardDescription className="text-lg">
                                            Est. Price: <span className="text-appex-teal font-bold">{bundle.price}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <ul className="space-y-3 mb-8">
                                            {bundle.items.map((item, i) => (
                                                <li key={i} className="flex items-center text-md text-gray-600 dark:text-gray-300">
                                                    <CheckCircle className="w-4 h-4 text-appex-teal mr-3 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Ideal For</p>
                                            <p className="text-md font-medium text-gray-700 dark:text-gray-200">{bundle.idealFor}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Local Suppliers */}
                    <div className="bg-appex-navy text-white rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold mb-6">Where to Buy in Zimbabwe?</h2>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            We have partnered with reputable hardware suppliers in Harare, Bulawayo, and Gweru to get you the best deals.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="bg-white/10 px-6 py-3 rounded-lg font-semibold">Solution Centre</div>
                            <div className="bg-white/10 px-6 py-3 rounded-lg font-semibold">Innovative Technologies</div>
                            <div className="bg-white/10 px-6 py-3 rounded-lg font-semibold">Matrix Warehouse</div>
                        </div>
                        <div className="mt-8">
                            <Button variant="secondary" size="lg">
                                View Supplier Directory <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
