import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useCountdown } from './useCountdown'

function probe(initial) {
  const box = {}
  function Probe({ from }) {
    Object.assign(box, useCountdown(from))
    return null
  }
  const view = render(<Probe from={initial} />)
  return {
    box,
    setFrom: (from) => act(() => view.rerender(<Probe from={from} />)),
  }
}

test('it starts at from, and is not done yet', () => {
  const { box } = probe(3)

  expect(box.left).toBe(3)
  expect(box.done).toBe(false)
})

test('each tick takes one off', () => {
  const { box } = probe(3)

  act(() => box.tick())
  expect(box.left).toBe(2)

  act(() => box.tick())
  expect(box.left).toBe(1)
})

test('it stops at zero and says so', () => {
  const { box } = probe(1)

  act(() => box.tick())
  act(() => box.tick())
  act(() => box.tick())

  expect(box.left).toBe(0)
  expect(box.done).toBe(true)
})

test('tick and reset survive a re-render unchanged', () => {
  const p = probe(3)
  const { tick, reset } = p.box

  act(() => p.box.tick())
  p.setFrom(3)

  expect(p.box.tick).toBe(tick)
  expect(p.box.reset).toBe(reset)
})

test('reset goes back to the from it has now', () => {
  const p = probe(3)

  act(() => p.box.tick())
  p.setFrom(10)
  act(() => p.box.reset())

  expect(p.box.left).toBe(10)
})

test('three ticks in one handler take three off, and no more than that', () => {
  const a = probe(5)
  act(() => {
    a.box.tick()
    a.box.tick()
    a.box.tick()
  })
  expect(a.box.left).toBe(2)

  const b = probe(2)
  act(() => {
    b.box.tick()
    b.box.tick()
    b.box.tick()
  })
  expect(b.box.left).toBe(0)
})
