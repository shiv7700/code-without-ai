import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Calendar from './Calendar'

const setup = (month = '2026-02') => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(<Calendar month={month} onSelect={onSelect} />)
  return { user, onSelect }
}

const heading = () => screen.getByRole('heading').textContent
const cells = () => screen.getAllByTestId('cell').map((c) => c.textContent)
const days = () => cells().filter(Boolean)
const go = (user, direction) =>
  user.click(screen.getByRole('button', { name: `${direction} month` }))

test('names the month and year', () => {
  setup()
  expect(heading()).toBe('February 2026')
})

test('labels the weekdays, starting on Monday', () => {
  setup()
  expect(screen.getAllByTestId('weekday').map((d) => d.textContent)).toEqual([
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
  ])
})

test('has a cell for every day of the month', () => {
  setup()
  expect(days()).toEqual(Array.from({ length: 28 }, (_, i) => String(i + 1)))
})

test('pads the start so the 1st lands on its weekday', () => {
  setup()
  // 1 February 2026 is a Sunday, so six blanks come first.
  expect(cells().slice(0, 7)).toEqual(['', '', '', '', '', '', '1'])
})

test('the grid is always whole weeks', () => {
  setup()
  expect(cells().length % 7).toBe(0)
})

test('a 31-day month starting mid-week still fits', () => {
  setup('2026-01')
  expect(days()).toHaveLength(31)
  expect(cells().length % 7).toBe(0)
  // 1 January 2026 is a Thursday.
  expect(cells().slice(0, 4)).toEqual(['', '', '', '1'])
})

test('next moves a month on', async () => {
  const { user } = setup()
  await go(user, 'Next')

  expect(heading()).toBe('March 2026')
  expect(days()).toHaveLength(31)
})

test('previous moves a month back', async () => {
  const { user } = setup()
  await go(user, 'Previous')

  expect(heading()).toBe('January 2026')
})

test('december rolls into next january', async () => {
  const { user } = setup('2026-12')
  await go(user, 'Next')

  expect(heading()).toBe('January 2027')
})

test('january rolls back into last december', async () => {
  const { user } = setup('2026-01')
  await go(user, 'Previous')

  expect(heading()).toBe('December 2025')
})

test('february knows about leap years', async () => {
  const { user } = setup('2028-01')
  await go(user, 'Next')

  expect(days()).toHaveLength(29)
})

test('clicking a day reports it as an ISO date', async () => {
  const { user, onSelect } = setup()
  await user.click(screen.getByRole('button', { name: '9' }))

  expect(onSelect).toHaveBeenCalledWith('2026-02-09')
})
