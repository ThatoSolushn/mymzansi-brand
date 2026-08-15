import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Button — BRAND.md §9.2. Five variants, not the generic
 * default/outline/ghost/secondary/link vocabulary shadcn ships with: this
 * is the same variant set mymzansi-app's RN Button already ships, so a
 * design reviewed on one platform reads the same way on the other.
 *
 *   primary              fill=accent   label=textInvert   one per screen
 *   secondary             outline      label=accent        alternatives
 *   plain                 surface fill label=text2          dismiss, "not now"
 *   destructive           fill=critical label=textInvert    irreversible only
 *   destructive-outline    outline      label=critical       leads somewhere
 *                                                              consequential,
 *                                                              but isn't the
 *                                                              commit action
 *
 * Depth comes from colour, never a shadow (`elevation` token: shadows are
 * "paint-heavy on low-end GPUs"). Motion is transform/opacity only (R5),
 * timed from the motion tokens, not a framework default.
 */
const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2.5',
    'rounded-sm border text-bodyEmph font-bold',
    'whitespace-nowrap select-none outline-none',
    'transition-[transform,opacity] duration-quick ease-standard',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45',
    'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-theme-accent',
  ],
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-theme-accent text-theme-textInvert hover:opacity-90',
        secondary: 'border-theme-accent bg-transparent text-theme-accent hover:bg-theme-surfaceSunk',
        plain: 'border-theme-border bg-theme-surface text-theme-text2 hover:bg-theme-surfaceSunk',
        destructive: 'border-transparent bg-semantic-critical text-theme-textInvert hover:opacity-90',
        'destructive-outline': 'border-semantic-critical bg-transparent text-semantic-critical hover:bg-theme-surfaceSunk',
      },
      // R8: destructive actions get the larger, more separated target.
      size: {
        default: 'min-h-touch-min px-md py-sm',
        destructive: 'min-h-touch-min-spaced px-md py-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /**
     * Material Symbols ligature name for a trailing icon (e.g. "arrow_forward").
     * Nested in its own rounded chip rather than sitting bare next to the
     * label — the "button-in-button" treatment, carried over from the elite
     * comparison direction because it reads as more considered at rest AND
     * gives the icon a dedicated hit-target boundary, not because it's
     * decorative.
     */
    trailingIcon?: string
  }

function Button({
  className,
  variant = 'primary',
  size,
  asChild = false,
  trailingIcon,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  const resolvedSize = size ?? (variant === 'destructive' || variant === 'destructive-outline' ? 'destructive' : 'default')

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size: resolvedSize, className }), 'group')}
      {...props}
    >
      {/* R4: label wraps, never truncates — isiZulu runs ~2x English */}
      <span className="text-balance">{children}</span>
      {trailingIcon ? (
        <span
          aria-hidden="true"
          className={cn(
            'material-symbols-outlined inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[18px] leading-none',
            'transition-transform duration-quick ease-standard group-hover:translate-x-0.5',
            variant === 'primary' || variant === 'destructive' ? 'bg-black/10' : 'bg-current/10',
          )}
        >
          {trailingIcon}
        </span>
      ) : null}
    </Comp>
  )
}

export { Button, buttonVariants }
