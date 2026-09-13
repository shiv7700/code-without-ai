import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Dashboard from './Dashboard'

function deferred() {
  let settle, fail
  const fn = vi.fn(
    () =>
      new Promise((resolve, reject) => {
        settle = resolve
        fail = reject
      }),
  )
  return {
    fn,
    resolve: (v) => act(async () => settle(v)),
    reject: (e) => act(async () => fail(e)),
  }
}

test('starts both requests before either answers', () => {
  const user = deferred()
  const count = deferred()
  render(<Dashboard loadUser={user.fn} loadCount={count.fn} />)

  expect(user.fn).toHaveBeenCalledTimes(1)
  expect(count.fn).toHaveBeenCalledTimes(1)
})

test('waits for both before showing anything', async () => {
  const user = deferred()
  const count = deferred()
  render(<Dashboard loadUser={user.fn} loadCount={count.fn} />)

  await user.resolve('Ada')
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  await count.resolve(7)
  expect(screen.getByTestId('name')).toHaveTextContent('Ada')
  expect(screen.getByTestId('count')).toHaveTextContent('7')
})

test('either one failing is an error', async () => {
  const user = deferred()
  const count = deferred()
  render(<Dashboard loadUser={user.fn} loadCount={count.fn} />)

  await user.resolve('Ada')
  await count.reject(new Error('boom'))
  expect(screen.getByRole('alert')).toBeInTheDocument()
})
