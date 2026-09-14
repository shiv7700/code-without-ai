import { expect, test } from 'vitest'
import { pLimit } from './pLimit'

const flush = () => new Promise((r) => setTimeout(r, 0))

function jobs() {
  const pending = new Map()
  const started = []
  return {
    started,
    job: (id) => () => {
      started.push(id)
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
    },
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

test('a job runs and resolves with its value', async () => {
  const limit = pLimit(2)
  await expect(limit(async (n) => n * 2, 21)).resolves.toBe(42)
})

test('only the limit runs at once', async () => {
  const limit = pLimit(2)
  const q = jobs()

  for (const id of ['a', 'b', 'c', 'd']) limit(q.job(id)).catch(() => {})
  await flush()

  expect(q.started).toEqual(['a', 'b'])
})

test('a freed slot starts the next job that was submitted', async () => {
  const limit = pLimit(2)
  const q = jobs()

  for (const id of ['a', 'b', 'c', 'd']) limit(q.job(id)).catch(() => {})
  await flush()

  await q.settle('b', 'B')
  expect(q.started).toEqual(['a', 'b', 'c'])

  await q.settle('a', 'A')
  expect(q.started).toEqual(['a', 'b', 'c', 'd'])
})

test('a rejection reaches its own caller', async () => {
  const limit = pLimit(1)
  const q = jobs()
  const boom = new Error('boom')

  const outcome = limit(q.job('a')).catch((e) => e)
  await flush()
  await q.fail('a', boom)

  expect(await outcome).toBe(boom)
})

test('a rejected job frees its slot', async () => {
  const limit = pLimit(1)
  const q = jobs()

  limit(q.job('a')).catch(() => {})
  limit(q.job('b')).catch(() => {})
  await flush()

  await q.fail('a', new Error('boom'))
  expect(q.started).toEqual(['a', 'b'])
})

test('the same limiter is still at full capacity for the next batch', async () => {
  const limit = pLimit(2)
  const first = jobs()

  limit(first.job('a')).catch(() => {})
  limit(first.job('b')).catch(() => {})
  await flush()
  await first.fail('a', new Error('boom'))
  await first.fail('b', new Error('boom'))

  const second = jobs()
  limit(second.job('x')).catch(() => {})
  limit(second.job('y')).catch(() => {})
  await flush()

  expect(second.started).toEqual(['x', 'y'])
})

test('a concurrency that is not a positive integer throws', () => {
  expect(() => pLimit(0)).toThrow(TypeError)
  expect(() => pLimit(-1)).toThrow(TypeError)
  expect(() => pLimit(1.5)).toThrow(TypeError)
  expect(() => pLimit()).toThrow(TypeError)
})
