import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SearchBox from './SearchBox'

function controllable() {
  const waits = []
  const searches = new Map()
  const wait = vi.fn((ms) => new Promise((resolve) => waits.push({ ms, resolve })))
  const search = vi.fn(
    (q) => new Promise((resolve, reject) => searches.set(q, { resolve, reject })),
  )
  return {
    wait,
    search,
    settled: () => act(async () => {}),
    elapse: (i = 0) => act(async () => waits[i].resolve()),
    resolve: (q, v) => act(async () => searches.get(q).resolve(v)),
    delays: () => wait.mock.calls.map(([ms]) => ms),
    queries: () => search.mock.calls.map(([q]) => q),
  }
}

const box = () => screen.getByLabelText('Search')
const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('typing waits before it searches', async () => {
  const api = controllable()
  render(<SearchBox search={api.search} wait={api.wait} delay={300} />)

  await userEvent.type(box(), 'a')
  expect(api.delays()).toEqual([300])
  expect(api.search).not.toHaveBeenCalled()

  await api.elapse()
  expect(api.queries()).toEqual(['a'])
})

test('the results land on screen', async () => {
  const api = controllable()
  render(<SearchBox search={api.search} wait={api.wait} />)

  await userEvent.type(box(), 'a')
  await api.elapse()
  await api.resolve('a', ['apple'])

  expect(rows()).toEqual(['apple'])
})

test('a wait that finishes for text already replaced searches nothing', async () => {
  const api = controllable()
  render(<SearchBox search={api.search} wait={api.wait} />)

  await userEvent.type(box(), 'ab')
  await api.elapse(0)
  await api.elapse(1)

  expect(api.queries()).toEqual(['ab'])
})

test('an empty box searches nothing and clears the results', async () => {
  const api = controllable()
  render(<SearchBox search={api.search} wait={api.wait} />)

  await userEvent.type(box(), 'a')
  await api.elapse()
  await api.resolve('a', ['apple'])

  await userEvent.clear(box())
  await api.settled()

  expect(rows()).toEqual([])
  expect(api.queries()).toEqual(['a'])
})

test('an old search answering last does not win', async () => {
  const api = controllable()
  render(<SearchBox search={api.search} wait={api.wait} />)

  await userEvent.type(box(), 'a')
  await api.elapse(0)

  await userEvent.type(box(), 'b')
  await api.elapse(1)

  await api.resolve('ab', ['able'])
  await api.resolve('a', ['apple'])

  expect(rows()).toEqual(['able'])
})
