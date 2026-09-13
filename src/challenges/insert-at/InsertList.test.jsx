import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import InsertList from './InsertList'

const ITEMS = ['alpha', 'beta', 'gamma']

const labels = () =>
  screen
    .queryAllByRole('listitem')
    .map((li) => li.textContent.replace(/Insert after.*/, ''))

const insert = async (value, after) => {
  await userEvent.type(screen.getByLabelText('New item'), value)
  await userEvent.click(
    screen.getByRole('button', { name: `Insert after ${after}` }),
  )
}

test('renders the items in order', () => {
  render(<InsertList initial={ITEMS} />)
  expect(labels()).toEqual(['alpha', 'beta', 'gamma'])
})

test('the new item lands directly after the row, and the input empties', async () => {
  render(<InsertList initial={ITEMS} />)

  await insert('delta', 'alpha')

  expect(labels()).toEqual(['alpha', 'delta', 'beta', 'gamma'])
  expect(screen.getByLabelText('New item')).toHaveValue('')
})

test('inserting after the last row puts it on the end', async () => {
  render(<InsertList initial={ITEMS} />)

  await insert('delta', 'gamma')
  expect(labels()).toEqual(['alpha', 'beta', 'gamma', 'delta'])
})

test('a whitespace-only input inserts nothing', async () => {
  render(<InsertList initial={ITEMS} />)

  await insert('   ', 'beta')
  expect(labels()).toEqual(['alpha', 'beta', 'gamma'])
})

test('two inserts both land where they were asked to', async () => {
  render(<InsertList initial={ITEMS} />)

  await insert('delta', 'alpha')
  await insert('epsilon', 'beta')

  expect(labels()).toEqual(['alpha', 'delta', 'beta', 'epsilon', 'gamma'])
})

test('the row appears, and the array it was handed still has three', async () => {
  const initial = [...ITEMS]
  render(<InsertList initial={initial} />)

  await insert('delta', 'beta')

  expect(labels()).toHaveLength(4)
  expect(initial).toEqual(ITEMS)
})
