import { render } from '@testing-library/react'
import { useEffect } from 'react'
import { expect, test, vi } from 'vitest'
import { useMemoCompare } from './useMemoCompare'

const sameId = (a, b) => a?.id === b?.id

function probe(first = { id: 1, n: 0 }, { isEqual = sameId, effect } = {}) {
  const handed = []
  function Probe({ value, other }) {
    const held = useMemoCompare(value, isEqual)
    handed.push(held)
    useEffect(() => effect?.(held), [held])
    return <span>{other}</span>
  }
  const view = render(<Probe value={first} other="x" />)
  return {
    handed,
    set: (value, other = 'x') =>
      view.rerender(<Probe value={value} other={other} />),
  }
}

test('the first render returns the value it was given', () => {
  const first = { id: 1, n: 0 }
  const { handed } = probe(first)
  expect(handed[0]).toBe(first)
})

test('an equal value comes back as the object from before', () => {
  const { handed, set } = probe()
  set({ id: 1, n: 1 })
  expect(handed[1]).toBe(handed[0])
})

test('a different value comes back as the new object', () => {
  const next = { id: 2, n: 0 }
  const { handed, set } = probe()
  set(next)
  expect(handed[1]).toBe(next)
})

test('an effect depending on the result does not re-run while it stays equal', () => {
  const effect = vi.fn()
  const { set } = probe(undefined, { effect })
  set({ id: 1, n: 1 })
  set({ id: 1, n: 2 })
  expect(effect).toHaveBeenCalledTimes(1)
})

test('after adopting a new value, the comparison is against that one', () => {
  const second = { id: 2, n: 0 }
  const { handed, set } = probe()

  set(second)
  set({ id: 2, n: 1 })
  set({ id: 2, n: 2 })

  expect(handed[2]).toBe(second)
  expect(handed[3]).toBe(second)
})
