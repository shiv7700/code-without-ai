import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Doc from './Doc'

function controllable() {
  let settle, fail
  const request = () =>
    new Promise((resolve, reject) => {
      settle = resolve
      fail = reject
    })
  return {
    request,
    respond: (res) => act(async () => settle(res)),
    reject: (e) => act(async () => fail(e)),
  }
}

test('renders the title when the response is ok', async () => {
  const api = controllable()
  render(<Doc request={api.request} />)

  await api.respond({
    ok: true,
    status: 200,
    json: async () => ({ title: 'Hello' }),
  })
  expect(screen.getByRole('heading')).toHaveTextContent('Hello')
})

test('a 404 is an error, even though the promise resolved', async () => {
  const api = controllable()
  render(<Doc request={api.request} />)

  await api.respond({ ok: false, status: 404, json: async () => ({}) })
  expect(screen.getByRole('alert')).toHaveTextContent('Request failed: 404')
})

test('json is not read when the response is not ok', async () => {
  const api = controllable()
  const json = vi.fn(async () => ({}))
  render(<Doc request={api.request} />)

  await api.respond({ ok: false, status: 500, json })
  expect(json).not.toHaveBeenCalled()
})

test('a rejected request shows its own message', async () => {
  const api = controllable()
  render(<Doc request={api.request} />)

  await api.reject(new Error('Network down'))
  expect(screen.getByRole('alert')).toHaveTextContent('Network down')
})
