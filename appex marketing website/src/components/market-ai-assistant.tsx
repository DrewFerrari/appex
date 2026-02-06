'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Send, Rocket, Building, Shield, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateWhatsAppMessage } from '@/lib/utils'
import Image from 'next/image'

interface Message {
    role: 'user' | 'assistant'
    content: React.ReactNode
}

export default function MarketAIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your Appex Guide. I can help you explore our POS solutions, hardware options, or our partner program. What can I help you find today?" }
    ])
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (text?: string) => {
        const messageText = text || input
        if (!messageText.trim()) return

        setMessages(prev => [...prev, { role: 'user', content: messageText }])
        setInput('')

        // Simulated AI Processing
        setTimeout(() => {
            const response = generateResponse(messageText.toLowerCase())
            setMessages(prev => [...prev, { role: 'assistant', content: response }])
        }, 600)
    }

    const generateResponse = (query: string): React.ReactNode => {
        // Retail Queries
        if (query.includes('retail') || query.includes('shop') || query.includes('store') || query.includes('boutique')) {
            return (
                <div className="space-y-2">
                    <p>Appex <strong>Retail POS</strong> is perfect for boutiques, supermarkets, and pharmacies:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>Advanced barcode & label management</li>
                        <li>CRM with loyalty points & birthday rewards</li>
                        <li>Multi-channel sales (Online + In-store)</li>
                        <li>Dynamic pricing & promotion engine</li>
                    </ul>
                    <p>It typically increases revenue by 30% and checkouts by 40%!</p>
                    <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={() => window.location.href = '/solutions/retail'}>
                        Explore Retail Solution
                    </Button>
                </div>
            )
        }

        // Restaurant Queries
        if (query.includes('restaurant') || query.includes('cafe') || query.includes('dining') || query.includes('food')) {
            return (
                <div className="space-y-2">
                    <p>Our <strong>Restaurant Solution</strong> streamlines your dining operations:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>Visual floor plan & table management</li>
                        <li>Kitchen Display System (KDS) for chef coordination</li>
                        <li>Bill splitting & tip management</li>
                        <li>QR code table ordering & reservations</li>
                    </ul>
                    <p>Boost your service speed by 35% and table turnover by 40%!</p>
                    <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={() => window.location.href = '/solutions/restaurant'}>
                        Explore Restaurant Solution
                    </Button>
                </div>
            )
        }

        // Grocery Queries
        if (query.includes('grocery') || query.includes('market') || query.includes('perishable') || query.includes('fruit') || query.includes('veg')) {
            return (
                <div className="space-y-2">
                    <p>Appex <strong>Grocery Solution</strong> focuses on freshness and efficiency:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>Expiration tracking & waste reduction alerts</li>
                        <li>Weight scale integration for accurate pricing</li>
                        <li>Bulk & wholesale pricing tiers</li>
                        <li>Multi-warehouse supplier management</li>
                    </ul>
                    <p>Proven to reduce food waste by 30% and improve margins by 20%!</p>
                    <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={() => window.location.href = '/solutions/grocery'}>
                        Explore Grocery Solution
                    </Button>
                </div>
            )
        }

        // Hardware Queries
        if (query.includes('hardware') || query.includes('equipment') || query.includes('pos machine')) {
            return (
                <div className="space-y-2">
                    <p>Appex offers a specialized POS solution for <strong>Hardware Stores</strong> with:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>Serial number & batch tracking for power tools</li>
                        <li>Contractor account management & credit limits</li>
                        <li>Project-based sales tracking</li>
                    </ul>
                    <p>Hardware stores see 45% fewer stockouts and 98% inventory accuracy!</p>
                    <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={() => window.location.href = '/solutions/hardware'}>
                        Explore Hardware Solution
                    </Button>
                </div>
            )
        }

        // Affiliation Queries
        if (query.includes('partner') || query.includes('affiliate') || query.includes('commission') || query.includes('join')) {
            return (
                <div className="space-y-2">
                    <p>Our <strong>Partner Program</strong> is designed for growth! We have 4 tiers (Bronze, Silver, Gold, Platinum) with:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>Generous rewards for every business referred</li>
                        <li>Recurring revenue & high percentage payouts</li>
                        <li>Branded marketing toolkit & dedicated support</li>
                    </ul>
                    <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={() => window.location.href = '/solutions/affiliation'}>
                        Learn About Partnering
                    </Button>
                </div>
            )
        }

        // Electricity/Power Queries
        if (query.includes('power') || query.includes('electricity') || query.includes('load shedding') || query.includes('offline')) {
            return (
                <div className="space-y-2">
                    <p>Appex is <strong>Load Shedding Proof</strong>! Our offline-first architecture means:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>Process sales even when the internet is down</li>
                        <li>Local data storage that syncs when power returns</li>
                        <li>Works perfectly on battery-powered mobile devices</li>
                    </ul>
                    <p>Never lose a sale due to power cuts again!</p>
                </div>
            )
        }

        // Pricing/Trial Queries
        if (query.includes('price') || query.includes('cost') || query.includes('free') || query.includes('trial')) {
            return (
                <div className="space-y-2">
                    <p>We offer a <strong>14-day Free Trial</strong> with no commitment. You can explore all features including:</p>
                    <ul className="list-disc pl-4 text-xs space-y-1">
                        <li>Full POS interface and inventory tools</li>
                        <li>EcoCash & Multi-currency payment support</li>
                        <li>Real-time reporting and analytics</li>
                    </ul>
                    <Button variant="appex" size="sm" className="w-full text-xs mt-2" onClick={() => window.open(generateWhatsAppMessage("Hi! I'd like to start my free trial"))}>
                        Start Free Trial (WhatsApp)
                    </Button>
                </div>
            )
        }

        // General Info
        if (query.includes('appex') || query.includes('what') || query.includes('help')) {
            return "Appex is Zimbabwe's leading offline-first POS system. We serve Retail, Restaurants, Hardware stores, and Groceries with tailored features for each industry. What specific solution can I tell you about?"
        }

        return (
            <div>
                <p>I'm not sure about that specifically. Would you like to chat with a human expert on WhatsApp instead?</p>
                <Button variant="outline" size="sm" className="w-full text-xs mt-2" onClick={() => window.open(generateWhatsAppMessage("Hi! I have some questions about Appex"))}>
                    Chat with Expert
                </Button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 left-6 z-[60]">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-80 sm:w-96 mb-4 h-[500px] flex flex-col shadow-2xl animate-in slide-in-from-left-5 duration-300 border-accent-blue/20">
                    <CardHeader className="bg-gradient-to-r from-dark-primary to-dark-secondary p-4 flex flex-row items-center justify-between rounded-t-lg border-b border-white/10">
                        <CardTitle className="text-white text-sm flex items-center">
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2 p-1">
                                <Image src="/logo.png" alt="Appex AI" width={20} height={20} className="object-contain" />
                            </div>
                            Appex Guide
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-4 overflow-hidden bg-background-primary">
                        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
                            {messages.map((m, i) => (
                                <div key={i} className={cn(
                                    "flex flex-col max-w-[85%] rounded-2xl p-3 text-sm shadow-sm",
                                    m.role === 'assistant'
                                        ? "bg-background-tertiary text-text-primary self-start rounded-bl-none border border-border-default"
                                        : "bg-accent-blue text-white self-end rounded-br-none"
                                )}>
                                    {m.content}
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <Button variant="outline" size="sm" className="text-[10px] h-7 justify-start" onClick={() => handleSend("Hardware solution details")}>
                                <Zap className="h-3 w-3 mr-1 text-accent-gold" /> Hardware POS
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7 justify-start" onClick={() => handleSend("Partner rewards")}>
                                <Rocket className="h-3 w-3 mr-1 text-accent-purple" /> Partner Tiers
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7 justify-start" onClick={() => handleSend("Offline capabilities")}>
                                <Building className="h-3 w-3 mr-1 text-accent-blue" /> Load Shedding
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7 justify-start" onClick={() => handleSend("Free trial information")}>
                                <Shield className="h-3 w-3 mr-1 text-accent-green" /> Free Trial
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="How can Appex help you?"
                                className="flex-1 bg-background-secondary border-border-default focus:ring-accent-blue"
                            />
                            <Button size="icon" onClick={() => handleSend()} className="bg-accent-blue hover:bg-accent-blue/90">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Toggle Button */}
            <Button
                size="lg"
                className={cn(
                    "rounded-full h-14 w-14 shadow-2xl relative transition-all duration-300 p-0 overflow-hidden",
                    isOpen ? "bg-status-danger hover:bg-status-danger/90 rotate-90" : "bg-white border-2 border-accent-blue hover:scale-110"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6 text-white" /> : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                        <Image src="/logo.png" alt="Appex AI" width={40} height={40} className="object-contain" />
                    </div>
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-blue border-2 border-white"></span>
                    </span>
                )}
            </Button>
        </div>
    )
}
