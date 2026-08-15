import { cn } from '@/lib/utils'

/**
 * Avatar — formalizes the ad hoc initials-circle mymzansi-app's wallet
 * screen invented inline. Initials-first, not photo-first: this system
 * has no real user photography anywhere, and a name is more reliably
 * available than a picture (BRAND.md's whole content model is
 * text-first — R3, R4, R12 all point the same direction).
 */
function Avatar({
  initials,
  src,
  alt,
  size = 'md',
  className,
}: {
  initials: string
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims = { sm: 'size-8 text-caption', md: 'size-10 text-body', lg: 'size-14 text-title3' }[size]
  return (
    <span
      data-slot="avatar"
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md',
        'border border-theme-border bg-theme-surfaceSunk font-bold text-theme-text2',
        dims,
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ''} className="size-full object-cover" />
      ) : (
        <span aria-hidden={!!alt}>{initials}</span>
      )}
    </span>
  )
}

export { Avatar }
