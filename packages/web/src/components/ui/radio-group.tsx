import * as React from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

/**
 * RadioGroup — formalizes the manual Pressable-list-with-"Selected"-label
 * pattern mymzansi-app's visitor-apply.tsx already hand-rolls for visa
 * reason selection (R3: selection carries a word, not only a colour —
 * kept here as the "Selected" indicator composed alongside, not baked
 * into this primitive, since the row chrome varies by screen).
 */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('flex flex-col gap-sm', className)} {...props} />
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'aspect-square size-5 shrink-0 rounded-full border border-theme-border bg-theme-surface',
        'transition-colors duration-quick ease-standard outline-none',
        'focus-visible:ring-2 focus-visible:ring-theme-accent focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-45',
        'data-[state=checked]:border-theme-accent',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="size-2.5 rounded-full bg-theme-accent" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
