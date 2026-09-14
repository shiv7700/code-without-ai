import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import SaveStatus from './SaveStatus'

test('both regions are there with nothing to say', () => {
  render(<SaveStatus />)

  expect(screen.getByRole('status')).toBeEmptyDOMElement()
  expect(screen.getByRole('alert')).toBeEmptyDOMElement()
})

test('a polite message goes in the status region, visibly', () => {
  render(<SaveStatus message="Saved" />)

  expect(screen.getByRole('status')).toHaveTextContent('Saved')
  expect(screen.getByText('Saved')).toBeVisible()
  expect(screen.getByRole('alert')).toBeEmptyDOMElement()
})

test('an error goes in the assertive one instead', () => {
  render(<SaveStatus message="Could not save" tone="error" />)

  expect(screen.getByRole('alert')).toHaveTextContent('Could not save')
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
})

test('clearing the message empties the regions without removing them', () => {
  const { rerender } = render(<SaveStatus message="Saved" />)

  rerender(<SaveStatus message="" />)
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
  expect(screen.getByRole('alert')).toBeEmptyDOMElement()
})

test('the regions are the same elements from first render to last', () => {
  const { rerender } = render(<SaveStatus />)
  const status = screen.getByRole('status')
  const alert = screen.getByRole('alert')

  rerender(<SaveStatus message="Saving…" />)
  expect(screen.getByRole('status')).toBe(status)

  rerender(<SaveStatus message="Could not save" tone="error" />)
  expect(screen.getByRole('status')).toBe(status)
  expect(screen.getByRole('alert')).toBe(alert)
  expect(alert).toHaveTextContent('Could not save')
})
