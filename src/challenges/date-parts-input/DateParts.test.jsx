import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import DateParts from './DateParts'

const part = (name) => screen.getByLabelText(name)

test('three labelled boxes, in reading order', () => {
  render(<DateParts onChange={() => {}} />)

  const boxes = screen.getAllByRole('textbox')
  expect(boxes).toHaveLength(3)
  expect(boxes[0]).toBe(part('Day'))
  expect(boxes[1]).toBe(part('Month'))
  expect(boxes[2]).toBe(part('Year'))
})

test('only digits survive, and only as many as fit', async () => {
  render(<DateParts onChange={() => {}} />)

  await userEvent.type(part('Year'), '2a0-24x')
  expect(part('Year')).toHaveValue('2024')
})

test('filling a box hands the focus to the next one', async () => {
  render(<DateParts onChange={() => {}} />)

  await userEvent.type(part('Day'), '12')
  expect(part('Month')).toHaveFocus()

  await userEvent.type(part('Month'), '05')
  expect(part('Year')).toHaveFocus()
})

test('the year keeps the focus, having nowhere to pass it', async () => {
  render(<DateParts onChange={() => {}} />)

  await userEvent.type(part('Year'), '2024')
  expect(part('Year')).toHaveFocus()
})

test('Backspace in an empty box steps back and deletes nothing', async () => {
  render(<DateParts onChange={() => {}} />)

  await userEvent.type(part('Day'), '12')
  await userEvent.keyboard('{Backspace}')

  expect(part('Day')).toHaveFocus()
  expect(part('Day')).toHaveValue('12')

  await userEvent.keyboard('{Backspace}')
  expect(part('Day')).toHaveValue('1')
})

test('the whole date is reported only once every box is full', async () => {
  const onChange = vi.fn()
  render(<DateParts onChange={onChange} />)

  await userEvent.type(part('Day'), '1205')
  expect(onChange).toHaveBeenLastCalledWith('')

  await userEvent.keyboard('2024')
  expect(onChange).toHaveBeenLastCalledWith('2024-05-12')

  await userEvent.keyboard('{Backspace}')
  expect(onChange).toHaveBeenLastCalledWith('')
})
