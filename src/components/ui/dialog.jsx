import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const SIDE = {
  // Centred by auto margins rather than a translate, so the enter animation
  // still has translate to itself.
  center:
    'inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border',
  right: 'inset-y-0 right-0 m-0 h-dvh w-full max-w-md border-l border-border',
}

// The native element, not a rebuilt one: showModal() is what gives the focus
// trap, Escape, the inert background and the top layer, all of which are the
// parts a hand-rolled modal gets wrong.
export function Dialog({
  open,
  onOpenChange,
  side = 'center',
  initialFocus,
  className,
  children,
  ...props
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (open && !el.open) {
      el.showModal()
      // Native focus lands on the first focusable child, which in a search
      // panel is the wrong one often enough to be worth overriding.
      initialFocus?.current?.focus()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open, initialFocus])

  // showModal makes the page inert but does not stop it scrolling behind.
  useEffect(() => {
    if (!open) return
    const { style } = document.documentElement
    const was = style.overflow
    style.overflow = 'hidden'
    return () => {
      style.overflow = was
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      data-slot="dialog"
      data-side={side}
      onCancel={(e) => {
        // Let React own the open state; the default close would desync it.
        e.preventDefault()
        onOpenChange?.(false)
      }}
      onClose={() => onOpenChange?.(false)}
      onClick={(e) => {
        if (e.target === ref.current) onOpenChange?.(false)
      }}
      className={cn(
        'fixed max-h-none max-w-none bg-popover p-0 text-popover-foreground shadow-pop',
        SIDE[side],
        className,
      )}
      {...props}
    >
      {open && children}
    </dialog>
  )
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-2 p-5 pb-3', className)} {...props} />
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn('font-mono text-sub', className)} {...props} />
}

export function DialogDescription({ className, ...props }) {
  return (
    <p className={cn('text-fine text-muted-foreground', className)} {...props} />
  )
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border p-4',
        className,
      )}
      {...props}
    />
  )
}
