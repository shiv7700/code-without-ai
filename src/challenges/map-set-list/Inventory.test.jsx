import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Inventory from './Inventory'

const STOCK = new Map([
  ['Cherry', 2],
  ['Apple', 3],
  ['Banana', 0],
])

const rows = () =>
  screen.getAllByRole('listitem').map((li) => li.textContent.trim())

test('one row per entry, in the order the map holds them', () => {
  render(<Inventory stock={STOCK} />)
  expect(rows()).toEqual(['Cherry: 2', 'Apple: 3', 'Banana: 0'])
})

test('a count of zero is still a row', () => {
  render(<Inventory stock={new Map([['Banana', 0]])} />)
  expect(rows()).toEqual(['Banana: 0'])
})

test('rows named in the low stock set are marked', () => {
  render(<Inventory stock={STOCK} lowStock={new Set(['Banana', 'Cherry'])} />)

  const [cherry, apple, banana] = screen.getAllByRole('listitem')
  expect(cherry).toHaveClass('low')
  expect(banana).toHaveClass('low')
  expect(apple.className).toBe('')
})

test('no low stock set at all is fine', () => {
  render(<Inventory stock={STOCK} />)
  for (const li of screen.getAllByRole('listitem')) expect(li.className).toBe('')
})

test('an empty map shows the message and no list', () => {
  render(<Inventory stock={new Map()} lowStock={new Set()} />)

  expect(screen.getByTestId('empty')).toHaveTextContent('Nothing in stock')
  expect(screen.queryByRole('list')).not.toBeInTheDocument()
})
