import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Field from './Field'

const value = () => screen.getByTestId('value').textContent

test('shows the label', () => {
  render(<Field label="Quantity" value={2} />)
  expect(screen.getByTestId('label')).toHaveTextContent('Quantity')
})

test('shows a plain value', () => {
  render(<Field label="City" value="Noida" />)
  expect(value()).toBe('Noida')
})

test('zero is a value, not a blank', () => {
  render(<Field label="Quantity" value={0} />)
  expect(value()).toBe('0')
})

test('an empty string stays empty — it is not missing data', () => {
  render(<Field label="Note" value="" />)
  expect(value()).toBe('')
})

test('undefined falls back to the placeholder', () => {
  render(<Field label="Note" />)
  expect(value()).toBe('—')
})

test('null falls back too', () => {
  render(<Field label="Note" value={null} />)
  expect(value()).toBe('—')
})

test('the placeholder can be overridden', () => {
  render(<Field label="Note" placeholder="not set" />)
  expect(value()).toBe('not set')
})
