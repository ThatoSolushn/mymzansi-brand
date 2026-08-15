import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

/**
 * EmptyState — no empty state existed anywhere in this system before
 * this pass (e.g. Wallet with no documents, Activity with nothing yet).
 * R11: never a dead end — `action`, when given, is the concrete next
 * step, not a decorative illustration standing in for one.
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  /** Material Symbols ligature name, e.g. "inbox". */
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick?: () => void; trailingIcon?: string; variant?: ButtonProps['variant'] }
  className?: string
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn('flex flex-col items-center gap-sm rounded-lg border border-dashed border-theme-border px-lg py-xl text-center', className)}
    >
      {icon ? (
        <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-theme-text3">
          {icon}
        </span>
      ) : null}
      <div className="flex flex-col gap-0.5">
        <span className="text-title3 font-bold text-theme-text">{title}</span>
        {description ? <span className="max-w-[42ch] text-bodySm text-theme-text2">{description}</span> : null}
      </div>
      {action ? (
        <Button variant={action.variant ?? 'secondary'} trailingIcon={action.trailingIcon} onClick={action.onClick} className="mt-xs">
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}

export { EmptyState }
