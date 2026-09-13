import { expect, test } from 'vitest'
import { deepClone } from './deepClone'

test('primitives come back untouched', () => {
  expect(deepClone(1)).toBe(1)
  expect(deepClone('a')).toBe('a')
  expect(deepClone(null)).toBe(null)
  expect(deepClone(undefined)).toBe(undefined)
})

test('an object is equal but not the same object', () => {
  const source = { a: 1, b: 'two' }
  const copy = deepClone(source)

  expect(copy).toEqual(source)
  expect(copy).not.toBe(source)
})

test('nested objects are copied too, not shared', () => {
  const source = { a: { b: { c: 1 } } }
  const copy = deepClone(source)

  copy.a.b.c = 99
  expect(source.a.b.c).toBe(1)
})

test('arrays stay arrays', () => {
  const copy = deepClone([1, [2, 3], { a: 4 }])

  expect(Array.isArray(copy)).toBe(true)
  expect(Array.isArray(copy[1])).toBe(true)
  expect(copy).toEqual([1, [2, 3], { a: 4 }])
})

test('a Date is cloned, not handed over', () => {
  const source = { at: new Date(1700000000000) }
  const copy = deepClone(source)

  expect(copy.at).toBeInstanceOf(Date)
  expect(copy.at.getTime()).toBe(1700000000000)
  expect(copy.at).not.toBe(source.at)
})

test('functions are shared, not cloned', () => {
  const fn = () => {}
  expect(deepClone({ fn }).fn).toBe(fn)
})

test('a cycle does not blow the stack', () => {
  const source = { name: 'root' }
  source.self = source

  const copy = deepClone(source)
  expect(copy.self).toBe(copy)
  expect(copy.self).not.toBe(source)
})

test('the same object twice becomes the same clone twice', () => {
  const shared = { n: 1 }
  const copy = deepClone({ a: shared, b: shared })

  expect(copy.a).toBe(copy.b)
})
