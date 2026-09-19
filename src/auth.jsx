import { createContext, useContext, useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { supabase } from './supabase'
import { challenges } from './challenges'
import { Button } from '@/components/ui/button'

const SPEC_COUNT = challenges.reduce((n, c) => n + c.tests.length, 0)

// What the sign-in is for, said plainly. All three are true today.
const KEPT = [
  [
    'Your code, as you type it',
    'Every challenge saves itself a second after you stop typing. Close the tab mid-thought and it is still there.',
  ],
  [
    'Progress that follows you',
    'A challenge turns solved the moment its suite goes green, on whatever machine you happen to be at.',
  ],
  [
    'Nothing written back',
    'No repositories, no gists, no commits in your name. Sign-in is how the rows find you and that is all.',
  ],
]

// lucide dropped brand marks, and this is the one button on the page.
const GithubMark = () => (
  <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-current">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
)

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
    <main className="relative min-h-dvh overflow-hidden">
      <div className="blueprint pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="glow pointer-events-none absolute inset-x-0 top-0 h-[40rem]"
        style={{ '--glow-x': '30%', '--glow-y': '40%' }}
        aria-hidden
      />

      <div className="relative mx-auto grid min-h-dvh max-w-5xl items-center gap-16 px-6 py-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="label inline-block text-muted-foreground transition-colors hover:text-foreground"
          >
            ← react without ai
          </Link>

          {/* Most people reaching this have never been here — the old copy
              welcomed them back to somewhere they had not been. */}
          <h1 className="mt-10 text-title text-balance">Save what you write.</h1>
          <p className="mt-5 text-sub text-subtle">
            {challenges.length} challenges, and the first one needs no account
            at all. Sign in when you want to keep what you have written.
          </p>

          <Button
            size="xl"
            className="mt-9 w-full"
            onClick={signIn}
            disabled={busy}
          >
            <GithubMark />
            {busy ? 'Redirecting…' : 'Continue with GitHub'}
          </Button>

          <p className="mt-4 text-fine text-muted-foreground">
            GitHub gives us your handle and avatar. Nothing else, and nothing is
            written to your account.
          </p>

          <figure className="mt-12 border-t border-border pt-6">
            <blockquote className="text-fine leading-relaxed text-muted-foreground italic">
              “{quote}”
            </blockquote>
            <figcaption className="label mt-2.5 text-muted-foreground/70">
              {author}
            </figcaption>
          </figure>
        </div>

        {/* The old page put a decorative ninety-bar smudge here and called it a
            ladder. This is the same space spent on what signing in is actually for. */}
        <ul className="hidden lg:block">
          {KEPT.map(([title, body], i) => (
            <li
              key={title}
              className="rung border-t border-border py-6 first:border-t-0 first:pt-0"
              style={{ '--i': i }}
            >
              <h2 className="text-sub font-medium">{title}</h2>
              <p className="mt-1.5 text-fine leading-relaxed text-muted-foreground">
                {body}
              </p>
            </li>
          ))}

          <li className="mt-2 border-t border-border pt-6 font-mono text-fine text-muted-foreground tabular-nums">
            {challenges.length} challenges
            <span className="mx-2.5 text-muted-foreground/40">·</span>
            {SPEC_COUNT.toLocaleString()} specs
            <span className="mx-2.5 text-muted-foreground/40">·</span>
            <span className="text-foreground">0</span> written for you
          </li>
        </ul>
      </div>
    </main>
  )
}
