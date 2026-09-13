import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { useInterval } from './useInterval'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))

function probe(callback, delay) {
  const Probe = ({ cb, ms }) => {
    useInterval(cb, ms)
    return null
  }
  const view = render(<Probe cb={callback} ms={delay} />)
  return {
    ...view,
    set: (cb, ms) => act(() => view.rerender(<Probe cb={cb} ms={ms} />)),
  }
}

test('ticks on every delay', () => {
  const tick = vi.fn()
  probe(tick, 100)

  advance(250)
  expect(tick).toHaveBeenCalledTimes(2)
})

test('a null delay pauses it', () => {
  const tick = vi.fn()
  probe(tick, null)

  advance(1000)
  expect(tick).not.toHaveBeenCalled()
})

test('re-rendering with a new inline callback does not restart the interval', () => {
  const tick = vi.fn()
  const { set } = probe(() => tick(), 100)

  advance(90)
  set(() => tick(), 100) // new function identity, same delay
  advance(90)

  // 180ms total. If the interval restarted on re-render it would be at 0 calls.
  expect(tick).toHaveBeenCalledTimes(1)
})

test('calls the LATEST callback', () => {
  const calls = []
  const { set } = probe(() => calls.push('old'), 100)

  set(() => calls.push('new'), 100)
  advance(100)

  expect(calls).toEqual(['new'])
})

test('changing the delay restarts at the new rate, with only one interval alive', () => {
  const tick = vi.fn()
  const { set } = probe(tick, 100)

  advance(100)
  expect(tick).toHaveBeenCalledTimes(1)

  set(tick, 50)
  advance(100)

  // 2 ticks at the new 50ms rate. A leaked 100ms interval would make it 3.
  expect(tick).toHaveBeenCalledTimes(3)
})

test('unmount stops the ticking', () => {
  const tick = vi.fn()
  const { unmount } = probe(tick, 100)

  advance(100)
  unmount()
  advance(500)

  expect(tick).toHaveBeenCalledTimes(1)
})
