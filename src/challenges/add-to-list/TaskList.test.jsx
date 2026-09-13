import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TaskList from './TaskList'

const rows = () =>
  screen.queryAllByRole('listitem').map((li) => li.textContent)

const add = async (task) => {
  await userEvent.type(screen.getByLabelText('Task'), task)
  await userEvent.click(screen.getByRole('button', { name: 'Add' }))
}

test('starts with the tasks it was given', () => {
  render(<TaskList initial={['wash up']} />)
  expect(rows()).toEqual(['wash up'])
})

test('a new task lands at the end and the input empties', async () => {
  render(<TaskList initial={['wash up']} />)

  await add('post the letter')

  expect(rows()).toEqual(['wash up', 'post the letter'])
  expect(screen.getByLabelText('Task')).toHaveValue('')
})

test('a whitespace-only task is ignored', async () => {
  render(<TaskList initial={['wash up']} />)

  await add('   ')

  expect(rows()).toEqual(['wash up'])
})

test('the same task can be added twice', async () => {
  render(<TaskList initial={[]} />)

  await add('ring mum')
  await add('ring mum')

  expect(rows()).toEqual(['ring mum', 'ring mum'])
})

test('the row appears, and the array it was handed does not grow', async () => {
  const initial = ['wash up']
  render(<TaskList initial={initial} />)

  await add('post the letter')

  expect(rows()).toHaveLength(2)
  expect(initial).toEqual(['wash up'])
})
