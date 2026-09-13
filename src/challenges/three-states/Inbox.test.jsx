import { act, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Inbox from './Inbox'

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

const SCREENS = ['loading', 'error', 'empty', 'list']
const showing = () => SCREENS.filter((id) => screen.queryByTestId(id))

test('starts on loading, and only loading', () => {
  const api = controllable()
  render(<Inbox load={api.load} />)
  expect(showing()).toEqual(['loading'])
})

test('data goes to the list, and only the list', async () => {
  const api = controllable()
  render(<Inbox load={api.load} />)

  await api.resolve(['one', 'two'])
  expect(showing()).toEqual(['list'])
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
})

test('an empty array is the empty screen, not an empty list', async () => {
  const api = controllable()
  render(<Inbox load={api.load} />)

  await api.resolve([])
  expect(showing()).toEqual(['empty'])
})

test('a failure is the error screen, and only that', async () => {
  const api = controllable()
  render(<Inbox load={api.load} />)

  await api.reject(new Error('boom'))
  expect(showing()).toEqual(['error'])
})
