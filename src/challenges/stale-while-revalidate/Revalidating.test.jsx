import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Revalidating from './Revalidating'

function controllable() {
  const queue = []
  const load = vi.fn(
    () => new Promise((resolve, reject) => queue.push({ resolve, reject })),
  )
  return {
    load,
    resolve: (v) => act(async () => queue.shift().resolve(v)),
    reject: (m) => act(async () => queue.shift().reject(new Error(m))),
  }
}

const value = () => screen.getByTestId('value').textContent
const state = () => screen.getByTestId('state').textContent

test('with nothing cached it just loads', async () => {
  const api = controllable()
  render(<Revalidating load={api.load} />)

  expect(state()).toBe('loading')
  await api.resolve('42')
  expect(value()).toBe('42')
  expect(state()).toBe('fresh')
})

test('a cached value is on screen from the first render', () => {
  const api = controllable()
  render(<Revalidating cached="41" load={api.load} />)

  expect(value()).toBe('41')
  expect(state()).toBe('stale')
})

test('it revalidates anyway', async () => {
  const api = controllable()
  render(<Revalidating cached="41" load={api.load} />)

  expect(api.load).toHaveBeenCalledTimes(1)
  await api.resolve('42')

  expect(value()).toBe('42')
  expect(state()).toBe('fresh')
})

test('a failure with nothing cached is just a failure', async () => {
  const api = controllable()
  render(<Revalidating load={api.load} />)

  await api.reject('offline')
  expect(screen.getByRole('alert')).toHaveTextContent('offline')
  expect(screen.queryByTestId('value')).not.toBeInTheDocument()
})

test('a failed revalidation leaves the cached value on screen', async () => {
  const api = controllable()
  render(<Revalidating cached="41" load={api.load} />)

  await api.reject('offline')

  expect(value()).toBe('41')
  expect(state()).toBe('stale')
  expect(screen.getByRole('alert')).toHaveTextContent('offline')
})
