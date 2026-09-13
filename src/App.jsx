import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router'
import { challenges } from './challenges'
import { Login, SessionProvider, useSession } from './auth'
import Home from './Home'
import Challenge from './Challenge'
import { Toaster } from '@/components/ui/sonner'
import './app.css'

function ChallengeRoute() {
  const { name } = useParams()
  const challenge = challenges.find((c) => c.name === name)

  // Keyed by name so switching challenges remounts: the saved code is fetched
  // fresh instead of the previous challenge's lingering until the reply lands.
  // A stale or hand-typed link should land on the list, not a blank screen.
  return challenge ? (
    <Challenge key={name} challenge={challenge} />
  ) : (
    <Navigate to="/" replace />
  )
}

// Every route is behind the login, so a deep link bounces through GitHub and
// comes back to the challenge that was asked for.
function Gate() {
  const session = useSession()

  if (session === undefined) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <span className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </main>
    )
  }

  if (session === null) return <Login />

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:name" element={<ChallengeRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Gate />
        <Toaster position="bottom-right" />
      </SessionProvider>
    </BrowserRouter>
  )
}
