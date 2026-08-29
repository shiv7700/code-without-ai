import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import DataTable from './DataTable'

const ROWS = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'alice', age: 45 },
  { id: 3, name: 'Bob', age: 25 },
  { id: 4, name: 'Dave', age: 35 },
]

const names = () =>
  screen.queryAllByTestId('row').map((r) => within(r).getAllByRole('cell')[0].textContent)

const header = (name) => screen.getByRole('button', { name })
const sortState = (name) => header(name).closest('th').getAttribute('aria-sort')
const search = () => screen.getByLabelText(/search/i)

test('renders every row in the original order', () => {
  render(<DataTable rows={ROWS} />)
  expect(names()).toEqual(['Charlie', 'alice', 'Bob', 'Dave'])
  expect(screen.getByTestId('count')).toHaveTextContent('4 of 4')
})

test('search filters by name, case-insensitively', async () => {
  render(<DataTable rows={ROWS} />)

  await userEvent.type(search(), 'a')
  expect(names()).toEqual(['Charlie', 'alice', 'Dave'])
  expect(screen.getByTestId('count')).toHaveTextContent('3 of 4')
})

test('clicking Name sorts ascending, clicking again descending', async () => {
  render(<DataTable rows={ROWS} />)

  await userEvent.click(header('Name'))
  expect(names()).toEqual(['alice', 'Bob', 'Charlie', 'Dave'])

  await userEvent.click(header('Name'))
  expect(names()).toEqual(['Dave', 'Charlie', 'Bob', 'alice'])
})

test('sorting by Age works on numbers, not strings', async () => {
  render(<DataTable rows={ROWS} />)

  await userEvent.click(header('Age'))
  expect(names()).toEqual(['Bob', 'Charlie', 'Dave', 'alice'])
})

test('switching column starts at ascending again', async () => {
  render(<DataTable rows={ROWS} />)

  await userEvent.click(header('Name'))
  await userEvent.click(header('Name')) // Name is now descending
  await userEvent.click(header('Age'))

  expect(names()).toEqual(['Bob', 'Charlie', 'Dave', 'alice'])
  expect(sortState('Age')).toBe('ascending')
})

test('aria-sort tracks the active column', async () => {
  render(<DataTable rows={ROWS} />)
  expect(sortState('Name')).toBe('none')
  expect(sortState('Age')).toBe('none')

  await userEvent.click(header('Name'))
  expect(sortState('Name')).toBe('ascending')
  expect(sortState('Age')).toBe('none')

  await userEvent.click(header('Name'))
  expect(sortState('Name')).toBe('descending')
})

test('search and sort compose', async () => {
  render(<DataTable rows={ROWS} />)

  await userEvent.type(search(), 'a')
  await userEvent.click(header('Age'))

  expect(names()).toEqual(['Charlie', 'Dave', 'alice'])
})

test('never mutates the rows prop', async () => {
  const rows = ROWS.map((r) => ({ ...r }))
  const snapshot = rows.map((r) => r.name)

  render(<DataTable rows={rows} />)
  await userEvent.click(header('Name'))
  await userEvent.click(header('Age'))

  expect(rows.map((r) => r.name)).toEqual(snapshot)
})
