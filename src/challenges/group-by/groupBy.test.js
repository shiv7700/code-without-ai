import { expect, test } from 'vitest'
import { groupBy } from './groupBy'

const people = [
  { name: 'ada', team: 'a' },
  { name: 'grace', team: 'b' },
  { name: 'alan', team: 'a' },
]

test('groups by a function', () => {
  expect(groupBy([1, 2, 3, 4], (n) => (n % 2 ? 'odd' : 'even'))).toEqual({
    odd: [1, 3],
    even: [2, 4],
  })
})

test('groups by a property name', () => {
  expect(groupBy(people, 'team')).toEqual({
    a: [people[0], people[2]],
    b: [people[1]],
  })
})

test('items keep their original order inside a group', () => {
  expect(groupBy(people, 'team').a).toEqual([people[0], people[2]])
})

test('an empty list gives an empty object', () => {
  expect(Object.keys(groupBy([], 'team'))).toEqual([])
})

test('everything landing in one group is still one group', () => {
  expect(groupBy([1, 2, 3], () => 'all').all).toEqual([1, 2, 3])
})

test('keys that clash with Object.prototype still work', () => {
  const out = groupBy(['toString', 'constructor', 'toString'], (s) => s)

  expect(out.toString).toEqual(['toString', 'toString'])
  expect(out.constructor).toEqual(['constructor'])
})

test('the values are new arrays, not the input', () => {
  const input = [1, 2]
  expect(groupBy(input, () => 'all').all).not.toBe(input)
})
