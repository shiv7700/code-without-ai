import { expect, test } from 'vitest'
import { splitWhen } from './splitWhen'

const isZero = (n) => n === 0

test('cuts the list at each separator', () => {
  expect(splitWhen([1, 2, 0, 3, 4], isZero)).toEqual([
    [1, 2],
    [3, 4],
  ])
})

test('the separator itself is in no group', () => {
  const out = splitWhen([1, 0, 2], isZero)
  expect(out.flat()).toEqual([1, 2])
})

test('a separator at either end leaves an empty group there', () => {
  expect(splitWhen([0, 1], isZero)).toEqual([[], [1]])
  expect(splitWhen([1, 0], isZero)).toEqual([[1], []])
})

test('two separators in a row leave an empty group between them', () => {
  expect(splitWhen([1, 0, 0, 2], isZero)).toEqual([[1], [], [2]])
})

test('no separator gives a single group with everything', () => {
  expect(splitWhen([1, 2, 3], isZero)).toEqual([[1, 2, 3]])
})

test('an empty list gives one empty group', () => {
  expect(splitWhen([], isZero)).toEqual([[]])
})

test('the predicate is given the index too', () => {
  expect(splitWhen(['a', 'b', 'c', 'd'], (_, i) => i % 2 === 1)).toEqual([
    ['a'],
    ['c'],
    [],
  ])
})

test('the input is untouched and the groups are new arrays', () => {
  const input = [1, 2, 3]
  const out = splitWhen(input, isZero)

  expect(input).toEqual([1, 2, 3])
  expect(out[0]).not.toBe(input)
})
