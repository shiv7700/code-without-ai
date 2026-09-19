import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import BoundedCounter from './BoundedCounter'

const count = () => screen.getByTestId('count').textContent
const up = () => screen.getByRole('button', { name: '+' })
const down = () => screen.getByRole('button', { name: '−' })

test('starts at the lower bound', () => {
  render(<BoundedCounter />)
  expect(count()).toBe('0')
})

test('counts up one at a time', async () => {
  render(<BoundedCounter />)
  await userEvent.click(up())
  await userEvent.click(up())
  expect(count()).toBe('2')
})

test('counts back down', async () => {
  render(<BoundedCounter />)
  await userEvent.click(up())
  await userEvent.click(down())
  expect(count()).toBe('0')
})

test('stops at the top', async () => {
  render(<BoundedCounter max={2} />)
  await userEvent.click(up())
  await userEvent.click(up())
  await userEvent.click(up())
  expect(count()).toBe('2')
})

test('the button that would overshoot is disabled', async () => {
  render(<BoundedCounter max={1} />)
  expect(down()).toBeDisabled()
  await userEvent.click(up())
  expect(up()).toBeDisabled()
  expect(down()).toBeEnabled()
})

test('honours bounds it is given', async () => {
  render(<BoundedCounter min={10} max={12} />)
  expect(count()).toBe('10')
  await userEvent.click(up())
  expect(count()).toBe('11')
})
