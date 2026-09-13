import { expect, test } from 'vitest'
import { compose, pipe } from './pipe'

const double = (n) => n * 2
const inc = (n) => n + 1

test('pipe runs left to right', () => {
  expect(pipe(double, inc)(5)).toBe(11)
})

test('compose runs right to left', () => {
  expect(compose(double, inc)(5)).toBe(12)
})

test('a single function is just that function', () => {
  expect(pipe(double)(3)).toBe(6)
  expect(compose(double)(3)).toBe(6)
})

test('with no functions at all the argument comes straight back', () => {
  const value = { a: 1 }

  expect(pipe()(value)).toBe(value)
  expect(compose()(value)).toBe(value)
})

test('only the first function receives every argument', () => {
  const sum = (...ns) => ns.reduce((a, b) => a + b, 0)

  expect(pipe(sum, double)(1, 2, 3)).toBe(12)
  expect(compose(double, sum)(1, 2, 3)).toBe(12)
})

test('the same composition can be called twice', () => {
  const run = pipe(double, inc)

  expect(run(1)).toBe(3)
  expect(run(10)).toBe(21)
})
