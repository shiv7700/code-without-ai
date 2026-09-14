import { expect, test } from 'vitest'
import { template } from './template'

test('fills a placeholder', () => {
  expect(template('Hi {name}', { name: 'Bo' })).toBe('Hi Bo')
})

test('fills every occurrence of every key', () => {
  expect(template('{a}-{b}-{a}', { a: 1, b: 2 })).toBe('1-2-1')
})

test('a key with no value is left visible', () => {
  expect(template('Hi {name}', {})).toBe('Hi {name}')
  expect(template('Hi {name}', { name: undefined })).toBe('Hi {name}')
})

test('zero, empty string and false are values', () => {
  expect(template('{n} items, note: "{note}", ok: {ok}', { n: 0, note: '', ok: false }))
    .toBe('0 items, note: "", ok: false')
})

test('a dollar sign in the value is a dollar sign', () => {
  expect(template('cost: {c}', { c: '$1,000' })).toBe('cost: $1,000')
  expect(template('[{c}]', { c: '$&' })).toBe('[$&]')
  expect(template('[{c}]', { c: '$$' })).toBe('[$$]')
})

test('anything that is not a placeholder is left alone', () => {
  expect(template('{ name } and {}', { name: 'Bo' })).toBe('{ name } and {}')
  expect(template('plain text')).toBe('plain text')
})
