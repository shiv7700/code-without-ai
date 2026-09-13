import { expect, test, vi } from 'vitest'
import { curry } from './curry'

const add3 = (a, b, c) => a + b + c

test('calls through when every argument arrives at once', () => {
  expect(curry(add3)(1, 2, 3)).toBe(6)
})

test('takes the arguments one at a time', () => {
  expect(curry(add3)(1)(2)(3)).toBe(6)
})

test('takes them in any grouping', () => {
  const curried = curry(add3)
  expect(curried(1, 2)(3)).toBe(6)
  expect(curried(1)(2, 3)).toBe(6)
})

test('a partial application can be reused independently', () => {
  const addTo1 = curry(add3)(1)
  expect(addTo1(2, 3)).toBe(6)
  expect(addTo1(10, 100)).toBe(111)
})

test('a zero-argument function runs straight away', () => {
  expect(curry(() => 42)()).toBe(42)
})

test('does not call the function early', () => {
  const spy = vi.fn(add3)
  const curried = curry(spy)
  curried(1)(2)
  expect(spy).not.toHaveBeenCalled()
})
