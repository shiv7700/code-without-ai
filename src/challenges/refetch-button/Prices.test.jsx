import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Prices from './Prices'

function controllable() {
  const queue = []
  const load = vi.fn(() => new Promise((resolve) => queue.push(resolve)))
  return { load, resolve: (v) => act(async () => queue.shift()(v)) }
}

const refresh = () => userEvent.click(screen.getByRole('button', { name: /refresh/i }))

test('loads once on mount', async () => {
  const api = controllable()
  render(<Prices load={api.load} />)

  await api.resolve(100)
  expect(screen.getByTestId('price')).toHaveTextContent('100')
  expect(api.load).toHaveBeenCalledTimes(1)
})

test('refresh asks again and shows the new value', async () => {
  const api = controllable()
  render(<Prices load={api.load} />)
  await api.resolve(100)

  await refresh()
  await api.resolve(250)
  expect(screen.getByTestId('price')).toHaveTextContent('250')
})

test('the spinner comes back while refreshing', async () => {
  const api = controllable()
  render(<Prices load={api.load} />)
  await api.resolve(100)

  await refresh()
  expect(screen.getByTestId('spinner')).toBeInTheDocument()

  await api.resolve(250)
  expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
})

test('two refreshes is three calls, not more', async () => {
  const api = controllable()
  render(<Prices load={api.load} />)
  await api.resolve(100)

  await refresh()
  await api.resolve(200)
  await refresh()
  await api.resolve(300)

  expect(api.load).toHaveBeenCalledTimes(3)
})
