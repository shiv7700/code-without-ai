import { act, render, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import SharedLoader, { resetSharedLoads } from './SharedLoader'

beforeEach(() => resetSharedLoads())

function controllable() {
  const pending = new Map()
  const load = vi.fn(
    (id) => new Promise((resolve, reject) => pending.set(id, { resolve, reject })),
  )
  return {
    load,
    resolve: (id, v) => act(async () => pending.get(id).resolve(v)),
    reject: (id, m) => act(async () => pending.get(id).reject(new Error(m))),
    ids: () => load.mock.calls.map(([id]) => id),
  }
}

const values = () => screen.queryAllByTestId('value').map((p) => p.textContent)

const Pair = ({ ids, load }) => (
  <div>
    {ids.map((id, i) => (
      <SharedLoader key={i} id={id} load={load} />
    ))}
  </div>
)

test('it shows what it loaded', async () => {
  const api = controllable()
  render(<SharedLoader id="a" load={api.load} />)

  await api.resolve('a', 'Ada')
  expect(values()).toEqual(['Ada'])
})

test('two instances mounting together make one request', async () => {
  const api = controllable()
  render(<Pair ids={['a', 'a']} load={api.load} />)

  expect(api.ids()).toEqual(['a'])
  await api.resolve('a', 'Ada')
  expect(values()).toEqual(['Ada', 'Ada'])
})

test('different ids are different requests', async () => {
  const api = controllable()
  render(<Pair ids={['a', 'b']} load={api.load} />)

  expect(api.ids()).toEqual(['a', 'b'])
  await api.resolve('a', 'Ada')
  await api.resolve('b', 'Bea')
  expect(values()).toEqual(['Ada', 'Bea'])
})

test('this is sharing, not caching — a later mount asks again', async () => {
  const api = controllable()
  const first = render(<SharedLoader id="a" load={api.load} />)
  await api.resolve('a', 'Ada')
  first.unmount()

  render(<SharedLoader id="a" load={api.load} />)
  expect(api.ids()).toEqual(['a', 'a'])
})

test('one instance unmounting does not rob the other', async () => {
  const api = controllable()
  const { rerender } = render(<Pair ids={['a', 'a']} load={api.load} />)

  rerender(<Pair ids={['a']} load={api.load} />)
  await api.resolve('a', 'Ada')

  expect(values()).toEqual(['Ada'])
  expect(api.ids()).toEqual(['a'])
})

test('a rejection reaches both, and is not remembered', async () => {
  const api = controllable()
  render(<Pair ids={['a', 'a']} load={api.load} />)

  await api.reject('a', 'offline')
  expect(screen.getAllByRole('alert')).toHaveLength(2)

  render(<SharedLoader id="a" load={api.load} />)
  expect(api.ids()).toEqual(['a', 'a'])
})
