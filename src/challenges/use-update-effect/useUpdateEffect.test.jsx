import { render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useUpdateEffect } from './useUpdateEffect'

function probe(effect) {
  let renders = 0
  function Probe({ dep, other }) {
    renders++
    useUpdateEffect(effect, [dep])
    return <span>{other}</span>
  }
  const view = render(<Probe dep="a" other="x" />)
  return {
    unmount: view.unmount,
    renders: () => renders,
    set: (dep, other = 'x') => view.rerender(<Probe dep={dep} other={other} />),
  }
}

test('it does not run on mount', () => {
  const effect = vi.fn()
  probe(effect)
  expect(effect).not.toHaveBeenCalled()
})

test('it runs when a dependency changes', () => {
  const effect = vi.fn()
  const { set } = probe(effect)
  set('b')
  expect(effect).toHaveBeenCalledTimes(1)
})

test('a re-render with unchanged deps does not run it', () => {
  const effect = vi.fn()
  const { set } = probe(effect)
  set('a', 'y')
  set('a', 'z')
  expect(effect).not.toHaveBeenCalled()
})

test('the skipped first run leaves no cleanup to fire later', () => {
  const cleanup = vi.fn()
  const { set, unmount } = probe(() => cleanup)

  set('b') // first real run
  expect(cleanup).not.toHaveBeenCalled()

  set('c') // cleans up the run from 'b', then runs again
  expect(cleanup).toHaveBeenCalledTimes(1)

  unmount()
  expect(cleanup).toHaveBeenCalledTimes(2)
})

test('mounting renders the component exactly once', () => {
  const { renders } = probe(vi.fn())
  expect(renders()).toBe(1)
})
