import { expect, test } from 'vitest'
import { uniqueBy } from './uniqueBy'

const people = [
  { id: 1, name: 'ada' },
  { id: 2, name: 'grace' },
  { id: 1, name: 'ada again' },
]

test('drops later items with a key already seen', () => {
  expect(uniqueBy(people, (p) => p.id)).toEqual([people[0], people[1]])
})

test('the first of a duplicate pair is the one kept', () => {
  const out = uniqueBy(people, (p) => p.id)
  expect(out[0].name).toBe('ada')
})

test('order follows the input', () => {
  expect(uniqueBy([3, 1, 3, 2, 1], (n) => n)).toEqual([3, 1, 2])
})

test('an empty list gives an empty array', () => {
  expect(uniqueBy([], (x) => x)).toEqual([])
})

test('the number 1 and the string "1" are different keys', () => {
  expect(uniqueBy([1, '1'], (x) => x)).toEqual([1, '1'])
})

test('two items keyed NaN collapse into one', () => {
  expect(uniqueBy([NaN, NaN, 1], (x) => x)).toEqual([NaN, 1])
})

test('the input is not modified and the result is a new array', () => {
  const input = [1, 1, 2]
  const out = uniqueBy(input, (n) => n)

  expect(input).toEqual([1, 1, 2])
  expect(out).not.toBe(input)
})
