import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import EmailField from './EmailField'

const field = () => screen.getByLabelText('Email')
const error = () => screen.queryByText('Enter a valid email')

test('says nothing before anything has happened', () => {
  render(<EmailField />)
  expect(error()).not.toBeInTheDocument()
})

test('says nothing while a bad value is being typed', async () => {
  render(<EmailField />)
  await userEvent.type(field(), 'nope')
  expect(error()).not.toBeInTheDocument()
})

test('complains once the box has been left', async () => {
  render(<EmailField />)
  await userEvent.type(field(), 'nope')
  await userEvent.tab()
  expect(error()).toBeInTheDocument()
})

test('a good value never complains', async () => {
  render(<EmailField />)
  await userEvent.type(field(), 'me@example.com')
  await userEvent.tab()
  expect(error()).not.toBeInTheDocument()
})

test('fixing it afterwards clears the message without leaving again', async () => {
  render(<EmailField />)
  await userEvent.type(field(), 'nope')
  await userEvent.tab()
  await userEvent.type(field(), '@example.com')
  expect(error()).not.toBeInTheDocument()
})

test('leaving an empty box complains too', async () => {
  render(<EmailField />)
  await userEvent.click(field())
  await userEvent.tab()
  expect(error()).toBeInTheDocument()
})
