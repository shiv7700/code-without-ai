import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SyncToggle from './SyncToggle'

function controllable() {
  const queue = []
  const save = vi.fn(
    () => new Promise((resolve, reject) => queue.push({ resolve, reject })),
  )
  return {
    save,
    resolve: (i = 0) => act(async () => queue.splice(i, 1)[0].resolve()),
    reject: (i = 0) => act(async () => queue.splice(i, 1)[0].reject(new Error('no'))),
    sent: () => save.mock.calls.map(([v]) => v),
  }
}

const toggle = () => screen.getByRole('button', { name: 'Notifications' })
const on = () => toggle().getAttribute('aria-pressed') === 'true'

test('clicking flips it before the save finishes', async () => {
  const api = controllable()
  render(<SyncToggle initial={false} save={api.save} />)

  await userEvent.click(toggle())

  expect(on()).toBe(true)
  expect(api.sent()).toEqual([true])
})

test('a save that works leaves it where it is', async () => {
  const api = controllable()
  render(<SyncToggle initial={false} save={api.save} />)

  await userEvent.click(toggle())
  await api.resolve()

  expect(on()).toBe(true)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('a save that fails puts it back, and says so', async () => {
  const api = controllable()
  render(<SyncToggle initial={false} save={api.save} />)

  await userEvent.click(toggle())
  await api.reject()

  expect(on()).toBe(false)
  expect(screen.getByRole('alert')).toHaveTextContent('Could not save')
})

test('a later success clears the alert', async () => {
  const api = controllable()
  render(<SyncToggle initial={false} save={api.save} />)

  await userEvent.click(toggle())
  await api.reject()

  await userEvent.click(toggle())
  await api.resolve()

  expect(on()).toBe(true)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('it stays clickable while a save is in flight', async () => {
  const api = controllable()
  render(<SyncToggle initial={false} save={api.save} />)

  await userEvent.click(toggle())
  await userEvent.click(toggle())

  expect(on()).toBe(false)
  expect(api.sent()).toEqual([true, false])
})

test('a failure that has already been overtaken changes nothing', async () => {
  const api = controllable()
  render(<SyncToggle initial={false} save={api.save} />)

  await userEvent.click(toggle())
  await userEvent.click(toggle())

  await api.reject(0)
  expect(on()).toBe(false)

  await api.resolve(0)
  expect(on()).toBe(false)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
