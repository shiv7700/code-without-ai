import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Cart from './Cart'

const ITEMS = [
  { id: 'k', name: 'Keyboard', price: 100 },
  { id: 'm', name: 'Mouse', price: 25.5 },
]

const qty = (id) => screen.getByTestId(`qty-${id}`)
const total = () => screen.getByTestId('total')
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

test('every row starts at zero, and so does the total', () => {
  render(<Cart items={ITEMS} />)

  expect(qty('k')).toHaveTextContent('0')
  expect(qty('m')).toHaveTextContent('0')
  expect(total()).toHaveTextContent('0.00')
})

test('Add raises that row', async () => {
  render(<Cart items={ITEMS} />)

  await click('Add Keyboard')
  await click('Add Keyboard')

  expect(qty('k')).toHaveTextContent('2')
})

test('Remove lowers it, and stops at zero', async () => {
  render(<Cart items={ITEMS} />)

  await click('Add Mouse')
  await click('Remove Mouse')
  await click('Remove Mouse')

  expect(qty('m')).toHaveTextContent('0')
})

test('the total is price times quantity, added up', async () => {
  render(<Cart items={ITEMS} />)

  await click('Add Keyboard')
  await click('Add Mouse')
  await click('Add Mouse')

  expect(total()).toHaveTextContent('151.00')
})

test('adding to one row does not wipe the other', async () => {
  render(<Cart items={ITEMS} />)

  await click('Add Keyboard')
  await click('Add Mouse')

  expect(qty('k')).toHaveTextContent('1')
  expect(qty('m')).toHaveTextContent('1')
})
