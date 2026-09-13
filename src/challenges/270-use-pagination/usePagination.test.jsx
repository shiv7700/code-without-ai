import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { usePagination } from './usePagination'

const nums = (n) => Array.from({ length: n }, (_, i) => i + 1)

function probe(initialItems, config = {}) {
  const box = {}
  function Probe({ items }) {
    Object.assign(box, usePagination({ items, ...config }))
    return null
  }
  const view = render(<Probe items={initialItems} />)
  return { box, setItems: (items) => act(() => view.rerender(<Probe items={items} />)) }
}

test('slices the first page', () => {
  const { box } = probe(nums(25), { pageSize: 10 })

  expect(box.page).toBe(1)
  expect(box.pageItems).toEqual(nums(10))
  expect(box.totalPages).toBe(3)
})

test('next and prev walk the pages', () => {
  const { box } = probe(nums(25), { pageSize: 10 })

  act(() => box.next())
  expect(box.page).toBe(2)
  expect(box.pageItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])

  act(() => box.prev())
  expect(box.page).toBe(1)
})

test('the last page can be short', () => {
  const { box } = probe(nums(25), { pageSize: 10 })

  act(() => box.setPage(3))
  expect(box.pageItems).toEqual([21, 22, 23, 24, 25])
})

test('starts at initialPage', () => {
  const { box } = probe(nums(25), { pageSize: 10, initialPage: 2 })
  expect(box.page).toBe(2)
})

test('next stops at the last page, prev stops at the first', () => {
  const { box } = probe(nums(25), { pageSize: 10 })

  act(() => box.next())
  act(() => box.next())
  act(() => box.next())
  act(() => box.next())
  expect(box.page).toBe(3)

  act(() => box.prev())
  act(() => box.prev())
  act(() => box.prev())
  expect(box.page).toBe(1)
})

test('setPage clamps both ways', () => {
  const { box } = probe(nums(25), { pageSize: 10 })

  act(() => box.setPage(999))
  expect(box.page).toBe(3)

  act(() => box.setPage(-5))
  expect(box.page).toBe(1)
})

test('canPrev and canNext mark the edges', () => {
  const { box } = probe(nums(25), { pageSize: 10 })

  expect(box.canPrev).toBe(false)
  expect(box.canNext).toBe(true)

  act(() => box.setPage(3))
  expect(box.canPrev).toBe(true)
  expect(box.canNext).toBe(false)
})

test('an empty list is still page 1 of 1', () => {
  const { box } = probe([], { pageSize: 10 })

  expect(box.page).toBe(1)
  expect(box.totalPages).toBe(1)
  expect(box.pageItems).toEqual([])
  expect(box.canNext).toBe(false)
  expect(box.canPrev).toBe(false)
})

test('shrinking the list clamps the current page back into range', () => {
  const { box, setItems } = probe(nums(100), { pageSize: 10 })

  act(() => box.setPage(9))
  expect(box.page).toBe(9)

  setItems(nums(12)) // now only 2 pages exist

  expect(box.totalPages).toBe(2)
  expect(box.page).toBe(2)
  expect(box.pageItems).toEqual([11, 12])
})

test('shrinking to empty does not leave a broken page', () => {
  const { box, setItems } = probe(nums(100), { pageSize: 10 })

  act(() => box.setPage(7))
  setItems([])

  expect(box.page).toBe(1)
  expect(box.pageItems).toEqual([])
})

test('the returned functions keep stable identities', () => {
  const { box, setItems } = probe(nums(25), { pageSize: 10 })

  const { next, prev, setPage } = box
  setItems(nums(30))

  expect(box.next).toBe(next)
  expect(box.prev).toBe(prev)
  expect(box.setPage).toBe(setPage)
})
