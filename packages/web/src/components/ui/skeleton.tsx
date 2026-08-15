import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Skeleton — a loading placeholder shaped like the content it stands in
 * for, not a generic spinner (stitch-design-taste's "skeletal loaders
 * matching layout dimensions"). No loading state existed anywhere in
 * this system before this pass.
 *
 * The shimmer is a plain opacity pulse — R5 (transform/opacity only) —
 * and is silenced by the global `prefers-reduced-motion` override in
 * index.css, which collapses it to a static, still-legible muted fill
 * rather than skipping the state's meaning.
 *
 * Fill is `theme-border`, not `theme-surfaceSunk`: in dark mode,
 * surfaceSunk is IDENTICAL to bg by design (recessed content should
 * blend into the page — see Input's fill) — exactly the wrong property
 * for something that needs to be seen. border is tuned to stay visible
 * against both bg and surface in both themes, which is what a skeleton
 * actually needs.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      role="status"
      aria-label="Loading"
      className={cn('animate-shimmer rounded-sm bg-theme-border', className)}
      {...props}
    />
  )
}

export { Skeleton }
