import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import KeyboardRating from './KeyboardRating'

const slider = () => screen.getByRole('slider')

const withNeighbour = (props = {}) =>
  render(
    <>
      <KeyboardRating {...props} />
      <button type="button">After</button>
    </>,
  )

test('exposes itself as a named slider with a range', () => {
  render(<KeyboardRating value={3} />)

  expect(slider()).toHaveAccessibleName('Rating')
  expect(slider()).toHaveAttribute('aria-valuemin', '0')
  expect(slider()).toHaveAttribute('aria-valuemax', '5')
  expect(slider()).toHaveAttribute('aria-valuenow', '3')
  expect(slider()).toHaveAttribute('aria-valuetext', '3 of 5')
})

test('the whole rating is one tab stop', async () => {
  withNeighbour({ value: 3 })

  await userEvent.tab()
  expect(slider()).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
})

test('arrows move the value by one, both ways', async () => {
  const onChange = vi.fn()
  render(<KeyboardRating value={3} onChange={onChange} />)
  slider().focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenLastCalledWith(4)

  await userEvent.keyboard('{ArrowDown}')
  expect(onChange).toHaveBeenLastCalledWith(2)

  await userEvent.keyboard('{ArrowUp}')
  expect(onChange).toHaveBeenLastCalledWith(4)

  await userEvent.keyboard('{ArrowLeft}')
  expect(onChange).toHaveBeenLastCalledWith(2)
})

test('Home and End jump to the ends', async () => {
  const onChange = vi.fn()
  render(<KeyboardRating value={3} onChange={onChange} />)
  slider().focus()

  await userEvent.keyboard('{Home}')
  expect(onChange).toHaveBeenLastCalledWith(0)

  await userEvent.keyboard('{End}')
  expect(onChange).toHaveBeenLastCalledWith(5)
})

test('it clamps, and a no-op reports nothing', async () => {
  const onChange = vi.fn()
  const { rerender } = render(<KeyboardRating value={5} onChange={onChange} />)
  slider().focus()

  await userEvent.keyboard('{ArrowRight}{End}')
  expect(onChange).not.toHaveBeenCalled()

  rerender(<KeyboardRating value={0} onChange={onChange} />)
  slider().focus()
  await userEvent.keyboard('{ArrowLeft}{Home}')
  expect(onChange).not.toHaveBeenCalled()
})

test('a parent that ignores onChange leaves the value where it was', async () => {
  render(<KeyboardRating value={2} onChange={() => {}} />)
  slider().focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(slider()).toHaveAttribute('aria-valuenow', '2')
})
