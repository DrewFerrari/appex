'use client'

import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import DownloadModal from '@/components/download-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ArrowRight,
    CheckCircle,
    Target,
    DollarSign,
    Award,
    Building,
    Share2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { generateWhatsAppMessage } from '@/lib/utils'

export default function AffiliationSolutionPage() {
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

    const partnerBenefits = [
        {
            icon: DollarSign,
            title: 'Competitive Commissions',
            description: 'Earn generous rewards for every business you bring into the Appex ecosystem.',
            features: [
                'High percentage payouts',
                'Recurring revenue options',
                'Transparent tracking',
                'Instant payout requests'
            ],
            color: 'bg-accent-green/10 text-accent-green'
        },
        {
            icon: Target,
            title: 'Lead Management',
            description: 'Sophisticated tools to track your referrals from initial click to final signup.',
            features: [
                'Real-time lead scoring',
                'Conversion status tracking',
                'Partner-specific URLs',
                'Detailed referral analytics'
            ],
            color: 'bg-accent-blue/10 text-accent-blue'
        },
        {
            icon: Share2,
            title: 'Marketing Toolkit',
            description: 'Access premium marketing materials to help you promote Appex effectively.',
            features: [
                'Branded social assets',
                'Email templates',
                'Product demo videos',
                'Co-branded landing pages'
            ],
            color: 'bg-purple-500/10 text-purple-600'
        },
        {
            icon: Award,
            title: 'Tiered Rewards',
            description: 'Advance through partner tiers (Bronze, Silver, Gold, Platinum) for increased benefits.',
            features: [
                'Higher commission rates',
                'Exclusive partner events',
                'Dedicated support manager',
                'Early access to features'
            ],
            color: 'bg-orange-500/10 text-orange-600'
        }
    ]

    const partnerTypes = [
        {
            title: 'Business Consultants',
            description: 'Experts helping local businesses modernize their operations.',
            reward: 'Top Tier'
        },
        {
            title: 'Hardware Providers',
            description: 'Bundling Appex software with POS hardware solutions.',
            reward: 'Commission Based'
        },
        {
            title: 'Influencers & Marketers',
            description: 'Promoting Appex through digital channels and networks.',
            reward: 'Performance Rewards'
        }
    ]

    return (
        <div className="min-h-screen bg-light-primary">
            <Navbar />
            <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />

            {/* Hero Section */}
            <section className="py-24 bg-gradient-to-br from-dark-primary to-dark-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center space-x-2 bg-accent-purple/10 rounded-full px-4 py-2 mb-8 border border-accent-purple/20">
                                <Building className="w-4 h-4 text-accent-purple" />
                                <span className="text-sm font-medium text-accent-purple">Appex Partner Program</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-light-primary mb-8 leading-tight">
                                Grow with Us. <br /><span className="text-gradient">Partner for Success.</span>
                            </h1>
                            <p className="text-xl text-light-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
                                Join the Appex Affiliation Portal. Help Zimbabwean businesses thrive while
                                earning industry-leading commissions and building your own referral network.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button size="xl" variant="appex" onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to join the Appex Partner Program"))}>
                                    Apply to Join
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    size="xl"
                                    variant="appexOutline"
                                    onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to learn more about partner commissions"))}
                                >
                                    View Commissions
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Partner Benefits */}
            <section className="py-24 bg-light-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-dark-primary mb-6">
                            Why Partner with <span className="text-gradient">Appex</span>?
                        </h2>
                        <p className="text-xl text-muted-gray max-w-3xl mx-auto leading-relaxed">
                            Empowering our partners with the tools and rewards they need to succeed
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {partnerBenefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-xl transition-all duration-300 shadow-lg group cursor-pointer bg-light-primary border border-gray-200">
                                    <CardHeader className="p-8">
                                        <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <benefit.icon className="w-8 h-8" />
                                        </div>
                                        <CardTitle className="font-semibold tracking-tight text-2xl text-dark-primary">{benefit.title}</CardTitle>
                                        <CardDescription className="text-lg text-muted-gray leading-relaxed">
                                            {benefit.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {benefit.features.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex items-center space-x-2">
                                                    <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                                                    <span className="text-sm text-muted-gray">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Types */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-dark-primary">Find Your Partner Type</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {partnerTypes.map((type, index) => (
                            <div key={index} className="bg-light-primary p-8 rounded-lg shadow-lg border border-gray-200 text-center hover:shadow-xl transition-all duration-300 group cursor-pointer">
                                <h3 className="text-2xl font-bold text-dark-primary mb-4 group-hover:text-accent-blue transition-colors">{type.title}</h3>
                                <p className="text-lg text-muted-gray mb-6 leading-relaxed">{type.description}</p>
                                <div className="inline-block px-6 py-2 bg-accent-blue/10 text-accent-blue text-sm font-bold rounded-full">
                                    {type.reward}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-appex text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            Become a Growth Partner
                        </h2>
                        <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
                            Start your journey today and help shape the future of business in Zimbabwe while building a sustainable income stream.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button size="xl" variant="secondary" onClick={() => window.open(generateWhatsAppMessage("Hi! I'm ready to become an Appex Partner"))}>
                                Apply Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
