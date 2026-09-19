import { cn } from '@/lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      data-slot="input"
      className={cn(
        'h-8 w-full min-w-0 rounded-sm border border-border bg-surface px-2.5 text-body',
        'transition-colors duration-(--dur-quick) placeholder:text-muted-foreground',
        'hover:border-edge focus-visible:border-ring focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // The search variant's clear button is the browser's, and it is grey on
        // grey in dark mode until it is inverted.
        '[&::-webkit-search-cancel-button]:opacity-60 dark:[&::-webkit-search-cancel-button]:invert',
        className,
      )}
      {...props}
    />
  )
}
