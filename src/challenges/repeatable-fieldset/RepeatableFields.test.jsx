import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import RepeatableFields from './RepeatableFields'

const add = () => screen.getByRole('button', { name: 'Add email' })
const row = (n) => screen.getByLabelText(`Email ${n}`)

async function threeRows() {
  render(<RepeatableFields />)
  await userEvent.click(add())
  await userEvent.click(add())
  await userEvent.type(row(1), 'a@x.com')
  await userEvent.type(row(2), 'b@x.com')
  await userEvent.type(row(3), 'c@x.com')
}

test('starts with a single row that cannot be removed', () => {
  render(<RepeatableFields />)

  expect(screen.getAllByRole('textbox')).toHaveLength(1)
  expect(screen.getByRole('button', { name: 'Remove email 1' })).toBeDisabled()
})

test('adding a row keeps what is already typed', async () => {
  render(<RepeatableFields />)

  await userEvent.type(row(1), 'a@x.com')
  await userEvent.click(add())

  expect(row(1)).toHaveValue('a@x.com')
  expect(row(2)).toHaveValue('')
})

test('the rows renumber once there is more than one', async () => {
  await threeRows()

  expect(screen.getAllByRole('textbox')).toHaveLength(3)
  expect(
    screen.getByRole('button', { name: 'Remove email 3' }),
  ).toBeEnabled()
})

test('removing the last row leaves the ones above alone', async () => {
  await threeRows()

  await userEvent.click(screen.getByRole('button', { name: 'Remove email 3' }))

  expect(screen.getAllByRole('textbox')).toHaveLength(2)
  expect(row(1)).toHaveValue('a@x.com')
  expect(row(2)).toHaveValue('b@x.com')
})

test('removing the middle row keeps the others with their own values', async () => {
  await threeRows()

  await userEvent.click(screen.getByRole('button', { name: 'Remove email 2' }))

  expect(screen.getAllByRole('textbox')).toHaveLength(2)
  expect(row(1)).toHaveValue('a@x.com')
  expect(row(2)).toHaveValue('c@x.com')
})

test('removing the first row promotes the second, text and all', async () => {
  await threeRows()

  await userEvent.click(screen.getByRole('button', { name: 'Remove email 1' }))

  expect(row(1)).toHaveValue('b@x.com')
  expect(row(2)).toHaveValue('c@x.com')
})
