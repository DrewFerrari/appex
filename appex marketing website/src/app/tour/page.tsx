'use client'

import React from 'react'
import GuidedTour from '@/components/tour/GuidedTour'
import { Button } from '@/components/ui/button'
import { Download, ArrowRight } from 'lucide-react'

export default function TourPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-appex-dark py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Experience <span className="text-gradient">Appex POS</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        See how easy it is to run your business before you sign up.
                        No credit card, no download, just a quick guided tour.
                    </p>
                </div>

                <div className="mb-20">
                    <GuidedTour />
                </div>

                <div className="text-center max-w-3xl mx-auto bg-white dark:bg-appex-navy p-12 rounded-2xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">Seen enough?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                        Get the full experience on your own device. The app includes sample data so you can play around immediately.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="xl" variant="appex">
                            <Download className="mr-2 w-5 h-5" /> Download App
                        </Button>
                        <Button size="xl" variant="outline">
                            View Pricing <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
