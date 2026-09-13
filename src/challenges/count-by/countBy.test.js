import { expect, test } from 'vitest'
import { countBy } from './countBy'

test('counts how many items land on each key', () => {
  const out = countBy([1, 2, 3, 4, 5], (n) => (n % 2 ? 'odd' : 'even'))

  expect(out.odd).toBe(3)
  expect(out.even).toBe(2)
})

test('an empty list gives an object with no keys', () => {
  expect(Object.keys(countBy([], (x) => x))).toEqual([])
})

test('everything landing on one key gives one count', () => {
  expect(countBy(['a', 'b', 'c'], () => 'all').all).toBe(3)
})

test('only the keys that occurred are present', () => {
  expect(Object.keys(countBy(['a', 'b', 'a'], (s) => s)).sort()).toEqual([
    'a',
    'b',
  ])
})

test('keys are used as given, not sorted or renumbered', () => {
  const out = countBy([3, 1, 3], (n) => n)

  expect(out[3]).toBe(2)
  expect(out[1]).toBe(1)
})

test('a key of constructor counts like any other', () => {
  const out = countBy(['constructor', 'toString', 'constructor'], (s) => s)

  expect(out.constructor).toBe(2)
  expect(out.toString).toBe(1)
})

test('the input is not modified', () => {
  const input = ['a', 'a']
  countBy(input, (s) => s)
  expect(input).toEqual(['a', 'a'])
})
