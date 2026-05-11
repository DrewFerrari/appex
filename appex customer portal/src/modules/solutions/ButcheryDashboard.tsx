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

const ButcheryDashboard: React.FC = () => {
  const stats = [
    { label: 'Today Sales', value: '$2,100', trend: '+15%', icon: DollarSign },
    { label: 'Meat Products', value: '89', trend: '+3%', icon: Package },
    { label: 'Orders', value: '67', trend: '+20%', icon: ShoppingCart },
    { label: 'Suppliers', value: '15', trend: '+1', icon: Truck }
  ]

  const features = [
    { name: 'Meat Processing', icon: Package, description: 'Track meat processing stages' },
    { name: 'Weight Management', icon: Scale, description: 'Precise weight tracking' },
    { name: 'Quality Control', icon: Settings, description: 'Quality assurance checks' },
    { name: 'Supplier Management', icon: Truck, description: 'Manage supplier relationships' }
  ]

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Beef sale - 5kg', amount: '$45.00', time: '10 mins ago' },
    { id: 2, type: 'processing', description: 'Chicken processing batch', amount: '120kg', time: '1 hour ago' },
    { id: 3, type: 'order', description: 'Restaurant order', amount: '$280.00', time: '2 hours ago' },
    { id: 4, type: 'delivery', description: 'Supplier delivery', amount: '500kg beef', time: '3 hours ago' }
  ]

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-premium">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-accent-red" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Butchery Solution
            </h1>
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          </div>
          <p className="text-text-muted">
            Complete meat processing and sales management system
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
                <stat.icon className="h-5 w-5 text-accent-red" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success/10 text-status-success">
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
            <CardTitle>Butchery Features</CardTitle>
            <CardDescription>Specialized tools for meat processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <Button key={i} variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-red/10 p-2 rounded-lg mr-3 group-hover:bg-accent-red/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-accent-red" />
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
                    <div className="w-2 h-2 bg-accent-red rounded-full" />
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

      {/* Processing Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Processing Status</CardTitle>
          <CardDescription>Current meat processing stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Clock className="h-8 w-8 text-accent-orange mx-auto mb-2" />
              <h3 className="font-semibold">In Progress</h3>
              <p className="text-2xl font-bold text-accent-orange">3</p>
              <p className="text-sm text-text-muted">Batches processing</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Package className="h-8 w-8 text-accent-green mx-auto mb-2" />
              <h3 className="font-semibold">Ready</h3>
              <p className="text-2xl font-bold text-accent-green">12</p>
              <p className="text-sm text-text-muted">Products available</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Users className="h-8 w-8 text-accent-blue mx-auto mb-2" />
              <h3 className="font-semibold">Pending Orders</h3>
              <p className="text-2xl font-bold text-accent-blue">8</p>
              <p className="text-sm text-text-muted">Customer orders</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ButcheryDashboard
