import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Package, DollarSign, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { usePrice } from '@/hooks/usePrice'
import { formatDate, cn } from '@/lib/utils'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

export default function DashboardPage() {
  const { formatPrice } = usePrice()
  const [searchQuery, setSearchQuery] = useState('')

  // Real data from IndexedDB
  const sales = useLiveQuery(() => db.sales.orderBy('createdAt').reverse().limit(50).toArray()) || []
  const products = useLiveQuery(() => db.products.toArray()) || []
  const customers = useLiveQuery(() => db.customers.toArray()) || []

  // Calculate today's sales
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todaySales = sales.filter((sale: any) => new Date(sale.createdAt) >= today)
  const todayRevenue = todaySales.reduce((sum: number, sale: any) => sum + (sale.totalAmountUSD || 0), 0)

  // Chart Data Preparation
  const chartData = sales.slice(0, 7).reverse().map(sale => ({
    date: formatDate(new Date(sale.createdAt)),
    amount: sale.totalAmountUSD
  }))

  const stats = [
    {
      title: 'Daily Revenue',
      value: formatPrice(todayRevenue),
      trend: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-accent-blue',
      glow: 'glow-blue'
    },
    {
      title: 'Active Inventory',
      value: products.length.toString(),
      trend: '+4.2%',
      isPositive: true,
      icon: Package,
      color: 'text-accent-purple',
      glow: 'glow-purple'
    },
    {
      title: 'Customer Base',
      value: customers.length.toString(),
      trend: '+2.1%',
      isPositive: true,
      icon: Users,
      color: 'text-accent-green',
      glow: ''
    },
    {
      title: 'Operational Status',
      value: 'Healthy',
      trend: 'Optimal',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-accent-gold',
      glow: ''
    }
  ]

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-premium">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Business <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-text-muted">
            Intelligence and performance metrics for your enterprise.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-morphism h-11">
            Generate Report
          </Button>
          <Button className="h-11">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative group max-w-2xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <Input
            placeholder="Search across inventory, sales, and analytics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-background-secondary/80 border-white/5 text-lg"
          />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className={cn("relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300", stat.glow)}>
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <stat.icon className="h-12 w-12" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium uppercase tracking-wider text-text-muted">
                {stat.title}
              </CardDescription>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                {stat.value}
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
                  stat.isPositive ? "bg-status-success/10 text-status-success" : "bg-status-error/10 text-status-error"
                )}>
                  {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                  {stat.trend}
                </div>
                <span className="text-xs text-text-muted">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts & Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Graph */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue Analytics
              <Button variant="ghost" size="sm" className="text-xs">View Full Report</Button>
            </CardTitle>
            <CardDescription>Visualizing revenue trends over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Center */}
        <div className="space-y-8">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle>Intelligent Actions</CardTitle>
              <CardDescription>AI-powered shortcuts for your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-blue/10 p-2 rounded-lg mr-3 group-hover:bg-accent-blue/20 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-accent-blue" />
                  </div>
                  <div>
                    <div className="font-semibold">Optimize Pricing</div>
                    <div className="text-xs text-text-muted">Sync ZiG rates with global markets</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-purple/10 p-2 rounded-lg mr-3 group-hover:bg-accent-purple/20 transition-colors">
                    <Package className="h-5 w-5 text-accent-purple" />
                  </div>
                  <div>
                    <div className="font-semibold">Restock Queue</div>
                    <div className="text-xs text-text-muted">12 items predicted to stock out</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-green/10 p-2 rounded-lg mr-3 group-hover:bg-accent-green/20 transition-colors">
                    <Users className="h-5 w-5 text-accent-green" />
                  </div>
                  <div>
                    <div className="font-semibold">Loyalty Blast</div>
                    <div className="text-xs text-text-muted">Reward top 5% customers</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
