import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useToggle } from './useToggle'

// Renders the hook and hands its return value out through `box`.
function probe(initial) {
  const box = {}
  function Probe({ tick }) {
    ;[box.on, box.toggle, box.setOn] = useToggle(initial)
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return { box, rerender: () => view.rerender(<Probe tick={Math.random()} />) }
}

test('starts false by default, or at `initial`', () => {
  expect(probe().box.on).toBe(false)
  expect(probe(true).box.on).toBe(true)
})

test('toggle flips the value', () => {
  const { box } = probe()

  act(() => box.toggle())
  expect(box.on).toBe(true)

  act(() => box.toggle())
  expect(box.on).toBe(false)
})

test('setOn sets it directly', () => {
  const { box } = probe()

  act(() => box.setOn(true))
  expect(box.on).toBe(true)

  act(() => box.setOn(true))
  expect(box.on).toBe(true)
})

test('toggle and setOn keep a stable identity across re-renders', () => {
  const { box, rerender } = probe()

  const toggle = box.toggle
  const setOn = box.setOn

  rerender()
  act(() => box.toggle())

  expect(box.toggle).toBe(toggle)
  expect(box.setOn).toBe(setOn)
})

test('two toggles in one batch cancel out', () => {
  const { box } = probe()

  act(() => {
    box.toggle()
    box.toggle()
  })

  expect(box.on).toBe(false)
})
