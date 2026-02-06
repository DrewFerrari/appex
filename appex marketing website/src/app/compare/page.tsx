'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, Minus } from 'lucide-react'

export default function ComparePage() {
    const features = [
        { name: 'Works Offline (Load Shedding)', appex: true, traditional: false, manual: false },
        { name: 'Multi-Currency (USD/ZWL)', appex: true, traditional: false, manual: true },
        { name: 'Real-time Inventory', appex: true, traditional: true, manual: false },
        { name: 'Mobile App Management', appex: true, traditional: false, manual: false },
        { name: 'EcoCash Integration', appex: true, traditional: 'Partial', manual: false },
        { name: 'Remote Staff Monitoring', appex: true, traditional: false, manual: false },
        { name: 'Cost', appex: 'Affordable Subscription', traditional: 'High Upfront ($1000+)', manual: 'Time Consuming' },
    ]

    const renderStatus = (status: boolean | string) => {
        if (status === true) return <Check className="w-6 h-6 text-green-500 mx-auto" />
        if (status === false) return <X className="w-6 h-6 text-red-500 mx-auto" />
        return <span className="text-sm font-medium">{status}</span>
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appex-dark py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Why Choose <span className="text-gradient">Appex POS?</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        See how Appex stacks up against traditional bulky systems and manual bookkeeping.
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="bg-white dark:bg-appex-navy rounded-2xl shadow-xl overflow-hidden mb-20">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="p-6 text-left text-lg font-bold text-gray-600 dark:text-gray-400 w-1/4">Feature</th>
                                    <th className="p-6 text-center text-xl font-bold text-appex-teal w-1/4 bg-appex-teal/5 border-t-4 border-appex-teal">
                                        Appex POS
                                    </th>
                                    <th className="p-6 text-center text-lg font-bold text-gray-600 dark:text-gray-400 w-1/4">
                                        Traditional POS
                                    </th>
                                    <th className="p-6 text-center text-lg font-bold text-gray-600 dark:text-gray-400 w-1/4">
                                        Pen & Paper
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((feature, idx) => (
                                    <tr key={idx} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-5 font-medium text-gray-900 dark:text-white">{feature.name}</td>
                                        <td className="p-5 text-center bg-appex-teal/5 font-bold text-gray-900 dark:text-white">
                                            {renderStatus(feature.appex)}
                                        </td>
                                        <td className="p-5 text-center text-gray-600 dark:text-gray-400">
                                            {renderStatus(feature.traditional)}
                                        </td>
                                        <td className="p-5 text-center text-gray-600 dark:text-gray-400">
                                            {renderStatus(feature.manual)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Switch CTA */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-6">Ready to upgrade your business?</h2>
                    <Button size="xl" variant="appex">
                        Start Free Trial
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                        Migration is easy. We help you import your existing products.
                    </p>
                </div>

            </div>
        </div>
    )
}
