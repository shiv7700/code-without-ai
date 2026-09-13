import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Tooltip from './Tooltip'

const trigger = () => screen.getByRole('button', { name: 'Save' })
const tip = () => screen.queryByRole('tooltip')

test('the tooltip stays out of the DOM until it is wanted', () => {
  render(<Tooltip text="Saves to your account">Save</Tooltip>)

  expect(trigger()).toBeInTheDocument()
  expect(tip()).toBeNull()
})

test('hovering reveals it', async () => {
  render(<Tooltip text="Saves to your account">Save</Tooltip>)

  await userEvent.hover(trigger())
  expect(tip()).toHaveTextContent('Saves to your account')
})

test('focusing reveals it too', async () => {
  render(<Tooltip text="Saves to your account">Save</Tooltip>)

  await userEvent.tab()
  expect(trigger()).toHaveFocus()
  expect(tip()).toHaveTextContent('Saves to your account')
})

test('the button is described by the tooltip while it is open', async () => {
  render(<Tooltip text="Saves to your account">Save</Tooltip>)

  await userEvent.hover(trigger())
  expect(trigger()).toHaveAccessibleDescription('Saves to your account')
})

test('leaving hides it again', async () => {
  render(<Tooltip text="Saves to your account">Save</Tooltip>)

  await userEvent.hover(trigger())
  await userEvent.unhover(trigger())
  expect(tip()).toBeNull()
  expect(trigger()).not.toHaveAttribute('aria-describedby')
})

test('Escape hides it while the button keeps focus', async () => {
  render(<Tooltip text="Saves to your account">Save</Tooltip>)

  await userEvent.tab()
  await userEvent.keyboard('{Escape}')
  expect(tip()).toBeNull()
  expect(trigger()).toHaveFocus()
})
