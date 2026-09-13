import { expect, test } from 'vitest'
import { sortBy } from './sortBy'

test('sorts by the computed key', () => {
  expect(sortBy(['ccc', 'a', 'bb'], (s) => s.length)).toEqual([
    'a',
    'bb',
    'ccc',
  ])
})

test('numbers are compared as numbers, not as text', () => {
  expect(sortBy([10, 9, 100, 1], (n) => n)).toEqual([1, 9, 10, 100])
})

test('the input is not modified', () => {
  const input = [3, 1, 2]
  const out = sortBy(input, (n) => n)

  expect(input).toEqual([3, 1, 2])
  expect(out).not.toBe(input)
})

test('items with an equal key keep their input order', () => {
  const rows = [
    { name: 'ada', team: 'b' },
    { name: 'grace', team: 'a' },
    { name: 'alan', team: 'b' },
    { name: 'edsger', team: 'a' },
  ]

  expect(sortBy(rows, (r) => r.team).map((r) => r.name)).toEqual([
    'grace',
    'edsger',
    'ada',
    'alan',
  ])
})

test('an empty list comes back empty', () => {
  expect(sortBy([], (x) => x)).toEqual([])
})

test('items whose key is undefined go last', () => {
  const rows = [{ n: undefined }, { n: 2 }, { n: undefined }, { n: 1 }]

  expect(sortBy(rows, (r) => r.n).map((r) => r.n)).toEqual([
    1,
    2,
    undefined,
    undefined,
  ])
})
