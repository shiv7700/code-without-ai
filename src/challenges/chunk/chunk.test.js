import { expect, test } from 'vitest'
import { chunk } from './chunk'

test('splits a list into groups of the given size', () => {
  expect(chunk([1, 2, 3, 4], 2)).toEqual([
    [1, 2],
    [3, 4],
  ])
})

test('the last group is short when it does not divide evenly', () => {
  expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
})

test('a size larger than the list gives one group', () => {
  expect(chunk([1, 2], 10)).toEqual([[1, 2]])
})

test('the default size is one', () => {
  expect(chunk([1, 2])).toEqual([[1], [2]])
})

test('an empty list gives no groups', () => {
  expect(chunk([], 3)).toEqual([])
})

test('a size below one gives an empty array instead of looping forever', () => {
  expect(chunk([1, 2, 3], 0)).toEqual([])
  expect(chunk([1, 2, 3], -2)).toEqual([])
  expect(chunk([1, 2, 3], NaN)).toEqual([])
})

test('the input is not modified and the groups are new arrays', () => {
  const input = [1, 2, 3]
  const out = chunk(input, 3)

  expect(input).toEqual([1, 2, 3])
  expect(out[0]).not.toBe(input)
})
