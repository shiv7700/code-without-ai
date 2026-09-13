import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Counter from './Counter'

const count = () => screen.getByTestId('count')
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

test('starts at 0 by default', () => {
  render(<Counter />)
  expect(count()).toHaveTextContent('0')
})

test('starts at the `start` prop', () => {
  render(<Counter start={5} />)
  expect(count()).toHaveTextContent('5')
})

test('+ increments, - decrements', async () => {
  render(<Counter start={3} />)

  await click('+')
  await click('+')
  expect(count()).toHaveTextContent('5')

  await click('-')
  expect(count()).toHaveTextContent('4')
})

test('never goes below 0', async () => {
  render(<Counter />)

  await click('-')
  await click('-')
  expect(count()).toHaveTextContent('0')
})

test('Reset goes back to `start`, not to 0', async () => {
  render(<Counter start={7} />)

  await click('+')
  await click('Reset')
  expect(count()).toHaveTextContent('7')
})
