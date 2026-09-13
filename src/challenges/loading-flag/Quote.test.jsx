import { act, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Quote from './Quote'

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

const spinner = () => screen.queryByTestId('spinner')

test('the spinner is up on the first render', () => {
  const api = controllable()
  render(<Quote load={api.load} />)
  expect(spinner()).toBeInTheDocument()
})

test('resolving takes the spinner down and shows the quote', async () => {
  const api = controllable()
  render(<Quote load={api.load} />)

  await api.resolve('Talk is cheap.')
  expect(spinner()).not.toBeInTheDocument()
  expect(screen.getByText('Talk is cheap.')).toBeInTheDocument()
})

test('rejecting takes the spinner down as well', async () => {
  const api = controllable()
  render(<Quote load={api.load} />)

  await api.reject(new Error('boom'))
  expect(spinner()).not.toBeInTheDocument()
})
