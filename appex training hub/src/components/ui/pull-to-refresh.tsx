"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useDrag } from "@use-gesture/react"
import { Loader2 } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  pullThreshold?: number
  maxPull?: number
}

export function PullToRefresh({
  onRefresh,
  children,
  pullThreshold = 80,
  maxPull = 120,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  
  // Vibrate if supported
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  const bind = useDrag(
    ({ movement: [, my], down, cancel, active }) => {
      // Only allow pull if we're at the top of the container
      if (containerRef.current && containerRef.current.scrollTop > 0) {
        if (active) cancel()
        return
      }

      // Ignore if currently refreshing
      if (isRefreshing) return

      // Resistance math
      const pulledDistance = Math.min(Math.max(my, 0), maxPull)
      const isPastThreshold = pulledDistance >= pullThreshold

      if (!down && isPastThreshold) {
        // Trigger refresh
        setIsRefreshing(true)
        triggerHaptic()
        controls.start({ y: 50, transition: { type: "spring", stiffness: 300, damping: 20 } })
        
        onRefresh().finally(() => {
          setIsRefreshing(false)
          controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } })
        })
      } else if (!down) {
        // Snap back
        controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } })
      } else {
        // Follow finger with resistance
        controls.set({ y: pulledDistance * 0.5 })
      }
    },
    {
      axis: "y",
      bounds: { top: 0 },
      rubberband: true,
    }
  )

  // Prevent default touch behaviors like overscroll-behavior-y to prevent native browser pull-to-refresh
  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.style.overscrollBehaviorY = "contain"
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loading Indicator */}
      <div className="absolute top-0 left-0 right-0 flex justify-center items-start pt-4 h-24 pointer-events-none z-0">
        <motion.div
          animate={controls}
          className="bg-white shadow-md rounded-full p-2 flex items-center justify-center opacity-0 -translate-y-full"
          style={{ 
            opacity: isRefreshing ? 1 : 0, 
            transform: isRefreshing ? "translateY(20px)" : "translateY(-100%)" 
          }}
        >
          <Loader2 className={`h-5 w-5 text-emerald-600 ${isRefreshing ? "animate-spin" : ""}`} />
        </motion.div>
      </div>

      {/* Content wrapper */}
      <motion.div
        ref={containerRef}
        {...bind()}
        animate={controls}
        className="w-full h-full overflow-y-auto z-10 relative bg-white touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  )
}
