import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, X, Send, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { usePrice } from '@/hooks/usePrice'
import { cn, isLowStock } from '@/lib/utils'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am your Appex Business Assistant. How can I help you analyze your business today?' }
    ])
    const scrollRef = useRef<HTMLDivElement>(null)
    const { formatPrice } = usePrice()

    // Context Data
    const sales = useLiveQuery(() => db.sales.toArray()) || []
    const products = useLiveQuery(() => db.products.toArray()) || []
    const customers = useLiveQuery(() => db.customers.toArray()) || []

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

    const generateResponse = (query: string): string => {
        if (query.includes('sales') || query.includes('revenue')) {
            const total = sales.reduce((sum: number, s: any) => sum + s.totalAmountUSD, 0)
            return `Total revenue across all sales is ${formatPrice(total)}. You have processed ${sales.length} transactions.`
        }

        if (query.includes('stock') || query.includes('inventory') || query.includes('low')) {
            const lowStock = products.filter(isLowStock)
            if (lowStock.length === 0) return "Great news! All your products have healthy stock levels above their reorder points."
            return `You have ${lowStock.length} items with low stock: ${lowStock.map((p: any) => p.name).join(', ')}. I recommend reordering these soon.`
        }

        if (query.includes('forecast') || query.includes('future') || query.includes('prediction')) {
            const recentSales = sales.filter(s => {
                const dayDiff = (new Date().getTime() - new Date(s.createdAt).getTime()) / (1000 * 3600 * 24)
                return dayDiff <= 7
            })
            const weeklyRevenue = recentSales.reduce((sum, s) => sum + s.totalAmountUSD, 0)
            const projectedNextWeek = weeklyRevenue * 1.1 // Assuming a 10% growth trend for simulation
            return `Based on last week's revenue of ${formatPrice(weeklyRevenue)}, I forecast a 10% growth for next week, projecting ${formatPrice(projectedNextWeek)} in sales.`
        }

        if (query.includes('reorder') || query.includes('order')) {
            const itemsToReorder = products.filter(isLowStock).map(p => `• ${p.name} (Need ${p.reorderLevel * 2} units)`)

            if (itemsToReorder.length === 0) return "No urgent reorders needed. All stock levels are within safe margins."
            return `Automated Reorder Suggestions:\n${itemsToReorder.join('\n')}\nWould you like me to draft purchase orders for these items?`
        }

        if (query.includes('customer')) {
            const topCustomer = [...customers].sort((a, b) => (b.totalSpentUSD || 0) - (a.totalSpentUSD || 0))[0]
            return topCustomer
                ? `Your most valuable customer is ${topCustomer.name}, who has spent a total of ${formatPrice(topCustomer.totalSpentUSD || 0)}. They have ${topCustomer.loyaltyPoints} loyalty points.`
                : "You haven't registered any customers yet."
        }

        if (query.includes('product') || query.includes('best')) {
            return "Based on recent sales data, I can see your inventory is well-utilized. Check the Reports overview for the specific top performing product."
        }

        return "I'm still learning! You can ask me about 'sales', 'stock levels', or 'customer stats'."
    }

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-80 sm:w-96 mb-4 h-[450px] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
                    <CardHeader className="bg-accent-blue p-4 flex flex-row items-center justify-between rounded-t-lg">
                        <CardTitle className="text-white text-sm flex items-center">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Appex Assistant
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
                            {messages.map((m, i) => (
                                <div key={i} className={cn(
                                    "flex flex-col max-w-[85%] rounded-lg p-3 text-sm",
                                    m.role === 'assistant'
                                        ? "bg-background-tertiary text-text-primary self-start rounded-bl-none"
                                        : "bg-accent-blue text-white self-end rounded-br-none"
                                )}>
                                    {m.content}
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => handleSend("Sales summary")}>
                                <TrendingUp className="h-3 w-3 mr-1" /> Sales Sum
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => handleSend("Reorder suggestions")}>
                                <RefreshCw className="h-3 w-3 mr-1" /> Auto Reorder
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => handleSend("Sales forecast")}>
                                <TrendingUp className="h-3 w-3 mr-1" /> Forecast
                            </Button>
                            <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => handleSend("Low stock check")}>
                                <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask anything..."
                                className="flex-1"
                            />
                            <Button size="icon" onClick={() => handleSend()}>
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
                    "rounded-full h-14 w-14 shadow-2xl relative transition-all",
                    isOpen ? "bg-status-error hover:bg-status-error/90 rotate-90" : "bg-accent-blue hover:bg-accent-blue/90"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </Button>
        </div>
    )
}
