import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import FocusInput from './FocusInput'

const input = () => screen.getByLabelText(/message/i)
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

test('renders an input tied to its label', () => {
  render(<FocusInput label="Message" />)
  expect(input()).toBeInTheDocument()
})

test('is not focused on mount without autoFocus', () => {
  render(<FocusInput label="Message" />)
  expect(input()).not.toHaveFocus()
})

test('autoFocus focuses the input on mount', () => {
  render(<FocusInput label="Message" autoFocus />)
  expect(input()).toHaveFocus()
})

test('the Focus button moves focus to the input', async () => {
  render(<FocusInput label="Message" />)

  await click(/focus/i)
  expect(input()).toHaveFocus()
})

test('typing updates the value', async () => {
  render(<FocusInput label="Message" />)

  await userEvent.type(input(), 'hello')
  expect(input()).toHaveValue('hello')
})

test('Clear empties the input and keeps it focused', async () => {
  render(<FocusInput label="Message" />)

  await userEvent.type(input(), 'hello')
  await click(/clear/i)
  expect(input()).toHaveValue('')
  expect(input()).toHaveFocus()
})
