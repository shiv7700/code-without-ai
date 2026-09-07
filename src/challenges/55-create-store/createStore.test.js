import { expect, test, vi } from 'vitest'
import { createStore } from './createStore'

const counter = (state, action) =>
  action.type === 'inc' ? { count: state.count + 1 } : state

const make = () => createStore(counter, { count: 0 })

test('starts on the initial state', () => {
  expect(make().getState()).toEqual({ count: 0 })
})

test('dispatch runs the reducer', () => {
  const store = make()
  store.dispatch({ type: 'inc' })
  expect(store.getState()).toEqual({ count: 1 })
})

test('an unknown action leaves the state alone', () => {
  const store = make()
  const before = store.getState()
  store.dispatch({ type: 'nope' })

  expect(store.getState()).toBe(before)
})

test('subscribers are told about a dispatch', () => {
  const store = make()
  const spy = vi.fn()

  store.subscribe(spy)
  store.dispatch({ type: 'inc' })

  expect(spy).toHaveBeenCalledTimes(1)
})

test('a subscriber reads the NEW state, not the old one', () => {
  const store = make()
  let seen

  store.subscribe(() => {
    seen = store.getState().count
  })
  store.dispatch({ type: 'inc' })

  expect(seen).toBe(1)
})

test('every subscriber hears it', () => {
  const store = make()
  const a = vi.fn()
  const b = vi.fn()

  store.subscribe(a)
  store.subscribe(b)
  store.dispatch({ type: 'inc' })

  expect(a).toHaveBeenCalled()
  expect(b).toHaveBeenCalled()
})

test('subscribe returns an unsubscribe', () => {
  const store = make()
  const spy = vi.fn()

  store.subscribe(spy)()
  store.dispatch({ type: 'inc' })

  expect(spy).not.toHaveBeenCalled()
})

test('unsubscribing one leaves the others subscribed', () => {
  const store = make()
  const kept = vi.fn()
  const dropped = vi.fn()

  store.subscribe(kept)
  store.subscribe(dropped)()
  store.dispatch({ type: 'inc' })

  expect(kept).toHaveBeenCalledTimes(1)
  expect(dropped).not.toHaveBeenCalled()
})

test('unsubscribing from inside a notification does not skip the next one', () => {
  const store = make()
  const second = vi.fn()

  const stop = store.subscribe(() => stop())
  store.subscribe(second)
  store.dispatch({ type: 'inc' })

  expect(second).toHaveBeenCalledTimes(1)
})

test('two stores are independent', () => {
  const a = make()
  const b = make()

  a.dispatch({ type: 'inc' })
  expect(b.getState()).toEqual({ count: 0 })
})
