import { expect, test } from 'vitest'
import { omit, pick } from './pick'

const source = { a: 1, b: 2, c: 3 }

test('pick keeps only the listed keys', () => {
  expect(pick(source, ['a', 'c'])).toEqual({ a: 1, c: 3 })
})

test('omit keeps everything else', () => {
  expect(omit(source, ['a', 'c'])).toEqual({ b: 2 })
})

test('a key that is not there is left out, not set to undefined', () => {
  const out = pick(source, ['a', 'nope'])

  expect(Object.keys(out)).toEqual(['a'])
  expect('nope' in out).toBe(false)
})

test('omitting a key that is not there changes nothing', () => {
  expect(omit(source, ['nope'])).toEqual({ a: 1, b: 2, c: 3 })
})

test('a key holding undefined is still picked when it is really there', () => {
  expect(Object.keys(pick({ a: undefined }, ['a']))).toEqual(['a'])
})

test('inherited keys are neither picked nor copied', () => {
  const child = Object.create({ inherited: 'from the prototype' })
  child.own = 'yes'

  expect(pick(child, ['own', 'inherited'])).toEqual({ own: 'yes' })
  expect(omit(child, [])).toEqual({ own: 'yes' })
})

test('the source is never modified and the result is a new object', () => {
  const out = omit(source, ['a'])

  expect(source).toEqual({ a: 1, b: 2, c: 3 })
  expect(out).not.toBe(source)
})
