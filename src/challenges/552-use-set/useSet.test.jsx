import { act, render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useSet } from './useSet'

function probe(initial) {
  let api
  const renders = vi.fn()
  const Probe = () => {
    api = useSet(initial)
    renders()
    return null
  }
  render(<Probe />)
  return {
    get: () => api,
    renders,
    call: (name, ...args) => act(() => api[name](...args)),
    values: () => [...api.set],
  }
}

test('starts empty', () => {
  expect(probe().values()).toEqual([])
})

test('starts from the values it was given', () => {
  expect(probe(['a', 'b']).values()).toEqual(['a', 'b'])
})

test('add puts a value in', () => {
  const p = probe()
  p.call('add', 'a')
  expect(p.values()).toEqual(['a'])
})

test('adding the same value twice changes nothing', () => {
  const p = probe(['a'])
  p.call('add', 'a')
  expect(p.values()).toEqual(['a'])
})

test('remove takes it out', () => {
  const p = probe(['a', 'b'])
  p.call('remove', 'a')
  expect(p.values()).toEqual(['b'])
})

test('removing something absent is harmless', () => {
  const p = probe(['a'])
  p.call('remove', 'zzz')
  expect(p.values()).toEqual(['a'])
})

test('toggle flips a value both ways', () => {
  const p = probe()
  p.call('toggle', 'a')
  expect(p.values()).toEqual(['a'])

  p.call('toggle', 'a')
  expect(p.values()).toEqual([])
})

test('has and size report the current contents', () => {
  const p = probe(['a'])
  expect(p.get().has('a')).toBe(true)
  expect(p.get().has('b')).toBe(false)
  expect(p.get().size).toBe(1)

  p.call('add', 'b')
  expect(p.get().size).toBe(2)
})

test('clear empties it', () => {
  const p = probe(['a', 'b'])
  p.call('clear')
  expect(p.values()).toEqual([])
})

test('a change re-renders — the Set is replaced, not mutated', () => {
  const p = probe()
  const before = p.get().set
  const renderCount = p.renders.mock.calls.length

  p.call('add', 'a')

  expect(p.get().set).not.toBe(before)
  expect(p.renders.mock.calls.length).toBeGreaterThan(renderCount)
})

test('the callbacks keep their identity across renders', () => {
  const p = probe()
  const before = p.get()

  p.call('add', 'a')

  expect(p.get().add).toBe(before.add)
  expect(p.get().remove).toBe(before.remove)
  expect(p.get().toggle).toBe(before.toggle)
  expect(p.get().clear).toBe(before.clear)
})
