import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import TemperatureConverter from './TemperatureConverter'

const c = () => screen.getByLabelText('Celsius')
const f = () => screen.getByLabelText('Fahrenheit')
const last = (onChange) => onChange.mock.calls.at(-1)[0]

test('both boxes start empty', () => {
  render(<TemperatureConverter onChange={() => {}} />)

  expect(c()).toHaveValue('')
  expect(f()).toHaveValue('')
})

test('Celsius fills Fahrenheit', async () => {
  render(<TemperatureConverter onChange={() => {}} />)

  await userEvent.type(c(), '100')
  expect(f()).toHaveValue('212')
})

test('Fahrenheit fills Celsius', async () => {
  render(<TemperatureConverter onChange={() => {}} />)

  await userEvent.type(f(), '32')
  expect(c()).toHaveValue('0')
})

test('what was typed is never rewritten by the conversion', async () => {
  const onChange = vi.fn()
  render(<TemperatureConverter onChange={onChange} />)

  await userEvent.type(c(), '36.6')

  expect(c()).toHaveValue('36.6')
  expect(f()).toHaveValue('98')
  expect(last(onChange)).toEqual({ value: '36.6', scale: 'c' })
})

test('emptying one box empties the other', async () => {
  render(<TemperatureConverter onChange={() => {}} />)

  await userEvent.type(c(), '20')
  await userEvent.clear(c())

  expect(c()).toHaveValue('')
  expect(f()).toHaveValue('')
})

test('text that is not a number converts to nothing', async () => {
  render(<TemperatureConverter onChange={() => {}} />)

  await userEvent.type(c(), 'warm')

  expect(c()).toHaveValue('warm')
  expect(f()).toHaveValue('')
})

test('the box you are typing in becomes the one that counts', async () => {
  render(<TemperatureConverter onChange={() => {}} />)

  await userEvent.type(c(), '100')
  await userEvent.clear(f())
  await userEvent.type(f(), '32')

  expect(c()).toHaveValue('0')
  expect(f()).toHaveValue('32')
})
