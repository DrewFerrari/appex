import { Bell, Search, User } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import ThemeToggle from "../ThemeToggle"

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between px-8 border-b border-border-default bg-background-secondary">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <Input
                    placeholder="Search analytics, leads, resources..."
                    className="pl-10 bg-background-tertiary border-none"
                />
            </div>

            <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-status-error" />
                </Button>

                <div className="h-8 w-[1px] bg-border-default mx-2" />

                <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-text-primary">Tendai Ncube</p>
                        <p className="text-xs text-text-muted italic">Gold Tier Partner</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-background-tertiary border border-border-default flex items-center justify-center">
                        <User size={20} className="text-text-muted" />
                    </div>
                </div>
            </div>
        </header>
    )
}
