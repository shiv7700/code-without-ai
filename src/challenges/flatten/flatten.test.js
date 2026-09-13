import { expect, test } from 'vitest'
import { flatten } from './flatten'

test('a flat array comes back flat', () => {
  expect(flatten([1, 2, 3])).toEqual([1, 2, 3])
})

test('flattens all the way down by default', () => {
  expect(flatten([1, [2, [3, [4, [5]]]]])).toEqual([1, 2, 3, 4, 5])
})

test('empty arrays disappear', () => {
  expect(flatten([1, [], [2, []], []])).toEqual([1, 2])
})

test('depth 1 only unwraps one level', () => {
  expect(flatten([1, [2, [3, [4]]]], 1)).toEqual([1, 2, [3, [4]]])
})

test('depth 0 is a shallow copy', () => {
  const input = [1, [2]]
  const out = flatten(input, 0)

  expect(out).toEqual([1, [2]])
  expect(out).not.toBe(input)
})

test('non-array values pass through untouched', () => {
  const obj = { a: [1] }
  expect(flatten([obj, [null, undefined]])).toEqual([obj, null, undefined])
})

test('the input is not modified', () => {
  const input = [1, [2, [3]]]
  flatten(input)
  expect(input).toEqual([1, [2, [3]]])
})
