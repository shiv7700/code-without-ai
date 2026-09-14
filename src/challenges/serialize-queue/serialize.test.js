import { expect, test, vi } from 'vitest'
import { serialize } from './serialize'

const flush = () => new Promise((r) => setTimeout(r, 0))

function controllable() {
  const pending = new Map()
  const fn = vi.fn(
    (id) => new Promise((resolve, reject) => pending.set(id, { resolve, reject })),
  )
  return {
    fn,
    settle: async (id, value) => {
      pending.get(id).resolve(value)
      await flush()
    },
    fail: async (id, error) => {
      pending.get(id).reject(error)
      await flush()
    },
  }
}

test('a single call behaves like the original', async () => {
  const run = serialize(async (n) => n * 2)
  await expect(run(21)).resolves.toBe(42)
})

test('the second call does not start until the first has settled', async () => {
  const api = controllable()
  const run = serialize(api.fn)

  run('a')
  run('b')
  await flush()
  expect(api.fn).toHaveBeenCalledTimes(1)

  await api.settle('a', 1)
  expect(api.fn).toHaveBeenCalledTimes(2)
})

test('every caller gets its own result', async () => {
  const api = controllable()
  const run = serialize(api.fn)

  const first = run('a')
  const second = run('b')
  await flush()

  await api.settle('a', 'A')
  await api.settle('b', 'B')

  expect(await first).toBe('A')
  expect(await second).toBe('B')
})

test('a rejection reaches its own caller', async () => {
  const api = controllable()
  const run = serialize(api.fn)
  const boom = new Error('boom')

  const outcome = run('a').catch((e) => e)
  await flush()
  await api.fail('a', boom)

  expect(await outcome).toBe(boom)
})

test('a rejection does not stop the queue', async () => {
  const api = controllable()
  const run = serialize(api.fn)

  run('a').catch(() => {})
  const second = run('b')
  await flush()

  await api.fail('a', new Error('boom'))
  expect(api.fn).toHaveBeenCalledTimes(2)

  await api.settle('b', 'B')
  await expect(second).resolves.toBe('B')
})

test('it works again after the queue has drained', async () => {
  const api = controllable()
  const run = serialize(api.fn)

  const first = run('a')
  await flush()
  await api.settle('a', 'A')
  await first

  const second = run('b')
  await flush()
  await api.settle('b', 'B')
  await expect(second).resolves.toBe('B')
})
