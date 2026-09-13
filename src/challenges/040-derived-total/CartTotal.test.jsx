import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import CartTotal from './CartTotal'

const LINES = [
  { name: 'Keyboard', price: 100, qty: 1 },
  { name: 'Cable', price: 50, qty: 2 },
]

const at = (id) => screen.getByTestId(id).textContent

test('adds up price times quantity', () => {
  render(<CartTotal lines={LINES} />)
  expect(at('subtotal')).toBe('200.00')
})

test('tax and total use the default rate', () => {
  render(<CartTotal lines={LINES} />)
  expect(at('tax')).toBe('36.00')
  expect(at('total')).toBe('236.00')
})

test('the rate can be overridden', () => {
  render(<CartTotal lines={LINES} rate={0.05} />)
  expect(at('tax')).toBe('10.00')
  expect(at('total')).toBe('210.00')
})

test('no lines is all zeroes', () => {
  render(<CartTotal lines={[]} />)
  expect(at('subtotal')).toBe('0.00')
  expect(at('total')).toBe('0.00')
})

test('new props recalculate — the numbers are not frozen at first render', () => {
  const { rerender } = render(<CartTotal lines={LINES} />)
  expect(at('subtotal')).toBe('200.00')

  rerender(<CartTotal lines={[{ name: 'Mouse', price: 30, qty: 3 }]} />)
  expect(at('subtotal')).toBe('90.00')
  expect(at('total')).toBe('106.20')
})
