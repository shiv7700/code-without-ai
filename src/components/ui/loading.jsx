// A spinner alone says "wait" and nothing else. Every loading state here names
// what it is waiting for and how long it should take, so a slow one still reads
// as working rather than stuck.
export function Loading({ title = 'Loading', hint, children, className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex h-full w-full flex-col items-center justify-center gap-5 px-6 text-center ${className}`}
    >
      <Sweep />
      <div className="space-y-1.5">
        <p className="text-sub font-medium text-foreground">{title}</p>
        {hint && <p className="text-fine text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

// A bar travelling under a fixed track, not a circle — it reads as progress
// through something rather than a wheel that could spin forever.
export function Sweep({ className = '' }) {
  return (
    <span
      aria-hidden
      className={`relative block h-px w-36 overflow-hidden bg-border ${className}`}
    >
      <span className="sweep absolute inset-y-0 left-0 w-1/4 bg-primary" />
    </span>
  )
}

// For a pane that already has its own frame: no copy, just a sign of life.
export function LoadingVeil({ className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`absolute inset-0 z-10 flex items-center justify-center bg-background ${className}`}
    >
      <Sweep />
    </div>
  )
}
