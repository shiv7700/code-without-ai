import { expect, test } from 'vitest'
import { partition } from './partition'

const odd = (n) => n % 2 === 1

test('splits into the ones that pass and the ones that do not', () => {
  expect(partition([1, 2, 3, 4], odd)).toEqual([
    [1, 3],
    [2, 4],
  ])
})

test('both halves keep the original order', () => {
  expect(partition([5, 2, 3, 8, 1], odd)).toEqual([
    [5, 3, 1],
    [2, 8],
  ])
})

test('an empty list still gives two arrays', () => {
  expect(partition([], odd)).toEqual([[], []])
})

test('everything passing leaves the second half empty', () => {
  expect(partition([1, 3], odd)).toEqual([[1, 3], []])
})

test('the predicate is given the index as well', () => {
  expect(partition(['a', 'b', 'c'], (_, i) => i % 2 === 0)).toEqual([
    ['a', 'c'],
    ['b'],
  ])
})

test('the predicate runs exactly once per item', () => {
  const seen = []
  partition([1, 2, 3], (n) => {
    seen.push(n)
    return odd(n)
  })

  expect(seen).toEqual([1, 2, 3])
})

test('the input is not modified', () => {
  const input = [1, 2, 3]
  partition(input, odd)
  expect(input).toEqual([1, 2, 3])
})
