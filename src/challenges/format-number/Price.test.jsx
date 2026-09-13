import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Price from './Price'

const shown = () => screen.getByTestId('amount').textContent

test('separators and two decimals at once', () => {
  render(<Price amount={1234.5} />)
  expect(shown()).toBe('$1,234.50')
})

test('a whole number keeps its decimals', () => {
  render(<Price amount={5} />)
  expect(shown()).toBe('$5.00')
})

test('a third decimal is rounded away', () => {
  render(<Price amount={1234567.891} />)
  expect(shown()).toBe('$1,234,567.89')
})

test('zero is an amount', () => {
  render(<Price amount={0} />)
  expect(shown()).toBe('$0.00')
})

test('the symbol can be changed', () => {
  render(<Price amount={99} currency="£" />)
  expect(shown()).toBe('£99.00')
})

test('no amount is a dash on its own', () => {
  render(<Price />)
  expect(shown()).toBe('—')
})

test('null is no amount either', () => {
  render(<Price amount={null} currency="£" />)
  expect(shown()).toBe('—')
})
