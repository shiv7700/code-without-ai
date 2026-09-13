import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useDefault } from './useDefault'

function probe(defaultValue, initial) {
  const box = {}
  function Probe({ fallback }) {
    ;[box.value, box.set] = useDefault(fallback, initial)
    return null
  }
  const view = render(<Probe fallback={defaultValue} />)
  return {
    box,
    setDefault: (next) => act(() => view.rerender(<Probe fallback={next} />)),
  }
}

test('starts at the initial value', () => {
  expect(probe('x', 'hello').box.value).toBe('hello')
})

test('a null or missing initial starts at the default', () => {
  expect(probe('x', null).box.value).toBe('x')
  expect(probe('x').box.value).toBe('x')
})

test('falsy values are values', () => {
  const { box } = probe('x', 'hello')

  act(() => box.set(0))
  expect(box.value).toBe(0)

  act(() => box.set(''))
  expect(box.value).toBe('')

  act(() => box.set(false))
  expect(box.value).toBe(false)
})

test('setting null or undefined falls back', () => {
  const { box } = probe('x', 'hello')

  act(() => box.set(null))
  expect(box.value).toBe('x')

  act(() => box.set('again'))
  act(() => box.set(undefined))
  expect(box.value).toBe('x')
})

test('the updater is handed the default, not the null underneath it', () => {
  const { box } = probe('x', 'hello')

  act(() => box.set(null))
  act(() => box.set((v) => v + '!'))

  expect(box.value).toBe('x!')
})

test('the setter survives a re-render and falls back to the newest default', () => {
  const p = probe('x', 'hello')
  const set = p.box.set

  p.setDefault('y')
  expect(p.box.set).toBe(set)

  act(() => set(null))
  expect(p.box.value).toBe('y')
})
