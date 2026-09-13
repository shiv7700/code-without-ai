import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import EditableList from './EditableList'

const ITEMS = [
  { id: 1, name: 'one' },
  { id: 2, name: 'two' },
  { id: 3, name: 'three' },
]

function controllable() {
  const pending = new Map()
  const rename = vi.fn(
    (id) => new Promise((resolve, reject) => pending.set(id, { resolve, reject })),
  )
  return {
    rename,
    resolve: (id) => act(async () => pending.get(id).resolve()),
    reject: (id) => act(async () => pending.get(id).reject(new Error('no'))),
  }
}

const names = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const bump = (id) => userEvent.click(screen.getByRole('button', { name: `Rename ${id}` }))

test('an edit shows before it is saved', async () => {
  const api = controllable()
  render(<EditableList items={ITEMS} rename={api.rename} />)

  await bump(1)

  expect(names()).toEqual(['one!', 'two', 'three'])
  expect(api.rename).toHaveBeenCalledWith(1, 'one!')
})

test('a saved edit stays', async () => {
  const api = controllable()
  render(<EditableList items={ITEMS} rename={api.rename} />)

  await bump(2)
  await api.resolve(2)

  expect(names()).toEqual(['one', 'two!', 'three'])
})

test('a failed edit goes back, and says which one', async () => {
  const api = controllable()
  render(<EditableList items={ITEMS} rename={api.rename} />)

  await bump(2)
  await api.reject(2)

  expect(names()).toEqual(['one', 'two', 'three'])
  expect(screen.getByRole('alert')).toHaveTextContent('Could not rename two')
})

test('three edits can be in flight at once', async () => {
  const api = controllable()
  render(<EditableList items={ITEMS} rename={api.rename} />)

  await bump(1)
  await bump(2)
  await bump(3)

  expect(names()).toEqual(['one!', 'two!', 'three!'])
  expect(api.rename).toHaveBeenCalledTimes(3)
})

test('the one that fails is the only one that goes back', async () => {
  const api = controllable()
  render(<EditableList items={ITEMS} rename={api.rename} />)

  await bump(1)
  await bump(2)
  await bump(3)

  await api.resolve(1)
  await api.reject(2)
  await api.resolve(3)

  expect(names()).toEqual(['one!', 'two', 'three!'])
})
