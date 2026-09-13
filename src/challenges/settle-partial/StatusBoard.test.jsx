import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import StatusBoard from './StatusBoard'

function board(names) {
  const pending = new Map()
  const services = names.map((name) => ({
    name,
    check: vi.fn(
      () =>
        new Promise((resolve, reject) =>
          pending.set(name, { resolve, reject }),
        ),
    ),
  }))
  return {
    services,
    resolve: (n, v) => act(async () => pending.get(n).resolve(v)),
    reject: (n) => act(async () => pending.get(n).reject(new Error('x'))),
  }
}

const rows = () =>
  screen.queryAllByRole('listitem').map((li) => li.textContent.trim())

test('starts every check together', () => {
  const b = board(['api', 'db'])
  render(<StatusBoard services={b.services} />)
  for (const s of b.services) expect(s.check).toHaveBeenCalledTimes(1)
})

test('shows nothing until all of them have settled', async () => {
  const b = board(['api', 'db'])
  render(<StatusBoard services={b.services} />)

  await b.resolve('api', 'ok')
  expect(rows()).toEqual([])
})

test('a failure does not take the rest down with it', async () => {
  const b = board(['api', 'db', 'cache'])
  render(<StatusBoard services={b.services} />)

  await b.resolve('api', 'ok')
  await b.reject('db')
  await b.resolve('cache', 'ok')

  expect(rows()).toEqual(['api: ok', 'db: down', 'cache: ok'])
})

test('order follows the services, not who answered first', async () => {
  const b = board(['api', 'db'])
  render(<StatusBoard services={b.services} />)

  await b.resolve('db', 'slow')
  await b.resolve('api', 'fast')

  expect(rows()).toEqual(['api: fast', 'db: slow'])
})
