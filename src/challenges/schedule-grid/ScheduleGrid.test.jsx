import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import ScheduleGrid from './ScheduleGrid'

const DAYS = ['Mon', 'Tue', 'Wed']
const SLOTS = ['09:00', '10:00', '11:00']

const setup = () => render(<ScheduleGrid days={DAYS} slots={SLOTS} />)

const cell = (day, slot) => screen.getByRole('button', { name: `${day} ${slot}` })
const chosen = () =>
  screen
    .getAllByRole('button')
    .filter((b) => b.dataset.selected === 'true')
    .map((b) => b.getAttribute('aria-label'))

const drag = (from, to) => {
  fireEvent.mouseDown(from)
  fireEvent.mouseEnter(to)
  fireEvent.mouseUp(to)
}

test('the grid is drawn and nothing is chosen', () => {
  setup()
  expect(screen.getAllByRole('button')).toHaveLength(9)
  expect(chosen()).toEqual([])
})

test('dragging across a row takes everything in between', () => {
  setup()
  drag(cell('Mon', '09:00'), cell('Wed', '09:00'))

  expect(chosen()).toEqual(['Mon 09:00', 'Tue 09:00', 'Wed 09:00'])
})

test('dragging down a column works the same way', () => {
  setup()
  drag(cell('Tue', '09:00'), cell('Tue', '11:00'))

  expect(chosen()).toEqual(['Tue 09:00', 'Tue 10:00', 'Tue 11:00'])
})

test('the pointer wandering over the grid on its own does nothing', () => {
  setup()
  fireEvent.mouseEnter(cell('Mon', '09:00'))
  fireEvent.mouseEnter(cell('Tue', '10:00'))

  expect(chosen()).toEqual([])
})

test('once you let go the grid stops following the pointer', () => {
  setup()
  drag(cell('Mon', '09:00'), cell('Mon', '09:00'))
  fireEvent.mouseEnter(cell('Wed', '11:00'))

  expect(chosen()).toEqual(['Mon 09:00'])
})

test('a second drag adds to what was already chosen', () => {
  setup()
  drag(cell('Mon', '09:00'), cell('Mon', '09:00'))
  drag(cell('Wed', '11:00'), cell('Wed', '11:00'))

  expect(chosen()).toEqual(['Mon 09:00', 'Wed 11:00'])
})

test('dragging the other way round picks the same block', () => {
  setup()
  drag(cell('Wed', '09:00'), cell('Mon', '09:00'))

  expect(chosen()).toEqual(['Mon 09:00', 'Tue 09:00', 'Wed 09:00'])
})
