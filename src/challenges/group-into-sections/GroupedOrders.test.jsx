import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import GroupedOrders from './GroupedOrders'

const ORDERS = [
  { id: '1', year: '2024', label: 'Desk' },
  { id: '2', year: '2019', label: 'Lamp' },
  { id: '3', year: '2024', label: 'Chair' },
  { id: '4', year: '2019', label: 'Rug' },
]

const headings = () =>
  screen.getAllByRole('heading').map((h) => h.textContent.trim())

test('one section per year', () => {
  render(<GroupedOrders orders={ORDERS} />)
  expect(headings()).toHaveLength(2)
})

test('sections follow the order the years first appear in', () => {
  render(<GroupedOrders orders={ORDERS} />)
  expect(headings()).toEqual(['2024', '2019'])
})

test('each section lists its own orders, in their original order', () => {
  render(<GroupedOrders orders={ORDERS} />)

  const [first, second] = screen.getAllByRole('list')
  expect([...first.children].map((li) => li.textContent.trim())).toEqual(['Desk', 'Chair'])
  expect([...second.children].map((li) => li.textContent.trim())).toEqual(['Lamp', 'Rug'])
})

test('every order is rendered once', () => {
  render(<GroupedOrders orders={ORDERS} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(4)
})

test('a single year is a single section', () => {
  render(<GroupedOrders orders={[ORDERS[0]]} />)

  expect(headings()).toEqual(['2024'])
  expect(screen.getAllByRole('listitem')).toHaveLength(1)
})

test('no orders, no sections', () => {
  render(<GroupedOrders orders={[]} />)

  expect(screen.queryAllByRole('heading')).toHaveLength(0)
  expect(screen.getByTestId('empty')).toBeInTheDocument()
})
