import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import RichText from './RichText'

test('the title and the markup live side by side', () => {
  render(<RichText title="Notes" html="<b>hi</b>" />)

  expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
  expect(screen.getByTestId('body')).toBeInTheDocument()
})

test('tags in the string become real elements', () => {
  render(<RichText title="Notes" html="<p>one</p><p>two</p>" />)

  const body = screen.getByTestId('body')
  expect(body.querySelectorAll('p')).toHaveLength(2)
  expect(body.querySelector('b')).toBeNull()
})

test('entities are decoded rather than shown', () => {
  render(<RichText title="Notes" html="Tom &amp; Jerry" />)
  expect(screen.getByTestId('body').textContent).toBe('Tom & Jerry')
})

test('nothing is sanitised on the way in', () => {
  render(<RichText title="Notes" html={'<a href="javascript:alert(1)">go</a>'} />)

  expect(screen.getByTestId('body').querySelector('a').getAttribute('href')).toBe(
    'javascript:alert(1)',
  )
})

test('no html means no body at all', () => {
  const { rerender } = render(<RichText title="Notes" />)
  expect(screen.queryByTestId('body')).not.toBeInTheDocument()

  rerender(<RichText title="Notes" html="" />)
  expect(screen.queryByTestId('body')).not.toBeInTheDocument()

  expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
})
