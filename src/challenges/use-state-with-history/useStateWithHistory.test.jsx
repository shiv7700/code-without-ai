import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useStateWithHistory } from './useStateWithHistory'

function probe(initial, capacity) {
  const box = {}
  function Probe({ tick }) {
    ;[box.value, box.set, box.history] = useStateWithHistory(initial, capacity)
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('the history starts with just the initial value', () => {
  const { box } = probe('a')

  expect(box.value).toBe('a')
  expect(box.history).toEqual(['a'])
})

test('each set appends, and the value is the last entry', () => {
  const { box } = probe('a')

  act(() => box.set('b'))
  act(() => box.set('c'))

  expect(box.value).toBe('c')
  expect(box.history).toEqual(['a', 'b', 'c'])
})

test('the updater form records what it returned', () => {
  const { box } = probe(1)

  act(() => box.set((n) => n + 1))
  act(() => box.set((n) => n * 10))

  expect(box.value).toBe(20)
  expect(box.history).toEqual([1, 2, 20])
})

test('the oldest entries fall off once it is full', () => {
  const { box } = probe('a', 3)

  act(() => box.set('b'))
  act(() => box.set('c'))
  act(() => box.set('d'))

  expect(box.history).toEqual(['b', 'c', 'd'])
  expect(box.value).toBe('d')
})

test('the setter survives a re-render unchanged', () => {
  const { box, rerender } = probe('a')
  const set = box.set

  act(() => box.set('b'))
  rerender()

  expect(box.set).toBe(set)
})

test('two sets in one handler both get recorded', () => {
  const { box } = probe(0)

  act(() => {
    box.set((n) => n + 1)
    box.set((n) => n + 1)
  })

  expect(box.value).toBe(2)
  expect(box.history).toEqual([0, 1, 2])
})
