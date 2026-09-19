import { createContext, useContext, useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { supabase } from './supabase'
import { challenges } from './challenges'
import { Button } from '@/components/ui/button'

// Decorative, and deliberately not the challenge count — five hundred ticks
// across a 24rem card is a smudge, not a ladder.
const RUNGS = 90

const QUOTES = [
  ['The only way to learn a new programming language is by writing programs in it.', 'Kernighan & Ritchie'],
  ['Programs must be written for people to read, and only incidentally for machines to execute.', 'Abelson & Sussman'],
  ['Simplicity is prerequisite for reliability.', 'Edsger Dijkstra'],
  ['First, solve the problem. Then write the code.', 'John Johnson'],
  ['Make it work, make it right, make it fast.', 'Kent Beck'],
  ['Weeks of coding can save you hours of planning.', 'anon'],
  ['Talk is cheap. Show me the code.', 'Linus Torvalds'],
  ['Experience is the name everyone gives to their mistakes.', 'Oscar Wilde'],
]

const SessionContext = createContext(null)

const NEXT_KEY = 'react-practice-next'

// `undefined` while the stored session is still being read, so the first paint
// is a spinner rather than the login screen flashing at someone already in.
export function SessionProvider({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    )
    return () => data.subscription.unsubscribe()
  }, [])

  return <SessionContext value={session}>{children}</SessionContext>
}

export const useSession = () => useContext(SessionContext)

// GitHub hands back `user_name` and `avatar_url`; the old localStorage `user`
// was a hand-typed name that had to be kept in sync by hand.
export const useProfile = () => {
  const session = useSession()
  const meta = session?.user?.user_metadata ?? {}
  return { handle: meta.user_name ?? meta.preferred_username, avatar: meta.avatar_url }
}

export const signOut = () => supabase.auth.signOut()

export function Login() {
  const session = useSession()
  const [params] = useSearchParams()
  const [busy, setBusy] = useState(false)
  // Lazy init, so clicking the button does not deal a new quote on the way out.
  const [[quote, author]] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
  )

  // Where to land afterwards. Read from sessionStorage as well as the URL,
  // because the URL is gone by the time GitHub sends us back.
  const next =
    params.get('next') || sessionStorage.getItem(NEXT_KEY) || '/ladder'

  // GitHub comes back to this same route, so the session lands here first and
  // the redirect happens on the way through rather than on a second click.
  if (session) {
    sessionStorage.removeItem(NEXT_KEY)
    return <Navigate to={next} replace />
  }

  const signIn = () => {
    setBusy(true)
    // The destination rides in sessionStorage, not in redirectTo. Supabase
    // matches redirectTo against an allow-list, and a bare origin + path is the
    // one shape every project already permits — a query string is not.
    sessionStorage.setItem(NEXT_KEY, next)
    // Origin + path, never `href`: the token arrives after a `#`, and a hash
    // already in the URL leaves supabase a second one it cannot parse.
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/login` },
    })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="label mb-10 inline-block text-muted-foreground transition-colors hover:text-foreground"
        >
          ← react without ai
        </Link>

        {/* The ladder, drawn. None of it climbed yet. */}
        <div className="mb-10 flex h-16 items-end gap-[3px]" aria-hidden>
          {Array.from({ length: RUNGS }, (_, i) => (
            <span
              key={i}
              className="rung flex-1 bg-border"
              style={{ '--i': i, height: `${8 + (i % 7) * 3}%` }}
            />
          ))}
        </div>

        {/* Most people reaching this have never been here — the old copy
            welcomed them back to somewhere they had not been. */}
        <h1 className="font-mono text-head font-semibold">Save what you write</h1>
        <p className="mt-2 text-body text-subtle">
          {challenges.length} reps, hand-written. Sign in and your code and
          progress follow you to whatever machine you sit down at.
        </p>
        <p className="mt-3 text-fine text-muted-foreground">
          GitHub gives us your handle and avatar. Nothing else, and nothing is
          written to your account.
        </p>

        <Button size="lg" className="mt-8 w-full" onClick={signIn} disabled={busy}>
          {busy ? 'Redirecting…' : 'Continue with GitHub'}
        </Button>

        <figure className="mt-10 border-t border-border pt-6">
          <blockquote className="text-fine leading-relaxed text-muted-foreground italic">
            “{quote}”
          </blockquote>
          <figcaption className="label mt-2.5 text-muted-foreground/70">
            {author}
          </figcaption>
        </figure>
      </div>
    </main>
  )
}
