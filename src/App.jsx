import { useState } from 'react'
import { challenges } from './challenges'
import { load, saveDone, saveUser } from './store'
import Home from './Home'
import Challenge from './Challenge'
import './app.css'

export default function App() {
  const [{ user, done }, setState] = useState(load)
  const [open, setOpen] = useState(null)

  const rename = () => {
    const next = prompt('Your name', user)
    if (next === null) return // cancelled — keep the name we had
    saveUser(next)
    setState((s) => ({ ...s, user: next }))
  }

  const record = (name) => (passed) =>
    setState((s) => ({ ...s, done: saveDone(name, passed) }))

  const challenge = challenges.find((c) => c.name === open)

  return challenge ? (
    <Challenge
      challenge={challenge}
      onBack={() => setOpen(null)}
      onResult={record(challenge.name)}
    />
  ) : (
    <Home user={user} done={done} onPick={setOpen} onRename={rename} />
  )
}
