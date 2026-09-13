import { expect, test } from 'vitest'
import { range } from './range'

test('one argument counts up from zero', () => {
  expect(range(4)).toEqual([0, 1, 2, 3])
})

test('the end is excluded', () => {
  expect(range(1, 4)).toEqual([1, 2, 3])
  expect(range(3, 3)).toEqual([])
})

test('a step skips values', () => {
  expect(range(0, 10, 3)).toEqual([0, 3, 6, 9])
})

test('a descending range counts down without being told to', () => {
  expect(range(3, 0)).toEqual([3, 2, 1])
})

test('a negative step counts down', () => {
  expect(range(5, 1, -2)).toEqual([5, 3])
})

test('a step pointing away from the end gives nothing', () => {
  expect(range(0, 5, -1)).toEqual([])
  expect(range(5, 0, 1)).toEqual([])
})

test('a step of zero gives an empty array instead of looping forever', () => {
  expect(range(0, 5, 0)).toEqual([])
})
