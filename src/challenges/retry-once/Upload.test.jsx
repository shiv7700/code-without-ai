import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Upload from './Upload'

function controllable() {
  const queue = []
  const send = vi.fn(
    () => new Promise((resolve, reject) => queue.push({ resolve, reject })),
  )
  return {
    send,
    resolve: (v) => act(async () => queue.shift().resolve(v)),
    reject: (m) => act(async () => queue.shift().reject(new Error(m))),
  }
}

test('one call is enough when it works', async () => {
  const api = controllable()
  render(<Upload send={api.send} />)

  await api.resolve('done')
  expect(screen.getByText('done')).toBeInTheDocument()
  expect(api.send).toHaveBeenCalledTimes(1)
})

test('a failure is retried once', async () => {
  const api = controllable()
  render(<Upload send={api.send} />)

  await api.reject('first')
  expect(api.send).toHaveBeenCalledTimes(2)

  await api.resolve('done')
  expect(screen.getByText('done')).toBeInTheDocument()
})

test('it gives up after the retries, showing the last error', async () => {
  const api = controllable()
  render(<Upload send={api.send} retries={2} />)

  await api.reject('one')
  await api.reject('two')
  await api.reject('three')

  expect(api.send).toHaveBeenCalledTimes(3)
  expect(screen.getByRole('alert')).toHaveTextContent('three')
})

test('retries={0} means one attempt', async () => {
  const api = controllable()
  render(<Upload send={api.send} retries={0} />)

  await api.reject('only')
  expect(api.send).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('alert')).toHaveTextContent('only')
})
