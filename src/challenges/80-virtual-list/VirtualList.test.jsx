import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import VirtualList from './VirtualList'

const ITEMS = Array.from({ length: 1000 }, (_, i) => `Item ${i}`)

const setup = () => render(<VirtualList items={ITEMS} itemHeight={20} height={100} />)

const indices = () =>
  screen.getAllByTestId('item').map((el) => Number(el.dataset.index))
const scrollTo = (top) => {
  const viewport = screen.getByTestId('viewport')
  viewport.scrollTop = top
  fireEvent.scroll(viewport)
}

test('the viewport is the height it was given', () => {
  setup()
  expect(screen.getByTestId('viewport')).toHaveStyle({ height: '100px' })
})

test('the spacer is as tall as the whole list would be', () => {
  setup()
  expect(screen.getByTestId('spacer')).toHaveStyle({ height: '20000px' })
})

test('only a screenful is rendered, not a thousand rows', () => {
  setup()
  expect(screen.getAllByTestId('item').length).toBeLessThan(10)
})

test('it starts at the top of the list', () => {
  setup()
  expect(indices()[0]).toBe(0)
  expect(screen.getByText('Item 0')).toBeInTheDocument()
})

test('the rendered window covers the visible area', () => {
  setup()
  // 100px tall, 20px rows: rows 0–4 are on screen.
  expect(indices()).toEqual(expect.arrayContaining([0, 1, 2, 3, 4]))
})

test('each row is positioned by its index, not by its order in the DOM', () => {
  setup()
  const rows = screen.getAllByTestId('item')
  expect(rows[0]).toHaveStyle({ top: '0px' })
  expect(rows[1]).toHaveStyle({ top: '20px' })
})

test('scrolling swaps in the rows for that offset', () => {
  setup()
  scrollTo(400)

  expect(indices()).toEqual(expect.arrayContaining([20, 21, 22, 23, 24]))
  expect(screen.getByText('Item 20')).toBeInTheDocument()
})

test('rows scrolled past are removed from the DOM', () => {
  setup()
  scrollTo(400)

  expect(screen.queryByText('Item 0')).not.toBeInTheDocument()
})

test('a scrolled row keeps its absolute position', () => {
  setup()
  scrollTo(400)

  expect(screen.getByText('Item 20').closest('[data-testid="item"]')).toHaveStyle({
    top: '400px',
  })
})

test('the row count stays put however far you scroll', () => {
  setup()
  scrollTo(400)
  const before = screen.getAllByTestId('item').length

  scrollTo(9000)
  expect(screen.getAllByTestId('item').length).toBe(before)
})

test('it does not run off the end of the list', () => {
  setup()
  scrollTo(19900)

  expect(Math.max(...indices())).toBe(999)
})

test('a partly-scrolled row is still rendered', () => {
  setup()
  scrollTo(410)

  // Row 20 is half out of view at the top, but still visible.
  expect(indices()).toContain(20)
})
