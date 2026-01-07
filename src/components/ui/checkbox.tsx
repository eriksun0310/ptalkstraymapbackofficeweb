"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground flex items-center justify-center",
            className
          )}
        >
          <Check className="h-3 w-3 hidden peer-checked:block text-white" />
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

// Simple checkbox with label
interface CheckboxWithLabelProps extends CheckboxProps {
  label: string
}

const CheckboxWithLabel = React.forwardRef<HTMLInputElement, CheckboxWithLabelProps>(
  ({ label, className, id, ...props }, ref) => {
    const innerId = id || React.useId()
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={innerId}
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-primary",
            className
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={innerId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
      </div>
    )
  }
)
CheckboxWithLabel.displayName = "CheckboxWithLabel"

export { Checkbox, CheckboxWithLabel }
