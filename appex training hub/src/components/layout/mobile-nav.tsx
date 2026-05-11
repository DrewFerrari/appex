"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  BookOpen, 
  FileText, 
  Award,
  Menu
} from "lucide-react"

interface MobileNavProps {
  onMenuClick: () => void;
}

export function MobileNav({ onMenuClick }: MobileNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/my-learning", icon: BookOpen, label: "My Learning" },
    { href: "/docs", icon: FileText, label: "Docs" },
    { href: "/certifications", icon: Award, label: "Certs" },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-emerald-600" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Icon className="w-6 h-6 min-w-[24px] min-h-[24px]" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
        
        <button 
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-900"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 min-w-[24px] min-h-[24px]" />
          <span className="text-[10px] font-medium leading-none">Menu</span>
        </button>
      </nav>
    </div>
  )
}
