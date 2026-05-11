import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Package, 
  BarChart3,
  Settings,
  Plus,
  Scale,
  Truck,
  Clock,
  Users,
  DollarSign
} from 'lucide-react'

const GroceryDashboard: React.FC = () => {
  const stats = [
    { label: 'Today Sales', value: '$1,890', trend: '+8%', icon: DollarSign },
    { label: 'Products', value: '3,456', trend: '+12%', icon: Package },
    { label: 'Expiring Soon', value: '23', trend: '-15%', icon: Clock },
    { label: 'Members', value: '1,234', trend: '+18%', icon: Users }
  ]

  const features = [
    { name: 'Fresh Produce', icon: Package, description: 'Manage fresh inventory' },
    { name: 'Expiry Tracking', icon: Clock, description: 'Monitor product expiry' },
    { name: 'Bulk Pricing', icon: ShoppingCart, description: 'Volume discounts' },
    { name: 'Loyalty Program', icon: Users, description: 'Customer rewards' }
  ]

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Grocery basket sale', amount: '$125.50', time: '5 mins ago' },
    { id: 2, type: 'expiry', description: 'Dairy products expiring', amount: '15 items', time: '1 hour ago' },
    { id: 3, type: 'delivery', description: 'Fresh produce delivery', amount: '200kg', time: '2 hours ago' },
    { id: 4, type: 'order', description: 'Bulk customer order', amount: '$450.00', time: '3 hours ago' }
  ]

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-premium">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-accent-green" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Grocery Solution
            </h1>
            <Badge variant="secondary" className="text-xs">
              Fresh
            </Badge>
          </div>
          <p className="text-text-muted">
            Complete grocery store management with fresh produce tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-morphism h-11">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button className="h-11">
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium uppercase tracking-wider text-text-muted">
                {stat.label}
              </CardDescription>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                {stat.value}
                <stat.icon className={`h-5 w-5 ${stat.label.includes('Expiring') ? 'text-accent-orange' : 'text-accent-green'}`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.trend.startsWith('+') ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'
                }`}>
                  {stat.trend}
                </div>
                <span className="text-xs text-text-muted">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Grocery Features</CardTitle>
            <CardDescription>Specialized tools for grocery management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <Button key={i} variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-green/10 p-2 rounded-lg mr-3 group-hover:bg-accent-green/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-accent-green" />
                  </div>
                  <div>
                    <div className="font-semibold">{feature.name}</div>
                    <div className="text-xs text-text-muted">{feature.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'expiry' ? 'bg-accent-orange' : 'bg-accent-green'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-text-muted">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{activity.amount}</p>
                    <p className="text-xs text-text-muted capitalize">{activity.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fresh Produce Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Fresh Produce Management</CardTitle>
          <CardDescription>Monitor fresh inventory and expiry dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Package className="h-8 w-8 text-accent-green mx-auto mb-2" />
              <h3 className="font-semibold">Fresh Stock</h3>
              <p className="text-2xl font-bold text-accent-green">245</p>
              <p className="text-sm text-text-muted">Items in stock</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Clock className="h-8 w-8 text-accent-orange mx-auto mb-2" />
              <h3 className="font-semibold">Expiring Soon</h3>
              <p className="text-2xl font-bold text-accent-orange">23</p>
              <p className="text-sm text-text-muted">Within 3 days</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Truck className="h-8 w-8 text-accent-blue mx-auto mb-2" />
              <h3 className="font-semibold">Pending Delivery</h3>
              <p className="text-2xl font-bold text-accent-blue">3</p>
              <p className="text-sm text-text-muted">Suppliers arriving</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GroceryDashboard
