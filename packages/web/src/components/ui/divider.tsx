import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Divider — a hairline rule. New in this pass (no prior spec): factored
 * out because Card/StatusRow/Sheet were each hand-rolling their own
 * `border-b` instead of sharing one primitive. Purely decorative by
 * default (`role="separator"` + `aria-hidden` would be redundant — a
 * native `<hr>` already conveys separation to assistive tech).
 */
function Divider({ className, ...props }: React.ComponentProps<'hr'>) {
  return <hr data-slot="divider" className={cn('border-t border-theme-border', className)} {...props} />
}

export { Divider }
