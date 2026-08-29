import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SignupForm from './SignupForm'

const email = () => screen.getByLabelText(/email/i)
const password = () => screen.getByLabelText(/password/i)
const submit = () => screen.getByRole('button', { name: /sign up/i })

test('inputs are controlled — typing updates their value', async () => {
  render(<SignupForm onSubmit={() => {}} />)

  await userEvent.type(email(), 'a@b.com')
  expect(email()).toHaveValue('a@b.com')

  await userEvent.type(password(), 'hunter2!!')
  expect(password()).toHaveValue('hunter2!!')
})

test('submit is disabled until both fields are valid', async () => {
  render(<SignupForm onSubmit={() => {}} />)
  expect(submit()).toBeDisabled()

  await userEvent.type(email(), 'a@b.com')
  expect(submit()).toBeDisabled() // password still empty

  await userEvent.type(password(), 'short')
  expect(submit()).toBeDisabled() // under 8 chars

  await userEvent.type(password(), 'enough!')
  expect(submit()).toBeEnabled()
})

test('an email without @ keeps submit disabled', async () => {
  render(<SignupForm onSubmit={() => {}} />)

  await userEvent.type(email(), 'not-an-email')
  await userEvent.type(password(), 'longenough')
  expect(submit()).toBeDisabled()
})

test('submitting calls onSubmit once with the values', async () => {
  const onSubmit = vi.fn()
  render(<SignupForm onSubmit={onSubmit} />)

  await userEvent.type(email(), 'a@b.com')
  await userEvent.type(password(), 'longenough')
  await userEvent.click(submit())

  expect(onSubmit).toHaveBeenCalledTimes(1)
  expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'longenough' })
})
