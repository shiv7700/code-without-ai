import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SelectableTable from './SelectableTable'

const ROWS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
  { id: 4, name: 'Dan' },
]

const box = (name) => screen.getByRole('checkbox', { name })
const all = () => box('Select all')
const tick = (name) => userEvent.click(box(name))
const search = (text) => userEvent.type(screen.getByLabelText(/search/i), text)

test('a checkbox per row, plus the header one', () => {
  render(<SelectableTable rows={ROWS} />)
  expect(screen.getAllByRole('checkbox')).toHaveLength(5)
})

test('selecting one row makes the header indeterminate', async () => {
  render(<SelectableTable rows={ROWS} />)

  await tick('Select Bob')
  expect(all().indeterminate).toBe(true)
  expect(all()).not.toBeChecked()
})

test('select-all ticks every row and the header goes checked', async () => {
  render(<SelectableTable rows={ROWS} />)

  await userEvent.click(all())
  screen.getAllByRole('checkbox').forEach((b) => expect(b).toBeChecked())
  expect(all().indeterminate).toBe(false)
})

test('ids come back in the order the rows were given', async () => {
  const onChange = vi.fn()
  render(<SelectableTable rows={ROWS} onChange={onChange} />)

  await tick('Select Dan')
  await tick('Select Alice')
  expect(onChange).toHaveBeenLastCalledWith([1, 4])
})

test('under a filter, select-all only touches what is on screen', async () => {
  const onChange = vi.fn()
  render(<SelectableTable rows={ROWS} onChange={onChange} />)

  await search('a')
  expect(screen.getAllByRole('checkbox')).toHaveLength(4) // Alice, Carol, Dan

  await userEvent.click(all())
  expect(onChange).toHaveBeenLastCalledWith([1, 3, 4])
})

test('the header reflects the visible rows, not the whole table', async () => {
  render(<SelectableTable rows={ROWS} />)

  await tick('Select Bob')
  await search('bo')
  expect(all()).toBeChecked()
  expect(all().indeterminate).toBe(false)
})

test('a selection survives being filtered out', async () => {
  const onChange = vi.fn()
  render(<SelectableTable rows={ROWS} onChange={onChange} />)

  await tick('Select Bob')
  await search('dan')

  expect(screen.queryByRole('checkbox', { name: 'Select Bob' })).toBeNull()
  await userEvent.click(all())
  expect(onChange).toHaveBeenLastCalledWith([2, 4])
})
