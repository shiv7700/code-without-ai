import { expect, test, vi } from 'vitest'
import { EventEmitter } from './EventEmitter'

test('a subscriber hears its event', () => {
  const bus = new EventEmitter()
  const spy = vi.fn()

  bus.on('ping', spy)
  bus.emit('ping', 1, 2)

  expect(spy).toHaveBeenCalledWith(1, 2)
})

test('emitting an event nobody listens to is fine', () => {
  expect(() => new EventEmitter().emit('nothing')).not.toThrow()
})

test('subscribers only hear their own event', () => {
  const bus = new EventEmitter()
  const spy = vi.fn()

  bus.on('ping', spy)
  bus.emit('pong')

  expect(spy).not.toHaveBeenCalled()
})

test('every subscriber is called, in subscription order', () => {
  const bus = new EventEmitter()
  const order = []

  bus.on('e', () => order.push('first'))
  bus.on('e', () => order.push('second'))
  bus.emit('e')

  expect(order).toEqual(['first', 'second'])
})

test('on returns something that unsubscribes', () => {
  const bus = new EventEmitter()
  const spy = vi.fn()

  const stop = bus.on('e', spy)
  stop()
  bus.emit('e')

  expect(spy).not.toHaveBeenCalled()
})

test('off removes one subscription, not the event', () => {
  const bus = new EventEmitter()
  const kept = vi.fn()
  const dropped = vi.fn()

  bus.on('e', kept)
  bus.on('e', dropped)
  bus.off('e', dropped)
  bus.emit('e')

  expect(kept).toHaveBeenCalledTimes(1)
  expect(dropped).not.toHaveBeenCalled()
})

test('the same callback added twice is called twice', () => {
  const bus = new EventEmitter()
  const spy = vi.fn()

  bus.on('e', spy)
  bus.on('e', spy)
  bus.emit('e')

  expect(spy).toHaveBeenCalledTimes(2)
})

test('unsubscribing during an emit does not skip the next subscriber', () => {
  const bus = new EventEmitter()
  const second = vi.fn()

  const stop = bus.on('e', () => stop())
  bus.on('e', second)
  bus.emit('e')

  expect(second).toHaveBeenCalledTimes(1)
})

test('two emitters do not share subscribers', () => {
  const a = new EventEmitter()
  const b = new EventEmitter()
  const spy = vi.fn()

  a.on('e', spy)
  b.emit('e')

  expect(spy).not.toHaveBeenCalled()
})
