import * as React from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

/**
 * Sheet — a bottom sheet, not a centered dialog: this is the one idiom
 * mymzansi-app already uses for both its menus (AppMenu, LanguagePicker),
 * factored out here as a shared primitive rather than two hand-rolled
 * copies of the same Modal markup, per Phase 1c of the same pass on the
 * RN side.
 *
 * Entrance uses the `slow` motion token (380ms) + `standard` easing —
 * not tw-animate-css's generic defaults — and honors reduced-motion via
 * the global override in index.css. Built on Radix Dialog for focus
 * trap, Escape-to-close and scroll lock; RN's Sheet gets the equivalent
 * from React Native's Modal + Reanimated (see Phase 1d).
 */
const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          'fixed inset-0 z-50 bg-(--scrim)',
          'data-[state=open]:animate-in data-[state=open]:fade-in',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out',
          'duration-base',
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col gap-md',
          'rounded-t-lg border-t border-theme-border bg-theme-bg p-md pb-lg outline-none',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
          'duration-slow ease-standard',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('text-title3 font-bold text-theme-text', className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('text-bodySm text-theme-text2', className)} {...props} />
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription }
