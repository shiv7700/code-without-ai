import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useClipboard } from './useClipboard'

let writeText

beforeEach(() => {
  vi.useFakeTimers()
  writeText = vi.fn(() => Promise.resolve())
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
})
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const flush = () => act(async () => {})

function probe(resetAfter) {
  const seen = { copy: null, ids: new Set() }
  const Probe = () => {
    const [copied, copy] = useClipboard(resetAfter)
    seen.copy = copy
    seen.ids.add(copy)
    return <output>{String(copied)}</output>
  }
  const view = render(<Probe />)
  return {
    ...view,
    seen,
    copied: () => screen.getByRole('status').textContent === 'true',
    run: async (text) => {
      await act(async () => seen.copy(text))
    },
    rerender: () => act(() => view.rerender(<Probe />)),
  }
}

test('starts not copied', () => {
  const p = probe(1000)
  expect(p.copied()).toBe(false)
})

test('writes the text to the clipboard', async () => {
  const p = probe(1000)

  await p.run('hello')
  expect(writeText).toHaveBeenCalledWith('hello')
})

test('flips to copied after a successful write', async () => {
  const p = probe(1000)

  await p.run('hello')
  expect(p.copied()).toBe(true)
})

test('falls back to false once the window passes', async () => {
  const p = probe(1000)

  await p.run('hello')
  advance(999)
  expect(p.copied()).toBe(true)

  advance(1)
  expect(p.copied()).toBe(false)
})

test('copying again restarts the window', async () => {
  const p = probe(1000)

  await p.run('a')
  advance(900)
  await p.run('b')
  advance(900)
  expect(p.copied()).toBe(true)
})

test('a rejected write leaves copied false and does not throw', async () => {
  writeText.mockRejectedValueOnce(new Error('denied'))
  const p = probe(1000)

  await p.run('hello')
  await flush()
  expect(p.copied()).toBe(false)
})

test('copy keeps a stable identity across re-renders', () => {
  const p = probe(1000)

  p.rerender()
  expect(p.seen.ids.size).toBe(1)
})

test('unmounting cancels the pending reset', async () => {
  const p = probe(1000)

  await p.run('hello')
  p.unmount()
  expect(() => advance(2000)).not.toThrow()
})
