import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useStep } from './useStep'

function probe(total) {
  let api
  const Probe = ({ count }) => {
    api = useStep(count)
    return null
  }
  const view = render(<Probe count={total} />)
  return {
    ...view,
    get: () => api,
    call: (name, ...args) => act(() => api[name](...args)),
  }
}

test('starts on step one', () => {
  expect(probe(3).get().step).toBe(1)
})

test('next moves forward', () => {
  const p = probe(3)
  p.call('next')
  expect(p.get().step).toBe(2)
})

test('next stops at the last step instead of wrapping', () => {
  const p = probe(3)
  p.call('next')
  p.call('next')
  p.call('next')

  expect(p.get().step).toBe(3)
})

test('prev moves back', () => {
  const p = probe(3)
  p.call('next')
  p.call('prev')

  expect(p.get().step).toBe(1)
})

test('prev stops at the first step', () => {
  const p = probe(3)
  p.call('prev')
  expect(p.get().step).toBe(1)
})

test('goTo jumps', () => {
  const p = probe(5)
  p.call('goTo', 4)
  expect(p.get().step).toBe(4)
})

test('goTo ignores a step that does not exist', () => {
  const p = probe(3)
  p.call('goTo', 9)
  expect(p.get().step).toBe(1)

  p.call('goTo', 0)
  expect(p.get().step).toBe(1)
})

test('isFirst and isLast say where you are', () => {
  const p = probe(2)
  expect(p.get().isFirst).toBe(true)
  expect(p.get().isLast).toBe(false)

  p.call('next')
  expect(p.get().isFirst).toBe(false)
  expect(p.get().isLast).toBe(true)
})

test('a single step is both first and last', () => {
  const p = probe(1)
  expect(p.get().isFirst).toBe(true)
  expect(p.get().isLast).toBe(true)
})

test('reset goes back to one', () => {
  const p = probe(3)
  p.call('next')
  p.call('reset')

  expect(p.get().step).toBe(1)
})

test('the callbacks keep their identity across renders', () => {
  const p = probe(3)
  const before = p.get()

  p.call('next')
  const after = p.get()

  expect(after.next).toBe(before.next)
  expect(after.prev).toBe(before.prev)
  expect(after.goTo).toBe(before.goTo)
  expect(after.reset).toBe(before.reset)
})
