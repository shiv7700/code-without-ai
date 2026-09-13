import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import StatusBadge from './StatusBadge'

test('always shows the label', () => {
  render(<StatusBadge label="Inbox" />)
  expect(screen.getByText('Inbox')).toBeInTheDocument()
})

test('shows the bubble when there is something to count', () => {
  render(<StatusBadge label="Inbox" count={3} />)
  expect(screen.getByTestId('count')).toHaveTextContent('3')
})

test('count 0 renders no bubble and no stray zero', () => {
  const { container } = render(<StatusBadge label="Inbox" count={0} />)
  expect(screen.queryByTestId('count')).not.toBeInTheDocument()
  expect(container.textContent).toBe('Inbox')
})

test('no count at all renders no bubble', () => {
  render(<StatusBadge label="Inbox" />)
  expect(screen.queryByTestId('count')).not.toBeInTheDocument()
})

test('urgent adds to the class instead of replacing it', () => {
  const { container } = render(<StatusBadge label="Inbox" urgent />)
  expect(container.firstChild).toHaveClass('badge', 'urgent')
})

test('not urgent is just the base class', () => {
  const { container } = render(<StatusBadge label="Inbox" />)
  expect(container.firstChild.className).toBe('badge')
})
