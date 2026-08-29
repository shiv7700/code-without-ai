// A name and twenty booleans. localStorage is the whole database.
const KEY = 'react-practice'

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {} // hand-edited or corrupt — start over rather than crash the app
  }
}

const write = (next) => localStorage.setItem(KEY, JSON.stringify(next))

export const load = () => {
  const { user = '', done = [] } = read()
  return { user, done: new Set(done) }
}

export const saveUser = (user) => write({ ...read(), user })

export const saveDone = (name, passed) => {
  const done = new Set(read().done ?? [])
  passed ? done.add(name) : done.delete(name)
  write({ ...read(), done: [...done] })
  return done
}
