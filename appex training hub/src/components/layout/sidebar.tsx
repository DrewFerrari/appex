"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Award,
  Users,
  HelpCircle,
  Settings,
  ChevronDown,
  ChevronRight,
  Store,
  Utensils,
  Wrench,
  ShoppingCart,
  Pill,
  Beef
} from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavItem[]
}

const solutionsNavigation = [
  {
    name: "Retail Management",
    href: "/solutions-training/retail-management",
    icon: Store
  },
  {
    name: "Restaurant Management", 
    href: "/solutions-training/restaurant-management",
    icon: Utensils
  },
  {
    name: "Hardware Store",
    href: "/solutions-training/hardware-store",
    icon: Wrench
  },
  {
    name: "Grocery Store",
    href: "/solutions-training/grocery-store",
    icon: ShoppingCart
  },
  {
    name: "Pharmacy",
    href: "/solutions-training/pharmacy",
    icon: Pill
  },
  {
    name: "Butchery",
    href: "/solutions-training/butchery",
    icon: Beef
  }
]

const mainNavigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "My Learning",
    href: "/my-learning",
    icon: BookOpen,
    children: [
      { name: "All Courses", href: "/my-learning/all-courses", icon: GraduationCap },
      { name: "My Enrolled", href: "/my-learning/enrolled", icon: BookOpen },
      { name: "Completed", href: "/my-learning/completed", icon: Award },
    ]
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: FileText,
    children: [
      { name: "User Guides", href: "/docs/guides", icon: FileText },
      { name: "Quick Reference", href: "/docs/reference", icon: BookOpen },
      { name: "FAQ", href: "/docs/faq", icon: HelpCircle },
      { name: "Troubleshooting", href: "/docs/troubleshooting", icon: Settings },
    ]
  },
  {
    name: "Certifications",
    href: "/certifications",
    icon: Award
  },
  {
    name: "Community",
    href: "/community",
    icon: Users
  },
  {
    name: "Support",
    href: "/support",
    icon: HelpCircle
  }
]

interface SidebarItemProps {
  item: NavItem
  level?: number
}

function SidebarItem({ item, level = 0 }: SidebarItemProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const isActive = pathname === item.href
  const hasChildren = item.children && item.children.length > 0

  const toggleExpanded = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      e.stopPropagation()
      setIsExpanded(!isExpanded)
    }
  }

  const content = (
    <>
      <div className="flex items-center space-x-3">
        <item.icon className="h-4 w-4" />
        <span>{item.name}</span>
      </div>
      {hasChildren && (
        isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )
      )}
    </>
  )

  const itemClassName = cn(
    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
    level > 0 && "ml-4",
    isActive
      ? "bg-emerald-50 text-emerald-700 font-medium"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  )

  return (
    <div className="w-full">
      {hasChildren ? (
        <button
          onClick={toggleExpanded}
          className={itemClassName}
        >
          {content}
        </button>
      ) : (
        <Link href={item.href} className={itemClassName}>
          {content}
        </Link>
      )}

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <SidebarItem key={child.name} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isSolutionsExpanded, setIsSolutionsExpanded] = useState(
    pathname.startsWith("/solutions-training")
  )

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavigation.map((item) => (
            <SidebarItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Solutions Section */}
        <div>
          <button
            onClick={() => setIsSolutionsExpanded(!isSolutionsExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>Solutions Training</span>
            {isSolutionsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isSolutionsExpanded && (
            <div className="mt-2 space-y-1">
              {solutionsNavigation.map((solution) => {
                const isActive = pathname === solution.href
                return (
                  <Link
                    key={solution.name}
                    href={solution.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ml-4",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <solution.icon className="h-4 w-4" />
                    <span>{solution.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
