import * as React from "react"

import { cn } from "../../lib/utils"

// Card component now primarily relies on the base `.card` style defined in index.css
// It allows className overrides for specific background/border colors applied in parent components (like HomePage)
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Apply the base card style from index.css and allow overrides
    className={cn("card", className)} 
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Standard padding, adjust if needed based on reference visual
    className={cn("flex flex-col space-y-1.5 p-6", className)} 
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    // Use reference text colors for titles
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-ref-light-text-hero dark:text-ref-dark-text", 
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    // Use reference text colors for descriptions/secondary text
    className={cn("text-sm text-ref-light-text-nav dark:text-ref-dark-text-nav", className)} 
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Standard padding, adjust if needed
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> 
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Standard padding, adjust if needed
    className={cn("flex items-center p-6 pt-0", className)} 
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

