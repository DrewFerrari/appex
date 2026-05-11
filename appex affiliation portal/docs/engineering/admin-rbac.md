# Admin Panel & Role-Based Access Control (RBAC)

## 📋 Overview

The AppEx Affiliation Portal features a comprehensive admin panel with granular Role-Based Access Control (RBAC) system. This ensures secure administrative operations while providing appropriate access levels for different user roles within the organization.

## 🏛️ Role Hierarchy

### Role Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Role Hierarchy                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SUPER_ADMIN (Level 5)                                              │
│  ├─ System configuration                                            │
│  ├─ Manage all administrators                                       │
│  ├─ Full system access                                              │
│  └─ Emergency controls                                              │
│                                                                     │
│  ADMIN (Level 4)                                                    │
│  ├─ User management                                                 │
│  ├─ Commission approvals                                            │
│  ├─ Payout processing                                               │
│  ├─ Analytics access                                                │
│  └─ System monitoring                                               │
│                                                                     │
│  SUPER_AFFILIATE (Level 3)                                          │
│  ├─ Team management                                                 │
│  ├─ Advanced analytics                                              │
│  ├─ Bulk operations                                                 │
│  └─ Training oversight                                             │
│                                                                     │
│  TRAINER/RESELLER (Level 2)                                         │
│  ├─ Own referral management                                         │
│  ├─ Commission viewing                                              │
│  ├─ Training access                                                 │
│  └─ Marketing materials                                             │
│                                                                     │
│  AFFILIATE (Level 1)                                                │
│  ├─ Profile management                                              │
│  ├─ Basic dashboard                                                 │
│  └─ Limited reporting                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Role Definitions

```typescript
// src/types/rbac.ts
export enum Role {
  AFFILIATE = 'affiliate',
  TRAINER = 'trainer',
  RESELLER = 'reseller',
  SUPER_AFFILIATE = 'super_affiliate',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface RoleDefinition {
  role: Role
  level: number
  displayName: string
  description: string
  permissions: Permission[]
  inherits?: Role[]
}

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  [Role.AFFILIATE]: {
    role: Role.AFFILIATE,
    level: 1,
    displayName: 'Affiliate',
    description: 'Basic affiliate with access to personal dashboard and referrals',
    permissions: [
      Permission.READ_OWN_PROFILE,
      Permission.UPDATE_OWN_PROFILE,
      Permission.READ_OWN_REFERRALS,
      Permission.READ_OWN_COMMISSIONS,
      Permission.REQUEST_PAYOUT,
      Permission.ACCESS_TRAINING,
    ],
  },

  [Role.TRAINER]: {
    role: Role.TRAINER,
    level: 2,
    displayName: 'Trainer',
    description: 'Affiliate with training capabilities and referral management',
    permissions: [
      ...ROLE_DEFINITIONS[Role.AFFILIATE].permissions,
      Permission.CREATE_REFERRAL,
      Permission.UPDATE_OWN_REFERRALS,
      Permission.DOWNLOAD_CERTIFICATES,
      Permission.ACCESS_MARKETING_MATERIALS,
    ],
  },

  [Role.RESELLER]: {
    role: Role.RESELLER,
    level: 2,
    displayName: 'Reseller',
    description: 'Affiliate focused on product sales and customer acquisition',
    permissions: [
      ...ROLE_DEFINITIONS[Role.AFFILIATE].permissions,
      Permission.CREATE_REFERRAL,
      Permission.UPDATE_OWN_REFERRALS,
      Permission.ACCESS_MARKETING_MATERIALS,
    ],
  },

  [Role.SUPER_AFFILIATE]: {
    role: Role.SUPER_AFFILIATE,
    level: 3,
    displayName: 'Super Affiliate',
    description: 'Senior affiliate with team management and advanced analytics',
    permissions: [
      ...ROLE_DEFINITIONS[Role.TRAINER].permissions,
      Permission.MANAGE_TEAM,
      Permission.VIEW_TEAM_ANALYTICS,
      Permission.BULK_OPERATIONS,
      Permission.APPROVE_TEAM_COMMISSIONS,
    ],
  },

  [Role.ADMIN]: {
    role: Role.ADMIN,
    level: 4,
    displayName: 'Administrator',
    description: 'System administrator with full operational control',
    permissions: [
      ...ROLE_DEFINITIONS[Role.SUPER_AFFILIATE].permissions,
      Permission.READ_ALL_USERS,
      Permission.MANAGE_USERS,
      Permission.READ_ALL_REFERRALS,
      Permission.APPROVE_COMMISSIONS,
      Permission.PROCESS_PAYOUTS,
      Permission.VIEW_ANALYTICS,
      Permission.MANAGE_SYSTEM,
      Permission.ACCESS_ADMIN_PANEL,
      Permission.EXPORT_DATA,
      Permission.MANAGE_CONTENT,
    ],
  },

  [Role.SUPER_ADMIN]: {
    role: Role.SUPER_ADMIN,
    level: 5,
    displayName: 'Super Administrator',
    description: 'System owner with full control including administrative access',
    permissions: [
      ...ROLE_DEFINITIONS[Role.ADMIN].permissions,
      Permission.MANAGE_ADMINS,
      Permission.SYSTEM_CONFIG,
      Permission.EMERGENCY_CONTROLS,
      Permission.AUDIT_LOG_ACCESS,
      Permission.DATABASE_ACCESS,
    ],
  },
}
```

## 🔐 Permission System

### Permission Definitions

```typescript
// src/types/permissions.ts
export enum Permission {
  // User Management
  READ_OWN_PROFILE = 'read_own_profile',
  UPDATE_OWN_PROFILE = 'update_own_profile',
  READ_ALL_USERS = 'read_all_users',
  MANAGE_USERS = 'manage_users',
  MANAGE_ADMINS = 'manage_admins',
  
  // Referral Management
  CREATE_REFERRAL = 'create_referral',
  READ_OWN_REFERRALS = 'read_own_referrals',
  UPDATE_OWN_REFERRALS = 'update_own_referrals',
  READ_ALL_REFERRALS = 'read_all_referrals',
  
  // Commission Management
  READ_OWN_COMMISSIONS = 'read_own_commissions',
  APPROVE_COMMISSIONS = 'approve_commissions',
  APPROVE_TEAM_COMMISSIONS = 'approve_team_commissions',
  
  // Payout Management
  REQUEST_PAYOUT = 'request_payout',
  PROCESS_PAYOUTS = 'process_payouts',
  
  // Analytics & Reporting
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_TEAM_ANALYTICS = 'view_team_analytics',
  EXPORT_DATA = 'export_data',
  
  // Training & Content
  ACCESS_TRAINING = 'access_training',
  DOWNLOAD_CERTIFICATES = 'download_certificates',
  MANAGE_CONTENT = 'manage_content',
  
  // Marketing
  ACCESS_MARKETING_MATERIALS = 'access_marketing_materials',
  
  // Team Management
  MANAGE_TEAM = 'manage_team',
  
  // System Administration
  ACCESS_ADMIN_PANEL = 'access_admin_panel',
  MANAGE_SYSTEM = 'manage_system',
  SYSTEM_CONFIG = 'system_config',
  EMERGENCY_CONTROLS = 'emergency_controls',
  
  // Audit & Security
  AUDIT_LOG_ACCESS = 'audit_log_access',
  DATABASE_ACCESS = 'database_access',
  
  // Operations
  BULK_OPERATIONS = 'bulk_operations',
}

export interface PermissionDefinition {
  permission: Permission
  category: string
  displayName: string
  description: string
  resource: string
  action: 'create' | 'read' | 'update' | 'delete' | 'execute'
}

export const PERMISSION_DEFINITIONS: Record<Permission, PermissionDefinition> = {
  [Permission.READ_OWN_PROFILE]: {
    permission: Permission.READ_OWN_PROFILE,
    category: 'User Management',
    displayName: 'Read Own Profile',
    description: 'View personal profile information',
    resource: 'user',
    action: 'read',
  },
  
  [Permission.UPDATE_OWN_PROFILE]: {
    permission: Permission.UPDATE_OWN_PROFILE,
    category: 'User Management',
    displayName: 'Update Own Profile',
    description: 'Update personal profile information',
    resource: 'user',
    action: 'update',
  },
  
  [Permission.READ_ALL_USERS]: {
    permission: Permission.READ_ALL_USERS,
    category: 'User Management',
    displayName: 'Read All Users',
    description: 'View all user profiles and information',
    resource: 'users',
    action: 'read',
  },
  
  [Permission.MANAGE_USERS]: {
    permission: Permission.MANAGE_USERS,
    category: 'User Management',
    displayName: 'Manage Users',
    description: 'Create, update, and deactivate user accounts',
    resource: 'users',
    action: 'execute',
  },
  
  // ... other permission definitions
} as Record<Permission, PermissionDefinition>
```

### Permission Checking Service

```typescript
// src/services/rbac.service.ts
import { Injectable } from '@nestjs/common'
import { Role, Permission, ROLE_DEFINITIONS } from '@/types/rbac'

@Injectable()
export class RBACService {
  private roleHierarchy = new Map<Role, Set<Permission>>()
  private permissionCache = new Map<string, boolean>()

  constructor() {
    this.buildRoleHierarchy()
  }

  private buildRoleHierarchy(): void {
    // Build permission sets for each role
    Object.values(Role).forEach(role => {
      const roleDef = ROLE_DEFINITIONS[role]
      const permissions = new Set(roleDef.permissions)
      
      // Add inherited permissions
      if (roleDef.inherits) {
        roleDef.inherits.forEach(inheritedRole => {
          const inheritedPermissions = this.roleHierarchy.get(inheritedRole)
          if (inheritedPermissions) {
            inheritedPermissions.forEach(perm => permissions.add(perm))
          }
        })
      }
      
      this.roleHierarchy.set(role, permissions)
    })
  }

  hasPermission(userRole: Role, permission: Permission): boolean {
    const cacheKey = `${userRole}:${permission}`
    
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!
    }

    const permissions = this.roleHierarchy.get(userRole)
    const hasPermission = permissions ? permissions.has(permission) : false
    
    this.permissionCache.set(cacheKey, hasPermission)
    return hasPermission
  }

  hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission))
  }

  hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission))
  }

  getPermissions(userRole: Role): Permission[] {
    const permissions = this.roleHierarchy.get(userRole)
    return permissions ? Array.from(permissions) : []
  }

  canAccessResource(userRole: Role, resource: string, action: string): boolean {
    const requiredPermission = this.getPermissionForResource(resource, action)
    return requiredPermission ? this.hasPermission(userRole, requiredPermission) : false
  }

  private getPermissionForResource(resource: string, action: string): Permission | null {
    // Map resource-action combinations to permissions
    const resourcePermissionMap: Record<string, Record<string, Permission>> = {
      'user': {
        'read': Permission.READ_OWN_PROFILE,
        'update': Permission.UPDATE_OWN_PROFILE,
      },
      'users': {
        'read': Permission.READ_ALL_USERS,
        'create': Permission.MANAGE_USERS,
        'update': Permission.MANAGE_USERS,
        'delete': Permission.MANAGE_USERS,
      },
      'referrals': {
        'read': Permission.READ_OWN_REFERRALS,
        'create': Permission.CREATE_REFERRAL,
        'update': Permission.UPDATE_OWN_REFERRALS,
      },
      'commissions': {
        'read': Permission.READ_OWN_COMMISSIONS,
        'approve': Permission.APPROVE_COMMISSIONS,
      },
      'payouts': {
        'request': Permission.REQUEST_PAYOUT,
        'process': Permission.PROCESS_PAYOUTS,
      },
      'admin': {
        'access': Permission.ACCESS_ADMIN_PANEL,
      },
    }

    return resourcePermissionMap[resource]?.[action] || null
  }

  clearCache(): void {
    this.permissionCache.clear()
  }
}
```

## 🛡️ Authorization Middleware

### Express Middleware

```typescript
// src/middleware/rbac.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { RBACService } from '@/services/rbac.service'
import { Permission } from '@/types/permissions'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const requirePermission = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
    }

    const rbacService = new RBACService()
    const hasPermission = rbacService.hasPermission(req.user.role as any, permission)

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
          required: permission,
        },
      })
    }

    next()
  }
}

export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
    }

    const rbacService = new RBACService()
    const hasPermission = rbacService.hasAnyPermission(req.user.role as any, permissions)

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
          required: permissions,
        },
      })
    }

    next()
  }
}

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient role',
          required: role,
        },
      })
    }

    next()
  }
}

export const requireMinRole = (minRole: string) => {
  const roleLevels = {
    'affiliate': 1,
    'trainer': 2,
    'reseller': 2,
    'super_affiliate': 3,
    'admin': 4,
    'super_admin': 5,
  }

  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      })
    }

    const userLevel = roleLevels[req.user.role as keyof typeof roleLevels]
    const requiredLevel = roleLevels[minRole as keyof typeof roleLevels]

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient role level',
          required: minRole,
        },
      })
    }

    next()
  }
}
```

### React Component Protection

```typescript
// src/components/auth/ProtectedComponent.tsx
import React from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { RBACService } from '@/services/rbac.service'
import { Permission } from '@/types/permissions'

interface ProtectedComponentProps {
  permission?: Permission
  permissions?: Permission[]
  role?: string
  minRole?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  permission,
  permissions,
  role,
  minRole,
  fallback = null,
  children,
}) => {
  const { user } = useAuthStore()

  if (!user) {
    return <>{fallback}</>
  }

  const rbacService = new RBACService()

  // Check specific permission
  if (permission && !rbacService.hasPermission(user.role as any, permission)) {
    return <>{fallback}</>
  }

  // Check any of multiple permissions
  if (permissions && !rbacService.hasAnyPermission(user.role as any, permissions)) {
    return <>{fallback}</>
  }

  // Check specific role
  if (role && user.role !== role) {
    return <>{fallback}</>
  }

  // Check minimum role level
  if (minRole) {
    const roleLevels = {
      'affiliate': 1,
      'trainer': 2,
      'reseller': 2,
      'super_affiliate': 3,
      'admin': 4,
      'super_admin': 5,
    }

    const userLevel = roleLevels[user.role as keyof typeof roleLevels]
    const requiredLevel = roleLevels[minRole as keyof typeof roleLevels]

    if (userLevel < requiredLevel) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// Hook for checking permissions in components
export const usePermission = (permission: Permission) => {
  const { user } = useAuthStore()
  const rbacService = new RBACService()

  return user ? rbacService.hasPermission(user.role as any, permission) : false
}

export const usePermissions = (permissions: Permission[]) => {
  const { user } = useAuthStore()
  const rbacService = new RBACService()

  return user ? rbacService.hasAnyPermission(user.role as any, permissions) : false
}
```

## 🎛️ Admin Panel Features

### Dashboard Overview

```typescript
// src/pages/admin/Dashboard.tsx
import React from 'react'
import { ProtectedComponent } from '@/components/auth/ProtectedComponent'
import { Permission } from '@/types/permissions'
import { AdminStats } from '@/components/admin/AdminStats'
import { SystemHealth } from '@/components/admin/SystemHealth'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { QuickActions } from '@/components/admin/QuickActions'

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <ProtectedComponent permission={Permission.MANAGE_SYSTEM}>
          <QuickActions />
        </ProtectedComponent>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProtectedComponent permission={Permission.VIEW_ANALYTICS}>
            <AdminStats />
          </ProtectedComponent>
          
          <ProtectedComponent permission={Permission.READ_ALL_USERS}>
            <RecentActivity />
          </ProtectedComponent>
        </div>

        <div className="space-y-6">
          <ProtectedComponent permission={Permission.MANAGE_SYSTEM}>
            <SystemHealth />
          </ProtectedComponent>
        </div>
      </div>
    </div>
  )
}
```

### User Management

```typescript
// src/pages/admin/UserManagement.tsx
import React, { useState } from 'react'
import { ProtectedComponent } from '@/components/auth/ProtectedComponent'
import { Permission } from '@/types/permissions'
import { UserList } from '@/components/admin/UserList'
import { UserForm } from '@/components/admin/UserForm'
import { RoleManagement } from '@/components/admin/RoleManagement'

export const UserManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showRoleManagement, setShowRoleManagement] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="space-x-2">
          <ProtectedComponent permission={Permission.MANAGE_ADMINS}>
            <button
              onClick={() => setShowRoleManagement(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Manage Roles
            </button>
          </ProtectedComponent>
          
          <ProtectedComponent permission={Permission.MANAGE_USERS}>
            <button
              onClick={() => setSelectedUser('new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add User
            </button>
          </ProtectedComponent>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProtectedComponent permission={Permission.READ_ALL_USERS}>
            <UserList onSelectUser={setSelectedUser} />
          </ProtectedComponent>
        </div>

        <div>
          {selectedUser && (
            <ProtectedComponent permission={Permission.MANAGE_USERS}>
              <UserForm 
                userId={selectedUser} 
                onClose={() => setSelectedUser(null)} 
              />
            </ProtectedComponent>
          )}
        </div>
      </div>

      {showRoleManagement && (
        <ProtectedComponent permission={Permission.MANAGE_ADMINS}>
          <RoleManagement onClose={() => setShowRoleManagement(false)} />
        </ProtectedComponent>
      )}
    </div>
  )
}
```

### Commission Management

```typescript
// src/pages/admin/CommissionManagement.tsx
import React from 'react'
import { ProtectedComponent } from '@/components/auth/ProtectedComponent'
import { Permission } from '@/types/permissions'
import { CommissionQueue } from '@/components/admin/CommissionQueue'
import { PayoutProcessing } from '@/components/admin/PayoutProcessing'
import { CommissionAnalytics } from '@/components/admin/CommissionAnalytics'

export const CommissionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProtectedComponent permission={Permission.APPROVE_COMMISSIONS}>
          <CommissionQueue />
        </ProtectedComponent>

        <ProtectedComponent permission={Permission.PROCESS_PAYOUTS}>
          <PayoutProcessing />
        </ProtectedComponent>
      </div>

      <ProtectedComponent permission={Permission.VIEW_ANALYTICS}>
        <CommissionAnalytics />
      </ProtectedComponent>
    </div>
  )
}
```

## 📊 Admin Analytics

### System Analytics Dashboard

```typescript
// src/components/admin/SystemAnalytics.tsx
import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number; affiliates: number }>
  commissionTrends: Array<{ date: string; amount: number; count: number }>
  referralConversion: Array<{ month: string; rate: number; total: number }>
  systemPerformance: Array<{ metric: string; value: number; threshold: number }>
}

export const SystemAnalytics: React.FC = () => {
  const [data, setData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!data) {
    return <div>Failed to load analytics</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="affiliates" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Commission Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Commission Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.commissionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Referral Conversion Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.referralConversion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* System Performance */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">System Performance</h3>
        <div className="space-y-4">
          {data.systemPerformance.map((metric) => (
            <div key={metric.metric} className="flex items-center justify-between">
              <span className="font-medium">{metric.metric}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.value > metric.threshold ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(metric.value / metric.threshold) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {metric.value} / {metric.threshold}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 🔧 Admin API Endpoints

### Admin Controllers

```typescript
// src/controllers/admin/user.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AdminGuard } from '@/guards/admin.guard'
import { PermissionGuard } from '@/guards/permission.guard'
import { RequirePermission } from '@/decorators/require-permission.decorator'
import { Permission } from '@/types/permissions'
import { UserService } from '@/services/user.service'

@Controller('admin/users')
@UseGuards(AdminGuard)
export class AdminUserController {
  constructor(private userService: UserService) {}

  @Get()
  @RequirePermission(Permission.READ_ALL_USERS)
  async getUsers(@Query() query: any) {
    return this.userService.getUsers(query)
  }

  @Post()
  @RequirePermission(Permission.MANAGE_USERS)
  async createUser(@Body() userData: any) {
    return this.userService.createUser(userData)
  }

  @Put(':id')
  @RequirePermission(Permission.MANAGE_USERS)
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return this.userService.updateUser(id, userData)
  }

  @Delete(':id')
  @RequirePermission(Permission.MANAGE_USERS)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id)
  }

  @Put(':id/role')
  @RequirePermission(Permission.MANAGE_ADMINS)
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.userService.updateUserRole(id, role)
  }

  @Post(':id/deactivate')
  @RequirePermission(Permission.MANAGE_USERS)
  async deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(id)
  }

  @Post(':id/activate')
  @RequirePermission(Permission.MANAGE_USERS)
  async activateUser(@Param('id') id: string) {
    return this.userService.activateUser(id)
  }
}
```

### Commission Management API

```typescript
// src/controllers/admin/commission.controller.ts
import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AdminGuard } from '@/guards/admin.guard'
import { RequirePermission } from '@/decorators/require-permission.decorator'
import { Permission } from '@/types/permissions'
import { CommissionService } from '@/services/commission.service'

@Controller('admin/commissions')
@UseGuards(AdminGuard)
export class AdminCommissionController {
  constructor(private commissionService: CommissionService) {}

  @Get('pending')
  @RequirePermission(Permission.APPROVE_COMMISSIONS)
  async getPendingCommissions(@Query() query: any) {
    return this.commissionService.getPendingCommissions(query)
  }

  @Put(':id/approve')
  @RequirePermission(Permission.APPROVE_COMMISSIONS)
  async approveCommission(@Param('id') id: string) {
    return this.commissionService.approveCommission(id)
  }

  @Put(':id/reject')
  @RequirePermission(Permission.APPROVE_COMMISSIONS)
  async rejectCommission(@Param('id') id: string, @Body('reason') reason: string) {
    return this.commissionService.rejectCommission(id, reason)
  }

  @Post('batch-approve')
  @RequirePermission(Permission.APPROVE_COMMISSIONS)
  async batchApproveCommissions(@Body('commissionIds') commissionIds: string[]) {
    return this.commissionService.batchApproveCommissions(commissionIds)
  }

  @Get('analytics')
  @RequirePermission(Permission.VIEW_ANALYTICS)
  async getCommissionAnalytics(@Query() query: any) {
    return this.commissionService.getAnalytics(query)
  }
}
```

## 📋 Permission Matrix

### Access Control Matrix

| Feature | Affiliate | Trainer | Reseller | Super Affiliate | Admin | Super Admin |
|---------|----------|---------|----------|----------------|-------|-------------|
| **Profile Management** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Create Referrals** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Own Commissions** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Request Payouts** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Access Training** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Download Certificates** | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Marketing Materials** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Team Management** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Team Analytics** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Bulk Operations** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **View All Users** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Manage Users** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Approve Commissions** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Process Payouts** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **System Analytics** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Admin Panel Access** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **System Configuration** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Manage Admins** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Emergency Controls** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### Resource-Action Mapping

| Resource | Create | Read | Update | Delete | Execute |
|----------|--------|------|--------|--------|---------|
| **Profile** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Users** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **All Users** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Referrals** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **All Referrals** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Commissions** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Commission Approval** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Payouts** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Payout Processing** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Analytics** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Admin Panel** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **System Config** | ❌ | ❌ | ❌ | ❌ | ❌ |

---

**Next**: [Incident Runbook](./incident-runbook.md) → Operational procedures documentation
