import { useCurrencyStore } from '@/stores/currencyStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'

export function CurrencySwitcher() {
    const { activeCurrency, setCurrency } = useCurrencyStore()

    const currencies = [
        { code: 'USD', label: '$ USD', color: 'text-accent-green' },
        { code: 'ZiG', label: 'ZiG', color: 'text-accent-gold' },
        { code: 'ZAR', label: 'R ZAR', color: 'text-accent-purple' },
    ] as const

    return (
        <div className="flex items-center gap-1 bg-background-secondary/50 p-1 rounded-lg border border-border-default backdrop-blur-md">
            <div className="px-2 mr-1">
                <Globe className="h-4 w-4 text-text-muted" />
            </div>
            {currencies.map((curr) => (
                <Button
                    key={curr.code}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 text-xs font-bold transition-all",
                        activeCurrency === curr.code
                            ? cn("bg-background-tertiary text-text-primary shadow-sm", curr.color)
                            : "text-text-muted hover:text-text-primary"
                    )}
                    onClick={() => setCurrency(curr.code)}
                >
                    {curr.label}
                </Button>
            ))}
        </div>
    )
}
