import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CursorList from './CursorList'

function controllable() {
  const queue = []
  const loadPage = vi.fn(() => new Promise((resolve) => queue.push(resolve)))
  return {
    loadPage,
    resolve: (page) => act(async () => queue.shift()(page)),
    cursors: () => loadPage.mock.calls.map(([c]) => c),
  }
}

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const more = () => screen.queryByRole('button', { name: 'Load more' })

test('the first page is asked for with no cursor', async () => {
  const api = controllable()
  render(<CursorList loadPage={api.loadPage} />)

  expect(api.cursors()).toEqual([null])
  await api.resolve({ items: ['a', 'b'], nextCursor: 'c2' })
  expect(rows()).toEqual(['a', 'b'])
})

test('load more sends the cursor the last page gave back', async () => {
  const api = controllable()
  render(<CursorList loadPage={api.loadPage} />)
  await api.resolve({ items: ['a'], nextCursor: 'c2' })

  await userEvent.click(more())
  expect(api.cursors()).toEqual([null, 'c2'])
})

test('pages are appended, not swapped in', async () => {
  const api = controllable()
  render(<CursorList loadPage={api.loadPage} />)
  await api.resolve({ items: ['a'], nextCursor: 'c2' })

  await userEvent.click(more())
  await api.resolve({ items: ['b'], nextCursor: 'c3' })

  await userEvent.click(more())
  await api.resolve({ items: ['c'], nextCursor: null })

  expect(rows()).toEqual(['a', 'b', 'c'])
})

test('a null cursor is the end', async () => {
  const api = controllable()
  render(<CursorList loadPage={api.loadPage} />)
  await api.resolve({ items: ['a'], nextCursor: null })

  expect(more()).not.toBeInTheDocument()
  expect(screen.getByText('No more')).toBeInTheDocument()
})

test('two clicks in a row load one page, not the same one twice', async () => {
  const api = controllable()
  render(<CursorList loadPage={api.loadPage} />)
  await api.resolve({ items: ['a'], nextCursor: 'c2' })

  await userEvent.click(more())
  await userEvent.click(more())

  expect(api.cursors()).toEqual([null, 'c2'])
})

test('an empty page with a cursor is not the end', async () => {
  const api = controllable()
  render(<CursorList loadPage={api.loadPage} />)
  await api.resolve({ items: ['a'], nextCursor: 'c2' })

  await userEvent.click(more())
  await api.resolve({ items: [], nextCursor: 'c3' })

  expect(more()).toBeInTheDocument()
  await userEvent.click(more())
  expect(api.cursors()).toEqual([null, 'c2', 'c3'])
})
