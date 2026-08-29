import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import FilterList from './FilterList'

const ITEMS = ['Apple', 'Banana', 'Grape', 'Pineapple', 'Mango']

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)
const search = () => screen.getByLabelText(/search/i)

test('renders every item before any typing', () => {
  render(<FilterList items={ITEMS} />)
  expect(rows()).toEqual(ITEMS)
  expect(screen.getByTestId('count')).toHaveTextContent('5 of 5')
})

test('filters as you type, case-insensitively', async () => {
  render(<FilterList items={ITEMS} />)

  await userEvent.type(search(), 'ap')
  expect(rows()).toEqual(['Apple', 'Grape', 'Pineapple'])
  expect(screen.getByTestId('count')).toHaveTextContent('3 of 5')
})

test('uppercase query still matches', async () => {
  render(<FilterList items={ITEMS} />)

  await userEvent.type(search(), 'MANGO')
  expect(rows()).toEqual(['Mango'])
})

test('shows "No results" and no rows when nothing matches', async () => {
  render(<FilterList items={ITEMS} />)

  await userEvent.type(search(), 'zzz')
  expect(rows()).toEqual([])
  expect(screen.getByText(/no results/i)).toBeInTheDocument()
})

test('clearing the query brings everything back', async () => {
  render(<FilterList items={ITEMS} />)

  await userEvent.type(search(), 'zzz')
  await userEvent.clear(search())
  expect(rows()).toEqual(ITEMS)
})
