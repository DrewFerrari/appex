import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Package, 
  TrendingUp,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface SolutionDashboardProps {
  solutionType: string
}

const SolutionDashboard: React.FC<SolutionDashboardProps> = ({ solutionType }) => {
  const { solutionType: currentSolutionType } = useAuthStore()

  const getSolutionConfig = (type: string) => {
    switch (type) {
      case 'retail':
        return {
          title: 'Retail Solution',
          description: 'Complete retail management system',
          icon: ShoppingCart,
          color: 'accent-blue',
          features: ['POS', 'Inventory', 'Customer Management', 'Sales Analytics'],
          stats: [
            { label: 'Today Sales', value: '$2,450', trend: '+12%' },
            { label: 'Products', value: '1,234', trend: '+5%' },
            { label: 'Customers', value: '856', trend: '+8%' },
            { label: 'Orders', value: '124', trend: '+15%' }
          ]
        }
      case 'restaurant':
        return {
          title: 'Restaurant Solution',
          description: 'Food service management platform',
          icon: Package,
          color: 'accent-orange',
          features: ['Table Management', 'Kitchen Orders', 'Menu Management', 'Staff Scheduling'],
          stats: [
            { label: 'Today Covers', value: '89', trend: '+18%' },
            { label: 'Tables', value: '24', trend: '0%' },
            { label: 'Menu Items', value: '156', trend: '+3%' },
            { label: 'Staff', value: '12', trend: '+2' }
          ]
        }
      case 'hardware':
        return {
          title: 'Hardware Solution',
          description: 'Hardware store management system',
          icon: Settings,
          color: 'accent-purple',
          features: ['Tool Tracking', 'Supplier Management', 'Project Billing', 'Inventory'],
          stats: [
            { label: 'Today Sales', value: '$3,200', trend: '+22%' },
            { label: 'Tools', value: '2,890', trend: '+6%' },
            { label: 'Projects', value: '45', trend: '+12%' },
            { label: 'Suppliers', value: '28', trend: '+4%' }
          ]
        }
      case 'grocery':
        return {
          title: 'Grocery Solution',
          description: 'Grocery store management platform',
          icon: Package,
          color: 'accent-green',
          features: ['Fresh Produce', 'Expiry Tracking', 'Bulk Pricing', 'Loyalty Program'],
          stats: [
            { label: 'Today Sales', value: '$1,890', trend: '+8%' },
            { label: 'Products', value: '3,456', trend: '+12%' },
            { label: 'Expiring', value: '23', trend: '-15%' },
            { label: 'Members', value: '1,234', trend: '+18%' }
          ]
        }
      case 'butchery':
        return {
          title: 'Butchery Solution',
          description: 'Meat processing and sales management',
          icon: Package,
          color: 'accent-red',
          features: ['Meat Processing', 'Weight Tracking', 'Quality Control', 'Supplier Management'],
          stats: [
            { label: 'Today Sales', value: '$2,100', trend: '+15%' },
            { label: 'Products', value: '89', trend: '+3%' },
            { label: 'Orders', value: '67', trend: '+20%' },
            { label: 'Suppliers', value: '15', trend: '+1' }
          ]
        }
      default:
        return {
          title: 'General Solution',
          description: 'Business management platform',
          icon: ShoppingCart,
          color: 'accent-blue',
          features: ['POS', 'Inventory', 'Analytics', 'Customer Management'],
          stats: [
            { label: 'Today Sales', value: '$1,500', trend: '+10%' },
            { label: 'Products', value: '500', trend: '+5%' },
            { label: 'Customers', value: '300', trend: '+8%' },
            { label: 'Orders', value: '50', trend: '+12%' }
          ]
        }
    }
  }

  const config = getSolutionConfig(solutionType)
  const Icon = config.icon

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gradient-premium">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Icon className={`h-8 w-8 text-${config.color}`} />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              {config.title}
            </h1>
            <Badge variant="secondary" className="text-xs">
              {solutionType}
            </Badge>
          </div>
          <p className="text-text-muted">
            {config.description}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass-morphism h-11">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button className="h-11">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium uppercase tracking-wider text-text-muted">
                {stat.label}
              </CardDescription>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                {stat.value}
                <TrendingUp className="h-5 w-5 text-accent-green" />
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features for {config.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {config.features.map((feature, i) => (
                <Button key={i} variant="outline" className="h-16 justify-start text-left glass-morphism group">
                  <div className={`bg-${config.color}/10 p-2 rounded-lg mr-3 group-hover:bg-${config.color}/20 transition-colors`}>
                    <ShoppingCart className={`h-5 w-5 text-${config.color}`} />
                  </div>
                  <div>
                    <div className="font-semibold">{feature}</div>
                    <div className="text-xs text-text-muted">Manage {feature.toLowerCase()}</div>
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
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 bg-${config.color} rounded-full`} />
                    <div>
                      <p className="text-sm font-medium">Transaction #{1000 + i}</p>
                      <p className="text-xs text-text-muted">{i * 15} minutes ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${(i * 45.50).toFixed(2)}</p>
                    <p className="text-xs text-text-muted">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SolutionDashboard
