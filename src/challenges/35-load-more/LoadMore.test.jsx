import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import LoadMore from './LoadMore'

const page = (n, hasMore = true) => ({
  items: [`item ${n}a`, `item ${n}b`],
  hasMore,
})

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const more = () => screen.queryByRole('button', { name: /load more/i })

test('loads the first page on mount', async () => {
  const fetchPage = vi.fn(async () => page(1))
  render(<LoadMore fetchPage={fetchPage} />)

  await waitFor(() => expect(rows()).toEqual(['item 1a', 'item 1b']))
  expect(fetchPage).toHaveBeenCalledWith(1)
})

test('shows a loading message while the first page is in flight', async () => {
  render(<LoadMore fetchPage={() => new Promise(() => {})} />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

test('Load more appends the next page', async () => {
  const fetchPage = vi.fn(async (n) => page(n))
  render(<LoadMore fetchPage={fetchPage} />)

  await waitFor(() => expect(rows()).toHaveLength(2))
  await userEvent.click(more())

  await waitFor(() => expect(rows()).toHaveLength(4))
  expect(rows()).toEqual(['item 1a', 'item 1b', 'item 2a', 'item 2b'])
  expect(fetchPage).toHaveBeenLastCalledWith(2)
})

test('the button is disabled while a page is in flight', async () => {
  let release
  const fetchPage = vi.fn((n) =>
    n === 1
      ? Promise.resolve(page(1))
      : new Promise((res) => {
          release = () => res(page(2))
        }),
  )
  render(<LoadMore fetchPage={fetchPage} />)

  await waitFor(() => expect(more()).toBeEnabled())
  await userEvent.click(more())

  expect(more()).toBeDisabled()
  release()
  await waitFor(() => expect(rows()).toHaveLength(4))
})

test('a double click cannot fetch the same page twice', async () => {
  const fetchPage = vi.fn(
    (n) =>
      new Promise((res) => setTimeout(() => res(page(n)), 0)),
  )
  render(<LoadMore fetchPage={fetchPage} />)

  await waitFor(() => expect(more()).toBeEnabled())
  await userEvent.dblClick(more())

  await waitFor(() => expect(rows()).toHaveLength(4))
  expect(fetchPage).toHaveBeenCalledTimes(2)
})

test('the button goes away when there is no more', async () => {
  render(<LoadMore fetchPage={async () => page(1, false)} />)

  await waitFor(() => expect(rows()).toHaveLength(2))
  expect(more()).toBeNull()
  expect(screen.getByText(/no more/i)).toBeInTheDocument()
})

test('a failure keeps what is already on screen', async () => {
  const fetchPage = vi.fn((n) =>
    n === 1 ? Promise.resolve(page(1)) : Promise.reject(new Error('nope')),
  )
  render(<LoadMore fetchPage={fetchPage} />)

  await waitFor(() => expect(rows()).toHaveLength(2))
  await userEvent.click(more())

  await screen.findByText(/something went wrong/i)
  expect(rows()).toEqual(['item 1a', 'item 1b'])
})
