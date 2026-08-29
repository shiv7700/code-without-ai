import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CheckboxGroup from './CheckboxGroup'

const OPTIONS = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
]

const box = (name) => screen.getByRole('checkbox', { name })
const all = () => box(/select all/i)
const tick = (name) => userEvent.click(box(name))

test('renders one checkbox per option, plus select-all', () => {
  render(<CheckboxGroup options={OPTIONS} />)
  expect(screen.getAllByRole('checkbox')).toHaveLength(4)
})

test('nothing is checked at first', () => {
  render(<CheckboxGroup options={OPTIONS} />)
  screen.getAllByRole('checkbox').forEach((b) => expect(b).not.toBeChecked())
})

test('ticking an option reports the selected ids', async () => {
  const onChange = vi.fn()
  render(<CheckboxGroup options={OPTIONS} onChange={onChange} />)

  await tick(/banana/i)
  expect(onChange).toHaveBeenCalledWith(['b'])
})

test('ids come back in the order the options were given', async () => {
  const onChange = vi.fn()
  render(<CheckboxGroup options={OPTIONS} onChange={onChange} />)

  await tick(/cherry/i)
  await tick(/apple/i)
  expect(onChange).toHaveBeenLastCalledWith(['a', 'c'])
})

test('unticking removes it again', async () => {
  const onChange = vi.fn()
  render(<CheckboxGroup options={OPTIONS} onChange={onChange} />)

  await tick(/apple/i)
  await tick(/apple/i)
  expect(onChange).toHaveBeenLastCalledWith([])
})

test('select all ticks every option', async () => {
  render(<CheckboxGroup options={OPTIONS} />)

  await userEvent.click(all())
  screen.getAllByRole('checkbox').forEach((b) => expect(b).toBeChecked())
})

test('select all unticks everything when everything is ticked', async () => {
  render(<CheckboxGroup options={OPTIONS} />)

  await userEvent.click(all())
  await userEvent.click(all())
  screen.getAllByRole('checkbox').forEach((b) => expect(b).not.toBeChecked())
})

test('select all goes indeterminate on a partial selection', async () => {
  render(<CheckboxGroup options={OPTIONS} />)

  await tick(/banana/i)
  expect(all().indeterminate).toBe(true)
  expect(all()).not.toBeChecked()
})

test('select all is checked, not indeterminate, once all are ticked', async () => {
  render(<CheckboxGroup options={OPTIONS} />)

  await tick(/apple/i)
  await tick(/banana/i)
  await tick(/cherry/i)
  expect(all()).toBeChecked()
  expect(all().indeterminate).toBe(false)
})
