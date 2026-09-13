import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Ticker from './Ticker'

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

test('shows the value and reports it', async () => {
  const api = controllable()
  const onValue = vi.fn()
  render(<Ticker load={api.load} onValue={onValue} />)

  await api.resolve(42)
  expect(screen.getByText('42')).toBeInTheDocument()
  expect(onValue).toHaveBeenCalledWith(42)
})

test('a response after unmount is dropped', async () => {
  const api = controllable()
  const onValue = vi.fn()
  const { unmount } = render(<Ticker load={api.load} onValue={onValue} />)

  unmount()
  await api.resolve(42)

  expect(onValue).not.toHaveBeenCalled()
})

test('a rejection after unmount is swallowed', async () => {
  const api = controllable()
  const { unmount } = render(<Ticker load={api.load} onValue={() => {}} />)

  unmount()
  await api.reject(new Error('boom'))
})
