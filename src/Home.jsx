import { useState } from 'react'
import { Link } from 'react-router'
import { challenges } from './challenges'
import { load, saveUser } from './store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function Home() {
  // Read on mount rather than lifting state — routing unmounts this screen, so
  // coming back from a challenge picks up whatever it recorded.
  const [{ user, done }, setState] = useState(load)

  const rename = () => {
    const next = prompt('Your name', user)
    if (next === null) return // cancelled — keep the name we had
    saveUser(next)
    setState((s) => ({ ...s, user: next }))
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-14 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          React practice ladder
        </h1>

        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          {/* The name doubles as a GitHub handle. Anything with a space in it
              is a display name, not a handle, so it stays plain text. */}
          {user &&
            (/^[\w-]+$/.test(user) ? (
              <a
                href={`https://github.com/${user}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {user}
              </a>
            ) : (
              <span className="font-medium text-foreground">{user}</span>
            ))}
          {user && <span aria-hidden>·</span>}
          <span>
            {done.size} of {challenges.length} done
          </span>
          <Button variant="link" size="xs" onClick={rename}>
            {user ? 'change name' : 'set your name'}
          </Button>
        </p>

        <Progress
          value={(done.size / challenges.length) * 100}
          className="mt-4"
        />
      </header>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-4">
        {challenges.map((c) => {
          const isDone = done.has(c.name)
          return (
            <li key={c.name}>
              <Link to={`/${c.name}`} className="group block h-full">
                <Card
                  className={`h-full gap-3 transition-colors ${
                    isDone
                      ? 'border-primary/60'
                      : 'group-hover:border-muted-foreground/40'
                  }`}
                >
                  <CardHeader className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
                    <span>{String(c.level).padStart(2, '0')}</span>
                    {isDone && <span className="text-primary">✓ done</span>}
                  </CardHeader>

                  <CardContent className="font-medium">{c.title}</CardContent>

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
    </main>
  )
}
