import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { challenges, tiers } from './challenges'
import { loadProgress } from './store'
import { signOut, useProfile } from './auth'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const STATUSES = [
  ['all', 'All'],
  ['todo', 'To do'],
  ['done', 'Done'],
]

const pad = (n) => String(n).padStart(3, '0')

function Rung({ challenge, index, isDone }) {
  const { name, level, title, summary, needsUi } = challenge

  return (
    <li className="rung" style={{ '--i': index }}>
      <Link
        to={`/${name}`}
        className={`group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-4 border-l-2 py-1.5 pr-3 pl-4 transition-colors outline-none hover:bg-muted focus-visible:bg-muted ${
          isDone
            ? 'border-primary'
            : 'border-transparent hover:border-muted-foreground'
        }`}
      >
        <span
          className={`font-mono text-xs tabular-nums ${
            isDone ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {pad(level)}
        </span>

        <span className="flex min-w-0 items-baseline gap-2.5">
          <span className="shrink-0 font-mono text-sm font-medium group-hover:text-primary">
            {title}
          </span>
          {!needsUi && (
            <span className="shrink-0 font-mono text-[0.5625rem] tracking-[0.15em] text-muted-foreground uppercase">
              hook
            </span>
          )}
          <span className="truncate text-xs text-muted-foreground">
            {summary}
          </span>
        </span>

        <span
          className={`font-mono text-[0.625rem] tracking-[0.15em] uppercase ${
            isDone ? 'text-primary' : 'text-transparent'
          }`}
        >
          done
        </span>
      </Link>
    </li>
  )
}

export default function Home() {
  const { handle, avatar } = useProfile()

  // Fetched on mount rather than lifted — routing unmounts this screen, so
  // coming back from a challenge picks up whatever it recorded.
  const [done, setDone] = useState(() => new Set())

  useEffect(() => {
    let live = true
    loadProgress().then((next) => live && setDone(next))
    return () => {
      live = false
    }
  }, [])

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [section, setSection] = useState('all')

  // Derived during render — three inputs in, one list out. Nothing to keep in
  // sync, and no effect to forget.
  const needle = query.trim().toLowerCase()
  const keep = (c) => {
    if (status === 'done' && !done.has(c.name)) return false
    if (status === 'todo' && done.has(c.name)) return false
    if (section !== 'all' && c.tier.name !== section) return false
    return c.search.includes(needle)
  }

  // `all` survives the filter, so the section's progress count stays a real
  // 3 / 20 rather than a confusing 0 / 1 of whatever the search left behind.
  const visible = tiers
    .map((tier) => ({
      ...tier,
      all: tier.challenges,
      challenges: tier.challenges.filter(keep),
    }))
    .filter((tier) => tier.challenges.length > 0)

  const shown = visible.reduce((n, tier) => n + tier.challenges.length, 0)
  const filtering = needle !== '' || status !== 'all' || section !== 'all'

  // One running count across sections, so the stagger reads as a single list.
  let rung = 0

  return (
    <main className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <header className="mb-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-mono text-xl font-semibold tracking-tight">
              react practice ladder
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {challenges.length} reps. Hand-written, every one.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {avatar && (
              <img src={avatar} alt="" className="size-6 rounded-full" />
            )}
            {handle && (
              <a
                href={`https://github.com/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs underline-offset-4 hover:underline"
              >
                {handle}
              </a>
            )}
            <Button variant="ghost" size="xs" onClick={signOut}>
              Sign out
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 flex items-baseline gap-2">
          <span className="font-mono text-5xl font-semibold tabular-nums">
            {pad(done.size)}
          </span>
          <span className="font-mono text-lg text-muted-foreground tabular-nums">
            / {challenges.length}
          </span>
          <span className="ml-auto font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
            solved
          </span>
        </div>
        <Progress
          value={(done.size / challenges.length) * 100}
          className="mt-3 h-1"
        />
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Input
          type="search"
          aria-label="Search challenges"
          placeholder="Search name, topic, or what the spec checks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 min-w-56 flex-1 font-mono text-xs"
        />
        <ToggleGroup value={status} onValueChange={setStatus}>
          {STATUSES.map(([value, label]) => (
            <ToggleGroupItem key={value} value={value}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <ToggleGroup
          value={section}
          onValueChange={setSection}
          className="flex-wrap"
        >
          <ToggleGroupItem value="all">Every section</ToggleGroupItem>
          {tiers.map((tier) => (
            <ToggleGroupItem key={tier.name} value={tier.name}>
              {tier.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {filtering && (
          <span className="ml-auto flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="tabular-nums">
              {shown}/{challenges.length}
            </span>
            <Button
              variant="link"
              size="xs"
              onClick={() => {
                setQuery('')
                setStatus('all')
                setSection('all')
              }}
            >
              Clear
            </Button>
          </span>
        )}
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nothing matches that. Try a shorter search.
        </p>
      )}

      {visible.map((tier) => (
        <section key={tier.name} className="mb-9">
          <div className="mb-2 flex items-baseline gap-3 pb-1 pl-1">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase">
              {tier.name}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {tier.blurb}
            </p>
            <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
              {tier.all.filter((c) => done.has(c.name)).length}/
              {tier.all.length}
            </span>
          </div>

          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {tier.challenges.map((c) => (
              <Rung
                key={c.name}
                challenge={c}
                index={rung++}
                isDone={done.has(c.name)}
              />
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
