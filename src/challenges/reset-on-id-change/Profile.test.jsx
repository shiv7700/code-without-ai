import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Profile from './Profile'

function controllable() {
  const pending = new Map()
  const load = vi.fn(
    (id) => new Promise((resolve) => pending.set(id, resolve)),
  )
  return { load, resolve: (id, v) => act(async () => pending.get(id)(v)) }
}

test('shows the name once it arrives', async () => {
  const api = controllable()
  render(<Profile userId={1} load={api.load} />)

  await api.resolve(1, { name: 'Ada' })
  expect(screen.getByText('Ada')).toBeInTheDocument()
})

test('a new id goes straight back to loading', async () => {
  const api = controllable()
  const { rerender } = render(<Profile userId={1} load={api.load} />)
  await api.resolve(1, { name: 'Ada' })

  rerender(<Profile userId={2} load={api.load} />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

test('the previous name is gone while the new one loads', async () => {
  const api = controllable()
  const { rerender } = render(<Profile userId={1} load={api.load} />)
  await api.resolve(1, { name: 'Ada' })

  rerender(<Profile userId={2} load={api.load} />)
  expect(screen.queryByText('Ada')).not.toBeInTheDocument()
})

test('and the new one does arrive', async () => {
  const api = controllable()
  const { rerender } = render(<Profile userId={1} load={api.load} />)
  await api.resolve(1, { name: 'Ada' })

  rerender(<Profile userId={2} load={api.load} />)
  await api.resolve(2, { name: 'Linus' })
  expect(screen.getByText('Linus')).toBeInTheDocument()
})
