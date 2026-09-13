import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Album from './Album'

function controllable() {
  const pending = new Map()
  const load = vi.fn(
    (id) => new Promise((resolve) => pending.set(id, resolve)),
  )
  return { load, resolve: (id, v) => act(async () => pending.get(id)(v)) }
}

const title = () => screen.getByRole('heading').textContent

test('loads with the id it was given', async () => {
  const api = controllable()
  render(<Album id={1} load={api.load} />)

  expect(api.load).toHaveBeenCalledWith(1)
  await api.resolve(1, { title: 'Kind of Blue' })
  expect(title()).toBe('Kind of Blue')
})

test('a new id loads again', async () => {
  const api = controllable()
  const { rerender } = render(<Album id={1} load={api.load} />)
  await api.resolve(1, { title: 'First' })

  rerender(<Album id={2} load={api.load} />)
  expect(api.load).toHaveBeenCalledWith(2)

  await api.resolve(2, { title: 'Second' })
  expect(title()).toBe('Second')
})

test('the same id does not load again', async () => {
  const api = controllable()
  const { rerender } = render(<Album id={1} load={api.load} />)
  await api.resolve(1, { title: 'First' })

  rerender(<Album id={1} load={api.load} />)
  rerender(<Album id={1} load={api.load} />)

  expect(api.load).toHaveBeenCalledTimes(1)
})
