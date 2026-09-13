import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useMap } from './useMap'

function probe(initial) {
  const box = { renders: 0 }
  function Probe({ tick }) {
    box.renders += 1
    Object.assign(box, useMap(initial))
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('starts empty, or from the entries it was given', () => {
  expect(probe().box.map.size).toBe(0)

  const { box } = probe([['a', 1]])
  expect(box.map).toBeInstanceOf(Map)
  expect(box.map.get('a')).toBe(1)
})

test('set puts an entry in, and the render shows it', () => {
  const { box } = probe()

  act(() => box.set('a', 1))

  expect(box.map.get('a')).toBe(1)
  expect(box.map.size).toBe(1)
  expect(box.renders).toBe(2)
})

test('set on an existing key replaces the value', () => {
  const { box } = probe([['a', 1]])

  act(() => box.set('a', 2))
  expect(box.map.get('a')).toBe(2)
  expect(box.map.size).toBe(1)
})

test('remove and clear take things out again', () => {
  const { box } = probe([
    ['a', 1],
    ['b', 2],
  ])

  act(() => box.remove('a'))
  expect(box.map.has('a')).toBe(false)
  expect(box.map.has('b')).toBe(true)

  act(() => box.clear())
  expect(box.map.size).toBe(0)
})

test('the functions survive a re-render unchanged', () => {
  const { box, rerender } = probe()
  const { set, remove, clear } = box

  act(() => box.set('a', 1))
  rerender()

  expect(box.set).toBe(set)
  expect(box.remove).toBe(remove)
  expect(box.clear).toBe(clear)
})

test('two sets in one handler land both', () => {
  const { box } = probe()

  act(() => {
    box.set('a', 1)
    box.set('b', 2)
  })

  expect([...box.map.entries()]).toEqual([
    ['a', 1],
    ['b', 2],
  ])
})

test('the Map you were holding is not the Map you get back', () => {
  const { box } = probe()
  const before = box.map

  act(() => box.set('a', 1))

  expect(box.map).not.toBe(before)
  expect(before.size).toBe(0)
})
