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
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          React practice ladder
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ninety challenges. Your code and progress follow you.
        </p>
      </div>

      <Button size="lg" onClick={signIn} disabled={busy}>
        {busy ? 'Redirecting…' : 'Continue with GitHub'}
      </Button>
    </main>
  )
}
