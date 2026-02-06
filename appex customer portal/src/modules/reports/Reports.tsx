import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download, Calendar } from 'lucide-react'
import { usePrice } from '@/hooks/usePrice'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { Sale } from '@/types'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { startOfDay, subDays, isAfter, isBefore, format } from 'date-fns'
import { calculateTrend, exportToCSV, getTotalStock } from '@/lib/utils'
import AIInsights from './AIInsights'

// Define explicit interfaces for report data
interface DailySale {
  date: string;
  sales: number;
  revenue: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface LowStockItem {
  name: string;
  currentStock: number;
  reorderLevel: number;
}

interface TopCustomer {
  name: string;
  spent: number;
  purchases: number;
}

interface OverviewReportData {
  totalRevenue: number;
  totalSales: number;
  averageSale: number;
  topProduct: string;
  revenueGrowth: number;
  salesGrowth: number;
  avgGrowth: number;
}

interface SalesReportData {
  dailySales: DailySale[];
  topProducts: TopProduct[];
}

interface InventoryReportData {
  lowStock: LowStockItem[];
  topSelling: (TopProduct & { sold: number; remaining: number })[];
}

interface CustomersReportData {
  newCustomers: number;
  returningCustomers: number;
  topCustomers: TopCustomer[];
}

interface ReportData {
  overview: OverviewReportData;
  sales: SalesReportData;
  inventory: InventoryReportData;
  customers: CustomersReportData;
}

const reportTypes = [
  { value: 'overview', label: 'Overview', icon: BarChart3 },
  { value: 'sales', label: 'Sales', icon: ShoppingCart },
  { value: 'inventory', label: 'Inventory', icon: Package },
  { value: 'customers', label: 'Customers', icon: Users },
  { value: 'financial', label: 'Financial', icon: DollarSign },
]

export default function Reports() {
  const { formatPrice, activeCurrency } = usePrice()
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [selectedReport, setSelectedReport] = useState('overview')

  // Real data from IndexedDB
  const sales = useLiveQuery(() => db.sales.toArray()) || []
  const products = useLiveQuery(() => db.products.toArray()) || []
  const customers = useLiveQuery(() => db.customers.toArray()) || []

  // Periods configuration
  const periods = [
    { value: 'today', label: 'Today', days: 1 },
    { value: '7days', label: 'Last 7 Days', days: 7 },
    { value: '30days', label: 'Last 30 Days', days: 30 },
    { value: '90days', label: 'Last 3 Months', days: 90 },
    { value: 'year', label: 'This Year', days: 365 }
  ]

  // Derived state: Filtered Sales
  const filteredSales = useMemo(() => {
    const period = periods.find(p => p.value === selectedPeriod)
    if (!period) return { current: sales, previous: [] }
    const now = startOfDay(new Date())
    const cutoffDate = subDays(now, period.days - 1)
    const prevCutoffDate = subDays(now, (period.days * 2) - 1)

    return {
      current: sales.filter((sale: Sale) => isAfter(new Date(sale.createdAt), cutoffDate)),
      previous: sales.filter((sale: Sale) =>
        isAfter(new Date(sale.createdAt), prevCutoffDate) &&
        isBefore(new Date(sale.createdAt), cutoffDate)
      )
    }
  }, [sales, selectedPeriod])

  const currentSales = filteredSales.current
  const previousSales = filteredSales.previous

  // Aggregate Overview Data
  const reportData = useMemo<ReportData>(() => {
    const totalRevenue = currentSales.reduce((sum: number, s: Sale) => sum + s.totalAmountUSD, 0)
    const prevRevenue = previousSales.reduce((sum: number, s: Sale) => sum + s.totalAmountUSD, 0)

    const totalSalesCount = currentSales.length
    const prevSalesCount = previousSales.length

    const averageSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0
    const prevAverageSale = prevSalesCount > 0 ? prevRevenue / prevSalesCount : 0

    // Daily Sales for chart
    const dailyMap = new Map<string, DailySale>()
    currentSales.forEach((sale: Sale) => {
      const dateStr = format(new Date(sale.createdAt), 'MMM dd')
      const current = dailyMap.get(dateStr) || { date: dateStr, sales: 0, revenue: 0 }
      current.sales += 1
      current.revenue += sale.totalAmountUSD
      dailyMap.set(dateStr, current)
    })
    const dailyTrend = Array.from(dailyMap.values())

    // Top Products
    const productMap = new Map<string, { quantity: number; revenue: number }>()
    currentSales.forEach((sale: Sale) => {
      sale.items.forEach(item => {
        const current = productMap.get(item.productId) || { quantity: 0, revenue: 0 }
        current.quantity += item.quantity
        current.revenue += item.totalUSD
        productMap.set(item.productId, current)
      })
    })

    const topProductsList: TopProduct[] = Array.from(productMap.entries())
      .map(([id, info]: [string, any]) => {
        const product = products.find((p: any) => p.id === id)
        return { name: product?.name || 'Unknown', ...info }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Top Customers
    const topCustomersList: TopCustomer[] = [...customers]
      .sort((a, b) => (b.totalSpentUSD || 0) - (a.totalSpentUSD || 0))
      .slice(0, 5)
      .map(c => ({ name: c.name, spent: c.totalSpentUSD || 0, purchases: 0 }))

    // Low Stock Items
    const lowStockItems: LowStockItem[] = products
      .filter((p: any) => getTotalStock(p) <= (p.reorderLevel || 10))
      .map((p: any) => ({
        name: p.name,
        currentStock: getTotalStock(p),
        reorderLevel: p.reorderLevel || 10
      }))

    return {
      overview: {
        totalRevenue,
        totalSales: totalSalesCount,
        averageSale,
        topProduct: topProductsList[0]?.name || 'None',
        revenueGrowth: calculateTrend(totalRevenue, prevRevenue),
        salesGrowth: calculateTrend(totalSalesCount, prevSalesCount),
        avgGrowth: calculateTrend(averageSale, prevAverageSale)
      },
      sales: {
        dailySales: dailyTrend,
        topProducts: topProductsList
      },
      inventory: {
        lowStock: lowStockItems,
        topSelling: topProductsList.map(p => ({ ...p, sold: p.quantity, remaining: 0 }))
      },
      customers: {
        newCustomers: customers.filter((c: any) => isAfter(new Date(c.createdAt || new Date()), subDays(new Date(), 30))).length,
        returningCustomers: customers.filter((c: any) => (c.totalSpentUSD || 0) > 0).length,
        topCustomers: topCustomersList
      }
    }
  }, [currentSales, previousSales, products, customers])


  const handleExport = () => {
    let dataToExport: any[] = []
    switch (selectedReport) {
      case 'overview':
        dataToExport = [reportData.overview]
        break
      case 'sales':
        dataToExport = reportData.sales.dailySales
        break
      case 'inventory':
        dataToExport = reportData.inventory.lowStock
        break
      case 'customers':
        dataToExport = reportData.customers.topCustomers
        break
    }
    exportToCSV(dataToExport, `report_${selectedReport}`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reports & Analytics</h1>
          <p className="text-text-muted">
            Track your business performance and gain insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Period and Report Type Selectors */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-background-tertiary border border-background-tertiary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
        >
          {periods.map(period => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>

        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          {reportTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedReport === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedReport(type.value)}
              className="flex items-center shrink-0"
            >
              <type.icon className="h-4 w-4 mr-2" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* AI Insights Section */}
      {selectedReport === 'overview' && (
        <AIInsights sales={sales} products={products} customers={customers} />
      )}

      {/* Business Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue"
              value={formatPrice(reportData.overview.totalRevenue)}
              growth={reportData.overview.revenueGrowth}
              icon={DollarSign}
              iconColor="text-currency-usd"
            />
            <MetricCard
              title="Total Sales"
              value={reportData.overview.totalSales.toString()}
              growth={reportData.overview.salesGrowth}
              icon={ShoppingCart}
              iconColor="text-accent-blue"
            />
            <MetricCard
              title="Average Sale"
              value={formatPrice(reportData.overview.averageSale)}
              growth={reportData.overview.avgGrowth}
              icon={Users}
              iconColor="text-accent-purple"
            />
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-status-warning" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-text-muted">Top Product</p>
                    <p className="text-lg font-bold text-text-primary truncate" title={reportData.overview.topProduct}>
                      {reportData.overview.topProduct}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.sales.dailySales}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) => activeCurrency === 'USD' ? `$${value}` : `${activeCurrency} ${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#F3F4F6' }}
                      formatter={(value: number) => [formatPrice(value), 'Revenue']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Report */}
      {selectedReport === 'sales' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Daily Sales Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.sales.dailySales.map((day, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-text-primary">{day.date}</p>
                      <p className="text-text-muted">{day.sales} sales</p>
                    </div>
                    <p className="font-bold text-text-primary">{formatPrice(day.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.sales.topProducts.map((p, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-text-primary">{p.name}</p>
                      <p className="text-text-muted">{p.quantity} units</p>
                    </div>
                    <p className="font-bold text-text-primary">{formatPrice(p.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory Report */}
      {selectedReport === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Low Stock Alerts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.inventory.lowStock.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-background-tertiary rounded-lg border-l-4 border-status-error">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.name}</p>
                      <p className="text-xs text-status-error">Stock: {item.currentStock} / {item.reorderLevel} (Critical)</p>
                    </div>
                    <Button size="sm" variant="outline">Restock</Button>
                  </div>
                ))}
                {reportData.inventory.lowStock.length === 0 && (
                  <div className="text-center py-8 text-text-muted">
                    All items are above reorder levels.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Inventory Health Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-status-success/10 border border-status-success/20 text-center">
                  <p className="text-xs text-text-muted">Healthy Stock</p>
                  <p className="text-2xl font-bold text-status-success">
                    {products.filter(p => getTotalStock(p) > (p.reorderLevel || 10) * 2).length}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-status-warning/10 border border-status-warning/20 text-center">
                  <p className="text-xs text-text-muted">Near Reorder</p>
                  <p className="text-2xl font-bold text-status-warning">
                    {products.filter(p => {
                      const stock = getTotalStock(p);
                      const reorder = p.reorderLevel || 10;
                      return stock > reorder && stock <= reorder * 2;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financial Report - Mock */}
      {selectedReport === 'financial' && (
        <Card className="max-w-md">
          <CardHeader><CardTitle>Balance Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span className="font-bold">{formatPrice(reportData.overview.totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-status-error">
              <span>Total Expenses (Mock)</span>
              <span className="font-bold">-$1,250.00</span>
            </div>
            <div className="pt-4 border-t border-background-tertiary flex justify-between text-lg font-bold text-status-success">
              <span>Net Profit</span>
              <span>{formatPrice(reportData.overview.totalRevenue - 1250)}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MetricCard({ title, value, growth, icon: Icon, iconColor }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <Icon className={`h-8 w-8 ${iconColor}`} />
          <div className="ml-4">
            <p className="text-sm font-medium text-text-muted">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <div className="flex items-center mt-1">
              {growth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-status-success mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-status-error mr-1" />
              )}
              <span className={growth >= 0 ? 'text-xs text-status-success' : 'text-xs text-status-error'}>
                {growth >= 0 ? '+' : ''}{growth}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
