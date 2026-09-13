import { expect, test, vi } from 'vitest'
import { mapAsyncLimit } from './mapAsyncLimit'

const after = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms))

test('an empty list resolves with an empty list', async () => {
  await expect(mapAsyncLimit([], 2, async () => 1)).resolves.toEqual([])
})

test('maps every item', async () => {
  await expect(mapAsyncLimit([1, 2, 3], 2, async (n) => n * 2)).resolves.toEqual([2, 4, 6])
})

test('results keep input order however the timings fall', async () => {
  const out = await mapAsyncLimit([30, 1, 20, 1], 2, (ms) => after(ms, ms))
  expect(out).toEqual([30, 1, 20, 1])
})

test('the index is passed in', async () => {
  const spy = vi.fn(async (item, index) => index)
  await expect(mapAsyncLimit(['a', 'b'], 1, spy)).resolves.toEqual([0, 1])
})

test('never runs more than limit at a time', async () => {
  let running = 0
  let peak = 0

  await mapAsyncLimit([5, 5, 5, 5, 5, 5], 2, async (ms) => {
    running++
    peak = Math.max(peak, running)
    await after(ms)
    running--
  })

  expect(peak).toBe(2)
})

test('a limit larger than the list is fine', async () => {
  await expect(mapAsyncLimit([1, 2], 99, async (n) => n)).resolves.toEqual([1, 2])
})

test('one failure rejects the whole thing', async () => {
  const boom = new Error('boom')
  const promise = mapAsyncLimit([1, 2, 3], 2, async (n) => {
    if (n === 2) throw boom
    return n
  })

  await expect(promise).rejects.toBe(boom)
})
