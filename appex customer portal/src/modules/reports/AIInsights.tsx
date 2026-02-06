import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Zap, UserX, PackageSearch } from 'lucide-react'
import { usePrice } from '@/hooks/usePrice'
import { subDays, isAfter } from 'date-fns'
import type { Sale, Product, Customer } from '@/types'

interface AIInsightsProps {
    sales: Sale[]
    products: Product[]
    customers: Customer[]
}

export default function AIInsights({ sales, products, customers }: AIInsightsProps) {
    const { formatPrice } = usePrice()

    const insights = useMemo(() => {
        // 1. Sales Forecasting (Simple Moving Average)
        const last7DaysSales = sales.filter(s => isAfter(new Date(s.createdAt), subDays(new Date(), 7)))
        const averageDailyRevenue = last7DaysSales.reduce((sum, s) => sum + s.totalAmountUSD, 0) / 7
        const forecastedNext7Days = averageDailyRevenue * 7

        // 2. Dead Stock Identification (0 sales in 30 days)
        const salesIn30Days = sales.filter(s => isAfter(new Date(s.createdAt), subDays(new Date(), 30)))
        const soldProductIds = new Set(salesIn30Days.flatMap(s => s.items.map(i => i.productId)))
        const deadStock = products.filter(p => !soldProductIds.has(p.id))

        // 3. Hot Items (High velocity in last 7 days)
        const productQuantities = new Map<string, number>()
        last7DaysSales.forEach(s => {
            s.items.forEach(i => {
                productQuantities.set(i.productId, (productQuantities.get(i.productId) || 0) + i.quantity)
            })
        })
        const hotItems = Array.from(productQuantities.entries())
            .map(([id, quantity]) => ({ id, quantity, name: products.find(p => p.id === id)?.name || 'Unknown' }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 3)

        // 4. Customer Churn Risk (No purchase in 60 days)
        const churnRisk = customers.filter(c => {
            if (!c.lastPurchaseDate) return false
            return !isAfter(new Date(c.lastPurchaseDate), subDays(new Date(), 60))
        })

        return {
            forecastedNext7Days,
            deadStock: deadStock.length,
            hotItems,
            churnRisk: churnRisk.length
        }
    }, [sales, products, customers])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sales Forecast */}
            <Card className="border-accent-blue/20 bg-accent-blue/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-accent-blue" />
                        7-Day Forecast
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-text-primary">{formatPrice(insights.forecastedNext7Days)}</p>
                    <p className="text-xs text-text-muted mt-1">Based on recent performance</p>
                </CardContent>
            </Card>

            {/* Dead Stock */}
            <Card className="border-status-error/20 bg-status-error/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                        <PackageSearch className="h-4 w-4 mr-2 text-status-error" />
                        Dead Stock
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-text-primary">{insights.deadStock} Items</p>
                    <p className="text-xs text-text-muted mt-1">No sales in 30 days</p>
                </CardContent>
            </Card>

            {/* Hot Items */}
            <Card className="border-status-success/20 bg-status-success/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-status-success" />
                        Hot Sellers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {insights.hotItems.map(item => (
                            <p key={item.id} className="text-xs font-medium text-text-primary truncate">
                                {item.name} ({item.quantity})
                            </p>
                        ))}
                        {insights.hotItems.length === 0 && <p className="text-xs text-text-muted">No velocity data</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Churn Risk */}
            <Card className="border-status-warning/20 bg-status-warning/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                        <UserX className="h-4 w-4 mr-2 text-status-warning" />
                        Churn Risk
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-text-primary">{insights.churnRisk} Customers</p>
                    <p className="text-xs text-text-muted mt-1">Idle for 60+ days</p>
                </CardContent>
            </Card>
        </div>
    )
}
