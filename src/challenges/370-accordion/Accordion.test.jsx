import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Accordion from './Accordion'

const ITEMS = [
  { id: 'a', title: 'First', body: 'Body one' },
  { id: 'b', title: 'Second', body: 'Body two' },
  { id: 'c', title: 'Third', body: 'Body three' },
]

const head = (name) => screen.getByRole('button', { name })
const click = (name) => userEvent.click(head(name))
const shown = (text) => screen.queryByText(text) !== null

test('renders a button per item', () => {
  render(<Accordion items={ITEMS} />)
  expect(screen.getAllByRole('button')).toHaveLength(3)
})

test('every panel starts closed', () => {
  render(<Accordion items={ITEMS} />)
  expect(shown('Body one')).toBe(false)
  expect(head(/first/i)).toHaveAttribute('aria-expanded', 'false')
})

test('clicking opens a panel', async () => {
  render(<Accordion items={ITEMS} />)

  await click(/first/i)
  expect(shown('Body one')).toBe(true)
  expect(head(/first/i)).toHaveAttribute('aria-expanded', 'true')
})

test('clicking an open panel closes it', async () => {
  render(<Accordion items={ITEMS} />)

  await click(/first/i)
  await click(/first/i)
  expect(shown('Body one')).toBe(false)
})

test('opening a second panel closes the first', async () => {
  render(<Accordion items={ITEMS} />)

  await click(/first/i)
  await click(/second/i)
  expect(shown('Body one')).toBe(false)
  expect(shown('Body two')).toBe(true)
})

test('allowMultiple keeps both open', async () => {
  render(<Accordion items={ITEMS} allowMultiple />)

  await click(/first/i)
  await click(/second/i)
  expect(shown('Body one')).toBe(true)
  expect(shown('Body two')).toBe(true)
})

test('allowMultiple still closes the one you click again', async () => {
  render(<Accordion items={ITEMS} allowMultiple />)

  await click(/first/i)
  await click(/second/i)
  await click(/first/i)
  expect(shown('Body one')).toBe(false)
  expect(shown('Body two')).toBe(true)
})
