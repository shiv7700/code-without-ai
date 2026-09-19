import { cn } from '@/lib/utils'

// Two plain objects instead of a variant library. Adding a look is a line here,
// and the class string for a given variant is readable without running anything.
const VARIANT = {
  // A gradient with a crisp inset top highlight, not a flat fill — the highlight
  // has to be the top of something or it is a white line for no reason. The
  // hover moves the gradient rather than filtering, which would wash the label.
  default: [
    'bg-primary bg-[linear-gradient(180deg,var(--color-volt-lift),var(--color-volt))]',
    'text-primary-foreground',
    'shadow-[0_1px_0_0_oklch(1_0_0/0.22)_inset,0_2px_10px_-3px_color-mix(in_oklch,var(--primary)_55%,transparent)]',
    'hover:bg-[linear-gradient(180deg,var(--color-volt-lift),var(--color-volt-lift))]',
    'hover:shadow-[0_1px_0_0_oklch(1_0_0/0.28)_inset,0_4px_16px_-4px_color-mix(in_oklch,var(--primary)_70%,transparent)]',
    // The ring is violet on violet otherwise, which is no ring at all.
    'focus-visible:outline-foreground',
  ].join(' '),
  outline:
    'border border-border bg-transparent text-foreground hover:border-edge hover:bg-surface-raised',
  ghost: 'text-muted-foreground hover:bg-surface-raised hover:text-foreground',
  destructive:
    'bg-destructive/12 text-destructive hover:bg-destructive/20 dark:bg-destructive/15',
  link: 'text-primary underline-offset-4 hover:underline',
}

const SIZE = {
  xs: 'h-6 gap-1 rounded-xs px-1.5 text-[0.6875rem]',
  sm: 'h-7 gap-1.5 px-2.5 text-fine',
  md: 'h-8 gap-1.5 px-3 text-fine',
  lg: 'h-9 gap-2 px-4 text-body',
  // The one conversion target on a page. 36px is toolbar height; this is a
  // decision, and it clears the 44px touch target as well.
  xl: 'h-11 gap-2 px-5 text-sub',
  icon: 'size-8',
  'icon-sm': 'size-7',
  'icon-xs': 'size-6 rounded-xs',
}

export function Button({
  as: As = 'button',
  variant = 'default',
  size = 'md',
  className,
  type,
  ...props
}) {
  return (
    <As
      data-slot="button"
      // A link rendered as a button has no implicit type to get wrong.
      type={As === 'button' ? (type ?? 'button') : type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-sm font-medium whitespace-nowrap select-none',
        'transition-[background,border-color,color,box-shadow,translate] duration-(--dur-quick) ease-out-quick',
        // The press only reads as a press if it moves. One pixel is enough.
        'active:translate-y-px disabled:pointer-events-none disabled:opacity-45',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    />
  )
}
