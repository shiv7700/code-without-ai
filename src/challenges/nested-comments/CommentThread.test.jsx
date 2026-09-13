import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import CommentThread from './CommentThread'

const COMMENTS = [
  {
    id: 'a',
    text: 'first post',
    replies: [
      { id: 'b', text: 'nice one', replies: [{ id: 'c', text: 'agreed', replies: [] }] },
      { id: 'd', text: 'not sure', replies: [] },
    ],
  },
  { id: 'e', text: 'unrelated', replies: [] },
]

const setup = () => ({
  user: userEvent.setup(),
  ...render(<CommentThread comments={COMMENTS} />),
})

const texts = () =>
  screen.queryAllByTestId('comment').map((c) => c.querySelector('p').textContent)
const count = () => screen.getByTestId('count').textContent
const comment = (text) =>
  screen.getAllByTestId('comment').find((c) => c.querySelector('p').textContent === text)

test('renders every comment, however deep', () => {
  setup()
  expect(texts()).toEqual(['first post', 'nice one', 'agreed', 'not sure', 'unrelated'])
})

test('replies are nested inside their parent', () => {
  setup()
  expect(comment('first post').contains(comment('agreed'))).toBe(true)
  expect(comment('unrelated').contains(comment('agreed'))).toBe(false)
})

test('counts the whole tree', () => {
  setup()
  expect(count()).toBe('5 comments')
})

test('no reply box until you ask for one', () => {
  setup()
  expect(screen.queryByLabelText('Reply')).not.toBeInTheDocument()
})

test('reply opens a box', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Reply to not sure' }))

  expect(screen.getByLabelText('Reply')).toBeInTheDocument()
})

test('only one reply box is open at a time', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Reply to not sure' }))
  await user.click(screen.getByRole('button', { name: 'Reply to unrelated' }))

  expect(screen.getAllByLabelText('Reply')).toHaveLength(1)
})

test('posting adds the reply under that comment', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Reply to not sure' }))
  await user.type(screen.getByLabelText('Reply'), 'me neither')
  await user.click(screen.getByRole('button', { name: 'Post' }))

  expect(comment('not sure').contains(comment('me neither'))).toBe(true)
})

test('a new reply goes to the end of its siblings', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Reply to first post' }))
  await user.type(screen.getByLabelText('Reply'), 'late arrival')
  await user.click(screen.getByRole('button', { name: 'Post' }))

  expect(texts()).toEqual([
    'first post',
    'nice one',
    'agreed',
    'not sure',
    'late arrival',
    'unrelated',
  ])
})

test('posting closes the box and bumps the count', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Reply to unrelated' }))
  await user.type(screen.getByLabelText('Reply'), 'hello')
  await user.click(screen.getByRole('button', { name: 'Post' }))

  expect(screen.queryByLabelText('Reply')).not.toBeInTheDocument()
  expect(count()).toBe('6 comments')
})

test('an empty reply posts nothing', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Reply to unrelated' }))
  await user.click(screen.getByRole('button', { name: 'Post' }))

  expect(count()).toBe('5 comments')
})

test('deleting a leaf removes just that one', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Delete agreed' }))

  expect(texts()).toEqual(['first post', 'nice one', 'not sure', 'unrelated'])
})

test('deleting a comment takes its replies with it', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Delete nice one' }))

  expect(texts()).toEqual(['first post', 'not sure', 'unrelated'])
  expect(count()).toBe('3 comments')
})

test('deleting a root takes the whole branch', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Delete first post' }))

  expect(texts()).toEqual(['unrelated'])
})
