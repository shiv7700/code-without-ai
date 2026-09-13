import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import PasswordStrength from './PasswordStrength'

const field = () => screen.getByLabelText(/password/i)
const meter = () => screen.getByTestId('meter')
const missing = () => screen.queryAllByTestId('missing').length

const type = async (text) => {
  render(<PasswordStrength />)
  if (text) await userEvent.type(field(), text)
}

test('an empty field scores zero and reads Weak', async () => {
  await type('')
  expect(meter()).toHaveAttribute('data-score', '0')
  expect(meter()).toHaveTextContent(/weak/i)
})

test('an empty field is missing all four rules', async () => {
  await type('')
  expect(missing()).toBe(4)
})

test('lowercase alone scores one', async () => {
  await type('abc')
  expect(meter()).toHaveAttribute('data-score', '1')
  expect(meter()).toHaveTextContent(/weak/i)
})

test('length and lowercase score two, reading Medium', async () => {
  await type('abcdefgh')
  expect(meter()).toHaveAttribute('data-score', '2')
  expect(meter()).toHaveTextContent(/medium/i)
})

test('three rules still read Medium', async () => {
  await type('abcdefgH')
  expect(meter()).toHaveAttribute('data-score', '3')
  expect(meter()).toHaveTextContent(/medium/i)
})

test('all four rules read Strong with nothing missing', async () => {
  await type('abcdefG1')
  expect(meter()).toHaveAttribute('data-score', '4')
  expect(meter()).toHaveTextContent(/strong/i)
  expect(missing()).toBe(0)
})

test('a met rule leaves the missing list', async () => {
  await type('A1')
  expect(missing()).toBe(2)
})
