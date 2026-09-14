import { expect, test, vi } from 'vitest'
import { debouncePromise } from './debouncePromise'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Fails in 300ms with a readable message instead of hanging until the timeout.
const within = (promise) =>
  Promise.race([promise, sleep(300).then(() => 'never settled')])

test('a single call resolves with the result', async () => {
  const search = debouncePromise(async (q) => `hits for ${q}`, 10)
  await expect(within(search('react'))).resolves.toBe('hits for react')
})

test('calls in the same window run the function once, with the last arguments', async () => {
  const fn = vi.fn(async (q) => q.toUpperCase())
  const search = debouncePromise(fn, 10)

  search('a')
  search('ab')
  await search('abc')

  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenCalledWith('abc')
})

test('every caller in the window gets the one result', async () => {
  const search = debouncePromise(async (q) => `hits for ${q}`, 10)

  const all = within(Promise.all([search('a'), search('ab'), search('abc')]))
  await expect(all).resolves.toEqual([
    'hits for abc',
    'hits for abc',
    'hits for abc',
  ])
})

test('a rejection reaches every caller in the window', async () => {
  const boom = new Error('boom')
  const search = debouncePromise(async () => {
    throw boom
  }, 10)

  const first = search('a')
  const second = search('ab')

  await expect(within(first)).rejects.toBe(boom)
  await expect(within(second)).rejects.toBe(boom)
})

test('nothing runs before the window is up', async () => {
  const fn = vi.fn(async () => 'done')
  const search = debouncePromise(fn, 10)

  const promise = search('a')
  await Promise.resolve()
  expect(fn).not.toHaveBeenCalled()

  await promise
  expect(fn).toHaveBeenCalledTimes(1)
})

test('a call after it has run starts a fresh window', async () => {
  const fn = vi.fn(async (q) => q)
  const search = debouncePromise(fn, 10)

  await expect(within(search('a'))).resolves.toBe('a')
  await expect(within(search('b'))).resolves.toBe('b')

  expect(fn).toHaveBeenCalledTimes(2)
})
