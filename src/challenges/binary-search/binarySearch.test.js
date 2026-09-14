import { expect, test } from 'vitest'
import { binarySearch } from './binarySearch'

test('finds an element', () => {
  expect(binarySearch([1, 3, 5, 7], 5)).toBe(2)
  expect(binarySearch([1, 3, 5, 7], 1)).toBe(0)
  expect(binarySearch([1, 3, 5, 7], 7)).toBe(3)
})

test('returns the first of several equal elements', () => {
  expect(binarySearch([1, 2, 2, 2, 2, 3], 2)).toBe(1)
  expect(binarySearch([5, 5, 5, 5], 5)).toBe(0)
})

test('a miss encodes where it would have gone', () => {
  expect(~binarySearch([1, 3, 5], 4)).toBe(2)
  expect(~binarySearch([1, 3, 5], 0)).toBe(0)
  expect(~binarySearch([1, 3, 5], 9)).toBe(3)
})

test('an empty array is a miss at the front', () => {
  expect(binarySearch([], 'anything')).toBe(-1)
})

test('a custom compare decides everything', () => {
  const people = [{ age: 20 }, { age: 30 }, { age: 40 }]
  const byAge = (a, b) => a.age - b.age

  expect(binarySearch(people, { age: 30 }, byAge)).toBe(1)
  expect(~binarySearch(people, { age: 35 }, byAge)).toBe(2)
})

test('it halves the range instead of walking it', () => {
  const list = Array.from({ length: 1024 }, (_, i) => i * 2)
  let calls = 0
  const counted = (a, b) => {
    calls++
    return a < b ? -1 : a > b ? 1 : 0
  }

  binarySearch(list, 1337, counted)
  expect(calls).toBeLessThanOrEqual(13)
})

test('the array is not modified', () => {
  const list = [1, 3, 5]
  binarySearch(list, 3)
  expect(list).toEqual([1, 3, 5])
})
