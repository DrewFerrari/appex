import * as React from "react"
import { Card, CardContent } from "../ui/Card"
import { cn } from "../../utils/cn"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
    label: string
    value: string
    change?: string
    trend?: "up" | "down"
    period?: string
    icon: React.ReactNode
    color?: "blue" | "green" | "purple" | "gold"
    subtitle?: string
    badge?: string
    actionButton?: string
}

export function MetricCard({
    label,
    value,
    change,
    trend,
    period,
    icon,
    color = "blue",
    subtitle,
    badge,
    actionButton,
}: MetricCardProps) {
    const colorMap = {
        blue: "text-accent-blue bg-status-infoBg",
        green: "text-accent-green bg-status-successBg",
        purple: "text-accent-purple bg-status-infoBg", // Adjust if purple bg needed
        gold: "text-accent-gold bg-status-warningBg",
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className={cn("p-2 rounded-lg", colorMap[color])}>
                        {icon}
                    </div>
                    {badge && (
                        <div className="px-2 py-1 text-xs rounded-full bg-background-tertiary text-accent-gold">
                            {badge}
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-text-muted">{label}</p>
                    <div className="flex items-baseline space-x-2">
                        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
                        {change && (
                            <span className={cn(
                                "text-xs font-semibold flex items-center",
                                trend === "up" ? "text-status-success" : "text-status-error"
                            )}>
                                {trend === "up" ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                {change}
                            </span>
                        )}
                    </div>
                    {(period || subtitle) && (
                        <p className="text-xs text-text-disabled mt-1">
                            {period || subtitle}
                        </p>
                    )}
                </div>

                {actionButton && (
                    <button className="mt-4 text-xs font-semibold text-accent-blue hover:text-accent-blueHover transition-colors">
                        {actionButton}
                    </button>
                )}
            </CardContent>
        </Card>
    )
}
