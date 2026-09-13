import { expect, test } from 'vitest'
import { parse, stringify } from './queryString'

test('reads pairs into an object', () => {
  expect(parse('page=2&sort=name')).toEqual({ page: '2', sort: 'name' })
})

test('a leading question mark is not part of the first key', () => {
  expect(parse('?page=2')).toEqual({ page: '2' })
})

test('an empty query gives an object with no keys', () => {
  expect(Object.keys(parse(''))).toEqual([])
  expect(Object.keys(parse('?'))).toEqual([])
})

test('a key with no value reads as an empty string', () => {
  expect(parse('debug&page=2')).toEqual({ debug: '', page: '2' })
  expect(parse('debug=')).toEqual({ debug: '' })
})

test('a repeated key collects into an array', () => {
  expect(parse('tag=a&tag=b&tag=c')).toEqual({ tag: ['a', 'b', 'c'] })
})

test('both spellings of a space decode to a space', () => {
  expect(parse('q=hello+world&r=hello%20world')).toEqual({
    q: 'hello world',
    r: 'hello world',
  })
})

test('stringify encodes, skips undefined, and repeats arrays', () => {
  expect(stringify({ q: 'a b', page: 2 })).toBe('q=a%20b&page=2')
  expect(stringify({ a: 1, b: undefined, c: 3 })).toBe('a=1&c=3')
  expect(stringify({ tag: ['a', 'b'] })).toBe('tag=a&tag=b')
  expect(stringify({})).toBe('')
})

test('a value containing an ampersand survives the round trip', () => {
  expect(parse(stringify({ q: 'a&b=c' }))).toEqual({ q: 'a&b=c' })
})
