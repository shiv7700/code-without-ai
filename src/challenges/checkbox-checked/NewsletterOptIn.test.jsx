import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import NewsletterOptIn from './NewsletterOptIn'

const box = () => screen.getByRole('checkbox', { name: /email me updates/i })

test('starts off', () => {
  render(<NewsletterOptIn />)
  expect(box()).not.toBeChecked()
  expect(screen.getByText('Off')).toBeInTheDocument()
})

test('clicking turns it on', async () => {
  render(<NewsletterOptIn />)
  await userEvent.click(box())
  expect(box()).toBeChecked()
  expect(screen.getByText('On')).toBeInTheDocument()
})

test('clicking again turns it back off', async () => {
  render(<NewsletterOptIn />)
  await userEvent.click(box())
  await userEvent.click(box())
  expect(box()).not.toBeChecked()
  expect(screen.getByText('Off')).toBeInTheDocument()
})

test('the label reads the box, not a copy of it', async () => {
  render(<NewsletterOptIn />)
  await userEvent.click(box())
  expect(screen.queryByText('Off')).not.toBeInTheDocument()
})
