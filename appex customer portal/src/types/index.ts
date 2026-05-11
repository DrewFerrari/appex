// Database types
export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: 'owner' | 'manager' | 'cashier' | 'clerk'
  businessId: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Business {
  id: string
  name: string
  businessType: 'retail' | 'restaurant' | 'hardware' | 'grocery' | 'butchery' | 'service' | 'manufacturing'
  registrationNumber?: string
  vatNumber?: string
  primaryCurrency: 'USD' | 'ZiG' | 'ZAR'
  timezone: string
  settings: Record<string, any>
  subscriptionTier: 'trial' | 'basic' | 'pro' | 'enterprise'
  subscriptionEndsAt?: Date
  createdAt: Date
}

export interface Product {
  id: string
  businessId: string
  sku: string
  name: string
  barcode?: string
  categoryId?: string
  description?: string
  costPriceUSD: number
  sellingPriceUSD: number
  sellingPriceZiG?: number
  reorderLevel: number
  supplierId?: string
  expiryDate?: Date
  isActive: boolean
  images: string[]
  attributes: Record<string, any>
  stockLevels: StockLevel[] // Multi-location stock tracking
  createdAt: Date
  updatedAt: Date
}

export interface StockLevel {
  warehouseId: string
  quantity: number
  updatedAt: Date
}

export interface Warehouse {
  id: string
  businessId: string
  branchId?: string // Optional link to a branch
  name: string
  location: string
  type: 'warehouse' | 'storefront' | 'mobile'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  businessId: string
  name: string
  description?: string
  parentId?: string
  createdAt: Date
}

export interface Customer {
  id: string
  businessId: string
  name: string
  phone: string
  email?: string
  address?: string
  customerType: 'retail' | 'wholesale' | 'corporate'
  creditLimitUSD: number
  currentBalanceUSD: number
  loyaltyPoints: number
  totalSpentUSD: number
  lastPurchaseDate?: Date
  tags: string[]
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Sale {
  id: string
  businessId: string
  receiptNumber: string
  customerId?: string
  subTotalUSD: number
  vatAmountUSD: number
  discountAmountUSD: number
  totalAmountUSD: number
  totalAmountZiG?: number
  paymentMethod: 'cash' | 'ecocash' | 'onemoney' | 'zimswitch' | 'bank_transfer' | 'credit'
  paymentReference?: string
  cashierId: string
  branchId?: string
  status: 'pending' | 'completed' | 'voided' | 'returned'
  isOffline: boolean
  syncStatus: 'pending' | 'synced' | 'failed'
  notes?: string
  createdAt: Date
  items: SaleItem[]
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  quantity: number
  unitPriceUSD: number
  unitPriceZiG?: number
  totalUSD: number
  totalZiG?: number
  discountAmountUSD: number
  createdAt: Date
}

export interface Supplier {
  id: string
  businessId: string
  name: string
  phone: string
  email?: string
  address?: string
  paymentTerms: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrder {
  id: string
  businessId: string
  supplierId: string
  orderNumber: string
  status: 'draft' | 'sent' | 'partial' | 'received' | 'cancelled'
  items: PurchaseOrderItem[]
  totalUSD: number
  expectedDeliveryDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderItem {
  id: string
  purchaseOrderId: string
  productId: string
  quantity: number
  unitCostUSD: number
  totalUSD: number
  receivedQuantity: number
}

export interface Branch {
  id: string
  businessId: string
  name: string
  phone: string
  email?: string
  address: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Store types
export interface AuthState {
  user: User | null
  token: string | null
  permissions: string[]
  currentBranch: Branch | null
  isAuthenticated: boolean
}

export interface CurrencyState {
  activeCurrency: 'USD' | 'ZiG' | 'ZAR'
  exchangeRates: Record<string, number>
  lastUpdated: Date | null
}

export interface SyncState {
  isOnline: boolean
  syncQueue: SyncOperation[]
  lastSync: Date | null
  syncProgress: number
}

export interface SyncOperation {
  id: string
  entityType: 'sale' | 'product' | 'customer' | 'inventory'
  entityId: string
  operation: 'create' | 'update' | 'delete'
  data: Record<string, any>
  status: 'pending' | 'syncing' | 'completed' | 'failed'
  retryCount: number
  createdAt: Date
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  settings: NotificationSettings
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  lowStock: boolean
  sales: boolean
  customers: boolean
}

// Form types
export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface SaleFormData {
  customerId?: string
  items: CartItem[]
  paymentMethod: Sale['paymentMethod']
  paymentReference?: string
  discountAmountUSD: number
  notes?: string
}

export interface CartItem {
  productId: string
  quantity: number
  unitPriceUSD: number
  unitPriceZiG?: number
  totalUSD: number
  totalZiG?: number
  product: Product
}

export interface CustomerFormData {
  name: string
  phone: string
  email?: string
  address?: string
  customerType: Customer['customerType']
  creditLimitUSD: number
  notes?: string
}

export interface ProductFormData {
  sku: string
  name: string
  barcode?: string
  categoryId?: string
  description?: string
  costPriceUSD: number
  sellingPriceUSD: number
  sellingPriceZiG?: number
  currentStock: number
  reorderLevel: number
  supplierId?: string
  expiryDate?: Date
  images: string[]
  attributes: Record<string, any>
}

// Zimbabwe-specific types
export interface ExchangeRate {
  id: string
  fromCurrency: string
  toCurrency: string
  rate: number
  source: string
  validFrom: Date
  validTo?: Date
  createdAt: Date
}

export interface VATRecord {
  id: string
  businessId: string
  saleId: string
  vatAmountUSD: number
  vatAmountZiG?: number
  vatRate: number
  fiscalReceiptNumber?: string
  isCertificateIssued: boolean
  certificateNumber?: string
  createdAt: Date
}

export interface LoadSheddingSchedule {
  id: string
  region: string
  stage: number
  startTime: string
  endTime: string
  dayOfWeek?: number
  effectiveDate: Date
  expiryDate?: Date
  createdAt: Date
}

export interface EcoCashPayment {
  id: string
  phoneNumber: string
  amount: number
  currency: 'USD' | 'ZiG'
  reference: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

export interface Communication {
  id: string
  customerId?: string
  type: 'email' | 'whatsapp' | 'sms'
  content: string
  status: 'sent' | 'failed' | 'pending'
  createdAt: Date
}
