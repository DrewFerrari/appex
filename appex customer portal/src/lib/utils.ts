import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: 'USD' | 'ZiG' | 'ZAR' = 'USD'): string {
  if (currency === 'ZiG') {
    return `ZiG ${amount.toLocaleString('en-ZW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatter = new Intl.NumberFormat('en-ZW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  })
  return formatter.format(amount)
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-ZW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('en-ZW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `RCP-${timestamp}-${random}`
}

export function validateZimbabwePhone(phone: string): boolean {
  // Zimbabwe phone numbers: +263 or 263 followed by 7-9 digits
  const zimPhoneRegex = /^(\+263|263)?[71]\d{7}$/
  return zimPhoneRegex.test(phone.replace(/\s/g, ''))
}

export function formatZimbabwePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('263')) {
    return `+263 ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`
  }
  if (cleaned.length === 9) {
    return `+263 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`
  }
  return phone
}

export function calculateVAT(amount: number, rate: number = 15): number {
  return (amount * rate) / 100
}

export function calculateVATInclusive(amount: number, rate: number = 15): number {
  return amount * (1 + rate / 100)
}

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Escape quotes and commas if needed
        const escaped = ('' + value).replace(/"/g, '""')
        return `"${escaped}"`
      }).join(',')
    )
  ]

  const csvString = csvRows.join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return parseFloat(((current - previous) / previous * 100).toFixed(1))
}

export function getTotalStock(product: any): number {
  if (!product || !product.stockLevels) return 0
  return (product.stockLevels || []).reduce((sum: number, level: any) => sum + level.quantity, 0)
}

export function isLowStock(product: any): boolean {
  if (!product) return false
  const total = getTotalStock(product)
  return total <= (product.reorderLevel || 10)
}
