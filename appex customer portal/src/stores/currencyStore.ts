import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CurrencyState } from '@/types'

interface CurrencyStore extends CurrencyState {
  setCurrency: (currency: 'USD' | 'ZiG' | 'ZAR') => void
  updateRates: (rates: Record<string, number>) => void
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeCurrency: 'USD',
      exchangeRates: {
        'USD-ZiG': 14.5,
        'USD-ZAR': 18.5,
        'ZiG-USD': 0.068,
        'ZAR-USD': 0.054,
        'ZAR-ZiG': 0.78,
      },
      lastUpdated: new Date(),

      // Actions
      setCurrency: (currency: 'USD' | 'ZiG' | 'ZAR') =>
        set({
          activeCurrency: currency,
        }),

      updateRates: (rates: Record<string, number>) =>
        set({
          exchangeRates: { ...get().exchangeRates, ...rates },
          lastUpdated: new Date(),
        }),

      convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => {
        const rates = get().exchangeRates
        const key = `${fromCurrency}-${toCurrency}`

        if (fromCurrency === toCurrency) return amount

        if (rates[key]) {
          return amount * rates[key]
        }

        // Try inverse conversion
        const inverseKey = `${toCurrency}-${fromCurrency}`
        if (rates[inverseKey]) {
          return amount / rates[inverseKey]
        }

        // Default to USD as base
        if (fromCurrency === 'USD') {
          const usdToTarget = rates[`USD-${toCurrency}`]
          return usdToTarget ? amount * usdToTarget : amount
        }

        if (toCurrency === 'USD') {
          const targetToUsd = rates[`${fromCurrency}-USD`]
          return targetToUsd ? amount * targetToUsd : amount
        }

        return amount
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({
        activeCurrency: state.activeCurrency,
        exchangeRates: state.exchangeRates,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
)
