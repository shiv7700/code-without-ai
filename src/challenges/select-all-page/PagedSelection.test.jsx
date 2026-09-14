import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import PagedSelection from './PagedSelection'

const ROWS = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Alan' },
  { id: 3, name: 'Grace' },
  { id: 4, name: 'Edsger' },
  { id: 5, name: 'Barbara' },
]

const header = () =>
  screen.getByRole('checkbox', { name: 'Select all on this page' })
const row = (name) => screen.getByRole('checkbox', { name })
const next = () => screen.getByRole('button', { name: 'Next page' })

test('shows one page at a time with nothing chosen', () => {
  render(<PagedSelection rows={ROWS} />)

  expect(screen.getByRole('checkbox', { name: 'Ada' })).not.toBeChecked()
  expect(screen.queryByRole('checkbox', { name: 'Grace' })).toBeNull()
  expect(header()).not.toBeChecked()
  expect(screen.getByText('0 selected')).toBeInTheDocument()
})

test('the header takes the whole page, and gives it back', async () => {
  render(<PagedSelection rows={ROWS} />)

  await userEvent.click(header())
  expect(row('Ada')).toBeChecked()
  expect(row('Alan')).toBeChecked()
  expect(screen.getByText('2 selected')).toBeInTheDocument()

  await userEvent.click(header())
  expect(row('Ada')).not.toBeChecked()
  expect(screen.getByText('0 selected')).toBeInTheDocument()
})

test('half a page shows the header in its third state', async () => {
  render(<PagedSelection rows={ROWS} />)

  await userEvent.click(row('Ada'))
  expect(header()).toBePartiallyChecked()

  await userEvent.click(row('Alan'))
  expect(header()).toBeChecked()
  expect(header()).not.toBePartiallyChecked()
})

test('the header speaks for the page in view, not the table', async () => {
  render(<PagedSelection rows={ROWS} />)

  await userEvent.click(header())
  await userEvent.click(next())

  expect(header()).not.toBeChecked()
  expect(header()).not.toBePartiallyChecked()
  expect(screen.getByText('2 selected')).toBeInTheDocument()
})

test('clearing a page leaves the other pages alone', async () => {
  render(<PagedSelection rows={ROWS} />)

  await userEvent.click(header())
  await userEvent.click(next())
  await userEvent.click(header())
  expect(screen.getByText('4 selected')).toBeInTheDocument()

  await userEvent.click(header())
  expect(screen.getByText('2 selected')).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Previous page' }))
  expect(header()).toBeChecked()
  expect(row('Ada')).toBeChecked()
})

test('choices survive a trip to another page and back', async () => {
  render(<PagedSelection rows={ROWS} />)

  await userEvent.click(row('Alan'))
  await userEvent.click(next())
  await userEvent.click(row('Grace'))
  await userEvent.click(screen.getByRole('button', { name: 'Previous page' }))

  expect(row('Alan')).toBeChecked()
  expect(row('Ada')).not.toBeChecked()
  expect(header()).toBePartiallyChecked()
  expect(screen.getByText('2 selected')).toBeInTheDocument()
})
