import { act, render } from '@testing-library/react'
import { useEffect } from 'react'
import { expect, test } from 'vitest'
import { useLatest } from './useLatest'

function probe(initial) {
  const box = { renders: 0 }
  function Probe({ value }) {
    box.renders += 1
    box.ref = useLatest(value)

    // Captured once, on mount — exactly the situation the hook exists for.
    const ref = box.ref
    useEffect(() => {
      box.read = () => ref.current
    }, [])

    return null
  }
  const view = render(<Probe value={initial} />)
  return {
    box,
    set: (value) => act(() => view.rerender(<Probe value={value} />)),
  }
}

test('it holds the value it was given', () => {
  expect(probe('a').box.ref.current).toBe('a')
})

test('it holds the new value after a re-render', () => {
  const p = probe('a')

  p.set('b')
  expect(p.box.ref.current).toBe('b')
})

test('it does not render the component on its own', () => {
  const p = probe('a')
  expect(p.box.renders).toBe(1)

  p.set('b')
  expect(p.box.renders).toBe(2)
})

test('it is the same ref object on every render', () => {
  const p = probe('a')
  const ref = p.box.ref

  p.set('b')
  p.set('c')

  expect(p.box.ref).toBe(ref)
})

test('a callback captured on mount reads the newest value through it', () => {
  const p = probe('a')

  p.set('b')
  expect(p.box.read()).toBe('b')

  p.set('c')
  expect(p.box.read()).toBe('c')
})
