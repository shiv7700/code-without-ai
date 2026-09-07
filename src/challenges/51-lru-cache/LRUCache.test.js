import { expect, test } from 'vitest'
import { LRUCache } from './LRUCache'

test('stores and reads back', () => {
  const cache = new LRUCache(2)
  cache.put('a', 1)
  expect(cache.get('a')).toBe(1)
})

test('a missing key is undefined', () => {
  expect(new LRUCache(2).get('nope')).toBe(undefined)
})

test('size never passes the capacity', () => {
  const cache = new LRUCache(2)
  cache.put('a', 1)
  cache.put('b', 2)
  cache.put('c', 3)

  expect(cache.size).toBe(2)
})

test('the least recently used one is evicted', () => {
  const cache = new LRUCache(2)
  cache.put('a', 1)
  cache.put('b', 2)
  cache.put('c', 3)

  expect(cache.get('a')).toBe(undefined)
  expect(cache.get('b')).toBe(2)
  expect(cache.get('c')).toBe(3)
})

test('reading a key makes it recently used', () => {
  const cache = new LRUCache(2)
  cache.put('a', 1)
  cache.put('b', 2)
  cache.get('a')
  cache.put('c', 3)

  expect(cache.get('a')).toBe(1)
  expect(cache.get('b')).toBe(undefined)
})

test('overwriting a key updates it without growing the cache', () => {
  const cache = new LRUCache(2)
  cache.put('a', 1)
  cache.put('b', 2)
  cache.put('a', 99)

  expect(cache.size).toBe(2)
  expect(cache.get('a')).toBe(99)
})

test('overwriting also counts as recently used', () => {
  const cache = new LRUCache(2)
  cache.put('a', 1)
  cache.put('b', 2)
  cache.put('a', 99)
  cache.put('c', 3)

  expect(cache.get('b')).toBe(undefined)
  expect(cache.get('a')).toBe(99)
})

test('a capacity of one keeps only the last write', () => {
  const cache = new LRUCache(1)
  cache.put('a', 1)
  cache.put('b', 2)

  expect(cache.get('a')).toBe(undefined)
  expect(cache.get('b')).toBe(2)
})

test('a stored undefined is still a stored key', () => {
  const cache = new LRUCache(2)
  cache.put('a', undefined)
  cache.put('b', 1)
  cache.put('c', 2)

  expect(cache.size).toBe(2)
})
