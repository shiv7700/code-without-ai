import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import InfiniteScroll from './InfiniteScroll'

let observers = []

class FakeObserver {
  constructor(callback) {
    this.callback = callback
    this.targets = new Set()
    observers.push(this)
  }
  observe(target) {
    this.targets.add(target)
  }
  unobserve(target) {
    this.targets.delete(target)
  }
  disconnect() {
    this.targets.clear()
    this.disconnected = true
  }
  scrollIntoView() {
    if (this.disconnected || this.targets.size === 0) return
    act(() => {
      this.callback([...this.targets].map((target) => ({ target, isIntersecting: true })), this)
    })
  }
}

const latest = () => observers[observers.length - 1]

beforeEach(() => {
  observers = []
  vi.stubGlobal('IntersectionObserver', FakeObserver)
})
afterEach(() => vi.unstubAllGlobals())

// Page 1 is ['item 1', 'item 2'], page 2 is ['item 3', 'item 4'], page 4 is empty.
const pager = (lastPage = 3) =>
  vi.fn((page) =>
    Promise.resolve(
      page > lastPage ? [] : [`item ${page * 2 - 1}`, `item ${page * 2}`],
    ),
  )

test('loads the first page on mount', async () => {
  const loadPage = pager()
  render(<InfiniteScroll loadPage={loadPage} />)

  expect(loadPage).toHaveBeenCalledWith(1)
  expect(await screen.findByText('item 1')).toBeInTheDocument()
})

test('says it is loading while it waits', async () => {
  render(<InfiniteScroll loadPage={pager()} />)

  expect(screen.getByText('Loading…')).toBeInTheDocument()
  await screen.findByText('item 1')
  expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
})

test('watches the sentinel once the first page has landed', async () => {
  render(<InfiniteScroll loadPage={pager()} />)
  await screen.findByText('item 1')

  expect(latest().targets.has(screen.getByTestId('sentinel'))).toBe(true)
})

test('scrolling the sentinel into view loads the next page', async () => {
  const loadPage = pager()
  render(<InfiniteScroll loadPage={loadPage} />)
  await screen.findByText('item 1')

  latest().scrollIntoView()

  expect(await screen.findByText('item 3')).toBeInTheDocument()
  expect(loadPage).toHaveBeenCalledWith(2)
})

test('new items are appended, not swapped in', async () => {
  render(<InfiniteScroll loadPage={pager()} />)
  await screen.findByText('item 1')

  latest().scrollIntoView()
  await screen.findByText('item 3')

  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
    'item 1',
    'item 2',
    'item 3',
    'item 4',
  ])
})

test('a second trigger while a page is in flight does not double-load', async () => {
  const loadPage = pager()
  render(<InfiniteScroll loadPage={loadPage} />)
  await screen.findByText('item 1')

  latest().scrollIntoView()
  latest().scrollIntoView()
  await screen.findByText('item 3')

  expect(loadPage).toHaveBeenCalledTimes(2)
})

test('an empty page ends the list', async () => {
  render(<InfiniteScroll loadPage={pager(1)} />)
  await screen.findByText('item 1')

  latest().scrollIntoView()

  expect(await screen.findByText('No more')).toBeInTheDocument()
  expect(screen.queryByTestId('sentinel')).not.toBeInTheDocument()
})

test('nothing loads after the end', async () => {
  const loadPage = pager(1)
  render(<InfiniteScroll loadPage={loadPage} />)
  await screen.findByText('item 1')

  latest().scrollIntoView()
  await screen.findByText('No more')
  latest().scrollIntoView()

  expect(loadPage).toHaveBeenCalledTimes(2)
})

test('unmounting stops the observer', async () => {
  const view = render(<InfiniteScroll loadPage={pager()} />)
  await screen.findByText('item 1')

  view.unmount()
  expect(latest().disconnected).toBe(true)
})
