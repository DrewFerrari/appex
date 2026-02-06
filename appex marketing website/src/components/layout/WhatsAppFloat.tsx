'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { generateWhatsAppMessage } from '@/lib/utils'

const WhatsAppFloat = () => {
    return (
        <>
            {/* Mobile Floating Button */}
            <div className="fixed bottom-6 right-6 z-40 md:hidden">
                <Button
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-glow h-14 w-14"
                    onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
                    aria-label="Chat on WhatsApp"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </div>

            {/* Desktop Floating Button */}
            <div className="fixed bottom-8 right-8 z-40 hidden md:block group">
                <Button
                    size="icon"
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-glow animate-pulse hover:animate-none transition-all duration-300 h-16 w-16"
                    onClick={() => window.open(generateWhatsAppMessage("Hi! I'm interested in Appex POS"))}
                    aria-label="Chat on WhatsApp"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-appex-navy px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium text-sm text-gray-800 dark:text-gray-200 pointer-events-none">
                    Chat with us!
                </span>
            </div>
        </>
    )
}

export default WhatsAppFloat
