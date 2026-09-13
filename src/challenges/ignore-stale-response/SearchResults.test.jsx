import { act, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import SearchResults from './SearchResults'

function controllable() {
  const pending = new Map()
  const search = (q) =>
    new Promise((resolve, reject) => pending.set(q, { resolve, reject }))
  return {
    search,
    resolve: (q, v) => act(async () => pending.get(q).resolve(v)),
    reject: (q, e) => act(async () => pending.get(q).reject(e)),
  }
}

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('shows the results for the query', async () => {
  const api = controllable()
  render(<SearchResults query="a" search={api.search} />)

  await api.resolve('a', ['apple'])
  expect(rows()).toEqual(['apple'])
})

test('a slow earlier response does not overwrite the latest', async () => {
  const api = controllable()
  const { rerender } = render(<SearchResults query="a" search={api.search} />)
  rerender(<SearchResults query="ab" search={api.search} />)

  await api.resolve('ab', ['able'])
  await api.resolve('a', ['apple'])

  expect(rows()).toEqual(['able'])
})

test('a late failure for an abandoned query changes nothing', async () => {
  const api = controllable()
  const { rerender } = render(<SearchResults query="a" search={api.search} />)
  rerender(<SearchResults query="ab" search={api.search} />)

  await api.resolve('ab', ['able'])
  await api.reject('a', new Error('too late'))

  expect(rows()).toEqual(['able'])
})

test('each new query is actually searched', async () => {
  const api = controllable()
  const { rerender } = render(<SearchResults query="a" search={api.search} />)
  await api.resolve('a', ['apple'])

  rerender(<SearchResults query="b" search={api.search} />)
  await api.resolve('b', ['banana'])
  expect(rows()).toEqual(['banana'])
})
