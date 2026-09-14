import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import VirtualListbox from './VirtualListbox'

const OPTIONS = Array.from({ length: 1000 }, (_, i) => `Item ${i}`)

const list = () => screen.getByRole('listbox')
const rows = () =>
  screen.getAllByRole('option').map((row) => row.textContent)

const scrollTo = (pixels) =>
  fireEvent.scroll(list(), { target: { scrollTop: pixels } })

const show = (props = {}) =>
  render(<VirtualListbox options={OPTIONS} onChange={() => {}} {...props} />)

test('renders only the rows that fit, and one more', () => {
  show()

  expect(list()).toHaveAccessibleName('Fruit')
  expect(rows()).toEqual([
    'Item 0',
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
  ])
})

test('each row says where it sits in the list nobody can see', () => {
  show()

  const third = screen.getByRole('option', { name: 'Item 2' })
  expect(third).toHaveAttribute('aria-posinset', '3')
  expect(third).toHaveAttribute('aria-setsize', '1000')
})

test('scrolling moves the window, and it stops at the end', () => {
  show()

  scrollTo(400)
  expect(rows()[0]).toBe('Item 20')
  expect(rows()).toHaveLength(6)

  scrollTo(19900)
  expect(rows()).toEqual([
    'Item 995',
    'Item 996',
    'Item 997',
    'Item 998',
    'Item 999',
  ])
})

test('clicking a row chooses it', async () => {
  const onChange = vi.fn()
  show({ onChange })

  await userEvent.click(screen.getByRole('option', { name: 'Item 3' }))
  expect(onChange).toHaveBeenCalledWith('Item 3')
})

test('the chosen row is rendered wherever it is, and only once', () => {
  show({ value: 'Item 900' })

  const chosen = screen.getByRole('option', { name: 'Item 900' })
  expect(chosen).toHaveAttribute('aria-selected', 'true')
  expect(chosen).toHaveAttribute('aria-posinset', '901')
  expect(screen.getAllByRole('option')).toHaveLength(7)

  scrollTo(18000)
  expect(rows()[0]).toBe('Item 900')
  expect(screen.getAllByRole('option')).toHaveLength(6)
})
