import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import MaybeLink from './MaybeLink'

test('an href wraps the children in a link', () => {
  render(
    <MaybeLink href="/cards/1">
      <span>Card one</span>
    </MaybeLink>,
  )

  const link = screen.getByRole('link', { name: 'Card one' })
  expect(link).toHaveAttribute('href', '/cards/1')
  expect(link).toHaveClass('card-link')
})

test('no href leaves the children on their own', () => {
  const { container } = render(
    <MaybeLink>
      <span>Card one</span>
    </MaybeLink>,
  )

  expect(container.innerHTML).toBe('<span>Card one</span>')
})

test('an empty href is not an href', () => {
  const { container } = render(
    <MaybeLink href="">
      <span>Card one</span>
    </MaybeLink>,
  )

  expect(container.querySelector('a')).toBeNull()
})

test('the children appear once, not once per branch', () => {
  render(
    <MaybeLink href="/cards/1">
      <span>Card one</span>
    </MaybeLink>,
  )

  expect(screen.getByText('Card one')).toBeInTheDocument()
})

test('external opens away and drops the opener', () => {
  render(<MaybeLink href="https://example.com" external>Docs</MaybeLink>)

  const link = screen.getByRole('link', { name: 'Docs' })
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

test('not external means neither attribute is there', () => {
  render(<MaybeLink href="/cards/1">Card one</MaybeLink>)

  const link = screen.getByRole('link', { name: 'Card one' })
  expect(link).not.toHaveAttribute('target')
  expect(link).not.toHaveAttribute('rel')
})
