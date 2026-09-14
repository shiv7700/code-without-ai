import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import KanbanBoard from './KanbanBoard'

const COLUMNS = [
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      { id: 'a', text: 'Write spec' },
      { id: 'b', text: 'Fix bug' },
    ],
  },
  { id: 'doing', title: 'Doing', cards: [{ id: 'c', text: 'Ship it' }] },
  { id: 'done', title: 'Done', cards: [] },
]

const setup = (columns = COLUMNS) => ({
  user: userEvent.setup(),
  ...render(<KanbanBoard columns={columns} />),
})

const column = (id) =>
  within(screen.getByTestId('column-' + id))
    .queryAllByTestId('card')
    .map((li) => li.textContent.replace(/Move.*$/, '').trim())

const card = (text) => screen.getByRole('button', { name: text })

test('every column shows its own cards', () => {
  setup()
  expect(column('todo')).toEqual(['Write spec', 'Fix bug'])
  expect(column('doing')).toEqual(['Ship it'])
  expect(column('done')).toEqual([])
})

test('moving right takes the card to the end of the next column', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Move Fix bug right' }))

  expect(column('todo')).toEqual(['Write spec'])
  expect(column('doing')).toEqual(['Ship it', 'Fix bug'])
})

test('the edges of the board are dead ends', () => {
  setup()
  expect(screen.getByRole('button', { name: 'Move Write spec left' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Move Ship it right' })).toBeEnabled()
})

test('arrow keys move the card that has focus', async () => {
  const { user } = setup()
  await user.click(card('Ship it'))
  await user.keyboard('{ArrowLeft}')

  expect(column('todo')).toEqual(['Write spec', 'Fix bug', 'Ship it'])
  expect(column('doing')).toEqual([])
})

test('a column emptied of cards is still a column', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Move Ship it right' }))

  expect(screen.getByTestId('column-doing')).toBeInTheDocument()
  expect(column('doing')).toEqual([])
})

test('a card can be walked across the board without touching the mouse again', async () => {
  const { user } = setup()
  await user.click(card('Write spec'))
  await user.keyboard('{ArrowRight}{ArrowRight}')

  expect(column('done')).toEqual(['Write spec'])
  expect(card('Write spec')).toHaveFocus()
})
