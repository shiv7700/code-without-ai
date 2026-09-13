import { describe, expect, test } from 'vitest'
import { initialState, selectVisible, todoReducer } from './todoReducer'

const run = (actions, state = initialState) => actions.reduce(todoReducer, state)

const seeded = run([
  { type: 'added', id: 1, text: 'write code' },
  { type: 'added', id: 2, text: 'ship it' },
  { type: 'toggled', id: 1 },
])

describe('todoReducer', () => {
  test('added appends a todo that is not done', () => {
    const next = todoReducer(initialState, { type: 'added', id: 1, text: 'hi' })
    expect(next.todos).toEqual([{ id: 1, text: 'hi', done: false }])
  })

  test('toggled flips only that todo', () => {
    expect(seeded.todos).toEqual([
      { id: 1, text: 'write code', done: true },
      { id: 2, text: 'ship it', done: false },
    ])
  })

  test('removed drops that todo', () => {
    const next = todoReducer(seeded, { type: 'removed', id: 1 })
    expect(next.todos.map((t) => t.id)).toEqual([2])
  })

  test('cleared removes every done todo', () => {
    const next = todoReducer(seeded, { type: 'cleared' })
    expect(next.todos.map((t) => t.id)).toEqual([2])
  })

  test('filtered sets the filter and leaves todos alone', () => {
    const next = todoReducer(seeded, { type: 'filtered', filter: 'done' })
    expect(next.filter).toBe('done')
    expect(next.todos).toEqual(seeded.todos)
  })

  test('an unknown action returns the exact same state object', () => {
    expect(todoReducer(seeded, { type: 'nonsense' })).toBe(seeded)
  })

  test('an action for a missing id is a no-op, not a crash', () => {
    expect(todoReducer(seeded, { type: 'toggled', id: 999 }).todos).toEqual(seeded.todos)
    expect(todoReducer(seeded, { type: 'removed', id: 999 }).todos).toEqual(seeded.todos)
  })

  test('never mutates — the previous state is untouched', () => {
    const before = structuredClone(seeded)

    todoReducer(seeded, { type: 'added', id: 3, text: 'x' })
    todoReducer(seeded, { type: 'toggled', id: 2 })
    todoReducer(seeded, { type: 'removed', id: 1 })
    todoReducer(seeded, { type: 'cleared' })

    expect(seeded).toEqual(before)
  })

  test('is pure — same input, same output', () => {
    const action = { type: 'added', id: 9, text: 'same' }
    expect(todoReducer(seeded, action)).toEqual(todoReducer(seeded, action))
  })
})

describe('selectVisible', () => {
  test('all → everything', () => {
    expect(selectVisible(seeded).map((t) => t.id)).toEqual([1, 2])
  })

  test('active → only unfinished', () => {
    const state = todoReducer(seeded, { type: 'filtered', filter: 'active' })
    expect(selectVisible(state).map((t) => t.id)).toEqual([2])
  })

  test('done → only finished', () => {
    const state = todoReducer(seeded, { type: 'filtered', filter: 'done' })
    expect(selectVisible(state).map((t) => t.id)).toEqual([1])
  })
})
