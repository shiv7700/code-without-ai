import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import DismissibleAlert from './DismissibleAlert'

const close = () => screen.getByRole('button', { name: /dismiss/i })

test('shows the message in an alert', () => {
  render(<DismissibleAlert message="Disk almost full" />)
  expect(screen.getByRole('alert')).toHaveTextContent('Disk almost full')
})

test('the close button has a name, not a glyph', () => {
  render(<DismissibleAlert message="Disk almost full" />)
  expect(close()).toBeInTheDocument()
})

test('dismissing removes it and reports once', async () => {
  const onDismiss = vi.fn()
  render(<DismissibleAlert message="Disk almost full" onDismiss={onDismiss} />)

  await userEvent.click(close())
  expect(screen.queryByRole('alert')).toBeNull()
  expect(onDismiss).toHaveBeenCalledTimes(1)
})

test('a new message replaces the old one while it is alive', () => {
  const { rerender } = render(<DismissibleAlert message="Disk almost full" />)
  rerender(<DismissibleAlert message="Disk full" />)

  expect(screen.getByRole('alert')).toHaveTextContent('Disk full')
})

test('a new message does not bring a dismissed alert back', async () => {
  const { rerender } = render(<DismissibleAlert message="Disk almost full" />)
  await userEvent.click(close())

  rerender(<DismissibleAlert message="Disk full" />)
  expect(screen.queryByRole('alert')).toBeNull()
  expect(screen.queryByText('Disk full')).toBeNull()
})
