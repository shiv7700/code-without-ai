import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import PriceField from './PriceField'

const box = () => screen.getByLabelText('Price')
const parsed = () => screen.getByTestId('parsed').textContent
const last = (onChange) => onChange.mock.calls.at(-1)[0]

test('an empty box parses to nothing', () => {
  render(<PriceField onChange={() => {}} />)

  expect(box()).toHaveValue('')
  expect(parsed()).toBe('none')
})

test('a number is reported as a number', async () => {
  const onChange = vi.fn()
  render(<PriceField onChange={onChange} />)

  await userEvent.type(box(), '12')

  expect(box()).toHaveValue('12')
  expect(parsed()).toBe('12')
  expect(last(onChange)).toBe(12)
})

test('a decimal point survives being typed', async () => {
  render(<PriceField onChange={() => {}} />)

  await userEvent.type(box(), '3.')
  expect(box()).toHaveValue('3.')

  await userEvent.type(box(), '5')
  expect(box()).toHaveValue('3.5')
  expect(parsed()).toBe('3.5')
})

test('the box can be emptied again', async () => {
  const onChange = vi.fn()
  render(<PriceField onChange={onChange} />)

  await userEvent.type(box(), '40')
  await userEvent.clear(box())

  expect(box()).toHaveValue('')
  expect(parsed()).toBe('none')
  expect(last(onChange)).toBe(null)
})

test('a lone zero stays on screen', async () => {
  render(<PriceField onChange={() => {}} />)

  await userEvent.type(box(), '0')

  expect(box()).toHaveValue('0')
  expect(parsed()).toBe('0')
})

test('nonsense parses to nothing, and never to NaN', async () => {
  const onChange = vi.fn()
  render(<PriceField onChange={onChange} />)

  await userEvent.type(box(), '12abc')

  expect(box()).toHaveValue('12abc')
  expect(parsed()).toBe('none')
  expect(onChange.mock.calls.every(([v]) => v === null || Number.isFinite(v))).toBe(
    true,
  )
})
