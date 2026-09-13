import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import ReorderableList from './ReorderableList'

const ITEMS = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
]

const labels = () =>
  screen.getAllByRole('listitem').map((li) => li.textContent.trim())

test('renders one row per item, in order', () => {
  render(<ReorderableList items={ITEMS} />)
  expect(labels()).toEqual(['Apple', 'Banana', 'Cherry'])
})

test('each label points at its own input', () => {
  render(<ReorderableList items={ITEMS} />)
  expect(screen.getByLabelText('Banana')).toBeInTheDocument()
})

test('an empty list renders no rows', () => {
  render(<ReorderableList items={[]} />)
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})

test('reordering moves the rows', () => {
  const { rerender } = render(<ReorderableList items={ITEMS} />)
  rerender(<ReorderableList items={[...ITEMS].reverse()} />)
  expect(labels()).toEqual(['Cherry', 'Banana', 'Apple'])
})

test('what you typed follows its item when the list reorders', async () => {
  const { rerender } = render(<ReorderableList items={ITEMS} />)

  await userEvent.type(screen.getByLabelText('Apple'), 'hello')
  rerender(<ReorderableList items={[...ITEMS].reverse()} />)

  expect(screen.getByLabelText('Apple')).toHaveValue('hello')
  expect(screen.getByLabelText('Cherry')).toHaveValue('')
})
