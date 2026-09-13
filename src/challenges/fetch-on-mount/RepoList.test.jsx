import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import RepoList from './RepoList'

function controllable() {
  let settle
  const load = vi.fn(() => new Promise((resolve) => (settle = resolve)))
  return { load, resolve: (v) => act(async () => settle(v)) }
}

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('renders nothing in the list until the promise settles', () => {
  const api = controllable()
  render(<RepoList load={api.load} />)
  expect(rows()).toEqual([])
})

test('renders what it resolved with', async () => {
  const api = controllable()
  render(<RepoList load={api.load} />)

  await api.resolve(['react', 'vite'])
  expect(rows()).toEqual(['react', 'vite'])
})

test('calls load once, not once per render', async () => {
  const api = controllable()
  const { rerender } = render(<RepoList load={api.load} />)

  await api.resolve(['react'])
  rerender(<RepoList load={api.load} />)
  rerender(<RepoList load={api.load} />)

  expect(api.load).toHaveBeenCalledTimes(1)
})

test('an empty result renders an empty list, not a crash', async () => {
  const api = controllable()
  render(<RepoList load={api.load} />)

  await api.resolve([])
  expect(rows()).toEqual([])
})
