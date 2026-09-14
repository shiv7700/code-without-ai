import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Calculator from './Calculator'

const setup = () => {
  const user = userEvent.setup()
  render(<Calculator />)
  return {
    user,
    press: async (keys) => {
      for (const key of keys)
        await user.click(screen.getByRole('button', { name: key }))
    },
  }
}

const display = () => screen.getByTestId('display').textContent.trim()

test('starts at nothing and the digits build a number', async () => {
  const { press } = setup()
  expect(display()).toBe('0')

  await press('407')
  expect(display()).toBe('407')
})

test('adds two numbers', async () => {
  const { press } = setup()
  await press('2+3=')

  expect(display()).toBe('5')
})

test('minus is worked out left to right', async () => {
  const { press } = setup()
  await press('9-2-3=')

  expect(display()).toBe('4')
})

test('multiplication is done before addition', async () => {
  const { press } = setup()
  await press('2+3*4=')

  expect(display()).toBe('14')
})

test('two products either side of a plus', async () => {
  const { press } = setup()
  await press('2*3+4*5=')

  expect(display()).toBe('26')
})

test('division comes first as well', async () => {
  const { press } = setup()
  await press('10/4+1=')

  expect(display()).toBe('3.5')
})

test('clear puts it all back', async () => {
  const { press } = setup()
  await press('2+3*4=')
  await press('C')
  expect(display()).toBe('0')

  await press('7+1=')
  expect(display()).toBe('8')
})

test('equals again does the same thing again', async () => {
  const { press } = setup()
  await press('2+3=')
  expect(display()).toBe('5')

  await press('=')
  expect(display()).toBe('8')
  await press('=')
  expect(display()).toBe('11')
})
