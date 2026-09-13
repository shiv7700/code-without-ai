import { act, render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useControllableState } from './useControllableState'

function probe(props) {
  let api
  const Probe = (p) => {
    api = useControllableState(p)
    return null
  }
  const view = render(<Probe {...props} />)
  return {
    ...view,
    value: () => api[0],
    set: (next) => act(() => api[1](next)),
    setProps: (next) => view.rerender(<Probe {...next} />),
    api: () => api,
  }
}

test('uncontrolled: starts at the default', () => {
  expect(probe({ defaultValue: 'a' }).value()).toBe('a')
})

test('uncontrolled: setting the value updates it', () => {
  const p = probe({ defaultValue: 'a' })
  p.set('b')
  expect(p.value()).toBe('b')
})

test('uncontrolled: onChange still hears about it', () => {
  const onChange = vi.fn()
  const p = probe({ defaultValue: 'a', onChange })
  p.set('b')

  expect(onChange).toHaveBeenCalledWith('b')
})

test('uncontrolled: an updater function gets the current value', () => {
  const p = probe({ defaultValue: 1 })
  p.set((n) => n + 1)
  p.set((n) => n + 1)

  expect(p.value()).toBe(3)
})

test('controlled: the prop wins over the default', () => {
  expect(probe({ value: 'prop', defaultValue: 'default' }).value()).toBe('prop')
})

test('controlled: setting the value does not change what comes back', () => {
  const p = probe({ value: 'prop' })
  p.set('ignored')

  expect(p.value()).toBe('prop')
})

test('controlled: onChange is how the parent finds out', () => {
  const onChange = vi.fn()
  const p = probe({ value: 'prop', onChange })
  p.set('next')

  expect(onChange).toHaveBeenCalledWith('next')
})

test('controlled: an updater function is resolved against the prop', () => {
  const onChange = vi.fn()
  const p = probe({ value: 5, onChange })
  p.set((n) => n + 1)

  expect(onChange).toHaveBeenCalledWith(6)
})

test('controlled: a new prop is what comes back', () => {
  const p = probe({ value: 'one' })
  p.setProps({ value: 'two' })

  expect(p.value()).toBe('two')
})

test('a value of null is controlled — only undefined means uncontrolled', () => {
  const p = probe({ value: null, defaultValue: 'default' })
  expect(p.value()).toBe(null)

  p.set('ignored')
  expect(p.value()).toBe(null)
})

test('the setter keeps its identity across renders', () => {
  const p = probe({ defaultValue: 'a' })
  const before = p.api()[1]

  p.set('b')
  expect(p.api()[1]).toBe(before)
})
