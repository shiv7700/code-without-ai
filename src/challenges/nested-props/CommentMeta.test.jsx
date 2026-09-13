import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import CommentMeta from './CommentMeta'

const at = (id) => screen.getByTestId(id).textContent

test('shows the body and the author name', () => {
  render(
    <CommentMeta comment={{ body: 'Nice', author: { name: 'Ada' } }} />,
  )
  expect(at('body')).toBe('Nice')
  expect(at('author')).toBe('Ada')
})

test('no author means Anonymous, and it must not throw', () => {
  render(<CommentMeta comment={{ body: 'Nice' }} />)
  expect(at('author')).toBe('Anonymous')
})

test('an avatar renders an image with empty alt', () => {
  render(
    <CommentMeta
      comment={{ body: 'Nice', author: { name: 'Ada', avatar: '/a.png' } }}
    />,
  )
  const img = screen.getByTestId('avatar')
  expect(img).toHaveAttribute('src', '/a.png')
  expect(img).toHaveAttribute('alt', '')
})

test('no avatar, no image', () => {
  render(<CommentMeta comment={{ body: 'Nice', author: { name: 'Ada' } }} />)
  expect(screen.queryByTestId('avatar')).not.toBeInTheDocument()
})

test('no replies at all', () => {
  render(<CommentMeta comment={{ body: 'Nice' }} />)
  expect(at('replies')).toBe('No replies')
})

test('one reply is singular', () => {
  render(<CommentMeta comment={{ body: 'Nice', replies: [1] }} />)
  expect(at('replies')).toBe('1 reply')
})

test('several replies are plural', () => {
  render(<CommentMeta comment={{ body: 'Nice', replies: [1, 2, 3] }} />)
  expect(at('replies')).toBe('3 replies')
})
