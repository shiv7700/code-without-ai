import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router'
import { challenges } from './challenges'
import Home from './Home'
import Challenge from './Challenge'
import './app.css'

function ChallengeRoute() {
  const { name } = useParams()
  const challenge = challenges.find((c) => c.name === name)

  // A stale or hand-typed link should land on the list, not a blank screen.
  return challenge ? (
    <Challenge challenge={challenge} />
  ) : (
    <Navigate to="/" replace />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:name" element={<ChallengeRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
