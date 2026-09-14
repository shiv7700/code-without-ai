import { expect, test } from 'vitest'
import { deepFreeze } from './deepFreeze'

test('freezes the object and everything under it', () => {
  const state = { user: { name: 'Bo', tags: ['a'] } }
  deepFreeze(state)

  expect(Object.isFrozen(state)).toBe(true)
  expect(Object.isFrozen(state.user)).toBe(true)
  expect(Object.isFrozen(state.user.tags)).toBe(true)
})

test('a nested write does nothing', () => {
  const state = deepFreeze({ user: { name: 'Bo' }, tags: ['a'] })

  try {
    state.user.name = 'Al'
  } catch {
    // strict mode throws, sloppy mode ignores it — either is fine
  }
  expect(state.user.name).toBe('Bo')
  expect(() => state.tags.push('b')).toThrow()
})

test('it hands back the same object', () => {
  const state = { a: 1 }
  expect(deepFreeze(state)).toBe(state)
})

test('primitives and null go straight through', () => {
  expect(deepFreeze(null)).toBeNull()
  expect(deepFreeze(undefined)).toBeUndefined()
  expect(deepFreeze(42)).toBe(42)
  expect(deepFreeze('hi')).toBe('hi')
})

test('a cycle does not hang it', () => {
  const a = { name: 'a' }
  const b = { name: 'b', a }
  a.b = b

  deepFreeze(a)
  expect(Object.isFrozen(a)).toBe(true)
  expect(Object.isFrozen(b)).toBe(true)
})

test('a Map and a Set are frozen, and so is what is inside them', () => {
  const inner = { deep: true }
  const state = { byId: new Map([['x', inner]]), seen: new Set([{ id: 1 }]) }

  deepFreeze(state)

  expect(Object.isFrozen(state.byId)).toBe(true)
  expect(Object.isFrozen(inner)).toBe(true)
  expect(Object.isFrozen(state.seen)).toBe(true)
  expect(Object.isFrozen([...state.seen][0])).toBe(true)
})
