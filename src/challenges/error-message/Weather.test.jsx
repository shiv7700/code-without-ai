import { act, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Weather from './Weather'

function controllable() {
  let settle, fail
  const load = () =>
    new Promise((resolve, reject) => {
      settle = resolve
      fail = reject
    })
  return {
    load,
    resolve: (v) => act(async () => settle(v)),
    reject: (e) => act(async () => fail(e)),
  }
}

test('shows the temperature on success', async () => {
  const api = controllable()
  render(<Weather load={api.load} />)

  await api.resolve({ temp: 31 })
  expect(screen.getByTestId('temp')).toHaveTextContent('31')
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('shows the error message, not a generic one', async () => {
  const api = controllable()
  render(<Weather load={api.load} />)

  await api.reject(new Error('Rate limited, try in 30s'))
  expect(screen.getByRole('alert')).toHaveTextContent('Rate limited, try in 30s')
})

test('a failure shows no temperature', async () => {
  const api = controllable()
  render(<Weather load={api.load} />)

  await api.reject(new Error('boom'))
  expect(screen.queryByTestId('temp')).not.toBeInTheDocument()
})
