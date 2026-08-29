import { act, render, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { useMediaQuery } from './useMediaQuery'

// One fake MediaQueryList per query string, so a test can flip a match and see
// who was listening.
let lists

const make = (query) => {
  const listeners = new Set()
  return {
    query,
    matches: false,
    addEventListener: (_, fn) => listeners.add(fn),
    removeEventListener: (_, fn) => listeners.delete(fn),
    listeners,
    flip(value) {
      this.matches = value
      listeners.forEach((fn) => fn({ matches: value }))
    },
  }
}

beforeEach(() => {
  lists = new Map()
  window.matchMedia = vi.fn((query) => {
    if (!lists.has(query)) lists.set(query, make(query))
    return lists.get(query)
  })
})

const WIDE = '(min-width: 768px)'
const NARROW = '(max-width: 400px)'

function probe(query) {
  const Probe = ({ q }) => <output>{String(useMediaQuery(q))}</output>
  const view = render(<Probe q={query} />)
  return {
    ...view,
    value: () => screen.getByRole('status').textContent === 'true',
    set: (q) => act(() => view.rerender(<Probe q={q} />)),
  }
}

test('reports false when the query does not match', () => {
  const p = probe(WIDE)
  expect(p.value()).toBe(false)
})

test('reports the real answer on the very first render', () => {
  lists.set(WIDE, Object.assign(make(WIDE), { matches: true }))
  const p = probe(WIDE)
  expect(p.value()).toBe(true)
})

test('re-renders when the match changes', () => {
  const p = probe(WIDE)

  act(() => lists.get(WIDE).flip(true))
  expect(p.value()).toBe(true)
})

test('subscribes to the query it was given', () => {
  probe(WIDE)
  expect(lists.get(WIDE).listeners.size).toBe(1)
})

test('changing the query resubscribes', () => {
  const p = probe(WIDE)

  p.set(NARROW)
  expect(lists.get(WIDE).listeners.size).toBe(0)
  expect(lists.get(NARROW).listeners.size).toBe(1)
})

test('unmounting removes the listener', () => {
  const p = probe(WIDE)

  p.unmount()
  expect(lists.get(WIDE).listeners.size).toBe(0)
})
