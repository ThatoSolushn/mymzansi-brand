import * as React from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-5 shrink-0 rounded-sm border border-theme-border bg-theme-surface',
        'transition-colors duration-quick ease-standard outline-none',
        'focus-visible:ring-2 focus-visible:ring-theme-accent focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-45',
        'data-[state=checked]:border-theme-accent data-[state=checked]:bg-theme-accent',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-theme-textInvert">
        <span aria-hidden="true" className="material-symbols-outlined text-[16px] leading-none">
          check
        </span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
