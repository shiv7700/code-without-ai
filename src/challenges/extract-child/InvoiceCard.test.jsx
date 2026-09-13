import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import InvoiceCard, { LineItem } from './InvoiceCard'

const ITEMS = [
  { id: 'a', description: 'Keyboard', qty: 2, unitPrice: 45.5 },
  { id: 'b', description: 'Cable', qty: 3, unitPrice: 5 },
]

const rows = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('one row per item, in order', () => {
  render(<InvoiceCard items={ITEMS} />)
  expect(rows()).toEqual([
    'Keyboard — 2 x $45.50 = $91.00',
    'Cable — 3 x $5.00 = $15.00',
  ])
})

test('the card adds the lines up', () => {
  render(<InvoiceCard items={ITEMS} />)
  expect(screen.getByTestId('total')).toHaveTextContent('$106.00')
})

test('the currency reaches the rows', () => {
  render(<InvoiceCard items={ITEMS} currency="£" />)
  expect(rows()[1]).toBe('Cable — 3 x £5.00 = £15.00')
  expect(screen.getByTestId('total')).toHaveTextContent('£106.00')
})

test('an empty invoice is an empty list and a zero total', () => {
  render(<InvoiceCard items={[]} />)
  expect(rows()).toEqual([])
  expect(screen.getByTestId('total')).toHaveTextContent('$0.00')
})

test('the row renders on its own, given only its own props', () => {
  render(
    <ul>
      <LineItem item={ITEMS[0]} currency="₹" />
    </ul>,
  )
  expect(rows()).toEqual(['Keyboard — 2 x ₹45.50 = ₹91.00'])
})

test('the row falls back to the same default currency', () => {
  render(
    <ul>
      <LineItem item={ITEMS[1]} />
    </ul>,
  )
  expect(rows()).toEqual(['Cable — 3 x $5.00 = $15.00'])
})
