# State Management Architecture

## 📋 Overview

The AppEx Affiliation Portal uses a hybrid state management approach combining TanStack Query for server state and Zustand for client state. This architecture provides optimal performance, type safety, and developer experience while maintaining clear separation of concerns.

## 🏗️ State Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend State Layer                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   Server State  │    │  Client State   │    │  Form State     │ │
│  │                 │    │                 │    │                 │ │
│  │ TanStack Query  │    │    Zustand      │    │ React Hook Form │ │
│  │                 │    │                 │    │                 │ │
│  │ • Caching       │    │ • UI State      │    │ • Validation    │ │
│  │ • Syncing       │    │ • User Session  │    │ • Field Values  │ │
│  │ • Optimistic    │    │ • Modals        │    │ • Errors        │ │
│  │   Updates       │    │ • Theme         │    │ • Submission    │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔌 TanStack Query Configuration

### Query Client Setup

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && 'status' in error && typeof error.status === 'number') {
          if (error.status >= 400 && error.status < 500) return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        // Global error handling for mutations
        console.error('Mutation error:', error)
      },
    },
  },
})
```

### Query Key Convention

```typescript
// src/lib/query-keys.ts
export const queryKeys = {
  // User-related queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    settings: () => [...queryKeys.user.all, 'settings'] as const,
  },
  
  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
    earnings: (period?: string) => [...queryKeys.dashboard.all, 'earnings', period] as const,
    referrals: (status?: string) => [...queryKeys.dashboard.all, 'referrals', status] as const,
  },
  
  // Referral queries
  referrals: {
    all: ['referrals'] as const,
    list: (filters?: ReferralFilters) => [...queryKeys.referrals.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.referrals.all, 'detail', id] as const,
    stats: () => [...queryKeys.referrals.all, 'stats'] as const,
  },
  
  // Commission queries
  commissions: {
    all: ['commissions'] as const,
    list: (filters?: CommissionFilters) => [...queryKeys.commissions.all, 'list', filters] as const,
    summary: (period?: string) => [...queryKeys.commissions.all, 'summary', period] as const,
    payout: (id?: string) => [...queryKeys.commissions.all, 'payout', id] as const,
  },
  
  // Training queries
  training: {
    all: ['training'] as const,
    courses: () => [...queryKeys.training.all, 'courses'] as const,
    progress: (courseId: string) => [...queryKeys.training.all, 'progress', courseId] as const,
    certificates: () => [...queryKeys.training.all, 'certificates'] as const,
  },
  
  // Marketing queries
  marketing: {
    all: ['marketing'] as const,
    materials: (type?: string) => [...queryKeys.marketing.all, 'materials', type] as const,
    links: () => [...queryKeys.marketing.all, 'links'] as const,
    campaigns: () => [...queryKeys.marketing.all, 'campaigns'] as const,
  },
} as const
```

### API Hooks Implementation

```typescript
// src/hooks/api/use-dashboard.ts
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'
import { queryKeys } from '@/lib/query-keys'

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: dashboardApi.getOverview,
    select: (data) => ({
      ...data,
      // Transform data for UI consumption
      conversionRate: data.totalReferrals > 0 
        ? data.convertedReferrals / data.totalReferrals 
        : 0,
      monthlyGrowth: calculateMonthlyGrowth(data.earningsChart),
    }),
  })
}

export const useEarningsChart = (period: 'week' | 'month' | 'year' = 'month') => {
  return useQuery({
    queryKey: queryKeys.dashboard.earnings(period),
    queryFn: () => dashboardApi.getEarningsChart(period),
    staleTime: 2 * 60 * 1000, // 2 minutes for financial data
  })
}
```

### Optimistic Updates Pattern

```typescript
// src/hooks/api/use-referrals.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { referralsApi } from '@/lib/api/referrals'
import { queryKeys } from '@/lib/query-keys'

export const useCreateReferral = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: referralsApi.create,
    onMutate: async (newReferral) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.referrals.list() })
      
      // Snapshot the previous value
      const previousReferrals = queryClient.getQueryData(queryKeys.referrals.list())
      
      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.referrals.list(), (old: any) => ({
        ...old,
        referrals: [
          {
            ...newReferral,
            id: `temp-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
          ...(old?.referrals || []),
        ],
        pagination: {
          ...old?.pagination,
          total: (old?.pagination?.total || 0) + 1,
        },
      }))
      
      return { previousReferrals }
    },
    onError: (err, newReferral, context) => {
      // Rollback on error
      if (context?.previousReferrals) {
        queryClient.setQueryData(queryKeys.referrals.list(), context.previousReferrals)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.referrals.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() })
    },
  })
}
```

## 🗃️ Zustand Store Architecture

### Store Structure

```typescript
// src/stores/index.ts
import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Auth Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // State
          user: null,
          isAuthenticated: false,
          tokens: null,
          isLoading: false,
          
          // Actions
          login: (userData, tokens) => set((state) => {
            state.user = userData
            state.isAuthenticated = true
            state.tokens = tokens
            state.isLoading = false
          }),
          
          logout: () => set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.tokens = null
            state.isLoading = false
          }),
          
          updateTokens: (tokens) => set((state) => {
            state.tokens = tokens
          }),
          
          setLoading: (loading) => set((state) => {
            state.isLoading = loading
          }),
        }))
      ),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          tokens: state.tokens,
        }),
      }
    ),
    { name: 'auth-store' }
  )
)

// UI Store
export const useUIStore = create<UIState>()(
  devtools(
    immer((set) => ({
      // State
      sidebarOpen: true,
      theme: 'light',
      notifications: [],
      modals: {
        referral: false,
        payout: false,
        profile: false,
      },
      
      // Actions
      toggleSidebar: () => set((state) => {
        state.sidebarOpen = !state.sidebarOpen
      }),
      
      setTheme: (theme: 'light' | 'dark') => set((state) => {
        state.theme = theme
      }),
      
      addNotification: (notification) => set((state) => {
        state.notifications.push({
          ...notification,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        })
      }),
      
      removeNotification: (id: string) => set((state) => {
        state.notifications = state.notifications.filter(n => n.id !== id)
      }),
      
      openModal: (modal: keyof UIState['modals']) => set((state) => {
        state.modals[modal] = true
      }),
      
      closeModal: (modal: keyof UIState['modals']) => set((state) => {
        state.modals[modal] = false
      }),
    })),
    { name: 'ui-store' }
  )
)

// Form Store (for multi-step forms)
export const useFormStore = create<FormState>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        currentStep: 1,
        formData: {},
        completedSteps: new Set(),
        isDirty: false,
        
        // Actions
        setCurrentStep: (step: number) => set((state) => {
          state.currentStep = step
        }),
        
        updateFormData: (data: Partial<any>) => set((state) => {
          state.formData = { ...state.formData, ...data }
          state.isDirty = true
        }),
        
        markStepCompleted: (step: number) => set((state) => {
          state.completedSteps.add(step)
        }),
        
        resetForm: () => set((state) => {
          state.currentStep = 1
          state.formData = {}
          state.completedSteps.clear()
          state.isDirty = false
        }),
      })),
      {
        name: 'form-storage',
        partialize: (state) => ({
          currentStep: state.currentStep,
          formData: state.formData,
          completedSteps: Array.from(state.completedSteps),
        }),
      }
    ),
    { name: 'form-store' }
  )
)
```

### Type Definitions

```typescript
// src/types/store.ts
import { User, TokenPair } from '@/types/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  tokens: TokenPair | null
  isLoading: boolean
  login: (user: User, tokens: TokenPair) => void
  logout: () => void
  updateTokens: (tokens: TokenPair) => void
  setLoading: (loading: boolean) => void
}

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  modals: {
    referral: boolean
    payout: boolean
    profile: boolean
  }
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  openModal: (modal: keyof UIState['modals']) => void
  closeModal: (modal: keyof UIState['modals']) => void
}

interface FormState {
  currentStep: number
  formData: Record<string, any>
  completedSteps: Set<number>
  isDirty: boolean
  setCurrentStep: (step: number) => void
  updateFormData: (data: Partial<any>) => void
  markStepCompleted: (step: number) => void
  resetForm: () => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  autoClose?: boolean
  duration?: number
}
```

## 📝 Form State Management

### React Hook Form Integration

```typescript
// src/components/forms/ReferralForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateReferral } from '@/hooks/api/use-referrals'

const referralSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+263\d{9}$/, 'Invalid Zimbabwe phone number'),
  businessName: z.string().min(1, 'Business name is required'),
  productInterest: z.enum(['pos', 'inventory', 'payroll', 'all']),
  notes: z.string().max(500, 'Notes too long').optional(),
})

type ReferralFormData = z.infer<typeof referralSchema>

export const ReferralForm = () => {
  const createReferral = useCreateReferral()
  const { openModal, closeModal } = useUIStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      productInterest: 'all',
    },
  })
  
  const onSubmit = async (data: ReferralFormData) => {
    try {
      await createReferral.mutateAsync(data)
      reset()
      closeModal('referral')
      openModal('success')
    } catch (error) {
      if (error.response?.data?.errors) {
        // Set field errors from API response
        error.response.data.errors.forEach((fieldError: any) => {
          setError(fieldError.field, { message: fieldError.message })
        })
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### Multi-Step Form Management

```typescript
// src/components/forms/SignupForm.tsx
import { useFormStore } from '@/stores/form-store'
import { useCreateAffiliate } from '@/hooks/api/use-affiliates'

const steps = [
  { id: 1, title: 'Personal Information', component: PersonalInfoStep },
  { id: 2, title: 'Business Details', component: BusinessDetailsStep },
  { id: 3, title: 'Payment Information', component: PaymentStep },
  { id: 4, title: 'Review & Submit', component: ReviewStep },
]

export const SignupForm = () => {
  const { currentStep, formData, setCurrentStep, updateFormData, markStepCompleted } = useFormStore()
  const createAffiliate = useCreateAffiliate()
  
  const currentStepData = steps[currentStep - 1]
  const CurrentStepComponent = currentStepData.component
  
  const handleNext = async (stepData: any) => {
    updateFormData(stepData)
    markStepCompleted(currentStep)
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit form
      try {
        await createAffiliate.mutateAsync(formData)
        // Handle success
      } catch (error) {
        // Handle error
      }
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  return (
    <div>
      <StepIndicator steps={steps} currentStep={currentStep} />
      <CurrentStepComponent 
        data={formData}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === steps.length}
      />
    </div>
  )
}
```

## 🔄 Data Synchronization Patterns

### Background Refetching

```typescript
// src/hooks/use-realtime-sync.ts
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { useQueryClient } from '@tanstack/react-query'

export const useRealtimeSync = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  const { lastJsonMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL,
    {
      shouldReconnect: () => true,
      reconnectInterval: 3000,
    }
  )
  
  useEffect(() => {
    if (lastJsonMessage) {
      const { type, data } = lastJsonMessage
      
      switch (type) {
        case 'commission_earned':
          // Update dashboard stats
          queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() })
          queryClient.invalidateQueries({ queryKey: queryKeys.commissions.list() })
          break
          
        case 'referral_status_changed':
          // Update referral list
          queryClient.invalidateQueries({ queryKey: queryKeys.referrals.list() })
          break
          
        case 'payout_processed':
          // Update payout history
          queryClient.invalidateQueries({ queryKey: queryKeys.commissions.payout() })
          break
      }
    }
  }, [lastJsonMessage, queryClient])
}
```

### Cache Invalidation Strategy

```typescript
// src/lib/cache-invalidation.ts
import { QueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'

export class CacheInvalidationStrategy {
  constructor(private queryClient: QueryClient) {}
  
  // Invalidate all user-related data
  invalidateUserData() {
    this.queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
    this.queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    this.queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all })
    this.queryClient.invalidateQueries({ queryKey: queryKeys.commissions.all })
  }
  
  // Invalidate financial data
  invalidateFinancialData() {
    this.queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.earnings() })
    this.queryClient.invalidateQueries({ queryKey: queryKeys.commissions.list() })
    this.queryClient.invalidateQueries({ queryKey: queryKeys.commissions.payout() })
  }
  
  // Invalidate referral data
  invalidateReferralData() {
    this.queryClient.invalidateQueries({ queryKey: queryKeys.referrals.all })
    this.queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.referrals() })
  }
  
  // Update specific item in cache
  updateReferralInCache(referralId: string, updates: Partial<Referral>) {
    this.queryClient.setQueriesData(
      { queryKey: queryKeys.referrals.list() },
      (old: any) => {
        if (!old?.referrals) return old
        
        return {
          ...old,
          referrals: old.referrals.map((referral: Referral) =>
            referral.id === referralId ? { ...referral, ...updates } : referral
          ),
        }
      }
    )
  }
}
```

## 🚨 Error Handling & Recovery

### Global Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Clear all queries on error
    const queryClient = new QueryClient()
    queryClient.clear()
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

### Query Error Recovery

```typescript
// src/hooks/use-query-with-retry.ts
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useQueryWithRetry = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  const handleRetry = useCallback((failureCount: number, error: any) => {
    // Don't retry on authentication errors
    if (error?.status === 401) return false
    
    // Don't retry on validation errors
    if (error?.status === 400) return false
    
    // Retry up to 3 times for network errors
    return failureCount < 3
  }, [])
  
  return useQuery({
    queryKey,
    queryFn,
    retry: handleRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}
```

## 📊 Performance Optimizations

### Query Selectors for Data Transformation

```typescript
// src/hooks/use-dashboard-stats.ts
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'
import { queryKeys } from '@/lib/query-keys'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(),
    queryFn: dashboardApi.getOverview,
    select: (data) => ({
      // Transform data for specific UI needs
      stats: {
        totalReferrals: data.totalReferrals,
        conversionRate: data.totalReferrals > 0 
          ? (data.convertedReferrals / data.totalReferrals * 100).toFixed(1)
          : '0',
        monthlyEarnings: data.earningsChart.reduce((sum, item) => sum + item.amount, 0),
        pendingPayouts: data.pendingEarnings,
      },
      chart: {
        data: data.earningsChart.map(item => ({
          ...item,
          formattedAmount: new Intl.NumberFormat('en-ZW', {
            style: 'currency',
            currency: 'USD',
          }).format(item.amount),
        })),
      },
      recentActivity: data.recentActivity.slice(0, 5), // Limit to 5 items
    }),
  })
}
```

### Prefetching Strategy

```typescript
// src/components/DashboardLayout.tsx
import { useEffect } from 'react'
import { queryClient } from '@/lib/query-client'
import { queryKeys } from '@/lib/query-keys'

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Prefetch data that's likely to be needed soon
    const prefetchData = async () => {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.referrals.list(),
        queryFn: referralsApi.getList,
        staleTime: 2 * 60 * 1000,
      })
      
      await queryClient.prefetchQuery({
        queryKey: queryKeys.commissions.summary(),
        queryFn: commissionsApi.getSummary,
        staleTime: 1 * 60 * 1000,
      })
    }
    
    prefetchData()
  }, [])
  
  return <div>{children}</div>
}
```

---

**Next**: [Security Hardening](../security/hardening.md) → Security measures and compliance documentation
