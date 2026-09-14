import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { challenges, tiers } from './challenges'
import { loadProgress } from './store'
import { Kbd, MOD } from './Kbd'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const pad = (n) => String(n).padStart(3, '0')

// The whole ladder from inside a challenge, so moving on does not mean a trip
// back to the home screen and a scroll through three hundred rows.
export function Jump({ current }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [done, setDone] = useState(() => new Set())
  const search = useRef(null)

  // Capture, or CodeMirror sees the chord first while the editor has focus.
  useEffect(() => {
    const toggle = (e) => {
      if (e.key !== 'k' || !(e.metaKey || e.ctrlKey)) return
      e.preventDefault()
      e.stopPropagation()
      setOpen((was) => !was)
    }
    document.addEventListener('keydown', toggle, true)
    return () => document.removeEventListener('keydown', toggle, true)
  }, [])

  // Read on every open rather than on mount: a challenge page has no other use
  // for the progress list, and by the second open one of them may have flipped.
  useEffect(() => {
    if (!open) return
    let live = true
    loadProgress().then((next) => live && setDone(next))
    return () => {
      live = false
    }
  }, [open])

  const onOpenChange = (next) => {
    setOpen(next)
    if (next) setQuery('')
  }

  const needle = query.trim().toLowerCase()
  const visible = tiers
    .map((tier) => ({
      ...tier,
      challenges: tier.challenges.filter((c) => c.search.includes(needle)),
    }))
    .filter((tier) => tier.challenges.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        Challenges
        <Kbd>{MOD}K</Kbd>
      </DialogTrigger>

      <DialogContent
        initialFocus={search}
        className="top-0 right-0 left-auto h-dvh w-full max-w-md translate-x-0 translate-y-0 grid-rows-[auto_1fr_auto] gap-0 rounded-none p-0 data-closed:slide-out-to-right data-open:slide-in-from-right"
      >
        <DialogHeader className="gap-3 border-b border-border p-4">
          <DialogTitle className="font-mono text-sm">
            Jump to a challenge
          </DialogTitle>
          <DialogDescription className="sr-only">
            Search the whole ladder and open any challenge.
          </DialogDescription>
          <Input
            ref={search}
            type="search"
            aria-label="Search challenges"
            placeholder="Search name, topic, or what the spec checks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 font-mono text-xs"
          />
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto overscroll-contain">
          {visible.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">
              Nothing matches that. Try a shorter search.
            </p>
          )}

          {visible.map((tier) => (
            <section key={tier.name}>
              <h3 className="sticky top-0 z-10 bg-popover px-4 py-2 font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
                {tier.name}
              </h3>

              <ul>
                {tier.challenges.map((c) => {
                  const here = c.name === current
                  return (
                    <li key={c.name}>
                      <Link
                        to={`/${c.name}`}
                        onClick={() => setOpen(false)}
                        aria-current={here ? 'page' : undefined}
                        // Opening on challenge 214 should not mean scrolling to
                        // it. The callback fires on mount, which is every open.
                        ref={
                          here
                            ? (el) => el?.scrollIntoView({ block: 'center' })
                            : undefined
                        }
                        className={`grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-3 border-l-2 py-1.5 pr-4 pl-3 transition-colors outline-none hover:bg-muted focus-visible:bg-muted ${
                          here
                            ? 'border-primary bg-muted'
                            : 'border-transparent'
                        }`}
                      >
                        <span
                          className={`font-mono text-xs tabular-nums ${
                            done.has(c.name)
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {pad(c.level)}
                        </span>

                        <span className="min-w-0">
                          <span className="block truncate font-mono text-sm">
                            {c.title}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {c.summary}
                          </span>
                        </span>

                        <span
                          className={`font-mono text-xs ${
                            done.has(c.name)
                              ? 'text-primary'
                              : 'text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <p className="border-t border-border px-4 py-2 font-mono text-[0.625rem] tracking-[0.15em] text-muted-foreground uppercase tabular-nums">
          {visible.reduce((n, t) => n + t.challenges.length, 0)} /{' '}
          {challenges.length}
        </p>
      </DialogContent>
    </Dialog>
  )
}
