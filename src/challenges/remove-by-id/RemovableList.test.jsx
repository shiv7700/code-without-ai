import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import RemovableList from './RemovableList'

const ROWS = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
  { id: 'd', label: 'Damson' },
]

const labels = () =>
  screen
    .queryAllByRole('listitem')
    .map((li) => li.textContent.replace(/Remove.*/, ''))

const remove = (label) =>
  userEvent.click(screen.getByRole('button', { name: `Remove ${label}` }))

test('renders one row per item, in order', () => {
  render(<RemovableList rows={ROWS} />)
  expect(labels()).toEqual(['Apple', 'Banana', 'Cherry', 'Damson'])
})

test('a row takes only itself away', async () => {
  render(<RemovableList rows={ROWS} />)

  await remove('Banana')
  expect(labels()).toEqual(['Apple', 'Cherry', 'Damson'])
})

test('three removals take the three you asked for', async () => {
  render(<RemovableList rows={ROWS} />)

  await remove('Apple')
  await remove('Cherry')
  await remove('Damson')

  expect(labels()).toEqual(['Banana'])
})

test('the list can be emptied completely', async () => {
  render(<RemovableList rows={[{ id: 'a', label: 'Apple' }]} />)

  await remove('Apple')
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})

test('the row goes, and the array it was handed keeps all four', async () => {
  const rows = ROWS.map((r) => ({ ...r }))
  render(<RemovableList rows={rows} />)

  await remove('Banana')

  expect(labels()).toHaveLength(3)
  expect(rows.map((r) => r.id)).toEqual(['a', 'b', 'c', 'd'])
})
