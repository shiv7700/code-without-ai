import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useBoolean } from './useBoolean'

function probe(initial) {
  const box = {}
  function Probe({ tick }) {
    ;[box.value, box.actions] = useBoolean(initial)
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('starts false by default, or at the initial value', () => {
  expect(probe().box.value).toBe(false)
  expect(probe(true).box.value).toBe(true)
})

test('on and off set it outright', () => {
  const { box } = probe()

  act(() => box.actions.on())
  expect(box.value).toBe(true)

  act(() => box.actions.on())
  expect(box.value).toBe(true)

  act(() => box.actions.off())
  expect(box.value).toBe(false)
})

test('toggle flips it', () => {
  const { box } = probe()

  act(() => box.actions.toggle())
  expect(box.value).toBe(true)

  act(() => box.actions.toggle())
  expect(box.value).toBe(false)
})

test('two toggles in one handler cancel out', () => {
  const { box } = probe()

  act(() => {
    box.actions.toggle()
    box.actions.toggle()
  })

  expect(box.value).toBe(false)
})

test('the actions object is the same object after a re-render', () => {
  const { box, rerender } = probe()
  const actions = box.actions

  act(() => box.actions.toggle())
  rerender()

  expect(box.actions).toBe(actions)
  expect(box.actions.toggle).toBe(actions.toggle)
})
