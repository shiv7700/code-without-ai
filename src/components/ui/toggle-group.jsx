import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const GroupContext = createContext(null)

// Single-select only, and the value is a string — the previous one handed back
// an array every call site had to unwrap, for a control that picks one thing.
export function ToggleGroup({ value, onValueChange, className, ...props }) {
  return (
    <GroupContext.Provider value={{ value, onValueChange }}>
      <div
        role="group"
        data-slot="toggle-group"
        className={cn(
          'inline-flex w-fit items-center gap-0.5 rounded-sm border border-border bg-surface p-0.5',
          className,
        )}
        {...props}
      />
    </GroupContext.Provider>
  )
}

export function ToggleGroupItem({ value, className, ...props }) {
  const group = useContext(GroupContext)
  const on = group.value === value

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      aria-pressed={on}
      onClick={() => group.onValueChange?.(value)}
      className={cn(
        'inline-flex h-6 shrink-0 items-center justify-center rounded-xs px-2.5 text-fine font-medium whitespace-nowrap',
        'transition-colors duration-(--dur-quick) ease-out-quick',
        on
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:bg-surface-raised hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}
