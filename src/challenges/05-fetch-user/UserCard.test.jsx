import { act, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import UserCard from './UserCard'

// A fetchUser you control by hand: nothing resolves until you say so.
function controllable() {
  const pending = new Map()
  const fetchUser = (id) =>
    new Promise((resolve, reject) => pending.set(id, { resolve, reject }))

  return {
    fetchUser,
    resolve: (id, value) => act(async () => pending.get(id).resolve(value)),
    reject: (id, err) => act(async () => pending.get(id).reject(err)),
  }
}

test('shows a loader, then the name', async () => {
  const api = controllable()
  render(<UserCard userId={1} fetchUser={api.fetchUser} />)

  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  await api.resolve(1, { name: 'Shivang' })
  expect(screen.getByText('Shivang')).toBeInTheDocument()
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})

test('shows an error message when the request fails', async () => {
  const api = controllable()
  render(<UserCard userId={1} fetchUser={api.fetchUser} />)

  await api.reject(1, new Error('boom'))
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})

test('going to a new userId goes back to loading', async () => {
  const api = controllable()
  const { rerender } = render(<UserCard userId={1} fetchUser={api.fetchUser} />)

  await api.resolve(1, { name: 'First' })
  expect(screen.getByText('First')).toBeInTheDocument()

  rerender(<UserCard userId={2} fetchUser={api.fetchUser} />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  expect(screen.queryByText('First')).not.toBeInTheDocument()
})

test('a late response for an old userId is ignored', async () => {
  const api = controllable()
  const { rerender } = render(<UserCard userId={1} fetchUser={api.fetchUser} />)

  // user 1 is still in flight when we switch to user 2
  rerender(<UserCard userId={2} fetchUser={api.fetchUser} />)

  // user 2 answers first...
  await api.resolve(2, { name: 'Second' })
  // ...and user 1's slow response lands afterwards
  await api.resolve(1, { name: 'First' })

  expect(screen.getByText('Second')).toBeInTheDocument()
  expect(screen.queryByText('First')).not.toBeInTheDocument()
})

test('a late failure for an old userId does not blow up the screen', async () => {
  const api = controllable()
  const { rerender } = render(<UserCard userId={1} fetchUser={api.fetchUser} />)

  rerender(<UserCard userId={2} fetchUser={api.fetchUser} />)

  await api.resolve(2, { name: 'Second' })
  await api.reject(1, new Error('too late'))

  expect(screen.getByText('Second')).toBeInTheDocument()
  expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
})
