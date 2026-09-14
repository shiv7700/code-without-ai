import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import Byline from './Byline'

const text = (container) => container.querySelector('p').textContent

test('reads as one sentence, spaces and all', () => {
  const { container } = render(<Byline author="Alice" minutes={3} />)
  expect(text(container)).toBe('By Alice · 3 min read')
})

test('only the author is bold', () => {
  const { container } = render(<Byline author="Alice" minutes={3} />)

  expect(container.querySelectorAll('strong')).toHaveLength(1)
  expect(container.querySelector('strong').textContent).toBe('Alice')
})

test('a tag adds one space and an italic hashtag', () => {
  const { container } = render(<Byline author="Alice" minutes={3} tag="react" />)

  expect(text(container)).toBe('By Alice · 3 min read #react')
  expect(container.querySelector('em').textContent).toBe('#react')
})

test('no tag leaves no trailing space and no em', () => {
  const { container } = render(<Byline author="Alice" minutes={12} />)

  expect(text(container)).toBe('By Alice · 12 min read')
  expect(container.querySelector('em')).toBeNull()
})

test('no run of two spaces anywhere', () => {
  const { container } = render(<Byline author="Alice" minutes={3} tag="react" />)
  expect(text(container)).not.toMatch(/\s\s/)
})

test('the spaces are ordinary spaces', () => {
  const { container } = render(<Byline author="Alice" minutes={3} tag="react" />)

  for (const code of [...text(container)].map((c) => c.charCodeAt(0))) {
    expect(code).not.toBe(160)
  }
})
