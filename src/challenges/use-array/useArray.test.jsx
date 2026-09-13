import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useArray } from './useArray'

function probe(initial) {
  const box = {}
  function Probe({ tick }) {
    Object.assign(box, useArray(initial))
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return {
    box,
    rerender: () => act(() => view.rerender(<Probe tick={Math.random()} />)),
  }
}

test('starts empty, or at the initial list', () => {
  expect(probe().box.items).toEqual([])
  expect(probe(['a', 'b']).box.items).toEqual(['a', 'b'])
})

test('push appends and remove drops the one at that index', () => {
  const { box } = probe(['a', 'b'])

  act(() => box.push('c'))
  expect(box.items).toEqual(['a', 'b', 'c'])

  act(() => box.remove(1))
  expect(box.items).toEqual(['a', 'c'])
})

test('remove on an index that is not there leaves the contents alone', () => {
  const { box } = probe(['a'])

  act(() => box.remove(9))
  expect(box.items).toEqual(['a'])
})

test('clear empties it', () => {
  const { box } = probe(['a', 'b'])

  act(() => box.clear())
  expect(box.items).toEqual([])
})

test('the functions survive a re-render unchanged', () => {
  const { box, rerender } = probe()
  const { push, remove, clear } = box

  act(() => box.push('a'))
  rerender()

  expect(box.push).toBe(push)
  expect(box.remove).toBe(remove)
  expect(box.clear).toBe(clear)
})

test('two pushes in one handler land both, in order', () => {
  const { box } = probe()

  act(() => {
    box.push('a')
    box.push('b')
  })

  expect(box.items).toEqual(['a', 'b'])
})

test('the array you had is not the array you get', () => {
  const initial = ['a']
  const { box } = probe(initial)
  const before = box.items

  act(() => box.push('b'))

  expect(box.items).not.toBe(before)
  expect(before).toEqual(['a'])
  expect(initial).toEqual(['a'])
})
