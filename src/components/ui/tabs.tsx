import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    // Use reference theme colors for the list background and text
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-ref-light-footer-bg p-1 text-ref-light-text-nav dark:bg-ref-dark-card-bg dark:text-ref-dark-text-nav",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    // Use reference theme colors for trigger text and active state
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-ref-light-bg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-quran focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-ref-light-bg data-[state=active]:text-ref-light-text-hero data-[state=active]:shadow-sm", // Light active state
      "dark:ring-offset-ref-dark-bg dark:focus-visible:ring-accent-quran",
      "dark:data-[state=active]:bg-ref-dark-bg dark:data-[state=active]:text-ref-dark-text", // Dark active state
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    // Use reference theme colors for focus ring
    className={cn(
      "mt-2 ring-offset-ref-light-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-quran focus-visible:ring-offset-2 dark:ring-offset-ref-dark-bg dark:focus-visible:ring-accent-quran",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

