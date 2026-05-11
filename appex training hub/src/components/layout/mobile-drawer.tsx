"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { 
  X, 
  Home, 
  BookOpen, 
  FileText, 
  Award,
  Users,
  LifeBuoy,
  Briefcase,
  LogOut,
  ChevronRight
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const menuGroups = [
    {
      title: "Learning",
      items: [
        { href: "/dashboard", icon: Home, label: "Dashboard" },
        { href: "/my-learning", icon: BookOpen, label: "My Learning" },
        { href: "/courses", icon: ChevronRight, label: "All Courses" },
        { href: "/certifications", icon: Award, label: "Certifications" },
      ]
    },
    {
      title: "Resources",
      items: [
        { href: "/docs", icon: FileText, label: "Documentation" },
        { href: "/solutions-training", icon: Briefcase, label: "Solutions Training" },
      ]
    },
    {
      title: "Support",
      items: [
        { href: "/community", icon: Users, label: "Community" },
        { href: "/support", icon: LifeBuoy, label: "Help & Support" },
      ]
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-[70] w-[80%] max-w-sm bg-white shadow-xl flex flex-col md:hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header / Profile */}
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                    {session?.user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[150px]">
                    {session?.user?.email || "Signed in"}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
              {menuGroups.map((group, idx) => (
                <div key={idx}>
                  <h4 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {group.title}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      const Icon = item.icon
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive 
                              ? "bg-emerald-50 text-emerald-700" 
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t bg-gray-50 pb-safe">
              <Button 
                variant="outline" 
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  onClose()
                  signOut({ callbackUrl: "/auth/signin" })
                }}
                nativeButton={false}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
