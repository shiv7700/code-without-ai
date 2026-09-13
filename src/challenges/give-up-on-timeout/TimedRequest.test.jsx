import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import TimedRequest from './TimedRequest'

function controllable() {
  let request
  let timer
  const run = vi.fn(
    () => new Promise((resolve, reject) => (request = { resolve, reject })),
  )
  const timeout = new Promise((resolve) => (timer = resolve))
  return {
    run,
    timeout,
    resolve: (v) => act(async () => request.resolve(v)),
    reject: (m) => act(async () => request.reject(new Error(m))),
    expire: () => act(async () => timer()),
  }
}

test('the answer shows when it arrives in time', async () => {
  const api = controllable()
  render(<TimedRequest run={api.run} timeout={api.timeout} />)

  expect(screen.getByText('Loading…')).toBeInTheDocument()
  await api.resolve('receipt')
  expect(screen.getByText('receipt')).toBeInTheDocument()
})

test('the timeout winning shows an alert', async () => {
  const api = controllable()
  render(<TimedRequest run={api.run} timeout={api.timeout} />)

  await api.expire()
  expect(screen.getByRole('alert')).toHaveTextContent('Timed out')
})

test('a failure before the timeout shows its own message', async () => {
  const api = controllable()
  render(<TimedRequest run={api.run} timeout={api.timeout} />)

  await api.reject('offline')
  expect(screen.getByRole('alert')).toHaveTextContent('offline')
})

test('the timeout expiring after a good answer changes nothing', async () => {
  const api = controllable()
  render(<TimedRequest run={api.run} timeout={api.timeout} />)

  await api.resolve('receipt')
  await api.expire()

  expect(screen.getByText('receipt')).toBeInTheDocument()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('an answer arriving after the timeout is thrown away', async () => {
  const api = controllable()
  render(<TimedRequest run={api.run} timeout={api.timeout} />)

  await api.expire()
  await api.resolve('receipt')

  expect(screen.queryByText('receipt')).not.toBeInTheDocument()
  expect(screen.getByRole('alert')).toHaveTextContent('Timed out')
})
