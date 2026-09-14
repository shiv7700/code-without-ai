import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// One at a time, and the last one is the closest to the answer — handing over
// all five at once would make the first four pointless.
export function Hints({ title, hints }) {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(1)

  if (hints.length === 0) return null

  // Back to the first hint on every open. Carrying the count over means coming
  // back tomorrow starts you at the answer.
  const onOpenChange = (next) => {
    setOpen(next)
    if (next) setShown(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        Hint
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{title}</DialogTitle>
          <DialogDescription>
            Each one gives away a little more. Stop as soon as you can see it.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-3">
          {hints.slice(0, shown).map((hint, i) => (
            <li key={hint} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-px font-mono text-[0.625rem] text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{hint}</span>
            </li>
          ))}
        </ol>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase tabular-nums">
            {shown} / {hints.length}
          </span>

          {shown < hints.length ? (
            <Button size="sm" variant="outline" onClick={() => setShown(shown + 1)}>
              Next hint
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              That is all of them.
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
