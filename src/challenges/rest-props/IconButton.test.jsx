import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import IconButton from './IconButton'

test('the icon is the button text', () => {
  render(<IconButton icon="+" label="Add" />)
  const button = screen.getByRole('button')
  expect(button).toHaveTextContent('+')
  expect(button).toHaveClass('icon-btn')
})

test('the label names the button', () => {
  render(<IconButton icon="+" label="Add" />)
  expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
})

test('data and title attributes go through', () => {
  render(<IconButton icon="+" label="Add" data-testid="add" title="Add one" />)
  expect(screen.getByTestId('add')).toHaveAttribute('title', 'Add one')
})

test('so do the real button attributes', () => {
  render(<IconButton icon="+" label="Add" type="submit" disabled />)
  const button = screen.getByRole('button')
  expect(button).toHaveAttribute('type', 'submit')
  expect(button).toBeDisabled()
})

test('the props you consumed do not leak onto the DOM', () => {
  render(<IconButton icon="+" label="Add" />)
  const button = screen.getByRole('button')
  expect(button).not.toHaveAttribute('icon')
  expect(button).not.toHaveAttribute('label')
})

test('a caller who passes aria-label wins', () => {
  render(<IconButton icon="+" label="Add" aria-label="Add to basket" />)
  expect(screen.getByRole('button', { name: 'Add to basket' })).toBeInTheDocument()
})
