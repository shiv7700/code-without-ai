import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useCounter } from './useCounter'

// Renders the hook and hands its return value out through `box`. `tick` is an
// unrelated prop, so a re-render can be forced without touching the hook.
function probe(initial) {
  const box = {}
  function Probe({ tick }) {
    Object.assign(box, useCounter(initial))
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('starts at zero, or at the initial value', () => {
  expect(probe().box.count).toBe(0)
  expect(probe(7).box.count).toBe(7)
})

test('inc and dec move by one', () => {
  const { box } = probe()

  act(() => box.inc())
  expect(box.count).toBe(1)

  act(() => box.dec())
  act(() => box.dec())
  expect(box.count).toBe(-1)
})

test('reset goes back to where it started', () => {
  const { box } = probe(3)

  act(() => box.inc())
  act(() => box.reset())
  expect(box.count).toBe(3)
})

test('the three functions survive a re-render unchanged', () => {
  const { box, rerender } = probe()
  const { inc, dec, reset } = box

  act(() => box.inc())
  rerender()

  expect(box.inc).toBe(inc)
  expect(box.dec).toBe(dec)
  expect(box.reset).toBe(reset)
})

test('two incs in one handler add two', () => {
  const { box } = probe()

  act(() => {
    box.inc()
    box.inc()
  })

  expect(box.count).toBe(2)
})
