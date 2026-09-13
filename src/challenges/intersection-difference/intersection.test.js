import { expect, test } from 'vitest'
import { difference, intersection } from './intersection'

test('intersection keeps what is in both', () => {
  expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
})

test('difference keeps what is only in the first', () => {
  expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1])
})

test('the order comes from the first argument', () => {
  expect(intersection([3, 1, 2], [2, 1, 3])).toEqual([3, 1, 2])
})

test('a repeat in the first argument only appears once', () => {
  expect(intersection([1, 1, 2], [1, 2])).toEqual([1, 2])
  expect(difference([1, 1, 3], [2])).toEqual([1, 3])
})

test('no overlap gives an empty array', () => {
  expect(intersection([1], [2])).toEqual([])
  expect(difference([], [1])).toEqual([])
})

test('NaN is found in the other list', () => {
  expect(intersection([NaN, 1], [NaN])).toEqual([NaN])
  expect(difference([NaN, 1], [NaN])).toEqual([1])
})

test('a key function compares both lists, and the first list supplies the items', () => {
  const mine = [{ id: 1 }, { id: 2 }]
  const theirs = [{ id: 2 }, { id: 3 }]

  expect(intersection(mine, theirs, (u) => u.id)).toEqual([{ id: 2 }])
  expect(intersection(mine, theirs, (u) => u.id)[0]).toBe(mine[1])
  expect(difference(mine, theirs, (u) => u.id)).toEqual([{ id: 1 }])
})

test('the inputs are not modified', () => {
  const left = [1, 2]
  const right = [2]
  intersection(left, right)
  difference(left, right)

  expect(left).toEqual([1, 2])
  expect(right).toEqual([2])
})
