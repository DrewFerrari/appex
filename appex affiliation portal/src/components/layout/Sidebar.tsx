import {
    LayoutDashboard,
    Users,
    DollarSign,
    Briefcase,
    GraduationCap,
    MessageCircle,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut
} from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { cn } from "../../utils/cn"
import { Button } from "../ui/Button"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Referrals", href: "/referrals" },
    { icon: DollarSign, label: "Earnings", href: "/earnings" },
    { icon: Briefcase, label: "Marketing Tools", href: "/marketing" },
    { icon: GraduationCap, label: "Training", href: "/training" },
    { icon: MessageCircle, label: "Support", href: "/support" },
    { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className={cn(
            "flex flex-col border-r border-border-default bg-background-secondary transition-all duration-300",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="flex h-16 items-center justify-between px-6 border-b border-border-default">
                {!isCollapsed && (
                    <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                        APPEX PARTNER
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </Button>
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) => cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-background-tertiary",
                            isActive
                                ? "bg-accent-blue text-text-primary"
                                : "text-text-muted hover:text-text-primary"
                        )}
                    >
                        <item.icon size={20} />
                        {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border-default">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-status-error hover:bg-status-errorBg hover:text-status-error",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <LogOut size={20} className={!isCollapsed ? "mr-3" : ""} />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </div>
    )
}
