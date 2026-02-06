import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Users, Edit, Trash2, Phone, Mail, MapPin, X } from 'lucide-react'
import { useCurrencyStore } from '@/stores/currencyStore'
import { formatCurrency, formatDate, formatZimbabwePhone } from '@/lib/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { Customer } from '@/types'
import { useToast } from '@/components/ui/use-toast'

export default function CustomerManagement() {
  const { activeCurrency } = useCurrencyStore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Real data from IndexedDB
  const customers = useLiveQuery(() => db.customers.toArray()) || []

  const customerTypes = ['all', 'retail', 'wholesale', 'corporate']

  const filteredCustomers = customers.filter((customer: Customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || customer.customerType === selectedType
    return matchesSearch && matchesType
  })

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Default values for new customer
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      businessId: 'offline-default',
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || undefined,
      address: formData.get('address') as string || undefined,
      customerType: formData.get('customerType') as Customer['customerType'],
      creditLimitUSD: parseFloat(formData.get('creditLimit') as string) || 0,
      currentBalanceUSD: 0,
      loyaltyPoints: 0,
      totalSpentUSD: 0,
      tags: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    try {
      await db.customers.add(newCustomer)

      // Add to sync queue
      await db.syncQueue.add({
        id: crypto.randomUUID(),
        entityType: 'customer',
        entityId: newCustomer.id,
        operation: 'create',
        data: newCustomer,
        status: 'pending',
        retryCount: 0,
        createdAt: new Date()
      })

      toast({
        title: "Customer Added",
        description: `${newCustomer.name} has been added successfully.`,
      })

      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Failed to add customer:', error)
      toast({
        title: "Error",
        description: "Failed to add customer. Phone number might be duplicate.",
        variant: "destructive"
      })
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'retail': return 'text-accent-blue'
      case 'wholesale': return 'text-accent-purple'
      case 'corporate': return 'text-currency-usd'
      default: return 'text-text-muted'
    }
  }

  const getCreditStatus = (currentBalance: number, creditLimit: number) => {
    if (creditLimit === 0) return { status: 'N/A', color: 'text-text-muted' }
    const percentageUsed = (currentBalance / creditLimit) * 100
    if (percentageUsed >= 90) return { status: 'Critical', color: 'text-status-error' }
    if (percentageUsed >= 70) return { status: 'Warning', color: 'text-status-warning' }
    return { status: 'Good', color: 'text-status-success' }
  }

  return (
    <div className="p-6 space-y-6 relative">
      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background-primary">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Customer</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" required placeholder="John Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input name="phone" required placeholder="+263..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      name="customerType"
                      className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="retail">Retail</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email (Optional)</label>
                  <Input name="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address (Optional)</label>
                  <Input name="address" placeholder="123 Street..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Credit Limit (USD)</label>
                  <Input name="creditLimit" type="number" defaultValue="0" />
                </div>
                <Button type="submit" className="w-full">Save Customer</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Customer Management</h1>
          <p className="text-text-muted">
            Manage your customer database, loyalty programs, and credit accounts
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-accent-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total Customers</p>
                <p className="text-2xl font-bold text-text-primary">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-currency-usd" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Active Credit</p>
                <p className="text-2xl font-bold text-text-primary">
                  {customers.filter((c: Customer) => c.currentBalanceUSD > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-accent-purple" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Loyalty Members</p>
                <p className="text-2xl font-bold text-text-primary">
                  {customers.filter(c => c.loyaltyPoints > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-status-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total Revenue</p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCurrency(customers.reduce((sum, c) => sum + (c.totalSpentUSD || 0), 0), activeCurrency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search customers by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-background-tertiary border border-background-tertiary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
        >
          {customerTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer: Customer) => {
          const creditStatus = getCreditStatus(customer.currentBalanceUSD, customer.creditLimitUSD)

          return (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">{customer.name}</h3>
                    <span className={`text-sm font-medium ${getCustomerTypeColor(customer.customerType)}`}>
                      {customer.customerType.charAt(0).toUpperCase() + customer.customerType.slice(1)}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-status-error">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-text-muted" />
                    <span className="text-text-primary">{formatZimbabwePhone(customer.phone)}</span>
                  </div>
                  {customer.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-text-muted" />
                      <span className="text-text-primary">{customer.email}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-text-muted mt-0.5" />
                      <span className="text-text-primary">{customer.address}</span>
                    </div>
                  )}
                </div>

                {/* Financial Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Credit Limit</span>
                    <span className="text-text-primary">
                      {formatCurrency(customer.creditLimitUSD, activeCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Current Balance</span>
                    <span className="text-text-primary">
                      {formatCurrency(customer.currentBalanceUSD, activeCurrency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Credit Status</span>
                    <span className={`font-medium ${creditStatus.color}`}>
                      {creditStatus.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Loyalty Points</span>
                    <span className="text-accent-purple font-medium">{customer.loyaltyPoints}</span>
                  </div>
                </div>

                {/* Last Purchase */}
                {customer.lastPurchaseDate && (
                  <div className="pt-2 border-t border-background-tertiary">
                    <p className="text-xs text-text-muted">
                      Last purchase: {formatDate(customer.lastPurchaseDate)}
                    </p>
                    <p className="text-sm font-medium text-text-primary">
                      Total spent: {formatCurrency(customer.totalSpentUSD, activeCurrency)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No customers found</p>
        </div>
      )}
    </div>
  )
}
