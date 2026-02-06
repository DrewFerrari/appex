'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from "@/components/ui/slider"
import { motion } from 'framer-motion'
import { RefreshCw, Download, Share2, DollarSign, Clock, TrendingUp } from 'lucide-react'

const ROICalculator = () => {
    const [revenue, setRevenue] = useState(5000)
    const [transactions, setTransactions] = useState(50)
    const [bookkeepingHours, setBookkeepingHours] = useState(10)
    const [shrinkage, setShrinkage] = useState(2)
    const [staffCount, setStaffCount] = useState(2)

    const [results, setResults] = useState({
        timeSaved: 0,
        revenueRecovered: 0,
        moneySaved: 0,
        totalAnnualImpact: 0
    })

    const calculateROI = () => {
        // Assumptions
        const hourlyRate = 15 // Estimated value of owner's time
        const bookkeepingAutomation = 0.8 // 80% time saved
        const shrinkageReduction = 0.5 // 50% reduction in theft/loss
        const transactionSpeedValue = 0.10 // 10 cents value per transaction in speed/accuracy

        // Calculations
        const monthlyTimeSaved = bookkeepingHours * bookkeepingAutomation
        const monthlyTimeValue = monthlyTimeSaved * hourlyRate

        const monthlyRevenueRecovered = (revenue * (shrinkage / 100)) * shrinkageReduction

        // Efficiency gains (faster checkout, fewer errors)
        const transactionEfficiency = transactions * 30 * transactionSpeedValue

        const monthlyTotal = monthlyTimeValue + monthlyRevenueRecovered + transactionEfficiency

        setResults({
            timeSaved: Math.round(monthlyTimeSaved),
            revenueRecovered: Math.round(monthlyRevenueRecovered),
            moneySaved: Math.round(monthlyTimeValue + transactionEfficiency),
            totalAnnualImpact: Math.round(monthlyTotal * 12)
        })
    }

    useEffect(() => {
        calculateROI()
    }, [revenue, transactions, bookkeepingHours, shrinkage, staffCount])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Enter Your Business Details</CardTitle>
                    <CardDescription>Adjust the sliders or enter values to match your business.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="revenue">Monthly Revenue (USD)</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="revenue"
                                type="number"
                                value={revenue}
                                onChange={(e) => setRevenue(Number(e.target.value))}
                                className="w-24"
                            />
                            <Slider
                                value={[revenue] as any}
                                min={500}
                                max={50000}
                                step={100}
                                onValueChange={(val) => setRevenue(val[0])}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transactions">Avg. Daily Transactions</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="transactions"
                                type="number"
                                value={transactions}
                                onChange={(e) => setTransactions(Number(e.target.value))}
                                className="w-24"
                            />
                            <Slider
                                value={[transactions] as any}
                                min={10}
                                max={1000}
                                step={10}
                                onValueChange={(val) => setTransactions(val[0])}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hours">Weekly Manual Bookkeeping (Hours)</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="hours"
                                type="number"
                                value={bookkeepingHours}
                                onChange={(e) => setBookkeepingHours(Number(e.target.value))}
                                className="w-24"
                            />
                            <Slider
                                value={[bookkeepingHours] as any}
                                min={0}
                                max={40}
                                step={1}
                                onValueChange={(val) => setBookkeepingHours(val[0])}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shrinkage">Estimated Shrinkage/Theft (%)</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="shrinkage"
                                type="number"
                                value={shrinkage}
                                onChange={(e) => setShrinkage(Number(e.target.value))}
                                className="w-24"
                            />
                            <Slider
                                value={[shrinkage] as any}
                                min={0}
                                max={10}
                                step={0.5}
                                onValueChange={(val) => setShrinkage(val[0])}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
                <Card className="bg-gradient-appex text-white border-0 shadow-lg shadow-glow">
                    <CardHeader>
                        <CardTitle className="text-white">Total Annual Impact</CardTitle>
                        <CardDescription className="text-blue-100">Projected value from switching to Appex POS</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            key={results.totalAnnualImpact}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-bold mb-2"
                        >
                            ${results.totalAnnualImpact.toLocaleString()}
                        </motion.div>
                        <div className="text-sm opacity-90">
                            Additional profit per year
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-white dark:bg-appex-charcoal border-0 shadow-md">
                        <CardContent className="pt-6 text-center">
                            <div className="mb-2 flex justify-center"><Clock className="text-appex-teal w-8 h-8" /></div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{results.timeSaved}h</div>
                            <div className="text-xs text-gray-500">Hours Saved / Month</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-appex-charcoal border-0 shadow-md">
                        <CardContent className="pt-6 text-center">
                            <div className="mb-2 flex justify-center"><DollarSign className="text-green-500 w-8 h-8" /></div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">${results.revenueRecovered}</div>
                            <div className="text-xs text-gray-500">Revenue Recovered / Month</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-appex-charcoal border-0 shadow-md">
                        <CardContent className="pt-6 text-center">
                            <div className="mb-2 flex justify-center"><TrendingUp className="text-purple-500 w-8 h-8" /></div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">${results.moneySaved}</div>
                            <div className="text-xs text-gray-500">Efficiency Gains / Month</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex space-x-4">
                    <Button className="flex-1" variant="appexOutline">
                        <Share2 className="w-4 h-4 mr-2" /> Share Result
                    </Button>
                    <Button className="flex-1" variant="appex">
                        <Download className="w-4 h-4 mr-2" /> Download Report
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ROICalculator
