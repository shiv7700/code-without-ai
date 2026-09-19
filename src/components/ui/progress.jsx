import { cn } from '@/lib/utils'

// Only ever used to show how much of the ladder is done, so it takes a plain
// 0–100 and nothing else. A label goes above it, in the caller's own layout.
export function Progress({ value = 0, className, ...props }) {
  const pct = Math.max(0, Math.min(100, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      data-slot="progress"
      className={cn('h-1 w-full overflow-hidden rounded-full bg-muted', className)}
      {...props}
    >
      {/* scaleX, not width — a width transition relayouts every frame. */}
      <div
        className="h-full origin-left rounded-full bg-primary transition-transform duration-(--dur-slow) ease-out-quick"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  )
}
