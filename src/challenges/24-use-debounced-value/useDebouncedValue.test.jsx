import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))

function probe(initial, delay) {
  const Probe = ({ value }) => <output>{String(useDebouncedValue(value, delay))}</output>
  const view = render(<Probe value={initial} />)
  return {
    ...view,
    shown: () => screen.getByRole('status').textContent,
    set: (value) => act(() => view.rerender(<Probe value={value} />)),
  }
}

test('shows the first value immediately', () => {
  const p = probe('a', 200)
  expect(p.shown()).toBe('a')
})

test('keeps the old value until the delay is up', () => {
  const p = probe('a', 200)

  p.set('b')
  expect(p.shown()).toBe('a')

  advance(199)
  expect(p.shown()).toBe('a')
})

test('lands on the new value once the delay passes', () => {
  const p = probe('a', 200)

  p.set('b')
  advance(200)
  expect(p.shown()).toBe('b')
})

test('rapid changes collapse into the last one', () => {
  const p = probe('a', 200)

  p.set('b')
  advance(100)
  p.set('c')
  advance(100)
  expect(p.shown()).toBe('a')

  advance(100)
  expect(p.shown()).toBe('c')
})

test('unmounting cancels a pending update', () => {
  const p = probe('a', 200)

  p.set('b')
  p.unmount()
  expect(() => advance(500)).not.toThrow()
})
