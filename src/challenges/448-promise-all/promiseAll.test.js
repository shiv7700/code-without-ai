import { expect, test } from 'vitest'
import { promiseAll } from './promiseAll'

const after = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms))
const failAfter = (ms, error) =>
  new Promise((_, reject) => setTimeout(() => reject(error), ms))

test('resolves with an empty array for an empty input', async () => {
  await expect(promiseAll([])).resolves.toEqual([])
})

test('resolves with every value', async () => {
  await expect(promiseAll([Promise.resolve(1), Promise.resolve(2)])).resolves.toEqual([1, 2])
})

test('results keep input order, not finishing order', async () => {
  await expect(promiseAll([after(30, 'slow'), after(1, 'fast')])).resolves.toEqual([
    'slow',
    'fast',
  ])
})

test('plain values are allowed alongside promises', async () => {
  await expect(promiseAll([1, Promise.resolve(2), 'three'])).resolves.toEqual([1, 2, 'three'])
})

test('rejects with the first rejection reason', async () => {
  const boom = new Error('boom')
  await expect(promiseAll([after(30, 1), failAfter(1, boom)])).rejects.toBe(boom)
})

test('does not wait for the rest before rejecting', async () => {
  const boom = new Error('boom')
  const never = new Promise(() => {})
  await expect(promiseAll([never, Promise.reject(boom)])).rejects.toBe(boom)
})

test('returns a promise, not the array', () => {
  expect(promiseAll([1])).toBeInstanceOf(Promise)
})
