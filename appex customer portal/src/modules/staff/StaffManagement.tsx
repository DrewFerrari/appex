import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Users, Edit, Trash2, Key, Calendar, Award } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: 'owner' | 'manager' | 'cashier' | 'clerk'
  department: string
  hireDate: Date
  isActive: boolean
  lastLogin?: Date
  permissions: string[]
}

export default function StaffManagement() {
  const { user: currentUser } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  // Mock data
  const roles = ['all', 'owner', 'manager', 'cashier', 'clerk']
  
  const staff: Staff[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@business.com',
      phone: '+263 71 234 5678',
      role: 'owner',
      department: 'Management',
      hireDate: new Date('2020-01-15'),
      isActive: true,
      lastLogin: new Date(Date.now() - 3600000),
      permissions: ['all']
    },
    {
      id: '2',
      name: 'John Moyo',
      email: 'john@business.com',
      phone: '+263 77 890 1234',
      role: 'manager',
      department: 'Operations',
      hireDate: new Date('2021-03-20'),
      isActive: true,
      lastLogin: new Date(Date.now() - 7200000),
      permissions: ['inventory', 'sales', 'reports', 'staff']
    },
    {
      id: '3',
      name: 'Grace Kadzere',
      email: 'grace@business.com',
      phone: '+263 73 456 7890',
      role: 'cashier',
      department: 'Sales',
      hireDate: new Date('2022-06-10'),
      isActive: true,
      lastLogin: new Date(Date.now() - 1800000),
      permissions: ['sales', 'customers']
    },
    {
      id: '4',
      name: 'Tendai Chikowore',
      email: 'tendai@business.com',
      phone: '+263 78 234 5678',
      role: 'clerk',
      department: 'Inventory',
      hireDate: new Date('2023-01-05'),
      isActive: true,
      lastLogin: new Date(Date.now() - 86400000),
      permissions: ['inventory']
    }
  ]

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.phone.includes(searchQuery)
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20'
      case 'manager': return 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
      case 'cashier': return 'bg-currency-usd/10 text-currency-usd border border-currency-usd/20'
      case 'clerk': return 'bg-status-warning/10 text-status-warning border border-status-warning/20'
      default: return 'bg-background-tertiary text-text-muted'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-ZW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatLastLogin = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Staff Management</h1>
          <p className="text-text-muted">
            Manage your team, roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
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
                <p className="text-sm font-medium text-text-muted">Total Staff</p>
                <p className="text-2xl font-bold text-text-primary">{staff.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-status-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Active Today</p>
                <p className="text-2xl font-bold text-text-primary">
                  {staff.filter(s => s.lastLogin && 
                    (Date.now() - s.lastLogin.getTime()) < 86400000).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-accent-purple" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Managers</p>
                <p className="text-2xl font-bold text-text-primary">
                  {staff.filter(s => s.role === 'manager' || s.role === 'owner').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-currency-usd" />
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Cashiers</p>
                <p className="text-2xl font-bold text-text-primary">
                  {staff.filter(s => s.role === 'cashier').length}
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
            placeholder="Search staff by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-background-tertiary border border-background-tertiary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
        >
          {roles.map(role => (
            <option key={role} value={role}>
              {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{member.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {currentUser?.role === 'owner' && member.id !== currentUser.id && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-status-error">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-text-muted" />
                  <span className="text-text-primary">{member.department}</span>
                </div>
                <div className="text-sm">
                  <p className="text-text-muted">{member.email}</p>
                  <p className="text-text-primary">{member.phone}</p>
                </div>
              </div>

              {/* Employment Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Hire Date</span>
                  <span className="text-text-primary">{formatDate(member.hireDate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Status</span>
                  <span className={`font-medium ${member.isActive ? 'text-status-success' : 'text-status-error'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Last Login */}
              {member.lastLogin && (
                <div className="pt-2 border-t border-background-tertiary">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-text-muted" />
                    <span className="text-text-muted">Last login: </span>
                    <span className="text-text-primary ml-1">{formatLastLogin(member.lastLogin)}</span>
                  </div>
                </div>
              )}

              {/* Permissions */}
              <div className="pt-2 border-t border-background-tertiary">
                <p className="text-xs text-text-muted mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {member.permissions.slice(0, 3).map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-background-tertiary text-xs rounded text-text-primary"
                    >
                      {permission}
                    </span>
                  ))}
                  {member.permissions.length > 3 && (
                    <span className="px-2 py-1 bg-background-tertiary text-xs rounded text-text-muted">
                      +{member.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted">No staff members found</p>
        </div>
      )}
    </div>
  )
}
