import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import RangeSelect from './RangeSelect'

const ROWS = ['One', 'Two', 'Three', 'Four', 'Five'].map((label, i) => ({
  id: `r${i + 1}`,
  label,
}))

const row = (label) => screen.getByRole('button', { name: label })
const click = (label) => fireEvent.click(row(label))
const shiftClick = (label) => fireEvent.click(row(label), { shiftKey: true })

const pressed = () =>
  screen
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.textContent)

const last = (onChange) => onChange.mock.calls.at(-1)[0]

test('a plain click selects just that row', () => {
  const onChange = vi.fn()
  render(<RangeSelect rows={ROWS} onChange={onChange} />)

  click('Three')

  expect(pressed()).toEqual(['Three'])
  expect(last(onChange)).toEqual(['r3'])
})

test('shift-click fills in from the anchor downwards', () => {
  const onChange = vi.fn()
  render(<RangeSelect rows={ROWS} onChange={onChange} />)

  click('Two')
  shiftClick('Four')

  expect(pressed()).toEqual(['Two', 'Three', 'Four'])
  expect(last(onChange)).toEqual(['r2', 'r3', 'r4'])
})

test('shift-click fills in upwards just the same', () => {
  render(<RangeSelect rows={ROWS} onChange={() => {}} />)

  click('Four')
  shiftClick('Two')

  expect(pressed()).toEqual(['Two', 'Three', 'Four'])
})

test('a second shift-click is measured from the same anchor', () => {
  render(<RangeSelect rows={ROWS} onChange={() => {}} />)

  click('Four')
  shiftClick('Two')
  shiftClick('Five')

  expect(pressed()).toEqual(['Four', 'Five'])
})

test('a plain click starts again, and moves the anchor', () => {
  render(<RangeSelect rows={ROWS} onChange={() => {}} />)

  click('One')
  shiftClick('Four')
  click('Three')

  expect(pressed()).toEqual(['Three'])

  shiftClick('Five')
  expect(pressed()).toEqual(['Three', 'Four', 'Five'])
})

test('shift-click with no anchor yet is just a click', () => {
  render(<RangeSelect rows={ROWS} onChange={() => {}} />)

  shiftClick('Three')

  expect(pressed()).toEqual(['Three'])
})
