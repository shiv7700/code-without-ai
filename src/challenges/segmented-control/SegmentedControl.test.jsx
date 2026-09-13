import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SegmentedControl from './SegmentedControl'

const OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const seg = (name) => screen.getByRole('button', { name })
const pressed = () =>
  screen
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.textContent)

test('renders a labelled group with a button per option', () => {
  render(<SegmentedControl options={OPTIONS} value="day" label="Range" />)

  expect(screen.getByRole('group', { name: 'Range' })).toBeInTheDocument()
  expect(screen.getAllByRole('button')).toHaveLength(3)
})

test('exactly one button is pressed', () => {
  render(<SegmentedControl options={OPTIONS} value="week" label="Range" />)
  expect(pressed()).toEqual(['Week'])
})

test('the unpressed buttons say so out loud', () => {
  render(<SegmentedControl options={OPTIONS} value="week" label="Range" />)

  expect(seg('Day')).toHaveAttribute('aria-pressed', 'false')
  expect(seg('Month')).toHaveAttribute('aria-pressed', 'false')
})

test('clicking an option reports its value', async () => {
  const onChange = vi.fn()
  render(<SegmentedControl options={OPTIONS} value="day" label="Range" onChange={onChange} />)

  await userEvent.click(seg('Month'))
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith('month')
})

test('clicking the pressed option reports nothing', async () => {
  const onChange = vi.fn()
  render(<SegmentedControl options={OPTIONS} value="day" label="Range" onChange={onChange} />)

  await userEvent.click(seg('Day'))
  expect(onChange).not.toHaveBeenCalled()
})

test('a value that matches no option presses nothing', () => {
  render(<SegmentedControl options={OPTIONS} value="year" label="Range" />)
  expect(pressed()).toEqual([])
})

test('a parent that ignores onChange keeps the old selection on screen', async () => {
  render(<SegmentedControl options={OPTIONS} value="day" label="Range" onChange={() => {}} />)

  await userEvent.click(seg('Week'))
  expect(pressed()).toEqual(['Day'])
})
