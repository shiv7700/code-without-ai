import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ServerTable from './ServerTable'

const ALL = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'alice', age: 45 },
  { id: 3, name: 'Bob', age: 25 },
  { id: 4, name: 'Dave', age: 35 },
  { id: 5, name: 'Eve', age: 28 },
]

// Stands in for the API: sorts and slices server-side, one page at a time.
const server = (delayFor = () => 1) =>
  vi.fn(({ page, sort, dir }) => {
    let rows = [...ALL]
    if (sort) {
      rows.sort((a, b) =>
        typeof a[sort] === 'number'
          ? a[sort] - b[sort]
          : String(a[sort]).localeCompare(String(b[sort])),
      )
      if (dir === 'desc') rows.reverse()
    }
    const slice = { rows: rows.slice((page - 1) * 2, page * 2), total: ALL.length }
    return new Promise((r) => setTimeout(() => r(slice), delayFor(page)))
  })

const setup = (fetchRows = server()) => {
  const user = userEvent.setup()
  render(<ServerTable fetchRows={fetchRows} pageSize={2} />)
  return { user, fetchRows }
}

const names = () =>
  screen.queryAllByTestId('row').map((row) => row.querySelectorAll('td')[1].textContent)
const click = (user, name) => user.click(screen.getByRole('button', { name }))

test('asks for the first page on mount', async () => {
  const { fetchRows } = setup()
  expect(fetchRows).toHaveBeenCalledWith({ page: 1, sort: null, dir: null })
  await screen.findByText('Charlie')
})

test('says it is loading while it waits', async () => {
  setup()
  expect(screen.getByText('Loading…')).toBeInTheDocument()

  await screen.findByText('Charlie')
  expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
})

test('shows one page of rows', async () => {
  setup()
  await screen.findByText('Charlie')
  expect(names()).toEqual(['Charlie', 'alice'])
})

test('next asks the server for the next page', async () => {
  const { user, fetchRows } = setup()
  await screen.findByText('Charlie')
  await click(user, 'Next')

  expect(fetchRows).toHaveBeenLastCalledWith({ page: 2, sort: null, dir: null })
  expect(await screen.findByText('Bob')).toBeInTheDocument()
})

test('previous is disabled on the first page, next on the last', async () => {
  const { user } = setup()
  await screen.findByText('Charlie')
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

  await click(user, 'Next')
  await click(user, 'Next')
  expect(screen.getByTestId('page')).toHaveTextContent('3 of 3')
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
})

test('a header sorts ascending, server-side', async () => {
  const { user, fetchRows } = setup()
  await screen.findByText('Charlie')
  await click(user, 'Name')

  expect(fetchRows).toHaveBeenLastCalledWith({ page: 1, sort: 'name', dir: 'asc' })
  expect(await screen.findByText('alice')).toBeInTheDocument()
})

test('clicking the same header again flips the direction', async () => {
  const { user, fetchRows } = setup()
  await screen.findByText('Charlie')
  await click(user, 'Name')
  await click(user, 'Name')

  expect(fetchRows).toHaveBeenLastCalledWith({ page: 1, sort: 'name', dir: 'desc' })
})

test('a different header starts at ascending again', async () => {
  const { user, fetchRows } = setup()
  await screen.findByText('Charlie')
  await click(user, 'Name')
  await click(user, 'Name')
  await click(user, 'Age')

  expect(fetchRows).toHaveBeenLastCalledWith({ page: 1, sort: 'age', dir: 'asc' })
})

test('the sorted column says so', async () => {
  const { user } = setup()
  await screen.findByText('Charlie')
  await click(user, 'Name')

  expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
    'aria-sort',
    'ascending',
  )
  expect(screen.getByRole('columnheader', { name: 'Age' })).toHaveAttribute('aria-sort', 'none')
})

test('sorting takes you back to page one', async () => {
  const { user, fetchRows } = setup()
  await screen.findByText('Charlie')
  await click(user, 'Next')
  await screen.findByText('Bob')
  await click(user, 'Name')

  expect(fetchRows).toHaveBeenLastCalledWith({ page: 1, sort: 'name', dir: 'asc' })
})

test('a selection survives a trip to another page and back', async () => {
  const { user } = setup()
  await screen.findByText('Charlie')
  await user.click(screen.getByLabelText('Charlie'))
  expect(screen.getByTestId('selected')).toHaveTextContent('1 selected')

  await click(user, 'Next')
  await screen.findByText('Bob')
  expect(screen.getByTestId('selected')).toHaveTextContent('1 selected')

  await click(user, 'Previous')
  await screen.findByText('Charlie')
  expect(screen.getByLabelText('Charlie')).toBeChecked()
})

test('a slow response for an abandoned page is thrown away', async () => {
  const { user } = setup(server((page) => (page === 2 ? 60 : 1)))
  await screen.findByText('Charlie')

  await click(user, 'Next')
  await click(user, 'Previous')
  await screen.findByText('Charlie')

  await new Promise((r) => setTimeout(r, 120))
  expect(names()).toEqual(['Charlie', 'alice'])
})
