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
  Users,
  TrendingUp,
  DollarSign
} from 'lucide-react'

const RetailDashboard: React.FC = () => {
  const stats = [
    { label: 'Today Sales', value: '$2,450', trend: '+12%', icon: DollarSign },
    { label: 'Products', value: '1,234', trend: '+5%', icon: Package },
    { label: 'Customers', value: '856', trend: '+8%', icon: Users },
    { label: 'Orders', value: '124', trend: '+15%', icon: ShoppingCart }
  ]

  const features = [
    { name: 'POS System', icon: ShoppingCart, description: 'Point of sale' },
    { name: 'Inventory', icon: Package, description: 'Stock management' },
    { name: 'Customer Management', icon: Users, description: 'Customer data' },
    { name: 'Sales Analytics', icon: BarChart3, description: 'Sales reports' }
  ]

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Retail sale #1234', amount: '$125.50', time: '5 mins ago' },
    { id: 2, type: 'customer', description: 'New customer registered', amount: 'John Doe', time: '15 mins ago' },
    { id: 3, type: 'inventory', description: 'Stock updated', amount: '50 items', time: '30 mins ago' },
    { id: 4, type: 'return', description: 'Product return', amount: '$25.00', time: '1 hour ago' }
  ]

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-premium">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-accent-blue" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Retail Solution
            </h1>
            <Badge variant="secondary" className="text-xs">
              Standard
            </Badge>
          </div>
          <p className="text-text-muted">
            Complete retail management system for modern stores
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
                <stat.icon className="h-5 w-5 text-accent-blue" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success/10 text-status-success">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
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
            <CardTitle>Retail Features</CardTitle>
            <CardDescription>Core retail management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <Button key={i} variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-blue/10 p-2 rounded-lg mr-3 group-hover:bg-accent-blue/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-accent-blue" />
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
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-blue rounded-full" />
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

      {/* Sales Performance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Today's sales overview and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <DollarSign className="h-8 w-8 text-accent-green mx-auto mb-2" />
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-2xl font-bold text-accent-green">$2,450</p>
              <p className="text-sm text-text-muted">Today's total</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-accent-blue mx-auto mb-2" />
              <h3 className="font-semibold">Transactions</h3>
              <p className="text-2xl font-bold text-accent-blue">124</p>
              <p className="text-sm text-text-muted">Completed today</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Users className="h-8 w-8 text-accent-purple mx-auto mb-2" />
              <h3 className="font-semibold">Customers</h3>
              <p className="text-2xl font-bold text-accent-purple">89</p>
              <p className="text-sm text-text-muted">Unique today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RetailDashboard
