import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Text from './Text'

test('defaults to a paragraph', () => {
  const { container } = render(<Text>hello</Text>)
  expect(container.firstChild.tagName).toBe('P')
  expect(container.firstChild).toHaveTextContent('hello')
})

test('renders the tag it was given', () => {
  render(<Text as="h1">Title</Text>)
  expect(screen.getByRole('heading', { name: 'Title', level: 1 })).toBeInTheDocument()
})

test('any tag name works, not a list you picked', () => {
  const { container } = render(<Text as="blockquote">quoted</Text>)
  expect(container.firstChild.tagName).toBe('BLOCKQUOTE')
})

test('the base class is always there', () => {
  const { container } = render(<Text>hello</Text>)
  expect(container.firstChild.className).toBe('text')
})

test('a tone is added to the base class', () => {
  const { container } = render(<Text tone="muted">hello</Text>)
  expect(container.firstChild).toHaveClass('text', 'muted')
})

test('a component can be the tag too', () => {
  const Pill = ({ className, children }) => (
    <span data-testid="pill" className={className}>
      {children}
    </span>
  )
  render(
    <Text as={Pill} tone="muted">
      hello
    </Text>,
  )
  expect(screen.getByTestId('pill')).toHaveClass('text', 'muted')
  expect(screen.getByTestId('pill')).toHaveTextContent('hello')
})
