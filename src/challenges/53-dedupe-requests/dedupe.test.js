import { expect, test, vi } from 'vitest'
import { dedupe } from './dedupe'

const after = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms))

test('a single call behaves like the original', async () => {
  await expect(dedupe(async (n) => n * 2)(21)).resolves.toBe(42)
})

test('overlapping calls with the same arguments only run once', async () => {
  const spy = vi.fn((id) => after(10, `user ${id}`))
  const load = dedupe(spy)

  const [a, b] = await Promise.all([load(1), load(1)])

  expect(spy).toHaveBeenCalledTimes(1)
  expect(a).toBe('user 1')
  expect(b).toBe('user 1')
})

test('overlapping calls hand back the same promise', () => {
  const load = dedupe(() => after(10, 'x'))
  expect(load(1)).toBe(load(1))
})

test('different arguments are different requests', async () => {
  const spy = vi.fn((id) => after(10, id))
  const load = dedupe(spy)

  await Promise.all([load(1), load(2)])
  expect(spy).toHaveBeenCalledTimes(2)
})

test('once it has settled, the next call runs again', async () => {
  const spy = vi.fn((id) => after(1, id))
  const load = dedupe(spy)

  await load(1)
  await load(1)

  expect(spy).toHaveBeenCalledTimes(2)
})

test('a failure reaches every waiting caller', async () => {
  const boom = new Error('boom')
  const load = dedupe(() => Promise.reject(boom))

  const results = await Promise.allSettled([load(1), load(1)])
  expect(results.map((r) => r.reason)).toEqual([boom, boom])
})

test('a failure is not cached — the next call retries', async () => {
  const spy = vi.fn().mockRejectedValue(new Error('boom'))
  const load = dedupe(spy)

  await load(1).catch(() => {})
  await load(1).catch(() => {})

  expect(spy).toHaveBeenCalledTimes(2)
})
