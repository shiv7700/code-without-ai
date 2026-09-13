import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useIsFirstRender } from './useIsFirstRender'

function probe() {
  const box = { renders: 0, seen: [] }
  function Probe({ tick }) {
    box.renders += 1
    box.seen.push(useIsFirstRender())
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    view,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('the first render sees true', () => {
  expect(probe().box.seen).toEqual([true])
})

test('every render after it sees false', () => {
  const p = probe()

  p.rerender()
  p.rerender()

  expect(p.box.seen).toEqual([true, false, false])
})

test('mounting costs exactly one render', () => {
  expect(probe().box.renders).toBe(1)
})

test('a second component mounted later gets its own first render', () => {
  const first = probe()
  first.rerender()

  const second = probe()

  expect(second.box.seen).toEqual([true])
  expect(first.box.seen).toEqual([true, false])
})

test('mounting the same component again starts it over', () => {
  const p = probe()
  p.rerender()
  p.view.unmount()

  expect(probe().box.seen).toEqual([true])
})
