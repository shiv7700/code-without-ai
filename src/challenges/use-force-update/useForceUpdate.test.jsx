import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useForceUpdate } from './useForceUpdate'

function probe() {
  const box = { renders: 0 }
  function Probe({ tick }) {
    box.renders += 1
    box.forceUpdate = useForceUpdate()
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('mounting renders once and no more', () => {
  expect(probe().box.renders).toBe(1)
})

test('calling it renders', () => {
  const { box } = probe()

  act(() => box.forceUpdate())
  expect(box.renders).toBe(2)
})

test('it keeps its identity across re-renders', () => {
  const { box, rerender } = probe()
  const forceUpdate = box.forceUpdate

  rerender()
  act(() => box.forceUpdate())

  expect(box.forceUpdate).toBe(forceUpdate)
})

test('it does not go quiet after the first time', () => {
  const { box } = probe()

  act(() => box.forceUpdate())
  act(() => box.forceUpdate())
  act(() => box.forceUpdate())

  expect(box.renders).toBe(4)
})

test('the function captured on the first render still works', () => {
  const { box, rerender } = probe()
  const captured = box.forceUpdate

  rerender()
  act(() => captured())
  act(() => captured())

  expect(box.renders).toBe(4)
})
