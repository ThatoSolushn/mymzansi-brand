import { cn } from '@/lib/utils'

/**
 * StatusRow — BRAND.md §9.1: a left status rail instead of an icon
 * circle. "Faster to scan than icon circles, no cross-cultural icon
 * ambiguity, far cheaper to render in a long list." `state` colours the
 * rail; `title` always carries the meaning in words (R3).
 */
export type StatusRowState = 'allowed' | 'restricted' | 'attention' | 'neutral'

const railColor: Record<StatusRowState, string> = {
  allowed: 'bg-semantic-success',
  restricted: 'bg-semantic-restricted',
  attention: 'bg-semantic-critical',
  neutral: 'bg-theme-border',
}

function StatusRow({
  title,
  detail,
  state = 'neutral',
  last = false,
  className,
}: {
  title: string
  detail?: string
  state?: StatusRowState
  last?: boolean
  className?: string
}) {
  const dimmed = state === 'restricted'
  return (
    <div
      data-slot="status-row"
      className={cn(
        'flex gap-sm px-md py-sm',
        !last && 'border-b border-theme-border',
        className,
      )}
    >
      {/* rail.status has no Tailwind utility mapping (generator doesn't expose
          `dimension.rail`) — read the real CSS custom property directly
          rather than hardcode 4px, so it can't drift from tokens.json. */}
      <div className={cn('w-[var(--rail-status)] shrink-0 rounded-sm', railColor[state])} />
      <div className="flex flex-1 flex-col gap-0.5">
        <span className={cn('text-body', dimmed ? 'text-theme-text3' : 'text-theme-text')}>{title}</span>
        {detail ? <span className="text-caption text-theme-text3">{detail}</span> : null}
      </div>
    </div>
  )
}

export { StatusRow }
