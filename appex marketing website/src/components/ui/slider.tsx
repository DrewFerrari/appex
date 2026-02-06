"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        value: number[]
        onValueChange: (val: number[]) => void
        max?: number
        min?: number
        step?: number
    }
>(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange([parseFloat(e.target.value)])
    }

    const val = value[0] || 0
    const percentage = ((val - min) / (max - min)) * 100

    return (
        <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={val}
                onChange={handleChange}
                ref={ref}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                    background: `linear-gradient(to right, #00D4CC 0%, #00D4CC ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
                }}
                {...props}
            />
            <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #00D4CC;
          cursor: pointer;
          transition: background .15s ease-in-out;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          background-color: #f1f5f9;
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: 0;
          border-radius: 50%;
          background: white;
          border: 2px solid #00D4CC;
          cursor: pointer;
          transition: background .15s ease-in-out;
        }
      `}</style>
        </div>
    )
})
Slider.displayName = "Slider"

export { Slider }
