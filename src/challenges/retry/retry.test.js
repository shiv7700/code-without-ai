import { afterEach, expect, test, vi } from 'vitest'
import { retry } from './retry'

afterEach(() => vi.useRealTimers())

test('a working function runs once', async () => {
  const spy = vi.fn().mockResolvedValue('ok')

  await expect(retry(spy)).resolves.toBe('ok')
  expect(spy).toHaveBeenCalledTimes(1)
})

test('keeps trying until one succeeds', async () => {
  const spy = vi
    .fn()
    .mockRejectedValueOnce(new Error('1'))
    .mockRejectedValueOnce(new Error('2'))
    .mockResolvedValue('ok')

  await expect(retry(spy)).resolves.toBe('ok')
  expect(spy).toHaveBeenCalledTimes(3)
})

test('gives up after retries extra attempts', async () => {
  const spy = vi.fn().mockRejectedValue(new Error('always'))

  await expect(retry(spy, { retries: 2 })).rejects.toThrow('always')
  expect(spy).toHaveBeenCalledTimes(3)
})

test('retries: 0 means one attempt and no more', async () => {
  const spy = vi.fn().mockRejectedValue(new Error('nope'))

  await expect(retry(spy, { retries: 0 })).rejects.toThrow('nope')
  expect(spy).toHaveBeenCalledTimes(1)
})

test('rejects with the last error, not the first', async () => {
  const spy = vi
    .fn()
    .mockRejectedValueOnce(new Error('first'))
    .mockRejectedValueOnce(new Error('last'))

  await expect(retry(spy, { retries: 1 })).rejects.toThrow('last')
})

test('waits the delay between attempts', async () => {
  vi.useFakeTimers()
  const spy = vi.fn().mockRejectedValue(new Error('x'))
  const promise = retry(spy, { retries: 1, delay: 100 }).catch(() => 'failed')

  await vi.advanceTimersByTimeAsync(0)
  expect(spy).toHaveBeenCalledTimes(1)

  await vi.advanceTimersByTimeAsync(100)
  expect(spy).toHaveBeenCalledTimes(2)
  await expect(promise).resolves.toBe('failed')
})

test('the attempt number is passed in', async () => {
  const seen = []
  await retry(
    (attempt) => {
      seen.push(attempt)
      return attempt === 2 ? 'ok' : Promise.reject(new Error('again'))
    },
    { retries: 5 },
  )

  expect(seen).toEqual([0, 1, 2])
})
