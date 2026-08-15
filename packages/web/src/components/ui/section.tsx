import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Section — a page-section heading. Deliberately NOT uppercase: uppercase
 * text is measurably harder to read for people with dyslexia and lower
 * literacy (word-shape recognition breaks down when every letter is the
 * same height), and this system's own beneficiaries are exactly the
 * population that costs. Hierarchy comes from size, not case.
 */
function Section({
  label,
  tone,
  children,
  className,
}: {
  label: string
  tone?: 'good' | 'limit'
  children?: React.ReactNode
  className?: string
}) {
  const dot = tone === 'good' ? 'bg-semantic-success' : tone === 'limit' ? 'bg-semantic-restricted' : null
  return (
    <div data-slot="section" className={cn('flex flex-col gap-xs', className)}>
      <div className="flex items-center gap-2">
        {dot ? <span className={cn('size-1.5 rounded-full', dot)} /> : null}
        <h2 className="text-title3 font-bold text-theme-text">{label}</h2>
      </div>
      {children}
    </div>
  )
}

export { Section }
