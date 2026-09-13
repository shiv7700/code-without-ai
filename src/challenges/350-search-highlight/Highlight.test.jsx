import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Highlight from './Highlight'

const marks = () => screen.queryAllByRole('mark').map((m) => m.textContent)

test('renders the text unchanged when there is no query', () => {
  render(<Highlight text="Banana bread" query="" />)
  expect(screen.getByText('Banana bread')).toBeInTheDocument()
  expect(marks()).toEqual([])
})

test('wraps a single match', () => {
  render(<Highlight text="Banana bread" query="bread" />)
  expect(marks()).toEqual(['bread'])
})

test('wraps every match, not just the first', () => {
  render(<Highlight text="Banana" query="an" />)
  expect(marks()).toEqual(['an', 'an'])
})

test('matches case-insensitively but keeps the original casing', () => {
  render(<Highlight text="Banana" query="BAN" />)
  expect(marks()).toEqual(['Ban'])
})

test('the full text is still readable around the marks', () => {
  const { container } = render(<Highlight text="Banana bread" query="an" />)
  expect(container.textContent).toBe('Banana bread')
})

test('a query of "." matches a full stop, not every character', () => {
  render(<Highlight text="a.b c" query="." />)
  expect(marks()).toEqual(['.'])
})

test('regex metacharacters in the query are literal', () => {
  render(<Highlight text="cost is $5 (net)" query="(net)" />)
  expect(marks()).toEqual(['(net)'])
})
