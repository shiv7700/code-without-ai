import { render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useDeepCompareEffect } from './useDeepCompareEffect'

function probe(effect, filters = { tag: 'new', page: { n: 1 } }) {
  function Probe({ tag, n, other }) {
    // A fresh object on every render, the way a caller would really write it.
    useDeepCompareEffect(effect, [{ tag, page: { n } }])
    return <span>{other}</span>
  }
  const view = render(<Probe tag={filters.tag} n={filters.page.n} other="x" />)
  return {
    unmount: view.unmount,
    set: (tag, n, other = 'x') =>
      view.rerender(<Probe tag={tag} n={n} other={other} />),
  }
}

test('it runs on mount', () => {
  const effect = vi.fn()
  probe(effect)
  expect(effect).toHaveBeenCalledTimes(1)
})

test('a re-render building an equal dependency does not run it again', () => {
  const effect = vi.fn()
  const { set } = probe(effect)
  set('new', 1, 'y')
  set('new', 1, 'z')
  expect(effect).toHaveBeenCalledTimes(1)
})

test('a change nested inside the dependency runs it', () => {
  const effect = vi.fn()
  const { set } = probe(effect)
  set('new', 2)
  expect(effect).toHaveBeenCalledTimes(2)
})

test('the cleanup runs before the next run and on unmount', () => {
  const cleanup = vi.fn()
  const { set, unmount } = probe(() => cleanup)

  set('old', 1)
  expect(cleanup).toHaveBeenCalledTimes(1)

  unmount()
  expect(cleanup).toHaveBeenCalledTimes(2)
})

test('after the deps change, equal deps are still equal', () => {
  const effect = vi.fn()
  const { set } = probe(effect)

  set('old', 1)
  expect(effect).toHaveBeenCalledTimes(2)

  set('old', 1, 'y')
  set('old', 1, 'z')
  expect(effect).toHaveBeenCalledTimes(2)
})
