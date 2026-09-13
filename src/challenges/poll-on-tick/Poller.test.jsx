import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Poller from './Poller'

function controllable() {
  const queue = []
  const listeners = new Set()
  const load = vi.fn(
    () => new Promise((resolve, reject) => queue.push({ resolve, reject })),
  )
  const tick = (fn) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
  return {
    load,
    tick,
    listeners,
    fire: () => act(async () => listeners.forEach((fn) => fn())),
    resolve: (v) => act(async () => queue.shift().resolve(v)),
  }
}

const value = () => screen.getByTestId('value').textContent

test('it loads once on mount', async () => {
  const api = controllable()
  render(<Poller load={api.load} tick={api.tick} />)

  expect(api.load).toHaveBeenCalledTimes(1)
  await api.resolve('37')
  expect(value()).toBe('37')
})

test('every tick loads again', async () => {
  const api = controllable()
  render(<Poller load={api.load} tick={api.tick} />)
  await api.resolve('37')

  await api.fire()
  await api.resolve('38')
  expect(value()).toBe('38')

  await api.fire()
  await api.resolve('39')
  expect(value()).toBe('39')
})

test('unmounting stops the polling', async () => {
  const api = controllable()
  const { unmount } = render(<Poller load={api.load} tick={api.tick} />)
  await api.resolve('37')

  unmount()
  await api.fire()

  expect(api.load).toHaveBeenCalledTimes(1)
  expect(api.listeners.size).toBe(0)
})

test('a tick loads exactly once, however many values have already arrived', async () => {
  const api = controllable()
  render(<Poller load={api.load} tick={api.tick} />)
  await api.resolve('1')

  await api.fire()
  await api.resolve('2')
  await api.fire()
  await api.resolve('3')
  await api.fire()

  expect(api.load).toHaveBeenCalledTimes(4)
  expect(api.listeners.size).toBe(1)
})
