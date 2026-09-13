import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Feed from './Feed'

function controllable() {
  const queue = []
  let seen = null
  const loadPage = vi.fn(() => new Promise((resolve) => queue.push(resolve)))
  const watch = (fn) => {
    seen = fn
    return () => (seen = null)
  }
  return {
    loadPage,
    watch,
    watching: () => seen !== null,
    fire: (times = 1) =>
      act(async () => {
        for (let i = 0; i < times; i++) seen?.()
      }),
    resolve: (items) => act(async () => queue.shift()(items)),
    pages: () => loadPage.mock.calls.map(([p]) => p),
  }
}

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('page one loads on mount', async () => {
  const api = controllable()
  render(<Feed loadPage={api.loadPage} watch={api.watch} />)

  expect(api.pages()).toEqual([1])
  await api.resolve(['a'])
  expect(rows()).toEqual(['a'])
})

test('the sentinel coming into view loads the next page', async () => {
  const api = controllable()
  render(<Feed loadPage={api.loadPage} watch={api.watch} />)
  await api.resolve(['a'])

  await api.fire()
  await api.resolve(['b'])

  expect(api.pages()).toEqual([1, 2])
  expect(rows()).toEqual(['a', 'b'])
})

test('an empty page is the end — it stops watching', async () => {
  const api = controllable()
  render(<Feed loadPage={api.loadPage} watch={api.watch} />)
  await api.resolve(['a'])

  await api.fire()
  await api.resolve([])

  expect(screen.getByText('No more')).toBeInTheDocument()
  expect(api.watching()).toBe(false)
})

test('unmounting stops watching', async () => {
  const api = controllable()
  const { unmount } = render(<Feed loadPage={api.loadPage} watch={api.watch} />)
  await api.resolve(['a'])

  unmount()
  expect(api.watching()).toBe(false)
})

test('two sightings before the first page lands still load one page', async () => {
  const api = controllable()
  render(<Feed loadPage={api.loadPage} watch={api.watch} />)

  await api.fire(2)
  expect(api.pages()).toEqual([1])

  await api.resolve(['a'])
  await api.fire()
  await api.resolve(['b'])

  expect(api.pages()).toEqual([1, 2])
  expect(rows()).toEqual(['a', 'b'])
})
