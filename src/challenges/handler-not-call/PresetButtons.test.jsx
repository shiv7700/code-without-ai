import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import PresetButtons from './PresetButtons'

const PRESETS = [5, 25, 100]

const total = () => screen.getByTestId('total')
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

test('renders one button per preset', () => {
  render(<PresetButtons presets={PRESETS} onPick={() => {}} />)
  expect(screen.getAllByRole('button')).toHaveLength(3)
})

test('nothing has happened before the first click', () => {
  const onPick = vi.fn()
  render(<PresetButtons presets={PRESETS} onPick={onPick} />)

  expect(total()).toHaveTextContent('0')
  expect(onPick).not.toHaveBeenCalled()
})

test('clicking adds that amount to the total', async () => {
  render(<PresetButtons presets={PRESETS} onPick={() => {}} />)

  await click('+25')
  expect(total()).toHaveTextContent('25')
})

test('each button carries its own amount', async () => {
  const onPick = vi.fn()
  render(<PresetButtons presets={PRESETS} onPick={onPick} />)

  await click('+100')
  expect(onPick).toHaveBeenCalledTimes(1)
  expect(onPick).toHaveBeenCalledWith(100)
})

test('the amounts add up over several clicks', async () => {
  render(<PresetButtons presets={PRESETS} onPick={() => {}} />)

  await click('+5')
  await click('+25')
  await click('+5')
  expect(total()).toHaveTextContent('35')
})
