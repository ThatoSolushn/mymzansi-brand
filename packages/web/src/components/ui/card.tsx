import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — BRAND.md §9.1. "Cards lift off a bone ground as white surfaces.
 * Hierarchy comes from the surface change, not from shadows the cheap
 * phone has to paint." No shadow by default; `elevated` opts into the
 * lightest elevation token for the rare case that genuinely needs to sit
 * above other cards (e.g. a modal-adjacent highlight), never the heavy
 * "lift" token.
 */
function Card({
  className,
  elevated = false,
  ...props
}: React.ComponentProps<'div'> & { elevated?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'rounded-lg border border-theme-border bg-theme-surface p-md',
        'flex flex-col gap-sm',
        elevated && 'shadow-card',
        className,
      )}
      {...props}
    />
  )
}

function CardEyebrow({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="card-eyebrow" className={cn('text-label font-semibold text-theme-text3', className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return <h3 data-slot="card-title" className={cn('text-title3 font-bold text-theme-text', className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="card-description" className={cn('text-bodySm text-theme-text2', className)} {...props} />
}

function CardMeta({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="card-meta" className={cn('text-caption text-theme-text3', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex items-center gap-sm pt-xs', className)} {...props} />
}

export { Card, CardEyebrow, CardTitle, CardDescription, CardMeta, CardFooter }
