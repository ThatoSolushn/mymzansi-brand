import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Icon, type IconName } from '@/components/ui/icon'

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
  /** A MyMzansi icon name from the curated Fluent set, e.g. "inbox". */
  icon?: IconName
  title: string
  description?: string
  action?: { label: string; onClick?: () => void; trailingIcon?: IconName; variant?: ButtonProps['variant'] }
  className?: string
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn('flex flex-col items-center gap-sm rounded-lg border border-dashed border-theme-border px-lg py-xl text-center', className)}
    >
      {icon ? <Icon name={icon} size={32} className="text-theme-text3" aria-hidden="true" /> : null}
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
