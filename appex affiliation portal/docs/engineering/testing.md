# Testing Strategy

## 📋 Overview

The AppEx Affiliation Portal implements a comprehensive testing strategy following the Testing Trophy model. This approach ensures high code quality, reliability, and maintainability while maximizing developer productivity and confidence in deployments.

## 🏆 Testing Trophy Implementation

```
        🔝
      Static
      Analysis
        ▲
     Integration
      Tests
        ▲
    Component
     Tests
        ▲
     Unit Tests
        ▼
    End-to-End
      Tests
```

### Test Coverage Targets

| Test Type | Coverage Target | Tooling | Execution Time |
|-----------|----------------|---------|----------------|
| Unit Tests | 90%+ | Vitest | < 30s |
| Component Tests | 80%+ | Vitest + Testing Library | < 1m |
| Integration Tests | 70%+ | Supertest + Test Database | < 2m |
| E2E Tests | Critical Paths | Playwright | < 5m |
| Static Analysis | 100% | ESLint + TypeScript | < 30s |

## 🔬 Unit Testing

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid'),
    randomBytes: vi.fn(() => Buffer.from('test')),
  },
})
```

### Unit Test Examples

#### Service Layer Tests

```typescript
// src/services/__tests__/commission.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CommissionService } from '../commission.service'
import { CommissionRepository } from '../../repositories/commission.repository'
import { AffiliateRepository } from '../../repositories/affiliate.repository'

describe('CommissionService', () => {
  let commissionService: CommissionService
  let mockCommissionRepository: vi.Mocked<CommissionRepository>
  let mockAffiliateRepository: vi.Mocked<AffiliateRepository>

  beforeEach(() => {
    mockCommissionRepository = {
      create: vi.fn(),
      findByAffiliateId: vi.fn(),
      updateStatus: vi.fn(),
    } as any

    mockAffiliateRepository = {
      findById: vi.fn(),
      updateTier: vi.fn(),
    } as any

    commissionService = new CommissionService(
      mockCommissionRepository,
      mockAffiliateRepository
    )
  })

  describe('calculateCommission', () => {
    it('should calculate commission correctly for POS sale', async () => {
      // Arrange
      const affiliate = {
        id: 'affiliate-1',
        commissionRate: 0.10,
        tier: 'bronze',
      }
      const referral = {
        id: 'referral-1',
        conversionValue: 1500.00,
        product: 'pos',
      }

      mockAffiliateRepository.findById.mockResolvedValue(affiliate)

      // Act
      const commission = await commissionService.calculateCommission(
        referral.id,
        'pos_sale',
        referral.conversionValue
      )

      // Assert
      expect(commission.amount).toBe(150.00)
      expect(commission.rate).toBe(0.10)
      expect(commission.type).toBe('pos_sale')
    })

    it('should apply tier-based commission rates', async () => {
      // Arrange
      const affiliate = {
        id: 'affiliate-1',
        commissionRate: 0.15,
        tier: 'gold',
      }
      const referral = {
        id: 'referral-1',
        conversionValue: 2000.00,
        product: 'pos',
      }

      mockAffiliateRepository.findById.mockResolvedValue(affiliate)

      // Act
      const commission = await commissionService.calculateCommission(
        referral.id,
        'pos_sale',
        referral.conversionValue
      )

      // Assert
      expect(commission.amount).toBe(300.00)
      expect(commission.rate).toBe(0.15)
    })

    it('should throw error for non-existent affiliate', async () => {
      // Arrange
      mockAffiliateRepository.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(
        commissionService.calculateCommission('referral-1', 'pos_sale', 1000)
      ).rejects.toThrow('Affiliate not found')
    })
  })

  describe('createCommission', () => {
    it('should create commission and update affiliate tier', async () => {
      // Arrange
      const commissionData = {
        affiliateId: 'affiliate-1',
        referralId: 'referral-1',
        type: 'pos_sale' as const,
        amount: 150.00,
        rate: 0.10,
      }

      mockCommissionRepository.create.mockResolvedValue({
        id: 'commission-1',
        ...commissionData,
        status: 'pending',
      })

      // Act
      const commission = await commissionService.createCommission(commissionData)

      // Assert
      expect(mockCommissionRepository.create).toHaveBeenCalledWith(commissionData)
      expect(mockAffiliateRepository.updateTier).toHaveBeenCalledWith('affiliate-1')
      expect(commission.id).toBe('commission-1')
    })
  })
})
```

#### Utility Function Tests

```typescript
// src/utils/__tests__/validation.test.ts
import { describe, it, expect } from 'vitest'
import { validateEmail, validatePhone, validatePassword } from '../validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.email+tag@domain.co.zw')).toBe(true)
      expect(validateEmail('user.name@subdomain.example.com')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user..name@domain.com')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should return true for valid Zimbabwe phone numbers', () => {
      expect(validatePhone('+263712345678')).toBe(true)
      expect(validatePhone('+263771234567')).toBe(true)
      expect(validatePhone('+263781234567')).toBe(true)
    })

    it('should return false for invalid phone numbers', () => {
      expect(validatePhone('0712345678')).toBe(false)
      expect(validatePhone('+26371234567')).toBe(false)
      expect(validatePhone('+2637123456789')).toBe(false)
      expect(validatePhone('+27712345678')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should return valid for strong passwords', () => {
      const result = validatePassword('StrongP@ssw0rd!')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return invalid for weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
      expect(result.errors).toContain('Password must contain at least one number')
      expect(result.errors).toContain('Password must contain at least one special character')
    })
  })
})
```

## 🧩 Component Testing

### React Component Tests

```typescript
// src/components/__tests__/ReferralForm.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReferralForm } from '../ReferralForm'
import { useCreateReferral } from '@/hooks/api/use-referrals'

// Mock the hook
vi.mock('@/hooks/api/use-referrals')

describe('ReferralForm', () => {
  let queryClient: QueryClient
  let mockCreateReferral: vi.Mock

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    mockCreateReferral = vi.fn()
    ;(useCreateReferral as vi.Mock).mockReturnValue({
      mutateAsync: mockCreateReferral,
      isPending: false,
    })
  })

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ReferralForm />
      </QueryClientProvider>
    )
  }

  it('should render all form fields', () => {
    renderComponent()

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/product interest/i)).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    renderComponent()

    const submitButton = screen.getByRole('button', { name: /submit referral/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    const user = userEvent.setup()
    renderComponent()

    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab() // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
    })
  })

  it('should validate Zimbabwe phone format', async () => {
    const user = userEvent.setup()
    renderComponent()

    const phoneInput = screen.getByLabelText(/phone/i)
    await user.type(phoneInput, '0712345678')
    await user.tab() // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/invalid zimbabwe phone number/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    mockCreateReferral.mockResolvedValue({ id: 'referral-1' })

    renderComponent()

    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '+263712345678')
    await user.type(screen.getByLabelText(/business name/i), 'John Business')
    
    // Select product interest
    const productSelect = screen.getByLabelText(/product interest/i)
    await user.selectOptions(productSelect, 'pos')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit referral/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockCreateReferral).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+263712345678',
        businessName: 'John Business',
        productInterest: 'pos',
      })
    })
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    ;(useCreateReferral as vi.Mock).mockReturnValue({
      mutateAsync: mockCreateReferral,
      isPending: true,
    })

    renderComponent()

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '+263712345678')
    await user.type(screen.getByLabelText(/business name/i), 'John Business')

    const submitButton = screen.getByRole('button', { name: /submit referral/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/submitting/i)).toBeInTheDocument()
  })
})
```

### Custom Hook Tests

```typescript
// src/hooks/__tests__/use-referrals.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useReferrals } from '../use-referrals'
import { referralsApi } from '@/lib/api/referrals'

// Mock the API
vi.mock('@/lib/api/referrals')

describe('useReferrals', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should fetch referrals successfully', async () => {
    const mockReferrals = {
      referrals: [
        { id: '1', name: 'John Doe', email: 'john@example.com', status: 'pending' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'contacted' },
      ],
      pagination: { page: 1, limit: 20, total: 2, totalPages: 1 },
    }

    ;(referralsApi.getList as vi.Mock).mockResolvedValue(mockReferrals)

    const { result } = renderHook(() => useReferrals(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockReferrals)
    expect(referralsApi.getList).toHaveBeenCalledWith({})
  })

  it('should handle API errors', async () => {
    const error = new Error('Failed to fetch referrals')
    ;(referralsApi.getList as vi.Mock).mockRejectedValue(error)

    const { result } = renderHook(() => useReferrals(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(error)
  })

  it('should refetch when filters change', async () => {
    const mockReferrals = { referrals: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    ;(referralsApi.getList as vi.Mock).mockResolvedValue(mockReferrals)

    const { result, rerender } = renderHook(
      ({ filters }) => useReferrals(filters),
      {
        wrapper,
        initialProps: { filters: {} },
      }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Change filters
    rerender({ filters: { status: 'pending' } })

    await waitFor(() => {
      expect(referralsApi.getList).toHaveBeenCalledWith({ status: 'pending' })
    })
  })
})
```

## 🔗 Integration Testing

### API Integration Tests

```typescript
// src/__tests__/integration/auth.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../test/database'

describe('Authentication API', () => {
  beforeAll(async () => {
    await setupTestDatabase()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create test user
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User',
        })

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
      expect(response.body.data.user.email).toBe('test@example.com')
    })

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.error.code).toBe('UNAUTHORIZED')
    })

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          // Missing password
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('POST /auth/refresh', () => {
    it('should refresh access token', async () => {
      // Login first
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
        })

      const { refreshToken } = loginResponse.body.data

      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeDefined()
    })

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
```

### Database Integration Tests

```typescript
// src/repositories/__tests__/affiliate.repository.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { AffiliateRepository } from '../affiliate.repository'
import { setupTestDatabase, teardownTestDatabase, clearTestDatabase } from '../../test/database'

describe('AffiliateRepository', () => {
  let repository: AffiliateRepository

  beforeAll(async () => {
    await setupTestDatabase()
    repository = new AffiliateRepository()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    await clearTestDatabase()
  })

  describe('create', () => {
    it('should create affiliate with valid data', async () => {
      const affiliateData = {
        userId: 'user-1',
        affiliateCode: 'TEST123',
        firstName: 'John',
        lastName: 'Doe',
        affiliateType: 'trainer' as const,
        commissionRate: 0.10,
      }

      const affiliate = await repository.create(affiliateData)

      expect(affiliate.id).toBeDefined()
      expect(affiliate.userId).toBe(affiliateData.userId)
      expect(affiliate.affiliateCode).toBe(affiliateData.affiliateCode)
      expect(affiliate.firstName).toBe(affiliateData.firstName)
      expect(affiliate.lastName).toBe(affiliateData.lastName)
      expect(affiliate.affiliateType).toBe(affiliateData.affiliateType)
      expect(affiliate.commissionRate).toBe(affiliateData.commissionRate)
    })

    it('should enforce unique affiliate code', async () => {
      const affiliateData = {
        userId: 'user-1',
        affiliateCode: 'DUPLICATE',
        firstName: 'John',
        lastName: 'Doe',
        affiliateType: 'trainer' as const,
        commissionRate: 0.10,
      }

      await repository.create(affiliateData)

      await expect(
        repository.create({
          ...affiliateData,
          userId: 'user-2',
        })
      ).rejects.toThrow('duplicate key value violates unique constraint')
    })
  })

  describe('findByAffiliateCode', () => {
    it('should find affiliate by code', async () => {
      const affiliateData = {
        userId: 'user-1',
        affiliateCode: 'FINDME',
        firstName: 'John',
        lastName: 'Doe',
        affiliateType: 'trainer' as const,
        commissionRate: 0.10,
      }

      await repository.create(affiliateData)

      const affiliate = await repository.findByAffiliateCode('FINDME')

      expect(affiliate).toBeDefined()
      expect(affiliate!.affiliateCode).toBe('FINDME')
    })

    it('should return null for non-existent code', async () => {
      const affiliate = await repository.findByAffiliateCode('NONEXISTENT')
      expect(affiliate).toBeNull()
    })
  })
})
```

## 🎭 End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run test:e2e:server',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Examples

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should login with valid credentials', async ({ page }) => {
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'trainer@demo.appex.co.zw')
    await page.fill('[data-testid="password-input"]', 'demo123')
    await page.click('[data-testid="login-button"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill login form with invalid credentials
    await page.fill('[data-testid="email-input"]', 'invalid@example.com')
    await page.fill('[data-testid="password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-button"]')

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid email or password')
  })

  test('should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')

    // Should show validation error
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test('should allow password reset', async ({ page }) => {
    // Click forgot password link
    await page.click('[data-testid="forgot-password-link"]')

    // Should navigate to reset password page
    await expect(page).toHaveURL('/forgot-password')
    await expect(page.locator('[data-testid="reset-password-form"]')).toBeVisible()

    // Fill reset form
    await page.fill('[data-testid="email-input"]', 'trainer@demo.appex.co.zw')
    await page.click('[data-testid="send-reset-button"]')

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })
})
```

```typescript
// e2e/referral.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Referral Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'trainer@demo.appex.co.zw')
    await page.fill('[data-testid="password-input"]', 'demo123')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should create new referral', async ({ page }) => {
    // Navigate to referrals page
    await page.click('[data-testid="referrals-nav"]')
    await expect(page).toHaveURL('/referrals')

    // Click create referral button
    await page.click('[data-testid="create-referral-button"]')

    // Fill referral form
    await page.fill('[data-testid="referral-name"]', 'John Doe')
    await page.fill('[data-testid="referral-email"]', 'john@example.com')
    await page.fill('[data-testid="referral-phone"]', '+263712345678')
    await page.fill('[data-testid="referral-business"]', 'John Business')
    await page.selectOption('[data-testid="referral-product"]', 'pos')

    // Submit form
    await page.click('[data-testid="submit-referral-button"]')

    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Referral created successfully')

    // Should redirect to referrals list
    await expect(page).toHaveURL('/referrals')

    // Should show new referral in list
    await expect(page.locator('[data-testid="referral-list"]')).toContainText('John Doe')
    await expect(page.locator('[data-testid="referral-list"]')).toContainText('john@example.com')
  })

  test('should validate referral form', async ({ page }) => {
    // Navigate to create referral page
    await page.click('[data-testid="referrals-nav"]')
    await page.click('[data-testid="create-referral-button"]')

    // Submit empty form
    await page.click('[data-testid="submit-referral-button"]')

    // Should show validation errors
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="phone-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="business-error"]')).toBeVisible()
  })

  test('should filter referrals by status', async ({ page }) => {
    // Navigate to referrals page
    await page.click('[data-testid="referrals-nav"]')

    // Filter by status
    await page.selectOption('[data-testid="status-filter"]', 'pending')

    // Should show only pending referrals
    const referrals = page.locator('[data-testid="referral-item"]')
    const count = await referrals.count()
    
    for (let i = 0; i < count; i++) {
      await expect(referrals.nth(i)).toContainText('pending')
    }
  })
})
```

## 📧 Email Testing with Mailpit

### Test Configuration

```typescript
// src/test/email.ts
import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'

export class TestEmailServer {
  private server: SMTPServer
  private emails: any[] = []

  constructor() {
    this.server = new SMTPServer({
      authOptional: true,
      onData: async (stream, session, callback) => {
        try {
          const parsed = await simpleParser(stream)
          this.emails.push({
            ...parsed,
            envelope: session.envelope,
          })
          callback()
        } catch (error) {
          callback(error)
        }
      },
    })
  }

  async start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server.listen(0, (err, address) => {
        if (err) reject(err)
        else resolve(address!.port)
      })
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => resolve())
    })
  }

  getEmails(): any[] {
    return this.emails
  }

  clearEmails(): void {
    this.emails = []
  }

  getEmailByRecipient(email: string): any | undefined {
    return this.emails.find(e => 
      e.to?.some((recipient: any) => recipient.address === email)
    )
  }
}
```

### Email Integration Tests

```typescript
// src/services/__tests__/email.service.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EmailService } from '../email.service'
import { TestEmailServer } from '../../test/email'

describe('EmailService', () => {
  let emailService: EmailService
  let testServer: TestEmailServer

  beforeEach(async () => {
    testServer = new TestEmailServer()
    const port = await testServer.start()
    
    emailService = new EmailService({
      host: 'localhost',
      port,
      secure: false,
    })
  })

  afterEach(async () => {
    await testServer.stop()
  })

  describe('sendVerificationEmail', () => {
    it('should send verification email', async () => {
      await emailService.sendVerificationEmail({
        to: 'test@example.com',
        name: 'Test User',
        code: '123456',
      })

      const emails = testServer.getEmails()
      expect(emails).toHaveLength(1)

      const email = emails[0]
      expect(email.subject).toBe('Verify your email address')
      expect(email.to).toEqual([{ address: 'test@example.com', name: 'Test User' }])
      expect(email.text).toContain('123456')
      expect(email.html).toContain('123456')
    })

    it('should handle email sending failure', async () => {
      // Stop server to simulate failure
      await testServer.stop()

      await expect(
        emailService.sendVerificationEmail({
          to: 'test@example.com',
          name: 'Test User',
          code: '123456',
        })
      ).rejects.toThrow('connect ECONNREFUSED')
    })
  })
})
```

## 🎯 Test Data Management

### Factory Pattern for Test Data

```typescript
// src/test/factories/affiliate.factory.ts
import { faker } from '@faker-js/faker'
import { Affiliate, CreateAffiliateDto } from '@/types'

export class AffiliateFactory {
  static create(overrides: Partial<CreateAffiliateDto> = {}): CreateAffisherDto {
    return {
      userId: faker.string.uuid(),
      affiliateCode: faker.helpers.replaceSymbolWithNumber('???###'),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      affiliateType: faker.helpers.arrayElement(['trainer', 'reseller']),
      commissionRate: faker.number.float({ min: 0.05, max: 0.20, fractionDigits: 4 }),
      ...overrides,
    }
  }

  static createMany(count: number, overrides: Partial<CreateAffiliateDto> = {}): CreateAffiliateDto[] {
    return Array.from({ length: count }, () => this.create(overrides))
  }

  static createWithDatabase(overrides: Partial<CreateAffiliateDto> = {}): Promise<Affiliate> {
    const data = this.create(overrides)
    return AffiliateRepository.create(data)
  }
}
```

### Database Test Utilities

```typescript
// src/test/database.ts
import { Pool } from 'pg'
import { migrate } from 'drizzle-node/postgres-js/migrator'
import { drizzle } from 'drizzle-node/postgres-js'
import * as schema from '../schema'

const testDb = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
})

export async function setupTestDatabase(): Promise<void> {
  const db = drizzle(testDb, { schema })
  
  // Run migrations
  await migrate(db, { migrationsFolder: './drizzle' })
}

export async function teardownTestDatabase(): Promise<void> {
  await testDb.end()
}

export async function clearTestDatabase(): Promise<void> {
  const db = drizzle(testDb, { schema })
  
  // Clear all tables in correct order (respecting foreign keys)
  const tables = [
    schema.auditLogs,
    schema.backgroundJobs,
    schema.userSessions,
    schema.certificates,
    schema.courseProgress,
    schema.commissions,
    schema.payouts,
    schema.referrals,
    schema.affiliates,
    schema.users,
  ]

  for (const table of tables) {
    await db.delete(table)
  }
}
```

## 📊 Test Reporting & Coverage

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: |
            test-results/
            coverage/
```

### Coverage Configuration

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run src",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

---

**Next**: [Error Handling](./error-handling.md) → Error management patterns documentation
