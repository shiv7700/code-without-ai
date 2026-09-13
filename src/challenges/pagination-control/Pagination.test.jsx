import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Pagination from './Pagination'

const CONTROLS = ['First', 'Previous', 'Next', 'Last']
const btn = (name) => screen.getByRole('button', { name })
const pages = () =>
  screen
    .getAllByRole('button')
    .map((b) => b.textContent)
    .filter((t) => !CONTROLS.includes(t))

test('renders a labelled nav with the four controls', () => {
  render(<Pagination page={4} pageCount={10} />)

  expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
  CONTROLS.forEach((c) => expect(btn(c)).toBeInTheDocument())
})

test('the first page disables going back, the last disables going on', () => {
  const { rerender } = render(<Pagination page={1} pageCount={10} />)
  expect(btn('First')).toBeDisabled()
  expect(btn('Previous')).toBeDisabled()
  expect(btn('Next')).toBeEnabled()

  rerender(<Pagination page={10} pageCount={10} />)
  expect(btn('Next')).toBeDisabled()
  expect(btn('Last')).toBeDisabled()
  expect(btn('Previous')).toBeEnabled()
})

test('the window is centred on the current page', () => {
  render(<Pagination page={6} pageCount={10} />)

  expect(pages()).toEqual(['4', '5', '6', '7', '8'])
  expect(btn('6')).toHaveAttribute('aria-current', 'page')
})

test('near the start the window slides instead of shrinking', () => {
  render(<Pagination page={2} pageCount={10} />)
  expect(pages()).toEqual(['1', '2', '3', '4', '5'])
})

test('near the end it slides the other way', () => {
  render(<Pagination page={9} pageCount={10} />)
  expect(pages()).toEqual(['6', '7', '8', '9', '10'])
})

test('fewer pages than the window shows all of them, once', () => {
  render(<Pagination page={2} pageCount={3} />)
  expect(pages()).toEqual(['1', '2', '3'])
})

test('clicking reports the page it goes to, and the current one reports nothing', async () => {
  const onChange = vi.fn()
  render(<Pagination page={6} pageCount={10} onChange={onChange} />)

  await userEvent.click(btn('8'))
  expect(onChange).toHaveBeenLastCalledWith(8)

  await userEvent.click(btn('Previous'))
  expect(onChange).toHaveBeenLastCalledWith(5)

  await userEvent.click(btn('Last'))
  expect(onChange).toHaveBeenLastCalledWith(10)

  onChange.mockClear()
  await userEvent.click(btn('6'))
  expect(onChange).not.toHaveBeenCalled()
})
