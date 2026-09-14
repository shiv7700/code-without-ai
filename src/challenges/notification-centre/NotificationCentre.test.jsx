import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import NotificationCentre from './NotificationCentre'

const NOTES = [
  { id: 1, group: 'Mentions', title: 'Ada mentioned you', read: false },
  { id: 2, group: 'Comments', title: 'New comment on spec', read: false },
  { id: 3, group: 'Mentions', title: 'Bob mentioned you', read: true },
  { id: 4, group: 'Comments', title: 'Reply from Cid', read: false },
]

const setup = (notifications = NOTES) => ({
  user: userEvent.setup(),
  ...render(<NotificationCentre notifications={notifications} />),
})

const headings = () =>
  screen.getAllByRole('heading').map((h) => h.textContent.replace(/\s+/g, ' ').trim())
const unread = () => screen.queryByTestId('unread')?.textContent.trim()
const inGroup = (name) =>
  within(screen.getByTestId('group-' + name))
    .getAllByTestId('note')
    .map((li) => li.dataset.read)
const markRead = (user, title) =>
  user.click(screen.getByRole('button', { name: `Mark ${title} read` }))

test('the notifications are gathered into groups, first one first', () => {
  setup()
  expect(headings()).toEqual(['Mentions (1)', 'Comments (2)'])
})

test('each group keeps its own notifications in order', () => {
  setup()
  expect(inGroup('Mentions')).toEqual(['false', 'true'])
  expect(inGroup('Comments')).toEqual(['false', 'false'])
})

test('the badge counts everything still unread', () => {
  setup()
  expect(unread()).toBe('3')
})

test('marking one read moves both numbers', async () => {
  const { user } = setup()
  await markRead(user, 'Reply from Cid')

  expect(unread()).toBe('2')
  expect(headings()).toEqual(['Mentions (1)', 'Comments (1)'])
  expect(inGroup('Comments')).toEqual(['false', 'true'])
})

test('with nothing unread the badge is not there at all', async () => {
  const { user } = setup([{ id: 1, group: 'Mentions', title: 'Only one', read: false }])
  await markRead(user, 'Only one')

  expect(screen.queryByTestId('unread')).not.toBeInTheDocument()
  expect(headings()).toEqual(['Mentions (0)'])
})

test('marking them all read clears the lot', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Mark all read' }))

  expect(screen.queryByTestId('unread')).not.toBeInTheDocument()
  expect(headings()).toEqual(['Mentions (0)', 'Comments (0)'])
})

test('marking the same one read twice is still once', async () => {
  const { user } = setup()
  await markRead(user, 'Reply from Cid')
  await markRead(user, 'Reply from Cid')

  expect(unread()).toBe('2')
  expect(headings()).toEqual(['Mentions (1)', 'Comments (1)'])
})
