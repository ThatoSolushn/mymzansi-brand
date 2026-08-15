import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Input — matches mymzansi-app's TextField: label above, sunk fill,
 * hairline border, touch.min height, error state below (that RN
 * component doesn't have an error state yet — a real gap the ui-ux
 * audit flagged; the web version starts with it since building it here
 * first is cheaper before it exists on both platforms).
 */
function Input({
  id,
  label,
  error,
  helperText,
  className,
  inputClassName,
  ...props
}: React.ComponentProps<'input'> & {
  label: string
  error?: string
  helperText?: string
  /** Sizes/positions the whole field block (label + input + helper). */
  className?: string
  /** Overrides the `<input>` element's own classes specifically. */
  inputClassName?: string
}) {
  const inputId = id ?? React.useId()
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  return (
    // `min-w` guards against collapsing to near-zero when a parent flex/grid
    // context gives this block no definite width to resolve `w-full` against
    // on the `<input>` inside — a genuine CSS gotcha (percentage widths don't
    // contribute to an ancestor's intrinsic/auto size), not just a default.
    <div className={cn('flex min-w-64 flex-col gap-xs', className)}>
      <label htmlFor={inputId} className="text-label font-semibold text-theme-text3">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={cn(
          'min-h-touch-min w-full rounded-sm border bg-theme-surfaceSunk px-sm text-numeric text-theme-text',
          'outline-none transition-[border-color] duration-quick ease-standard',
          'placeholder:text-theme-text3 focus-visible:border-theme-accent',
          error ? 'border-semantic-critical' : 'border-theme-border',
          inputClassName,
        )}
        {...props}
      />
      {error ? (
        <span id={errorId} role="alert" className="text-caption text-semantic-critical">
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-caption text-theme-text3">
          {helperText}
        </span>
      ) : null}
    </div>
  )
}

export { Input }
