import { expect, test } from 'vitest'
import { get } from './get'

const data = {
  user: { name: 'ada', tags: ['x', 'y'], address: { city: null } },
  list: [{ id: 1 }, { id: 2 }],
}

test('reads a shallow key', () => {
  expect(get(data, 'user')).toBe(data.user)
})

test('reads a dotted path', () => {
  expect(get(data, 'user.name')).toBe('ada')
})

test('reads array indices with brackets', () => {
  expect(get(data, 'user.tags[1]')).toBe('y')
  expect(get(data, 'list[0].id')).toBe(1)
})

test('accepts the path as an array too', () => {
  expect(get(data, ['user', 'tags', 0])).toBe('x')
})

test('a missing key gives undefined', () => {
  expect(get(data, 'user.email')).toBe(undefined)
})

test('a missing key gives the fallback when one is passed', () => {
  expect(get(data, 'user.email', 'none')).toBe('none')
})

test('walking through a null does not throw', () => {
  expect(get(data, 'user.address.city.zip', 'none')).toBe('none')
})

test('a stored null is a real value, not a miss', () => {
  expect(get(data, 'user.address.city', 'none')).toBe(null)
})

test('an index past the end falls back', () => {
  expect(get(data, 'list[9].id', 'none')).toBe('none')
})
