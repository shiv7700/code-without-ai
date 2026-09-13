import { expect, test, vi } from 'vitest'
import { retryWithBackoff } from './retryWithBackoff'

const flush = () => new Promise((r) => setTimeout(r, 0))

function harness() {
  const runs = []
  const waits = []
  const run = vi.fn(
    () => new Promise((resolve, reject) => runs.push({ resolve, reject })),
  )
  const wait = vi.fn((ms) => new Promise((resolve) => waits.push({ ms, resolve })))
  return {
    run,
    wait,
    fail: async (m) => {
      runs.shift().reject(new Error(m))
      await flush()
    },
    ok: async (v) => {
      runs.shift().resolve(v)
      await flush()
    },
    tick: async () => {
      waits.shift().resolve()
      await flush()
    },
    delays: () => wait.mock.calls.map(([ms]) => ms),
  }
}

const settle = (promise) =>
  promise.then(
    (value) => ['ok', value],
    (error) => ['err', error.message],
  )

test('one attempt is enough when it works', async () => {
  const h = harness()
  const result = settle(retryWithBackoff(h.run, { wait: h.wait }))

  await h.ok('sent')
  expect(await result).toEqual(['ok', 'sent'])
  expect(h.delays()).toEqual([])
})

test('a failure waits before the next attempt, not instead of it', async () => {
  const h = harness()
  settle(retryWithBackoff(h.run, { wait: h.wait }))

  await h.fail('one')
  expect(h.delays()).toEqual([100])
  expect(h.run).toHaveBeenCalledTimes(1)

  await h.tick()
  expect(h.run).toHaveBeenCalledTimes(2)
})

test('the delay doubles on every retry', async () => {
  const h = harness()
  settle(retryWithBackoff(h.run, { retries: 3, wait: h.wait }))

  await h.fail('one')
  await h.tick()
  await h.fail('two')
  await h.tick()
  await h.fail('three')
  await h.tick()

  expect(h.delays()).toEqual([100, 200, 400])
  expect(h.run).toHaveBeenCalledTimes(4)
})

test('it rejects with the last error once the retries run out', async () => {
  const h = harness()
  const result = settle(retryWithBackoff(h.run, { retries: 1, wait: h.wait }))

  await h.fail('one')
  await h.tick()
  await h.fail('two')

  expect(await result).toEqual(['err', 'two'])
})

test('retries: 0 is one attempt and no wait at all', async () => {
  const h = harness()
  const result = settle(retryWithBackoff(h.run, { retries: 0, wait: h.wait }))

  await h.fail('only')
  expect(await result).toEqual(['err', 'only'])
  expect(h.wait).not.toHaveBeenCalled()
})

test('the last attempt is not followed by a wait', async () => {
  const h = harness()
  const result = settle(retryWithBackoff(h.run, { retries: 2, delay: 50, wait: h.wait }))

  await h.fail('one')
  await h.tick()
  await h.fail('two')
  await h.tick()
  await h.fail('three')

  expect(await result).toEqual(['err', 'three'])
  expect(h.delays()).toEqual([50, 100])
})
