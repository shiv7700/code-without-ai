import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { debounce } from './debounce'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('waits, then calls once with the last arguments', () => {
  const spy = vi.fn()
  const d = debounce(spy, 100)

  d('a')
  d('b')
  expect(spy).not.toHaveBeenCalled()

  vi.advanceTimersByTime(100)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('b')
})

test('every call restarts the clock', () => {
  const spy = vi.fn()
  const d = debounce(spy, 100)

  d()
  vi.advanceTimersByTime(90)
  d()
  vi.advanceTimersByTime(90)
  expect(spy).not.toHaveBeenCalled()

  vi.advanceTimersByTime(10)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('leading fires on the first call instead', () => {
  const spy = vi.fn()
  const d = debounce(spy, 100, { leading: true, trailing: false })

  d('a')
  expect(spy).toHaveBeenCalledWith('a')

  d('b')
  vi.advanceTimersByTime(100)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('leading fires again once the gap is long enough', () => {
  const spy = vi.fn()
  const d = debounce(spy, 100, { leading: true, trailing: false })

  d()
  vi.advanceTimersByTime(200)
  d()
  expect(spy).toHaveBeenCalledTimes(2)
})

test('both edges: one call fires once, not twice', () => {
  const spy = vi.fn()
  const d = debounce(spy, 100, { leading: true, trailing: true })

  d('a')
  vi.advanceTimersByTime(100)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('both edges: a burst fires at each end', () => {
  const spy = vi.fn()
  const d = debounce(spy, 100, { leading: true, trailing: true })

  d('a')
  d('b')
  d('c')
  vi.advanceTimersByTime(100)

  expect(spy.mock.calls).toEqual([['a'], ['c']])
})

test('cancel drops the pending call', () => {
  const spy = vi.fn()
  const d = debounce(spy, 100)

  d()
  d.cancel()
  vi.advanceTimersByTime(500)
  expect(spy).not.toHaveBeenCalled()
})
