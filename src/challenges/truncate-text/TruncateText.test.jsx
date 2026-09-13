import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TruncateText from './TruncateText'

const LONG = 'abcdefghijklmnopqrstuvwxyz'
const shown = () => screen.getByTestId('text').textContent
const toggle = () => screen.getByRole('button')

test('short text renders whole, with no button', () => {
  render(<TruncateText text="hello" limit={10} />)

  expect(shown()).toBe('hello')
  expect(screen.queryByRole('button')).toBeNull()
})

test('text of exactly the limit is left alone', () => {
  render(<TruncateText text="abcde" limit={5} />)

  expect(shown()).toBe('abcde')
  expect(screen.queryByRole('button')).toBeNull()
})

test('longer text is cut to the limit and marked with an ellipsis', () => {
  render(<TruncateText text={LONG} limit={5} />)

  expect(shown()).toBe('abcde…')
  expect(toggle()).toHaveTextContent('more')
  expect(toggle()).toHaveAttribute('aria-expanded', 'false')
})

test('more expands to the whole text', async () => {
  render(<TruncateText text={LONG} limit={5} />)

  await userEvent.click(toggle())
  expect(shown()).toBe(LONG)
  expect(toggle()).toHaveTextContent('less')
  expect(toggle()).toHaveAttribute('aria-expanded', 'true')
})

test('less collapses it again', async () => {
  render(<TruncateText text={LONG} limit={5} />)

  await userEvent.click(toggle())
  await userEvent.click(toggle())
  expect(shown()).toBe('abcde…')
})

test('the limit counts characters of the text, not the ellipsis', () => {
  render(<TruncateText text="abcdef" limit={5} />)
  expect(shown()).toBe('abcde…')
})
