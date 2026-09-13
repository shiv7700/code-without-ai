import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import CodeSample from './CodeSample'

const sample = () => document.querySelector('code')

test('shows the caption', () => {
  render(<CodeSample label="Bold" code="hi" />)
  expect(screen.getByText('Bold').tagName).toBe('FIGCAPTION')
})

test('plain text goes through untouched', () => {
  render(<CodeSample label="Bold" code="const a = 1" />)
  expect(sample().textContent).toBe('const a = 1')
})

test('tags in the string are shown, not obeyed', () => {
  const { container } = render(<CodeSample label="Bold" code="<b>hi</b>" />)
  expect(sample().textContent).toBe('<b>hi</b>')
  expect(container.querySelector('b')).toBeNull()
})

// In braces, not quotes — JSX decodes entities inside a quoted attribute.
test('an entity stays as the characters it was written with', () => {
  render(<CodeSample label="Amp" code={'a &amp; b'} />)
  expect(sample().textContent).toBe('a &amp; b')
})

test('quotes and braces survive', () => {
  render(<CodeSample label="Obj" code={'{ "a": 1 }'} />)
  expect(sample().textContent).toBe('{ "a": 1 }')
})
