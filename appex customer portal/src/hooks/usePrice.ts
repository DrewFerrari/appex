import { useCurrencyStore } from '@/stores/currencyStore'
import { formatCurrency } from '@/lib/utils'

export function usePrice() {
    const { activeCurrency, convertAmount } = useCurrencyStore()

    /**
     * Converts a USD amount to the active currency and formats it.
     * @param amountUSD - The amount in USD
     * @returns Formatted currency string
     */
    const formatPrice = (amountUSD: number) => {
        const converted = convertAmount(amountUSD, 'USD', activeCurrency)
        return formatCurrency(converted, activeCurrency)
    }

    /**
     * Returns the converted raw number for calculations
     */
    const convert = (amountUSD: number) => {
        return convertAmount(amountUSD, 'USD', activeCurrency)
    }

    return {
        formatPrice,
        convert,
        activeCurrency
    }
}
