import { expect, test } from 'vitest'
import { set } from './set'

test('sets a shallow key', () => {
  expect(set({ a: 1 }, 'b', 2)).toEqual({ a: 1, b: 2 })
})

test('the original is never touched', () => {
  const source = { a: { b: 1 } }
  set(source, 'a.b', 2)
  expect(source).toEqual({ a: { b: 1 } })
})

test('returns a new object', () => {
  const source = { a: 1 }
  expect(set(source, 'a', 2)).not.toBe(source)
})

test('sets a nested key', () => {
  expect(set({ a: { b: { c: 1 } } }, 'a.b.c', 9)).toEqual({ a: { b: { c: 9 } } })
})

test('every object on the path is copied', () => {
  const source = { a: { b: { c: 1 } } }
  const next = set(source, 'a.b.c', 9)

  expect(next.a).not.toBe(source.a)
  expect(next.a.b).not.toBe(source.a.b)
})

test('branches off the path are shared, not copied', () => {
  const source = { a: { b: 1 }, untouched: { big: 'object' } }
  const next = set(source, 'a.b', 2)

  expect(next.untouched).toBe(source.untouched)
})

test('array indices stay arrays', () => {
  const next = set({ list: [1, 2, 3] }, 'list[1]', 9)

  expect(Array.isArray(next.list)).toBe(true)
  expect(next.list).toEqual([1, 9, 3])
})

test('accepts an array path', () => {
  expect(set({}, ['a', 'b'], 1)).toEqual({ a: { b: 1 } })
})

test('missing objects along the way are created', () => {
  expect(set({}, 'a.b.c', 1)).toEqual({ a: { b: { c: 1 } } })
})

test('a numeric key creates an array, not an object', () => {
  expect(Array.isArray(set({}, 'list[0]', 'x').list)).toBe(true)
})
