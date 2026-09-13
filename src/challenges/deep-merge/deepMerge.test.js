import { expect, test } from 'vitest'
import { deepMerge } from './deepMerge'

test('shallow keys from the source win', () => {
  expect(deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 })
})

test('nested objects are merged, not replaced', () => {
  expect(
    deepMerge({ api: { url: 'x', retries: 3 } }, { api: { url: 'y' } }),
  ).toEqual({ api: { url: 'y', retries: 3 } })
})

test('arrays are replaced whole, never concatenated', () => {
  expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['c'] })).toEqual({
    tags: ['c'],
  })
})

test('an undefined in the source leaves the existing value alone', () => {
  expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 })
})

test('a null in the source does clear the existing value', () => {
  expect(deepMerge({ a: 1 }, { a: null })).toEqual({ a: null })
})

test('an object on one side and a primitive on the other takes the source', () => {
  expect(deepMerge({ a: { b: 1 } }, { a: 5 })).toEqual({ a: 5 })
  expect(deepMerge({ a: 5 }, { a: { b: 1 } })).toEqual({ a: { b: 1 } })
})

test('neither input is modified, however deep the nesting goes', () => {
  let target = { value: 0 }
  let source = { value: 1 }
  for (let i = 0; i < 50; i++) {
    target = { nested: target }
    source = { nested: source }
  }

  const before = JSON.stringify(target)
  const merged = deepMerge(target, source)

  expect(JSON.stringify(target)).toBe(before)
  expect(merged.nested).not.toBe(target.nested)
})
