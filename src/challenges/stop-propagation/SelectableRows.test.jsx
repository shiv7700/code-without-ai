import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import SelectableRows from './SelectableRows'

const ROWS = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
]

const row = (label) =>
  screen.getByRole('button', { name: `Remove ${label}` }).closest('li')

const selected = () =>
  screen
    .queryAllByRole('listitem')
    .filter((li) => li.getAttribute('data-selected') === 'true')
    .map((li) => li.textContent.replace(/Remove.*/, ''))

const remove = (label) =>
  userEvent.click(screen.getByRole('button', { name: `Remove ${label}` }))

test('nothing is selected to begin with', () => {
  render(<SelectableRows rows={ROWS} />)

  expect(screen.getAllByRole('listitem')).toHaveLength(3)
  expect(selected()).toEqual([])
})

test('clicking a row selects it, and only it', async () => {
  render(<SelectableRows rows={ROWS} />)

  await userEvent.click(row('Banana'))
  expect(selected()).toEqual(['Banana'])

  await userEvent.click(row('Cherry'))
  expect(selected()).toEqual(['Cherry'])
})

test('the button removes its own row', async () => {
  render(<SelectableRows rows={ROWS} />)

  await remove('Banana')
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
})

test('removing a row does not select anything', async () => {
  render(<SelectableRows rows={ROWS} />)

  await remove('Banana')
  expect(selected()).toEqual([])
})

test('removing one row leaves the selection on another', async () => {
  render(<SelectableRows rows={ROWS} />)

  await userEvent.click(row('Apple'))
  await remove('Cherry')

  expect(selected()).toEqual(['Apple'])
})

test('the array it was handed keeps all three', async () => {
  const rows = ROWS.map((r) => ({ ...r }))
  render(<SelectableRows rows={rows} />)

  await remove('Apple')

  expect(screen.getAllByRole('listitem')).toHaveLength(2)
  expect(rows).toHaveLength(3)
})
