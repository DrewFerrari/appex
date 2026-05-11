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
  Utensils
} from 'lucide-react'

const RestaurantDashboard: React.FC = () => {
  const stats = [
    { label: 'Today Covers', value: '89', trend: '+18%', icon: Users },
    { label: 'Tables', value: '24', trend: '0%', icon: Utensils },
    { label: 'Menu Items', value: '156', trend: '+3%', icon: Package },
    { label: 'Staff', value: '12', trend: '+2', icon: Users }
  ]

  const features = [
    { name: 'Table Management', icon: Utensils, description: 'Table reservations' },
    { name: 'Kitchen Orders', icon: Package, description: 'Order tracking' },
    { name: 'Menu Management', icon: Settings, description: 'Menu updates' },
    { name: 'Staff Scheduling', icon: Users, description: 'Staff management' }
  ]

  const recentActivity = [
    { id: 1, type: 'order', description: 'Table 5 - Order complete', amount: '$85.00', time: '5 mins ago' },
    { id: 2, type: 'reservation', description: 'Table 12 reserved', amount: '4 guests', time: '15 mins ago' },
    { id: 3, type: 'kitchen', description: 'Kitchen order fired', amount: '3 items', time: '30 mins ago' },
    { id: 4, type: 'payment', description: 'Table 8 payment', amount: '$120.00', time: '45 mins ago' }
  ]

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-premium">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Utensils className="h-8 w-8 text-accent-orange" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Restaurant Solution
            </h1>
            <Badge variant="secondary" className="text-xs">
              Dining
            </Badge>
          </div>
          <p className="text-text-muted">
            Complete restaurant management and food service platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-morphism h-11">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button className="h-11">
            <Plus className="mr-2 h-4 w-4" />
            New Order
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
                <stat.icon className="h-5 w-5 text-accent-orange" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.trend.startsWith('+') ? 'bg-status-success/10 text-status-success' : 'bg-background-tertiary text-text-muted'
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
            <CardTitle>Restaurant Features</CardTitle>
            <CardDescription>Specialized tools for restaurant management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <Button key={i} variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className="bg-accent-orange/10 p-2 rounded-lg mr-3 group-hover:bg-accent-orange/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-accent-orange" />
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
            <CardDescription>Latest orders and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-orange rounded-full" />
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

      {/* Table Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Table Status</CardTitle>
          <CardDescription>Current table occupancy and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Utensils className="h-8 w-8 text-accent-green mx-auto mb-2" />
              <h3 className="font-semibold">Available</h3>
              <p className="text-2xl font-bold text-accent-green">8</p>
              <p className="text-sm text-text-muted">Tables free</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Users className="h-8 w-8 text-accent-orange mx-auto mb-2" />
              <h3 className="font-semibold">Occupied</h3>
              <p className="text-2xl font-bold text-accent-orange">14</p>
              <p className="text-sm text-text-muted">Tables in use</p>
            </div>
            <div className="text-center p-4 bg-background-secondary/50 rounded-lg">
              <Clock className="h-8 w-8 text-accent-blue mx-auto mb-2" />
              <h3 className="font-semibold">Reserved</h3>
              <p className="text-2xl font-bold text-accent-blue">2</p>
              <p className="text-sm text-text-muted">Upcoming reservations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RestaurantDashboard
