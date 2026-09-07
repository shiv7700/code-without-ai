import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { throttle } from './throttle'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

test('fires straight away on the first call', () => {
  const spy = vi.fn()
  throttle(spy, 100)('a')
  expect(spy).toHaveBeenCalledWith('a')
})

test('swallows the calls inside the window', () => {
  const spy = vi.fn()
  const t = throttle(spy, 100)

  t('a')
  t('b')
  t('c')
  expect(spy).toHaveBeenCalledTimes(1)
})

test('the last swallowed call lands at the end of the window', () => {
  const spy = vi.fn()
  const t = throttle(spy, 100)

  t('a')
  t('b')
  t('c')
  vi.advanceTimersByTime(100)

  expect(spy.mock.calls).toEqual([['a'], ['c']])
})

test('calls spaced further apart than the wait all fire', () => {
  const spy = vi.fn()
  const t = throttle(spy, 100)

  t()
  vi.advanceTimersByTime(200)
  t()
  vi.advanceTimersByTime(200)
  t()

  expect(spy).toHaveBeenCalledTimes(3)
})

test('trailing off means a burst fires exactly once', () => {
  const spy = vi.fn()
  const t = throttle(spy, 100, { trailing: false })

  t('a')
  t('b')
  vi.advanceTimersByTime(500)

  expect(spy.mock.calls).toEqual([['a']])
})

test('leading off means the first call waits its turn', () => {
  const spy = vi.fn()
  const t = throttle(spy, 100, { leading: false })

  t('a')
  expect(spy).not.toHaveBeenCalled()

  vi.advanceTimersByTime(100)
  expect(spy).toHaveBeenCalledWith('a')
})
