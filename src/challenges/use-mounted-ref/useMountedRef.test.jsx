import { act, render } from '@testing-library/react'
import { useEffect } from 'react'
import { expect, test } from 'vitest'
import { useMountedRef } from './useMountedRef'

function probe() {
  const box = {}
  function Probe({ tick }) {
    box.ref = useMountedRef()
    box.tick = tick

    // The callback is made on mount and outlives the component, which is the
    // only interesting case.
    const ref = box.ref
    useEffect(() => {
      box.stillThere = () => ref.current
    }, [])

    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    view,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('it says true once mounted', () => {
  expect(probe().box.ref.current).toBe(true)
})

test('a re-render does not change the answer', () => {
  const p = probe()

  p.rerender()

  expect(p.box.ref.current).toBe(true)
  expect(p.box.stillThere()).toBe(true)
})

test('it is the same ref object every render', () => {
  const p = probe()
  const ref = p.box.ref

  p.rerender()

  expect(p.box.ref).toBe(ref)
})

test('after unmounting it says false', () => {
  const p = probe()

  p.view.unmount()

  expect(p.box.ref.current).toBe(false)
})

test('a callback made while mounted finds out that it is not any more', () => {
  const p = probe()
  const stillThere = p.box.stillThere

  p.rerender()
  p.view.unmount()

  expect(stillThere()).toBe(false)
})

test('one component unmounting says nothing about another', () => {
  const a = probe()
  const b = probe()

  a.view.unmount()

  expect(a.box.stillThere()).toBe(false)
  expect(b.box.stillThere()).toBe(true)
})
