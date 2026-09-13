import { expect, test } from 'vitest'
import { deepEqual } from './deepEqual'

test('primitives compare by value', () => {
  expect(deepEqual(1, 1)).toBe(true)
  expect(deepEqual('a', 'a')).toBe(true)
  expect(deepEqual(1, '1')).toBe(false)
  expect(deepEqual(null, undefined)).toBe(false)
})

test('NaN equals NaN', () => {
  expect(deepEqual(NaN, NaN)).toBe(true)
})

test('0 and -0 are not equal', () => {
  expect(deepEqual(0, -0)).toBe(false)
})

test('flat objects compare by their entries', () => {
  expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
  expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
})

test('key order does not matter', () => {
  expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
})

test('an extra key makes them different', () => {
  expect(deepEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false)
})

test('nesting is compared all the way down', () => {
  expect(deepEqual({ a: { b: [1, { c: 2 }] } }, { a: { b: [1, { c: 2 }] } })).toBe(true)
  expect(deepEqual({ a: { b: [1, { c: 2 }] } }, { a: { b: [1, { c: 3 }] } })).toBe(false)
})

test('an array is not an object with numeric keys', () => {
  expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false)
})

test('arrays compare by position', () => {
  expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
  expect(deepEqual([1, 2, 3], [3, 2, 1])).toBe(false)
  expect(deepEqual([1, 2], [1, 2, 3])).toBe(false)
})

test('dates compare by their time', () => {
  expect(deepEqual(new Date(1000), new Date(1000))).toBe(true)
  expect(deepEqual(new Date(1000), new Date(2000))).toBe(false)
  expect(deepEqual(new Date(1000), { })).toBe(false)
})
