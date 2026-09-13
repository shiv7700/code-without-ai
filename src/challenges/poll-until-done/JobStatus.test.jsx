import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import JobStatus from './JobStatus'

function controllable() {
  const queue = []
  const listeners = new Set()
  const load = vi.fn(() => new Promise((resolve) => queue.push(resolve)))
  const tick = (fn) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
  return {
    load,
    tick,
    listeners,
    fire: () => act(async () => listeners.forEach((fn) => fn())),
    resolve: (status) => act(async () => queue.shift()({ status })),
  }
}

const status = () => screen.getByTestId('status').textContent

test('it shows the status it was given', async () => {
  const api = controllable()
  render(<JobStatus load={api.load} tick={api.tick} />)

  await api.resolve('queued')
  expect(status()).toBe('queued')
})

test('a running job keeps being asked about', async () => {
  const api = controllable()
  render(<JobStatus load={api.load} tick={api.tick} />)
  await api.resolve('queued')

  await api.fire()
  await api.resolve('running')

  expect(status()).toBe('running')
  expect(api.load).toHaveBeenCalledTimes(2)
})

test('done unsubscribes', async () => {
  const api = controllable()
  render(<JobStatus load={api.load} tick={api.tick} />)

  await api.resolve('done')
  expect(api.listeners.size).toBe(0)
})

test('failed is terminal too', async () => {
  const api = controllable()
  render(<JobStatus load={api.load} tick={api.tick} />)

  await api.resolve('failed')
  await api.fire()

  expect(status()).toBe('failed')
  expect(api.load).toHaveBeenCalledTimes(1)
})

test('ticks after a terminal status ask nothing, however many arrive', async () => {
  const api = controllable()
  render(<JobStatus load={api.load} tick={api.tick} />)

  await api.resolve('queued')
  await api.fire()
  await api.resolve('running')
  await api.fire()
  await api.resolve('done')

  await api.fire()
  await api.fire()
  await api.fire()

  expect(api.load).toHaveBeenCalledTimes(3)
  expect(status()).toBe('done')
})
