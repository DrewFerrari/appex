"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  label?: string
  position?: "bottom-right" | "bottom-left" | "bottom-center"
}

const FAB = forwardRef<HTMLButtonElement, FABProps>(
  ({ className, icon, label, position = "bottom-right", ...props }, ref) => {
    
    const positionClasses = {
      "bottom-right": "bottom-[80px] right-4", // above bottom nav
      "bottom-left": "bottom-[80px] left-4",
      "bottom-center": "bottom-[80px] left-1/2 -translate-x-1/2",
    }

    return (
      <motion.button
        ref={ref}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "fixed z-40 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 md:hidden",
          label ? "px-4 py-3 space-x-2" : "w-14 h-14",
          positionClasses[position],
          className
        )}
        {...props}
      >
        <span className="flex items-center justify-center w-6 h-6">
          {icon}
        </span>
        {label && <span className="font-semibold text-sm">{label}</span>}
      </motion.button>
    )
  }
)
FAB.displayName = "FAB"

export { FAB }
