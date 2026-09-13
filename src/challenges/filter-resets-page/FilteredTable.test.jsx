import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import FilteredTable from './FilteredTable'

function controllable() {
  const queue = []
  const fetchPage = vi.fn(() => new Promise((resolve) => queue.push(resolve)))
  return {
    fetchPage,
    resolve: (rows, pages = 3, i = 0) =>
      act(async () => queue.splice(i, 1)[0]({ rows, pages })),
    asked: () => fetchPage.mock.calls.map(([args]) => args),
  }
}

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const filter = () => screen.getByLabelText('Filter')
const next = () => screen.getByRole('button', { name: 'Next' })
const page = () => screen.getByTestId('page').textContent

test('page one of no filter is asked for on mount', async () => {
  const api = controllable()
  render(<FilteredTable fetchPage={api.fetchPage} />)

  expect(api.asked()).toEqual([{ filter: '', page: 1 }])
  await api.resolve(['a'])
  expect(rows()).toEqual(['a'])
  expect(page()).toBe('1 of 3')
})

test('next asks for the next page', async () => {
  const api = controllable()
  render(<FilteredTable fetchPage={api.fetchPage} />)
  await api.resolve(['a'])

  await userEvent.click(next())
  await api.resolve(['b'])

  expect(rows()).toEqual(['b'])
  expect(page()).toBe('2 of 3')
})

test('typing a filter asks again', async () => {
  const api = controllable()
  render(<FilteredTable fetchPage={api.fetchPage} />)
  await api.resolve(['a'])

  await userEvent.type(filter(), 'x')
  await api.resolve(['ax'], 1)

  expect(api.asked()).toEqual([
    { filter: '', page: 1 },
    { filter: 'x', page: 1 },
  ])
  expect(rows()).toEqual(['ax'])
})

test('the page in flight when the filter changed never lands', async () => {
  const api = controllable()
  render(<FilteredTable fetchPage={api.fetchPage} />)
  await api.resolve(['a'])

  await userEvent.click(next())
  await userEvent.type(filter(), 'x')

  await api.resolve(['ax'], 1, 1)
  await api.resolve(['b'], 3, 0)

  expect(rows()).toEqual(['ax'])
  expect(page()).toBe('1 of 1')
})

test('changing the filter never asks for the page you were on', async () => {
  const api = controllable()
  render(<FilteredTable fetchPage={api.fetchPage} />)
  await api.resolve(['a'])

  await userEvent.click(next())
  await api.resolve(['b'])

  await userEvent.type(filter(), 'x')

  expect(api.asked()).toEqual([
    { filter: '', page: 1 },
    { filter: '', page: 2 },
    { filter: 'x', page: 1 },
  ])
})
