'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Smartphone, Banknote, RefreshCw, Layers, CheckCircle } from 'lucide-react'

export default function PaymentsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appex-dark">
            {/* Hero */}
            <section className="bg-white dark:bg-appex-navy pt-24 pb-20 border-b dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Master the <span className="text-gradient">Zimbabwean Payment Landscape</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                        Accept every way your customers want to pay. From EcoCash USD to Swipe and Cash, Appex handles the complexity of multi-currency transactions for you.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="xl" variant="appex">Start Automating Payments</Button>
                    </div>
                </div>
            </section>

            {/* Methods Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Supported Payment Methods</h2>
                        <p className="text-gray-600">All integrated natively into your Point of Sale flow.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <Card className="border-t-4 border-t-green-500 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <Smartphone className="w-10 h-10 text-green-600 mb-2" />
                                <CardTitle>Mobile Money</CardTitle>
                                <CardDescription>EcoCash, OneMoney, TeleCash</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> USD & ZWL Wallets</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Auto-trigger USSD push</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Automatic reconciliation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CreditCard className="w-10 h-10 text-blue-600 mb-2" />
                                <CardTitle>Card Swipe / POS</CardTitle>
                                <CardDescription>ZimSwitch, Visa, MasterCard</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-500 mr-2" /> Integrated with bank machines</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-500 mr-2" /> External reference tracking</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-blue-500 mr-2" /> Split card/cash payments</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-gray-500 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <Banknote className="w-10 h-10 text-gray-600 mb-2" />
                                <CardTitle>Cash (Multi-Currency)</CardTitle>
                                <CardDescription>USD, ZWL, ZAR, Bond</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-gray-500 mr-2" /> Real-time exchange rates</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-gray-500 mr-2" /> Auto-calculate change in USD</li>
                                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-gray-500 mr-2" /> Cashier shift balancing</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Deep Dive Tabs */}
                    <div className="bg-white dark:bg-appex-navy rounded-2xl shadow-xl p-6 md:p-12">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Handling Complexity, Simply</h2>

                        <Tabs defaultValue="multicurrency" className="w-full">
                            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-8 h-auto">
                                <TabsTrigger value="multicurrency" className="py-4 text-lg">Multi-Currency Pricing</TabsTrigger>
                                <TabsTrigger value="split" className="py-4 text-lg">Split Payments</TabsTrigger>
                                <TabsTrigger value="reconcile" className="py-4 text-lg">End-of-Day Reconciliation</TabsTrigger>
                            </TabsList>

                            <TabsContent value="multicurrency" className="space-y-6">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-bold mb-4">One Price, Automatic Conversion</h3>
                                        <p className="text-lg text-gray-600 dark:text-gray-300">
                                            Set your base price in USD. Appex automatically calculates the ZWL price based on the daily or real-time rate.
                                            No need to relabel thousands of products every morning.
                                        </p>
                                    </div>
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-8 flex items-center justify-center">
                                        <RefreshCw className="w-16 h-16 text-appex-teal animate-spin-slow" />
                                        <div className="ml-4 text-left">
                                            <div className="text-sm text-gray-500">Rate Update</div>
                                            <div className="text-xl font-bold text-gray-900 dark:text-white">1 USD = ??? ZWL</div>
                                            <div className="text-xs text-green-500">Live (Bank Rate / Black Market)</div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="split" className="space-y-6">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-bold mb-4">"I have $5 cash and the rest EcoCash"</h3>
                                        <p className="text-lg text-gray-600 dark:text-gray-300">
                                            We've all heard it. Appex handles split payments effortlessly.
                                            Accept part cash, part card, part mobile money in a single transaction receipt.
                                        </p>
                                    </div>
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-8 flex items-center justify-center">
                                        <Layers className="w-16 h-16 text-purple-500" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="reconcile" className="space-y-6">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-2xl font-bold mb-4">Cash Up in Minutes, Not Hours</h3>
                                        <p className="text-lg text-gray-600 dark:text-gray-300">
                                            At the end of the shift, the system tells you exactly how much USD cash, ZWL cash, and electronic value you should have.
                                            Spot theft or errors instantly.
                                        </p>
                                    </div>
                                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-8 flex items-center justify-center">
                                        <CheckCircle className="w-16 h-16 text-green-500" />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>
        </div>
    )
}
