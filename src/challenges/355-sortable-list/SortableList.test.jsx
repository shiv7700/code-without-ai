import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import SortableList from './SortableList'

const ROWS = [
  { name: 'Mango', score: 3 },
  { name: 'Apple', score: 9 },
  { name: 'Grape', score: 1 },
]

const names = () =>
  screen
    .getAllByTestId('row')
    .map((r) => within(r).getAllByRole('cell')[0].textContent)
const header = (name) => screen.getByRole('button', { name })
const click = (name) => userEvent.click(header(name))

test('starts in the order it was given', () => {
  render(<SortableList rows={ROWS} />)
  expect(names()).toEqual(['Mango', 'Apple', 'Grape'])
})

test('no header is marked as sorted at first', () => {
  render(<SortableList rows={ROWS} />)
  expect(header(/name/i)).not.toHaveAttribute('data-dir')
  expect(header(/score/i)).not.toHaveAttribute('data-dir')
})

test('clicking Name sorts ascending by name', async () => {
  render(<SortableList rows={ROWS} />)

  await click(/name/i)
  expect(names()).toEqual(['Apple', 'Grape', 'Mango'])
  expect(header(/name/i)).toHaveAttribute('data-dir', 'asc')
})

test('clicking Name again flips to descending', async () => {
  render(<SortableList rows={ROWS} />)

  await click(/name/i)
  await click(/name/i)
  expect(names()).toEqual(['Mango', 'Grape', 'Apple'])
  expect(header(/name/i)).toHaveAttribute('data-dir', 'desc')
})

test('sorting by score uses numbers, not text', async () => {
  render(<SortableList rows={[...ROWS, { name: 'Fig', score: 12 }]} />)

  await click(/score/i)
  expect(names()).toEqual(['Grape', 'Mango', 'Apple', 'Fig'])
})

test('switching columns starts that column ascending', async () => {
  render(<SortableList rows={ROWS} />)

  await click(/name/i)
  await click(/name/i)
  await click(/score/i)
  expect(names()).toEqual(['Grape', 'Mango', 'Apple'])
  expect(header(/score/i)).toHaveAttribute('data-dir', 'asc')
  expect(header(/name/i)).not.toHaveAttribute('data-dir')
})

test('the rows prop is left alone', async () => {
  const rows = [...ROWS]
  render(<SortableList rows={rows} />)

  await click(/name/i)
  expect(rows).toEqual(ROWS)
})
