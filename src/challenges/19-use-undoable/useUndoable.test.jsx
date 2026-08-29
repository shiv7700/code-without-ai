import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useUndoable } from './useUndoable'

function probe(initial) {
  const box = {}
  function Probe({ tick }) {
    Object.assign(box, useUndoable(initial))
    box.tick = tick
    return null
  }
  const view = render(<Probe tick={0} />)
  return { box, rerender: () => act(() => view.rerender(<Probe tick={1} />)) }
}

test('starts at the initial value with nowhere to go', () => {
  const { box } = probe('a')

  expect(box.state).toBe('a')
  expect(box.canUndo).toBe(false)
  expect(box.canRedo).toBe(false)
})

test('set moves forward and enables undo', () => {
  const { box } = probe('a')

  act(() => box.set('b'))
  expect(box.state).toBe('b')
  expect(box.canUndo).toBe(true)
  expect(box.canRedo).toBe(false)
})

test('set accepts an updater function', () => {
  const { box } = probe(1)

  act(() => box.set((n) => n + 1))
  act(() => box.set((n) => n + 1))

  expect(box.state).toBe(3)
})

test('undo and redo walk the history', () => {
  const { box } = probe('a')

  act(() => box.set('b'))
  act(() => box.set('c'))

  act(() => box.undo())
  expect(box.state).toBe('b')

  act(() => box.undo())
  expect(box.state).toBe('a')
  expect(box.canUndo).toBe(false)
  expect(box.canRedo).toBe(true)

  act(() => box.redo())
  expect(box.state).toBe('b')

  act(() => box.redo())
  expect(box.state).toBe('c')
  expect(box.canRedo).toBe(false)
})

test('undo at the start and redo at the end do nothing', () => {
  const { box } = probe('a')

  act(() => box.undo())
  act(() => box.undo())
  expect(box.state).toBe('a')

  act(() => box.set('b'))
  act(() => box.redo())
  act(() => box.redo())
  expect(box.state).toBe('b')
})

test('a new set after undo drops the redo future', () => {
  const { box } = probe('a')

  act(() => box.set('b'))
  act(() => box.set('c'))
  act(() => box.undo()) // back at 'b', 'c' is redoable
  expect(box.canRedo).toBe(true)

  act(() => box.set('branch'))

  expect(box.state).toBe('branch')
  expect(box.canRedo).toBe(false)

  act(() => box.redo())
  expect(box.state).toBe('branch') // 'c' is gone for good
})

test('undo after branching goes to the surviving history', () => {
  const { box } = probe('a')

  act(() => box.set('b'))
  act(() => box.set('c'))
  act(() => box.undo())
  act(() => box.set('branch'))
  act(() => box.undo())

  expect(box.state).toBe('b')
})

test('reset jumps to a value and wipes history', () => {
  const { box } = probe('a')

  act(() => box.set('b'))
  act(() => box.set('c'))
  act(() => box.undo())

  act(() => box.reset('fresh'))

  expect(box.state).toBe('fresh')
  expect(box.canUndo).toBe(false)
  expect(box.canRedo).toBe(false)
})

test('the returned functions keep stable identities', () => {
  const { box, rerender } = probe('a')

  const { set, undo, redo, reset } = box
  act(() => box.set('b'))
  rerender()

  expect(box.set).toBe(set)
  expect(box.undo).toBe(undo)
  expect(box.redo).toBe(redo)
  expect(box.reset).toBe(reset)
})
