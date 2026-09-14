import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import SortableTable from './SortableTable'

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'team', label: 'Team' },
]

const ROWS = [
  { id: 1, name: 'Ada', team: 'Blue' },
  { id: 2, name: 'Grace', team: 'Red' },
  { id: 3, name: 'Alan', team: 'Blue' },
  { id: 4, name: 'Edsger', team: 'Red' },
]

const names = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.children[0].textContent)

const header = (name) =>
  screen.getByRole('button', { name }).closest('th')

const press = (name) => userEvent.click(screen.getByRole('button', { name }))

test('renders the rows in the order they arrived, unsorted', () => {
  render(<SortableTable columns={COLUMNS} rows={ROWS} />)

  expect(names()).toEqual(['Ada', 'Grace', 'Alan', 'Edsger'])
  expect(header('Name')).not.toHaveAttribute('aria-sort')
})

test('a column sorts ascending, and says so', async () => {
  render(<SortableTable columns={COLUMNS} rows={ROWS} />)

  await press('Name')
  expect(names()).toEqual(['Ada', 'Alan', 'Edsger', 'Grace'])
  expect(header('Name')).toHaveAttribute('aria-sort', 'ascending')
  expect(header('Team')).not.toHaveAttribute('aria-sort')
})

test('a second press turns it round', async () => {
  render(<SortableTable columns={COLUMNS} rows={ROWS} />)

  await press('Name')
  await press('Name')
  expect(names()).toEqual(['Grace', 'Edsger', 'Alan', 'Ada'])
  expect(header('Name')).toHaveAttribute('aria-sort', 'descending')
})

test('sorting another column moves the marker and starts again', async () => {
  render(<SortableTable columns={COLUMNS} rows={ROWS} />)

  await press('Name')
  await press('Team')

  expect(header('Name')).not.toHaveAttribute('aria-sort')
  expect(header('Team')).toHaveAttribute('aria-sort', 'ascending')
})

test('rows that compare equal keep the order they were in', async () => {
  render(<SortableTable columns={COLUMNS} rows={ROWS} />)

  await press('Team')
  expect(names()).toEqual(['Ada', 'Alan', 'Grace', 'Edsger'])
})

test('a third press gives the original order back, untouched', async () => {
  const rows = ROWS.map((row) => ({ ...row }))
  render(<SortableTable columns={COLUMNS} rows={rows} />)

  await press('Name')
  await press('Name')
  await press('Name')

  expect(names()).toEqual(['Ada', 'Grace', 'Alan', 'Edsger'])
  expect(header('Name')).not.toHaveAttribute('aria-sort')
  expect(rows.map((row) => row.name)).toEqual([
    'Ada',
    'Grace',
    'Alan',
    'Edsger',
  ])
})
