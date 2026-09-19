import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import QuickAdd from './QuickAdd'

const field = () => screen.getByLabelText('New item')
const items = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('starts with an empty list', () => {
  render(<QuickAdd />)
  expect(items()).toEqual([])
})

test('Enter adds what was typed', async () => {
  render(<QuickAdd />)
  await userEvent.type(field(), 'milk{Enter}')
  expect(items()).toEqual(['milk'])
})

test('the box is empty again afterwards', async () => {
  render(<QuickAdd />)
  await userEvent.type(field(), 'milk{Enter}')
  expect(field()).toHaveValue('')
})

test('typing without Enter adds nothing', async () => {
  render(<QuickAdd />)
  await userEvent.type(field(), 'milk')
  expect(items()).toEqual([])
})

test('the item is stored trimmed', async () => {
  render(<QuickAdd />)
  await userEvent.type(field(), '  milk  {Enter}')
  expect(items()).toEqual(['milk'])
})

test('Enter on nothing but spaces adds nothing', async () => {
  render(<QuickAdd />)
  await userEvent.type(field(), '   {Enter}')
  expect(items()).toEqual([])
})

test('adding twice keeps both, in order', async () => {
  render(<QuickAdd />)
  await userEvent.type(field(), 'milk{Enter}')
  await userEvent.type(field(), 'eggs{Enter}')
  expect(items()).toEqual(['milk', 'eggs'])
})
