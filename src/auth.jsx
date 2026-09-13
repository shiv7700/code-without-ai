import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { Button } from '@/components/ui/button'

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

  const signIn = () => {
    setBusy(true)
    // Back to the page they asked for, not always the list.
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.href },
    })
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* The ladder, drawn. Ninety rungs, none of them climbed yet. */}
        <div className="mb-10 flex h-16 items-end gap-[3px]" aria-hidden>
          {Array.from({ length: 90 }, (_, i) => (
            <span
              key={i}
              className="rung flex-1 bg-line"
              style={{ '--i': i, height: `${8 + (i % 7) * 3}%` }}
            />
          ))}
        </div>

        <h1 className="font-mono text-xl font-semibold tracking-tight">
          react practice ladder
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ninety reps, hand-written. Sign in and your code and progress follow
          you to whatever machine you sit down at.
        </p>

        <Button className="mt-8 w-full" onClick={signIn} disabled={busy}>
          {busy ? 'Redirecting…' : 'Continue with GitHub'}
        </Button>
      </div>
    </main>
  )
}
