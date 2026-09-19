import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router'
import { challenges } from './challenges'
import { Login, SessionProvider, useSession } from './auth'
import Marketing from './Marketing'
import Home from './Home'
import Challenge from './Challenge'
import Check from './Check'
import { Loading } from '@/components/ui/loading'
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
    <Navigate to="/ladder" replace />
  )
}

// The first challenge runs signed out. Someone who has typed a real answer and
// watched a test go green is a different visitor from one asked to authorise
// GitHub against a page they have not touched. Nothing saves until they sign in;
// `store.js` already no-ops every write without a session.
const FREE = challenges[0]?.name

function MaybeGated() {
  const { name } = useParams()

  if (name === FREE) return <ChallengeRoute />

  return (
    <Gate>
      <ChallengeRoute />
    </Gate>
  )
}

// A deep link while signed out carries where it was going, so GitHub sends you
// back to the challenge you asked for and not to the front page.
function Gate({ children }) {
  const session = useSession()
  const { pathname } = useLocation()

  if (session === undefined) {
    return (
      <Loading
        title="Checking your session"
        hint="One moment."
        className="min-h-dvh"
      />
    )
  }

  if (session === null) {
    return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        {/* `/`, `/login` and `/check` are public — the first two are how anyone
            arrives, and /check is the deploy's own smoke test, which has to run
            before a session exists. Everything else is behind Gate. */}
        <Routes>
          <Route path="/" element={<Marketing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/check" element={<Check />} />
          <Route
            path="/ladder"
            element={
              <Gate>
                <Home />
              </Gate>
            }
          />
          <Route path="/:name" element={<MaybeGated />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" />
      </SessionProvider>
    </BrowserRouter>
  )
}
