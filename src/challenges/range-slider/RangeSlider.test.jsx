import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import RangeSlider from './RangeSlider'

function Host({ initial = [20, 60], ...rest }) {
  const [value, setValue] = useState(initial)
  return <RangeSlider value={value} onChange={setValue} {...rest} />
}

const lower = () => screen.getByRole('slider', { name: 'Minimum' })
const upper = () => screen.getByRole('slider', { name: 'Maximum' })
const at = (el) => Number(el.getAttribute('aria-valuenow'))

test('two named thumbs, each a tab stop of its own', async () => {
  render(<Host />)

  await userEvent.tab()
  expect(lower()).toHaveFocus()

  await userEvent.tab()
  expect(upper()).toHaveFocus()
})

test('each thumb reports the range it can actually reach', () => {
  render(<Host />)

  expect(lower()).toHaveAttribute('aria-valuemin', '0')
  expect(lower()).toHaveAttribute('aria-valuemax', '60')
  expect(lower()).toHaveAttribute('aria-valuenow', '20')

  expect(upper()).toHaveAttribute('aria-valuemin', '20')
  expect(upper()).toHaveAttribute('aria-valuemax', '100')
})

test('arrows move the thumb they are pressed on', async () => {
  const onChange = vi.fn()
  render(<RangeSlider value={[20, 60]} onChange={onChange} step={5} />)

  lower().focus()
  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenLastCalledWith([25, 60])

  upper().focus()
  await userEvent.keyboard('{ArrowLeft}')
  expect(onChange).toHaveBeenLastCalledWith([20, 55])
})

test('the lower thumb stops dead against the upper one', async () => {
  render(<Host initial={[20, 25]} />)
  lower().focus()

  await userEvent.keyboard('{PageUp}')
  expect(at(lower())).toBe(25)
  expect(at(upper())).toBe(25)

  await userEvent.keyboard('{End}')
  expect(at(lower())).toBe(25)
  expect(at(upper())).toBe(25)
})

test('the upper thumb stops dead against the lower one', async () => {
  render(<Host initial={[40, 45]} />)
  upper().focus()

  await userEvent.keyboard('{PageDown}{Home}')
  expect(at(upper())).toBe(40)
  expect(at(lower())).toBe(40)
})

test('a move that changes nothing is not reported', async () => {
  const onChange = vi.fn()
  render(<RangeSlider value={[30, 30]} onChange={onChange} />)

  lower().focus()
  await userEvent.keyboard('{ArrowRight}{End}{PageUp}')
  upper().focus()
  await userEvent.keyboard('{ArrowLeft}{Home}{PageDown}')

  expect(onChange).not.toHaveBeenCalled()
})
