import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25",
        destructive:
          "rounded-2xl bg-gradient-to-r from-destructive to-danger-glow text-destructive-foreground shadow-lg hover:shadow-xl hover:shadow-destructive/25",
        outline:
          "rounded-2xl border-2 border-white/20 bg-white/70 backdrop-blur-md text-foreground hover:bg-white/90 hover:border-primary/50 shadow-lg",
        secondary:
          "rounded-2xl bg-gradient-to-r from-secondary to-muted text-secondary-foreground shadow-lg hover:shadow-xl hover:bg-secondary/90",
        ghost: "rounded-xl hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        success: "rounded-2xl bg-gradient-to-r from-success to-success-glow text-success-foreground shadow-lg hover:shadow-xl hover:shadow-success/25",
        warning: "rounded-2xl bg-gradient-to-r from-warning to-warning-glow text-warning-foreground shadow-lg hover:shadow-xl hover:shadow-warning/25",
        info: "rounded-2xl bg-gradient-to-r from-info to-info-glow text-info-foreground shadow-lg hover:shadow-xl hover:shadow-info/25",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 py-2",
        lg: "h-14 rounded-2xl px-8 py-4 text-base",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
