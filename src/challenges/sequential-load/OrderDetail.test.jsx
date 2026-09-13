import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import OrderDetail from './OrderDetail'

function deferred() {
  let settle, fail
  const fn = vi.fn(
    () =>
      new Promise((resolve, reject) => {
        settle = resolve
        fail = reject
      }),
  )
  return {
    fn,
    resolve: (v) => act(async () => settle(v)),
    reject: (e) => act(async () => fail(e)),
  }
}

test('does not ask for the customer before the order is in', () => {
  const order = deferred()
  const customer = deferred()
  render(
    <OrderDetail orderId={9} loadOrder={order.fn} loadCustomer={customer.fn} />,
  )

  expect(order.fn).toHaveBeenCalledWith(9)
  expect(customer.fn).not.toHaveBeenCalled()
})

test('uses the id the order came back with', async () => {
  const order = deferred()
  const customer = deferred()
  render(
    <OrderDetail orderId={9} loadOrder={order.fn} loadCustomer={customer.fn} />,
  )

  await order.resolve({ customerId: 77 })
  expect(customer.fn).toHaveBeenCalledWith(77)
})

test('stays loading through both steps, then shows the name', async () => {
  const order = deferred()
  const customer = deferred()
  render(
    <OrderDetail orderId={9} loadOrder={order.fn} loadCustomer={customer.fn} />,
  )

  await order.resolve({ customerId: 77 })
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  await customer.resolve({ name: 'Ada' })
  expect(screen.getByText('Ada')).toBeInTheDocument()
})

test('a failure at the first step is an error', async () => {
  const order = deferred()
  const customer = deferred()
  render(
    <OrderDetail orderId={9} loadOrder={order.fn} loadCustomer={customer.fn} />,
  )

  await order.reject(new Error('boom'))
  expect(screen.getByRole('alert')).toBeInTheDocument()
  expect(customer.fn).not.toHaveBeenCalled()
})
