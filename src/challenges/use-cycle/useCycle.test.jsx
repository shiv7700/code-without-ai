import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useCycle } from './useCycle'

function probe(initial) {
  const box = {}
  function Probe({ values }) {
    ;[box.current, box.next, box.reset] = useCycle(values)
    return null
  }
  const view = render(<Probe values={initial} />)
  return {
    box,
    setValues: (values) => act(() => view.rerender(<Probe values={values} />)),
  }
}

test('starts on the first value', () => {
  expect(probe(['red', 'amber', 'green']).box.current).toBe('red')
})

test('next moves one along', () => {
  const { box } = probe(['red', 'amber', 'green'])

  act(() => box.next())
  expect(box.current).toBe('amber')

  act(() => box.next())
  expect(box.current).toBe('green')
})

test('it wraps round to the start', () => {
  const { box } = probe(['red', 'amber'])

  act(() => box.next())
  act(() => box.next())

  expect(box.current).toBe('red')
})

test('reset goes back to the first', () => {
  const { box } = probe(['red', 'amber', 'green'])

  act(() => box.next())
  act(() => box.reset())

  expect(box.current).toBe('red')
})

test('next and reset survive a re-render unchanged', () => {
  const p = probe(['red', 'amber'])
  const { next, reset } = p.box

  p.setValues(['red', 'amber'])

  expect(p.box.next).toBe(next)
  expect(p.box.reset).toBe(reset)
})

test('two nexts in one handler move two along', () => {
  const { box } = probe(['red', 'amber', 'green'])

  act(() => {
    box.next()
    box.next()
  })

  expect(box.current).toBe('green')
})

test('a fresh array of the same values does not move the position', () => {
  const p = probe(['red', 'amber', 'green'])

  act(() => p.box.next())
  p.setValues(['red', 'amber', 'green'])

  expect(p.box.current).toBe('amber')
})

test('next wraps around the list it has now, not the one it started with', () => {
  const p = probe(['red', 'amber'])

  p.setValues(['red', 'amber', 'green'])
  act(() => {
    p.box.next()
    p.box.next()
  })

  expect(p.box.current).toBe('green')
})
