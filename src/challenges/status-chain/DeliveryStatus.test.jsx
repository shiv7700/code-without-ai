import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import DeliveryStatus from './DeliveryStatus'

const status = () => screen.getByTestId('status').textContent

test('nothing set yet', () => {
  render(<DeliveryStatus />)
  expect(status()).toBe('Not shipped yet')
})

test('shipped and not yet arrived', () => {
  render(<DeliveryStatus shippedAt="3 Feb" />)
  expect(status()).toBe('Shipped on 3 Feb')
})

test('delivered beats shipped', () => {
  render(<DeliveryStatus shippedAt="3 Feb" deliveredAt="5 Feb" />)
  expect(status()).toBe('Delivered on 5 Feb')
})

test('cancelled beats everything', () => {
  render(<DeliveryStatus shippedAt="3 Feb" deliveredAt="5 Feb" cancelled />)
  expect(status()).toBe('Cancelled')
})

test('only ever one line', () => {
  render(<DeliveryStatus shippedAt="3 Feb" deliveredAt="5 Feb" cancelled />)
  expect(screen.getAllByTestId('status')).toHaveLength(1)
})
