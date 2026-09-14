import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SwatchPicker from './SwatchPicker'

const COLOURS = [
  { value: 'r', name: 'Red' },
  { value: 'g', name: 'Green' },
  { value: 'b', name: 'Blue' },
]

const swatch = (name) => screen.getByRole('radio', { name })

const show = (props = {}) =>
  render(
    <>
      <SwatchPicker colours={COLOURS} onChange={() => {}} {...props} />
      <button type="button">After</button>
    </>,
  )

test('every swatch is a named radio in a named group', () => {
  show({ value: 'g' })

  expect(screen.getByRole('radiogroup')).toHaveAccessibleName('Colour')
  expect(screen.getAllByRole('radio')).toHaveLength(3)
  expect(swatch('Green')).toHaveAttribute('aria-checked', 'true')
  expect(swatch('Red')).toHaveAttribute('aria-checked', 'false')
})

test('the whole group is one tab stop', async () => {
  show({ value: 'g' })

  await userEvent.tab()
  expect(swatch('Green')).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
})

test('clicking chooses', async () => {
  const onChange = vi.fn()
  show({ value: 'r', onChange })

  await userEvent.click(swatch('Blue'))
  expect(onChange).toHaveBeenCalledWith('b')
})

test('arrows move and choose, wrapping both ways', async () => {
  const onChange = vi.fn()
  show({ value: 'r', onChange })
  swatch('Red').focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(swatch('Green')).toHaveFocus()
  expect(onChange).toHaveBeenLastCalledWith('g')

  swatch('Blue').focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(swatch('Red')).toHaveFocus()
  expect(onChange).toHaveBeenLastCalledWith('r')

  await userEvent.keyboard('{ArrowLeft}')
  expect(swatch('Blue')).toHaveFocus()
  expect(onChange).toHaveBeenLastCalledWith('b')
})

test('a parent that ignores onChange leaves the choice alone', async () => {
  show({ value: 'r' })

  await userEvent.click(swatch('Blue'))
  expect(swatch('Red')).toHaveAttribute('aria-checked', 'true')
  expect(swatch('Blue')).toHaveAttribute('aria-checked', 'false')
})

test('with nothing chosen the group is still reachable, and Space chooses', async () => {
  const onChange = vi.fn()
  show({ value: null, onChange })

  expect(screen.queryByRole('radio', { checked: true })).toBeNull()

  await userEvent.tab()
  expect(swatch('Red')).toHaveFocus()

  await userEvent.keyboard(' ')
  expect(onChange).toHaveBeenCalledWith('r')
})
