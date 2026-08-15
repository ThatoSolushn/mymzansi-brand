import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Badge — R3: colour reinforces, never informs alone. `label` is the
 * child text itself; there is no icon-only or colour-only mode.
 */
const badgeVariants = cva('inline-flex w-fit items-center rounded-full px-xs py-3xs text-label font-semibold', {
  variants: {
    tone: {
      neutral: 'bg-theme-surfaceSunk text-theme-text2',
      good: 'bg-theme-surfaceSunk text-semantic-success',
      // R2: maize (cautionFill) is a bright ground in BOTH themes, so its
      // label is always light-theme ink — never `theme-text`, which would
      // flip to a pale chalk-on-maize illegible pairing in dark mode. This
      // mirrors `onCautionFill` in mymzansi-app's theme/index.ts exactly.
      limit: 'bg-semantic-cautionFill text-palette-ink',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

function Badge({ className, tone, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props} />
}

export { Badge, badgeVariants }
