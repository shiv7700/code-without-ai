import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import MentionBox from './MentionBox'

const PEOPLE = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Alan' },
  { id: 3, name: 'Bob' },
]

const setup = () => {
  const user = userEvent.setup()
  render(<MentionBox people={PEOPLE} />)
  return { user, box: screen.getByLabelText('Comment') }
}

const options = () =>
  screen.queryAllByRole('option').map((li) => li.textContent.trim())

test('no menu until there is a mention to complete', async () => {
  const { user, box } = setup()
  await user.type(box, 'looks good')

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('an at sign offers everyone', async () => {
  const { user, box } = setup()
  await user.type(box, '@')

  expect(options()).toEqual(['Ada', 'Alan', 'Bob'])
})

test('what follows the at sign narrows it down', async () => {
  const { user, box } = setup()
  await user.type(box, 'hi @a')

  expect(options()).toEqual(['Ada', 'Alan'])
})

test('a name nobody has closes the menu', async () => {
  const { user, box } = setup()
  await user.type(box, '@az')

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('a space finishes the mention off', async () => {
  const { user, box } = setup()
  await user.type(box, '@ad ')

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('an at sign in the middle of a word is part of an address', async () => {
  const { user, box } = setup()
  await user.type(box, 'mail bob@a')

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('choosing someone writes their name in and closes the menu', async () => {
  const { user, box } = setup()
  await user.type(box, 'hi @al')
  await user.click(screen.getByRole('option', { name: 'Alan' }))

  expect(box).toHaveValue('hi @Alan ')
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('the mention you finished five words ago does not reopen it', async () => {
  const { user, box } = setup()
  await user.type(box, '@ad')
  expect(options()).toEqual(['Ada'])

  await user.type(box, 'a and here is the rest of it')
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})
