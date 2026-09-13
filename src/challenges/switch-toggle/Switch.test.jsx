import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Switch from './Switch'

const sw = () => screen.getByRole('switch')

test('announces itself as a labelled switch', () => {
  render(<Switch label="Wi-Fi" />)

  expect(sw()).toHaveAccessibleName('Wi-Fi')
  expect(sw()).toHaveAttribute('aria-checked', 'false')
})

test('aria-checked follows the checked prop', () => {
  render(<Switch label="Wi-Fi" checked />)
  expect(sw()).toHaveAttribute('aria-checked', 'true')
})

test('clicking reports the opposite value', async () => {
  const onChange = vi.fn()
  render(<Switch label="Wi-Fi" checked onChange={onChange} />)

  await userEvent.click(sw())
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(false)
})

test('Space toggles it too', async () => {
  const onChange = vi.fn()
  render(<Switch label="Wi-Fi" onChange={onChange} />)

  sw().focus()
  await userEvent.keyboard(' ')
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(true)
})

test('one Tab reaches it', async () => {
  render(<Switch label="Wi-Fi" />)

  await userEvent.tab()
  expect(sw()).toHaveFocus()
})

test('a parent that ignores onChange leaves it alone', async () => {
  render(<Switch label="Wi-Fi" checked={false} onChange={() => {}} />)

  await userEvent.click(sw())
  expect(sw()).toHaveAttribute('aria-checked', 'false')
})
