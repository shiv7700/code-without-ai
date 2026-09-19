import { useState } from 'react'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
    <>
      <Button variant="ghost" size="sm" onClick={() => onOpenChange(true)}>
        Hint
      </Button>

      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        className="sm:max-w-md"
        aria-label={`Hints for ${title}`}
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle>{title}</DialogTitle>
            {/* Escape closes it, but only if you already knew that. */}
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Close the hints"
              onClick={() => onOpenChange(false)}
            >
              ✕
            </Button>
          </div>
          <DialogDescription>
            Each one gives away a little more. Stop as soon as you can see it.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-3 px-5 pb-5">
          {hints.slice(0, shown).map((hint, i) => (
            <li key={hint} className="flex gap-3 text-body leading-relaxed">
              <span className="mt-1 font-mono text-label text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{hint}</span>
            </li>
          ))}
        </ol>

        <DialogFooter className="justify-between">
          <span className="label text-muted-foreground tabular-nums">
            {shown} / {hints.length}
          </span>

          {shown < hints.length ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShown(shown + 1)}
            >
              Next hint
            </Button>
          ) : (
            <span className="text-fine text-muted-foreground">
              That is all of them.
            </span>
          )}
        </DialogFooter>
      </Dialog>
    </>
  )
}
