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
  Clock,
  DollarSign,
  Wrench
} from 'lucide-react'

const HardwareDashboard: React.FC = () => {
  const stats = [
    { label: 'Today Sales', value: '$3,200', trend: '+22%', icon: DollarSign },
    { label: 'Tools', value: '2,890', trend: '+6%', icon: Wrench },
    { label: 'Projects', value: '45', trend: '+12%', icon: Package },
    { label: 'Suppliers', value: '28', trend: '+4%', icon: Users }
  ]

  const features = [
    { name: 'Tool Tracking', icon: Wrench, description: 'Track tool inventory' },
    { name: 'Project Billing', icon: Package, description: 'Project-based pricing' },
    { name: 'Supplier Management', icon: Users, description: 'Manage suppliers' },
    { name: 'Service Orders', icon: Settings, description: 'Service requests' }
  ]

  const recentActivity = [
    { id: 1, type: 'sale', description: 'Power tools sale', amount: '$450.00', time: '10 mins ago' },
    { id: 2, type: 'project', description: 'Construction project', amount: '$1,200.00', time: '1 hour ago' },
    { id: 3, type: 'service', description: 'Tool repair service', amount: '$85.00', time: '2 hours ago' },
    { id: 4, type: 'delivery', description: 'Bulk tool delivery', amount: '50 items', time: '3 hours ago' }
  ]

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-premium">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Wrench className="h-8 w-8 text-accent-purple" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Hardware Solution
            </h1>
            <Badge variant="secondary" className="text-xs">
              Professional
            </Badge>
          </div>
          <p className="text-text-muted">
            Complete hardware store and project management system
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
                <stat.icon className="h-5 w-5 text-accent-purple" />
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
            <CardTitle>Hardware Features</CardTitle>
            <CardDescription>Specialized tools for hardware management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <Button key={i} variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-purple/10 p-2 rounded-lg mr-3 group-hover:bg-accent-purple/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-accent-purple" />
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
                    <div className="w-2 h-2 bg-accent-purple rounded-full" />
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

      {/* Project Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Current construction and service projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Package className="h-8 w-8 text-accent-purple mx-auto mb-2" />
              <h3 className="font-semibold">Active Projects</h3>
              <p className="text-2xl font-bold text-accent-purple">12</p>
              <p className="text-sm text-text-muted">Ongoing work</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Wrench className="h-8 w-8 text-accent-blue mx-auto mb-2" />
              <h3 className="font-semibold">Tools on Rent</h3>
              <p className="text-2xl font-bold text-accent-blue">34</p>
              <p className="text-sm text-text-muted">Currently rented</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Clock className="h-8 w-8 text-accent-orange mx-auto mb-2" />
              <h3 className="font-semibold">Pending Service</h3>
              <p className="text-2xl font-bold text-accent-orange">8</p>
              <p className="text-sm text-text-muted">Service requests</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HardwareDashboard
