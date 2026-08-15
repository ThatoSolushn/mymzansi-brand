import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

/**
 * Switch — new primitive; Settings (both platforms) currently shows
 * inert static rows because nothing existed to bind them to. Built on
 * Radix for the accessibility contract (role, keyboard, focus) rather
 * than reimplementing a toggle from scratch.
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-6 w-10 shrink-0 items-center rounded-full border border-transparent',
        'transition-colors duration-quick ease-standard outline-none',
        'focus-visible:ring-2 focus-visible:ring-theme-accent focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-45',
        'data-[state=checked]:bg-theme-accent data-[state=unchecked]:bg-theme-surfaceSunk',
        'data-[state=unchecked]:border-theme-border',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-theme-surface shadow-card',
          'transition-transform duration-quick ease-standard',
          'data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[2px]',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
