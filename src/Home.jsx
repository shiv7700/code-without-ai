import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { challenges, tiers } from './challenges'
import { loadProgress } from './store'
import { signOut, useProfile } from './auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const STATUSES = [
  ['all', 'All'],
  ['todo', 'To do'],
  ['done', 'Done'],
]

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

  return (
    <main className="mx-auto max-w-5xl px-6 pt-14 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          React practice ladder
        </h1>

        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          {avatar && (
            <img src={avatar} alt="" className="size-5 rounded-full" />
          )}
          {handle && (
            <>
              <a
                href={`https://github.com/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {handle}
              </a>
              <span aria-hidden>·</span>
            </>
          )}
          <span>
            {done.size} of {challenges.length} done
          </span>
          <Button variant="link" size="xs" onClick={signOut}>
            sign out
          </Button>
        </p>

        <Progress
          value={(done.size / challenges.length) * 100}
          className="mt-4"
        />
      </header>

      <div className="mb-10 flex flex-wrap items-center gap-2">
        <input
          type="search"
          aria-label="Search challenges"
          placeholder="Search name, topic, or what the spec checks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 min-w-64 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-input dark:bg-input/30"
        />

        <div className="flex gap-1">
          {STATUSES.map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={status === value ? 'secondary' : 'ghost'}
              onClick={() => setStatus(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-1">
        <Button
          size="sm"
          variant={section === 'all' ? 'secondary' : 'ghost'}
          onClick={() => setSection('all')}
        >
          Every section
        </Button>
        {tiers.map((tier) => (
          <Button
            key={tier.name}
            size="sm"
            variant={section === tier.name ? 'secondary' : 'ghost'}
            onClick={() => setSection(tier.name)}
          >
            {tier.name}
          </Button>
        ))}

        {filtering && (
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="tabular-nums">
              {shown} of {challenges.length}
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
              clear
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
        <section key={tier.name} className="mb-12">
          <div className="mb-4 flex items-baseline gap-3 border-b pb-2">
            <h2 className="text-lg font-semibold tracking-tight">{tier.name}</h2>
            <p className="text-sm text-muted-foreground">{tier.blurb}</p>
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {tier.all.filter((c) => done.has(c.name)).length} / {tier.all.length}
            </span>
          </div>

          <ul className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
            {tier.challenges.map((c) => {
              const isDone = done.has(c.name)
              return (
                <li key={c.name}>
                  <Link
                    to={`/${c.name}`}
                    className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Card
                      className={`h-full gap-3 transition duration-150 group-hover:-translate-y-0.5 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-black/40 ${
                        isDone
                          ? 'border-primary/60 group-hover:border-primary'
                          : 'group-hover:border-muted-foreground'
                      }`}
                    >
                      <CardHeader className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
                        <span>{String(c.level).padStart(2, '0')}</span>
                        {isDone && <span className="text-primary">✓ done</span>}
                      </CardHeader>

                      <CardContent>
                        <p className="font-mono font-medium group-hover:text-primary">
                          {c.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {c.summary}
                        </p>
                      </CardContent>

                      <CardFooter className="mt-auto flex flex-wrap gap-1.5">
                        {c.topics.map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
                        ))}
                        {!c.needsUi && (
                          <Badge variant="ghost" className="border-dashed">
                            no UI
                          </Badge>
                        )}
                      </CardFooter>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </main>
  )
}
