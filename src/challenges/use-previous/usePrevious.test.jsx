import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { usePrevious } from './usePrevious'

function probe(initial) {
  const box = { renders: 0 }
  function Probe({ value }) {
    box.renders += 1
    box.previous = usePrevious(value)
    return null
  }
  const view = render(<Probe value={initial} />)
  return {
    box,
    set: (value) => act(() => view.rerender(<Probe value={value} />)),
  }
}

test('the first render has nothing to report', () => {
  expect(probe('a').box.previous).toBeUndefined()
})

test('it hands back the value from the render before, not this one', () => {
  const p = probe('a')

  p.set('b')
  expect(p.box.previous).toBe('a')
})

test('a re-render with the same value makes that the previous one', () => {
  const p = probe('a')

  p.set('a')
  expect(p.box.previous).toBe('a')
})

test('it keeps up over a run of changes', () => {
  const p = probe(1)

  p.set(2)
  p.set(3)
  expect(p.box.previous).toBe(2)

  p.set(4)
  expect(p.box.previous).toBe(3)
})

test('it does not render the component on its own', () => {
  const p = probe('a')
  expect(p.box.renders).toBe(1)

  p.set('b')
  expect(p.box.renders).toBe(2)
})
