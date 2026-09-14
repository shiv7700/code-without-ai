import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SavedTasks from './SavedTasks'

function controllable() {
  const lists = []
  const adds = []
  const loadTasks = vi.fn(() => new Promise((resolve) => lists.push(resolve)))
  const addTask = vi.fn(
    () => new Promise((resolve, reject) => adds.push({ resolve, reject })),
  )
  return {
    loadTasks,
    addTask,
    list: (tasks) => act(async () => lists.shift()(tasks)),
    saved: () => act(async () => adds.shift().resolve()),
    failed: () => act(async () => adds.shift().reject(new Error('no'))),
  }
}

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const box = () => screen.getByLabelText('New task')
const add = () => screen.getByRole('button', { name: 'Add' })

const submit = async (text) => {
  await userEvent.type(box(), text)
  await userEvent.click(add())
}

test('the list is loaded on mount', async () => {
  const api = controllable()
  render(<SavedTasks loadTasks={api.loadTasks} addTask={api.addTask} />)

  await api.list(['milk'])
  expect(rows()).toEqual(['milk'])
})

test('submitting sends the text', async () => {
  const api = controllable()
  render(<SavedTasks loadTasks={api.loadTasks} addTask={api.addTask} />)
  await api.list(['milk'])

  await submit('eggs')
  expect(api.addTask).toHaveBeenCalledWith('eggs')
})

test('the old list stays up while the refetch is in flight', async () => {
  const api = controllable()
  render(<SavedTasks loadTasks={api.loadTasks} addTask={api.addTask} />)
  await api.list(['milk'])

  await submit('eggs')
  await api.saved()

  expect(rows()).toEqual(['milk'])
  await api.list(['milk', 'eggs'])
  expect(rows()).toEqual(['milk', 'eggs'])
})

test('a failed add shows an alert and keeps the text', async () => {
  const api = controllable()
  render(<SavedTasks loadTasks={api.loadTasks} addTask={api.addTask} />)
  await api.list(['milk'])

  await submit('eggs')
  await api.failed()

  expect(screen.getByRole('alert')).toHaveTextContent('Could not add')
  expect(box()).toHaveValue('eggs')
  expect(api.loadTasks).toHaveBeenCalledTimes(1)
})

test('a successful add empties the box', async () => {
  const api = controllable()
  render(<SavedTasks loadTasks={api.loadTasks} addTask={api.addTask} />)
  await api.list(['milk'])

  await submit('eggs')
  await api.saved()

  expect(box()).toHaveValue('')
})

test('one add refetches the list exactly once', async () => {
  const api = controllable()
  render(<SavedTasks loadTasks={api.loadTasks} addTask={api.addTask} />)
  await api.list(['milk'])

  await submit('eggs')
  await api.saved()
  await api.list(['milk', 'eggs'])

  expect(api.loadTasks).toHaveBeenCalledTimes(2)
})
