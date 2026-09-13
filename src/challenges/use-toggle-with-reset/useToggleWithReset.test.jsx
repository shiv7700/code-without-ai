import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useToggleWithReset } from './useToggleWithReset'

function probe(initial) {
  const box = {}
  function Probe({ start }) {
    ;[box.on, box.toggle, box.reset] = useToggleWithReset(start)
    return null
  }
  const view = render(<Probe start={initial} />)
  return {
    box,
    setInitial: (start) => act(() => view.rerender(<Probe start={start} />)),
  }
}

test('starts false by default, or at the initial value', () => {
  expect(probe().box.on).toBe(false)
  expect(probe(true).box.on).toBe(true)
})

test('toggle flips it', () => {
  const { box } = probe()

  act(() => box.toggle())
  expect(box.on).toBe(true)

  act(() => box.toggle())
  expect(box.on).toBe(false)
})

test('reset goes back to where it started', () => {
  const { box } = probe(true)

  act(() => box.toggle())
  act(() => box.reset())

  expect(box.on).toBe(true)
})

test('two toggles in one handler cancel out', () => {
  const { box } = probe()

  act(() => {
    box.toggle()
    box.toggle()
  })

  expect(box.on).toBe(false)
})

test('toggle and reset survive a re-render unchanged', () => {
  const p = probe()
  const { toggle, reset } = p.box

  act(() => p.box.toggle())
  p.setInitial(false)

  expect(p.box.toggle).toBe(toggle)
  expect(p.box.reset).toBe(reset)
})

test('a later initial value changes neither the state nor where reset goes', () => {
  const p = probe(false)

  p.setInitial(true)
  expect(p.box.on).toBe(false)

  act(() => p.box.toggle())
  expect(p.box.on).toBe(true)

  act(() => p.box.reset())
  expect(p.box.on).toBe(false)
})
