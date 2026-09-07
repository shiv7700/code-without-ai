import { expect, test, vi } from 'vitest'
import { memoize } from './memoize'

test('returns what the function returns', () => {
  expect(memoize((a, b) => a + b)(1, 2)).toBe(3)
})

test('the same arguments only run the function once', () => {
  const spy = vi.fn((a, b) => a + b)
  const memoized = memoize(spy)

  expect(memoized(1, 2)).toBe(3)
  expect(memoized(1, 2)).toBe(3)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('different arguments run it again', () => {
  const spy = vi.fn((a, b) => a + b)
  const memoized = memoize(spy)

  memoized(1, 2)
  memoized(2, 1)
  expect(spy).toHaveBeenCalledTimes(2)
})

test('object arguments are compared by their contents', () => {
  const spy = vi.fn((user) => user.name)
  const memoized = memoize(spy)

  memoized({ name: 'ada' })
  memoized({ name: 'ada' })
  expect(spy).toHaveBeenCalledTimes(1)
})

test('a cached undefined is still a cache hit', () => {
  const spy = vi.fn(() => undefined)
  const memoized = memoize(spy)

  memoized(1)
  memoized(1)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('two memoized functions do not share a cache', () => {
  const a = memoize(() => 'a')
  const b = memoize(() => 'b')

  expect(a(1)).toBe('a')
  expect(b(1)).toBe('b')
})

test('a custom key function decides what counts as the same call', () => {
  const spy = vi.fn((user) => user.name)
  const memoized = memoize(spy, (user) => user.id)

  memoized({ id: 1, name: 'ada' })
  memoized({ id: 1, name: 'grace' })

  expect(spy).toHaveBeenCalledTimes(1)
})
