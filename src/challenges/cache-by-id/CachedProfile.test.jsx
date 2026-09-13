import { act, render, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import CachedProfile, { clearProfileCache } from './CachedProfile'

beforeEach(() => clearProfileCache())

function controllable() {
  const pending = new Map()
  const load = vi.fn(
    (id) => new Promise((resolve, reject) => pending.set(id, { resolve, reject })),
  )
  return {
    load,
    resolve: (id, v) => act(async () => pending.get(id).resolve(v)),
    ids: () => load.mock.calls.map(([id]) => id),
  }
}

test('an unknown id loads', async () => {
  const api = controllable()
  render(<CachedProfile id="1" load={api.load} />)

  expect(screen.getByText('Loading…')).toBeInTheDocument()
  await api.resolve('1', 'Ada')
  expect(screen.getByText('Ada')).toBeInTheDocument()
})

test('a second instance reads the cache instead of loading', async () => {
  const api = controllable()
  const first = render(<CachedProfile id="1" load={api.load} />)
  await api.resolve('1', 'Ada')
  first.unmount()

  render(<CachedProfile id="1" load={api.load} />)

  expect(screen.getByText('Ada')).toBeInTheDocument()
  expect(api.ids()).toEqual(['1'])
})

test('clearing the cache makes the next render load again', async () => {
  const api = controllable()
  const first = render(<CachedProfile id="1" load={api.load} />)
  await api.resolve('1', 'Ada')
  first.unmount()

  clearProfileCache()
  render(<CachedProfile id="1" load={api.load} />)

  expect(screen.getByText('Loading…')).toBeInTheDocument()
  expect(api.ids()).toEqual(['1', '1'])
})

test('an unknown id shows Loading… and not the name it had before', async () => {
  const api = controllable()
  const { rerender } = render(<CachedProfile id="1" load={api.load} />)
  await api.resolve('1', 'Ada')

  rerender(<CachedProfile id="2" load={api.load} />)

  expect(screen.getByText('Loading…')).toBeInTheDocument()
  expect(screen.queryByText('Ada')).not.toBeInTheDocument()
})

test('changing to a cached id shows it on that very render', async () => {
  const api = controllable()
  const { rerender } = render(<CachedProfile id="1" load={api.load} />)
  await api.resolve('1', 'Ada')

  rerender(<CachedProfile id="2" load={api.load} />)
  await api.resolve('2', 'Bea')

  rerender(<CachedProfile id="1" load={api.load} />)

  expect(screen.getByText('Ada')).toBeInTheDocument()
  expect(api.ids()).toEqual(['1', '2'])
})
