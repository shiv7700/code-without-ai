import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import UserEditor from './UserEditor'

const ADA = { id: 'a', name: 'Ada', email: 'ada@example.com' }
const GRACE = { id: 'g', name: 'Grace', email: 'grace@example.com' }

const name = () => screen.getByLabelText('Name')
const email = () => screen.getByLabelText('Email')

test('the fields start from the user', () => {
  render(<UserEditor user={ADA} />)

  expect(name()).toHaveValue('Ada')
  expect(email()).toHaveValue('ada@example.com')
})

test('the fields can be typed into', async () => {
  render(<UserEditor user={ADA} />)

  await userEvent.type(name(), '!')
  expect(name()).toHaveValue('Ada!')
})

test('switching user throws the typing away', async () => {
  const { rerender } = render(<UserEditor user={ADA} />)

  await userEvent.type(name(), ' Lovelace')
  rerender(<UserEditor user={GRACE} />)

  expect(name()).toHaveValue('Grace')
  expect(email()).toHaveValue('grace@example.com')
})

test('the same user again keeps the typing', async () => {
  const { rerender } = render(<UserEditor user={ADA} />)

  await userEvent.type(name(), ' Lovelace')
  rerender(<UserEditor user={{ ...ADA }} />)

  expect(name()).toHaveValue('Ada Lovelace')
})

test('a switch rebuilds the form rather than patching it', async () => {
  const { rerender } = render(<UserEditor user={ADA} />)
  const before = name()

  rerender(<UserEditor user={{ ...ADA }} />)
  expect(name()).toBe(before)

  rerender(<UserEditor user={GRACE} />)
  expect(name()).not.toBe(before)
})
