import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SignupForm from './SignupForm'

const setup = () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<SignupForm onSubmit={onSubmit} />)
  return { user, onSubmit }
}

const field = (label) => screen.getByLabelText(label)
const errors = () => screen.queryAllByRole('alert').map((a) => a.textContent)
const submit = (user) => user.click(screen.getByRole('button', { name: 'Sign up' }))

const fillValid = async (user) => {
  await user.type(field('Email'), 'ada@example.com')
  await user.type(field('Password'), 'longenough')
  await user.type(field('Confirm password'), 'longenough')
}

test('starts with no complaints', () => {
  setup()
  expect(errors()).toEqual([])
})

test('does not complain while you are still typing a field', async () => {
  const { user } = setup()
  await user.type(field('Email'), 'ada')

  expect(errors()).toEqual([])
})

test('complains once you leave an invalid field', async () => {
  const { user } = setup()
  await user.type(field('Email'), 'ada')
  await user.tab()

  expect(errors()).toEqual(['Enter a valid email'])
})

test('the complaint goes away when the value becomes valid', async () => {
  const { user } = setup()
  await user.type(field('Email'), 'ada')
  await user.tab()
  await user.type(field('Email'), '@example.com')

  expect(errors()).not.toContain('Enter a valid email')
})

test('a short password is rejected', async () => {
  const { user } = setup()
  await user.type(field('Password'), 'short')
  await user.tab()

  expect(errors()).toEqual(['Password must be at least 8 characters'])
})

test('the confirmation has to match', async () => {
  const { user } = setup()
  await user.type(field('Password'), 'longenough')
  await user.type(field('Confirm password'), 'longenoug')
  await user.tab()

  expect(errors()).toEqual(['Passwords do not match'])
})

test('submitting an empty form shows the errors without touching a field', async () => {
  const { user } = setup()
  await submit(user)

  expect(errors()).toEqual([
    'Enter a valid email',
    'Password must be at least 8 characters',
  ])
})

test('an invalid submit does not call onSubmit', async () => {
  const { user, onSubmit } = setup()
  await submit(user)

  expect(onSubmit).not.toHaveBeenCalled()
})

test('a valid form submits its values', async () => {
  const { user, onSubmit } = setup()
  await fillValid(user)
  await submit(user)

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'ada@example.com',
    password: 'longenough',
  })
})

test('a valid form submits with nothing to complain about', async () => {
  const { user } = setup()
  await fillValid(user)
  await submit(user)

  expect(errors()).toEqual([])
})
