import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-ZW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(number: number): string {
  return new Intl.NumberFormat('en-ZW').format(number)
}

export function generateWhatsAppMessage(message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/263780808358?text=${encoded}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
