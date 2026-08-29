import { act, render } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

beforeEach(() => localStorage.clear())

function probe(key, initial) {
  const box = {}
  function Probe({ tick }) {
    ;[box.value, box.setValue] = useLocalStorage(key, initial)
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return { box, rerender: () => act(() => view.rerender(<Probe tick={1} />)) }
}

test('uses initialValue when nothing is stored', () => {
  const { box } = probe('name', 'shivang')
  expect(box.value).toBe('shivang')
})

test('reads an existing value out of localStorage', () => {
  localStorage.setItem('count', '42')
  const { box } = probe('count', 0)
  expect(box.value).toBe(42)
})

test('setValue updates state and writes JSON to storage', () => {
  const { box } = probe('count', 0)

  act(() => box.setValue(7))
  expect(box.value).toBe(7)
  expect(localStorage.getItem('count')).toBe('7')
})

test('setValue accepts an updater function', () => {
  const { box } = probe('count', 1)

  act(() => box.setValue((n) => n + 1))
  act(() => box.setValue((n) => n + 1))

  expect(box.value).toBe(3)
  expect(localStorage.getItem('count')).toBe('3')
})

test('objects survive a round trip', () => {
  const { box } = probe('user', { name: 'a', tags: [] })

  act(() => box.setValue({ name: 'b', tags: ['x'] }))
  expect(JSON.parse(localStorage.getItem('user'))).toEqual({ name: 'b', tags: ['x'] })
})

test('a lazy initialValue function runs at most once', () => {
  const init = vi.fn(() => 'computed')
  const { box, rerender } = probe('lazy', init)

  rerender()
  rerender()

  expect(box.value).toBe('computed')
  expect(init).toHaveBeenCalledTimes(1)
})

test('corrupt JSON in storage falls back instead of throwing', () => {
  localStorage.setItem('broken', '{not json at all')

  const { box } = probe('broken', 'safe default')
  expect(box.value).toBe('safe default')
})

test('setValue keeps a stable identity across re-renders', () => {
  const { box, rerender } = probe('count', 0)

  const setValue = box.setValue
  rerender()
  act(() => box.setValue(1))

  expect(box.setValue).toBe(setValue)
})

test('a storage event from another tab updates the value', () => {
  const { box } = probe('count', 0)

  act(() => {
    localStorage.setItem('count', '99')
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'count', newValue: '99' }),
    )
  })

  expect(box.value).toBe(99)
})

test('a storage event for a different key is ignored', () => {
  const { box } = probe('count', 0)

  act(() => {
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'somethingElse', newValue: '99' }),
    )
  })

  expect(box.value).toBe(0)
})
