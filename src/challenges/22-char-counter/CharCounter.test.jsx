import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import CharCounter from './CharCounter'

const box = () => screen.getByLabelText(/message/i)
const count = () => screen.getByTestId('count')

test('starts empty, showing zero of max', () => {
  render(<CharCounter max={20} />)
  expect(count()).toHaveTextContent('0 / 20')
})

test('the count follows what you type', async () => {
  render(<CharCounter max={20} />)

  await userEvent.type(box(), 'hello')
  expect(count()).toHaveTextContent('5 / 20')
})

test('typing stops at max', async () => {
  render(<CharCounter max={5} />)

  await userEvent.type(box(), 'abcdefghij')
  expect(box()).toHaveValue('abcde')
  expect(count()).toHaveTextContent('5 / 5')
})

test('no warning while there is plenty of room', async () => {
  render(<CharCounter max={30} />)

  await userEvent.type(box(), 'abc')
  expect(count()).not.toHaveAttribute('data-warn')
})

test('warns once 10 or fewer characters remain', async () => {
  render(<CharCounter max={12} />)

  await userEvent.type(box(), 'ab')
  expect(count()).toHaveAttribute('data-warn', 'true')
})

test('deleting back down clears the warning', async () => {
  render(<CharCounter max={12} />)

  await userEvent.type(box(), 'abc')
  await userEvent.clear(box())
  expect(count()).not.toHaveAttribute('data-warn')
})
