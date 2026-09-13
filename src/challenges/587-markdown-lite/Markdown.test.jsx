import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Markdown from './Markdown'

const show = (text) => render(<Markdown text={text} />).container

test('plain text comes through as plain text', () => {
  expect(show('hello world').textContent).toBe('hello world')
})

test('double asterisks make it bold', () => {
  show('a **bold** word')
  expect(screen.getByText('bold').tagName).toBe('STRONG')
})

test('single asterisks make it italic', () => {
  show('a *slanted* word')
  expect(screen.getByText('slanted').tagName).toBe('EM')
})

test('backticks make it code', () => {
  show('run `npm test` now')
  expect(screen.getByText('npm test').tagName).toBe('CODE')
})

test('brackets and parens make a link', () => {
  show('see [the docs](https://react.dev)')
  const link = screen.getByRole('link', { name: 'the docs' })

  expect(link).toHaveAttribute('href', 'https://react.dev')
})

test('the surrounding text is kept, and the markers are not', () => {
  expect(show('a **bold** word').textContent).toBe('a bold word')
})

test('several marks on one line all render', () => {
  show('**one** and *two* and `three`')

  expect(screen.getByText('one').tagName).toBe('STRONG')
  expect(screen.getByText('two').tagName).toBe('EM')
  expect(screen.getByText('three').tagName).toBe('CODE')
})

test('bold wins over italic — two asterisks are not one', () => {
  show('**bold**')
  expect(screen.getByText('bold').tagName).toBe('STRONG')
})

test('marks nest inside each other', () => {
  show('**bold and *italic* inside**')
  const em = screen.getByText('italic')

  expect(em.tagName).toBe('EM')
  expect(em.closest('strong')).not.toBe(null)
})

test('a link can hold formatting', () => {
  show('[**important** link](https://react.dev)')
  const link = screen.getByRole('link')

  expect(link).toHaveAttribute('href', 'https://react.dev')
  expect(link.querySelector('strong').textContent).toBe('important')
})

test('markers inside code are literal', () => {
  show('`**not bold**`')

  expect(screen.getByText('**not bold**').tagName).toBe('CODE')
  expect(document.querySelector('strong')).toBe(null)
})

test('an unmatched marker is just a character', () => {
  expect(show('2 * 3 = 6').textContent).toBe('2 * 3 = 6')
  expect(document.querySelector('em')).toBe(null)
})

test('an empty string renders nothing at all', () => {
  expect(show('').textContent).toBe('')
})
