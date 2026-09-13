import { createContext, useContext, useEffect, useState } from 'react'
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
  const [busy, setBusy] = useState(false)
  // Lazy init, so clicking the button does not deal a new quote on the way out.
  const [[quote, author]] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
  )

  const signIn = () => {
    setBusy(true)
    // Back to the page they asked for, but origin + pathname only. `href` keeps
    // whatever hash is already there, and the token arrives after a second `#`
    // that supabase cannot parse — which then never clears on its own.
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
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

        <h1 className="font-mono text-xl font-semibold tracking-tight">
          react practice ladder
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {challenges.length} reps, hand-written. Sign in and your code follows
          you to whatever machine you sit down at.
        </p>

        <Button className="mt-8 w-full" onClick={signIn} disabled={busy}>
          {busy ? 'Redirecting…' : 'Continue with GitHub'}
        </Button>

        <figure className="mt-10 border-t border-border pt-6">
          <blockquote className="text-sm leading-relaxed text-muted-foreground italic">
            “{quote}”
          </blockquote>
          <figcaption className="mt-2.5 font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground/70 uppercase">
            {author}
          </figcaption>
        </figure>
      </div>
    </main>
  )
}
