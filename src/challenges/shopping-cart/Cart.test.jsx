import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Cart from './Cart'

const ITEMS = [
  { id: 'mug', name: 'Mug', price: 8.5, qty: 2 },
  { id: 'tea', name: 'Tea', price: 3, qty: 1 },
]

const setup = (items = ITEMS) => ({
  user: userEvent.setup(),
  ...render(<Cart items={items} />),
})

const lines = () =>
  screen
    .queryAllByTestId('line')
    .map((li) => li.textContent.replace(/\s+/g, ' ').trim())
const money = (id) => screen.getByTestId(id).textContent.replace(/\s+/g, ' ').trim()

const apply = async (user, code) => {
  await user.type(screen.getByLabelText('Discount code'), code)
  await user.click(screen.getByRole('button', { name: 'Apply' }))
}

test('renders a line per item with its own total', () => {
  setup()
  expect(lines()).toEqual(['Mug ×2 £17.00', 'Tea ×1 £3.00'])
})

test('the subtotal adds the lines up', () => {
  setup()
  expect(money('subtotal')).toBe('£20.00')
  expect(money('total')).toBe('£20.00')
})

test('increasing the quantity moves the line total and the subtotal', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Increase Mug' }))

  expect(lines()[0]).toBe('Mug ×3 £25.50')
  expect(money('subtotal')).toBe('£28.50')
})

test('decreasing the last one removes the line', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Decrease Tea' }))

  expect(lines()).toEqual(['Mug ×2 £17.00'])
  expect(money('subtotal')).toBe('£17.00')
})

test('a bad code is refused and takes nothing off', async () => {
  const { user } = setup()
  await apply(user, 'FREESTUFF')

  expect(screen.getByRole('alert')).toHaveTextContent('Invalid code')
  expect(money('discount')).toBe('−£0.00')
  expect(money('total')).toBe('£20.00')
})

test('SAVE10 takes a tenth off', async () => {
  const { user } = setup()
  await apply(user, 'SAVE10')

  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(money('discount')).toBe('−£2.00')
  expect(money('total')).toBe('£18.00')
})

test('emptying the cart leaves nothing to pay for', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Remove Mug' }))
  await user.click(screen.getByRole('button', { name: 'Remove Tea' }))

  expect(lines()).toEqual([])
  expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  expect(money('total')).toBe('£0.00')
})

test('the discount follows the cart after the code was applied', async () => {
  const { user } = setup()
  await apply(user, 'SAVE10')
  await user.click(screen.getByRole('button', { name: 'Remove Tea' }))

  expect(money('subtotal')).toBe('£17.00')
  expect(money('discount')).toBe('−£1.70')
  expect(money('total')).toBe('£15.30')
})
