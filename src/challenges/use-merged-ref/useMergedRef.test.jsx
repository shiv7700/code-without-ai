import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { expect, test, vi } from 'vitest'
import { useMergedRef } from './useMergedRef'

let handed = []

function Probe({ refs, other }) {
  const merged = useMergedRef(...refs)
  handed.push(merged)
  return (
    <div ref={merged} data-testid="node">
      {other}
    </div>
  )
}

function mount(refs) {
  handed = []
  const view = render(<Probe refs={refs} other="x" />)
  return {
    unmount: view.unmount,
    set: (next, other = 'x') =>
      view.rerender(<Probe refs={next} other={other} />),
  }
}

test('the node reaches an object ref and a function ref alike', () => {
  const object = createRef()
  const fn = vi.fn()
  mount([object, fn])

  const node = screen.getByTestId('node')
  expect(object.current).toBe(node)
  expect(fn).toHaveBeenCalledWith(node)
})

test('null and undefined entries are skipped', () => {
  const object = createRef()
  mount([null, object, undefined])
  expect(object.current).toBe(screen.getByTestId('node'))
})

test('unmounting empties every ref', () => {
  const object = createRef()
  const fn = vi.fn()
  const { unmount } = mount([object, fn])

  unmount()

  expect(object.current).toBe(null)
  expect(fn).toHaveBeenLastCalledWith(null)
})

test('swapping a ref clears the old one and fills the new one', () => {
  const first = createRef()
  const second = createRef()
  const { set } = mount([first])

  set([second])

  expect(first.current).toBe(null)
  expect(second.current).toBe(screen.getByTestId('node'))
})

test('a re-render with the same refs does not reattach the node', () => {
  const object = createRef()
  const fn = vi.fn()
  const refs = [object, fn]
  const { set } = mount(refs)

  set(refs, 'y')
  set(refs, 'z')

  expect(handed).toHaveLength(3)
  expect(handed[1]).toBe(handed[0])
  expect(handed[2]).toBe(handed[0])
  expect(fn).toHaveBeenCalledTimes(1)
  expect(object.current).toBe(screen.getByTestId('node'))
})
