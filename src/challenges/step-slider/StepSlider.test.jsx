import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import StepSlider from './StepSlider'

const slider = () => screen.getByRole('slider')

test('exposes itself as a named slider with a range', () => {
  render(<StepSlider value={40} onChange={() => {}} />)

  expect(slider()).toHaveAccessibleName('Volume')
  expect(slider()).toHaveAttribute('aria-valuemin', '0')
  expect(slider()).toHaveAttribute('aria-valuemax', '100')
  expect(slider()).toHaveAttribute('aria-valuenow', '40')
})

test('it is a single tab stop', async () => {
  render(
    <>
      <StepSlider value={40} onChange={() => {}} />
      <button type="button">After</button>
    </>,
  )

  await userEvent.tab()
  expect(slider()).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
})

test('arrows move by one step, both ways', async () => {
  const onChange = vi.fn()
  render(<StepSlider value={40} onChange={onChange} step={5} />)
  slider().focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenLastCalledWith(45)

  await userEvent.keyboard('{ArrowDown}')
  expect(onChange).toHaveBeenLastCalledWith(35)
})

test('the page keys move ten steps, and the ends jump', async () => {
  const onChange = vi.fn()
  render(<StepSlider value={40} onChange={onChange} step={2} />)
  slider().focus()

  await userEvent.keyboard('{PageUp}')
  expect(onChange).toHaveBeenLastCalledWith(60)

  await userEvent.keyboard('{PageDown}')
  expect(onChange).toHaveBeenLastCalledWith(20)

  await userEvent.keyboard('{Home}')
  expect(onChange).toHaveBeenLastCalledWith(0)

  await userEvent.keyboard('{End}')
  expect(onChange).toHaveBeenLastCalledWith(100)
})

test('it clamps, and a move that changes nothing is not reported', async () => {
  const onChange = vi.fn()
  const { rerender } = render(
    <StepSlider value={95} onChange={onChange} step={10} />,
  )
  slider().focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenLastCalledWith(100)

  rerender(<StepSlider value={100} onChange={onChange} step={10} />)
  onChange.mockClear()
  await userEvent.keyboard('{ArrowRight}{PageUp}{End}')
  expect(onChange).not.toHaveBeenCalled()
})

test('a parent that ignores onChange leaves the slider where it was', async () => {
  render(<StepSlider value={40} onChange={() => {}} />)
  slider().focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(slider()).toHaveAttribute('aria-valuenow', '40')
})

test('a fractional step stays exact', async () => {
  const onChange = vi.fn()
  render(
    <StepSlider value={0.2} onChange={onChange} min={0} max={1} step={0.1} />,
  )
  slider().focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenLastCalledWith(0.3)

  await userEvent.keyboard('{ArrowLeft}')
  expect(onChange).toHaveBeenLastCalledWith(0.1)
})
