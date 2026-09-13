import { expect, test } from 'vitest'
import { once } from './once'

test('the wrapped function runs on the first call', () => {
  expect(once(() => 42)()).toBe(42)
})

test('later calls return the first result without running again', () => {
  let runs = 0
  const init = once(() => ++runs)

  expect(init()).toBe(1)
  expect(init()).toBe(1)
  expect(init()).toBe(1)
  expect(runs).toBe(1)
})

test('arguments from the first call are passed through', () => {
  expect(once((a, b) => a + b)(2, 3)).toBe(5)
})

test('arguments from later calls are ignored', () => {
  const add = once((a, b) => a + b)
  add(2, 3)

  expect(add(100, 100)).toBe(5)
})

test('a first result of undefined is remembered like any other', () => {
  let runs = 0
  const init = once(() => {
    runs++
    return undefined
  })

  expect(init()).toBe(undefined)
  expect(init()).toBe(undefined)
  expect(runs).toBe(1)
})

test('a throw on the first call is not a retry', () => {
  let runs = 0
  const boom = once(() => {
    runs++
    throw new Error('nope')
  })

  expect(() => boom()).toThrow('nope')
  expect(() => boom()).toThrow('nope')
  expect(runs).toBe(1)
})
