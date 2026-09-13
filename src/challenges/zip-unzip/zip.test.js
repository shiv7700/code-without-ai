import { expect, test } from 'vitest'
import { unzip, zip } from './zip'

test('pairs up two lists', () => {
  expect(zip([1, 2], ['a', 'b'])).toEqual([
    [1, 'a'],
    [2, 'b'],
  ])
})

test('works for three lists as well as two', () => {
  expect(zip([1], ['a'], [true])).toEqual([[1, 'a', true]])
})

test('a short list is padded with undefined, not cut off', () => {
  expect(zip([1, 2, 3], ['a'])).toEqual([
    [1, 'a'],
    [2, undefined],
    [3, undefined],
  ])
})

test('zip with no lists at all gives an empty array', () => {
  expect(zip()).toEqual([])
})

test('unzip turns the rows back into columns', () => {
  expect(
    unzip([
      [1, 'a'],
      [2, 'b'],
    ]),
  ).toEqual([
    [1, 2],
    ['a', 'b'],
  ])
})

test('unzip pads ragged rows too', () => {
  expect(unzip([[1, 'a'], [2]])).toEqual([
    [1, 2],
    ['a', undefined],
  ])
})

test('the inputs are not modified', () => {
  const left = [1, 2]
  const right = ['a']
  zip(left, right)

  expect(left).toEqual([1, 2])
  expect(right).toEqual(['a'])
})
