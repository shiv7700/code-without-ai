import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import Combobox from './Combobox'

const OPTIONS = ['Apple', 'Apricot', 'Avocado', 'Banana']

function Host() {
  const [value, setValue] = useState('')
  return <Combobox options={OPTIONS} value={value} onChange={setValue} />
}

const box = () => screen.getByRole('combobox')
const options = () => screen.getAllByRole('option')

test('starts closed, with no list in the document', () => {
  render(<Host />)

  expect(box()).toHaveAccessibleName('Fruit')
  expect(box()).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('typing opens the list and narrows it', async () => {
  render(<Host />)

  await userEvent.type(box(), 'ap')
  expect(box()).toHaveAttribute('aria-expanded', 'true')
  expect(options().map((o) => o.textContent)).toEqual(['Apple', 'Apricot'])
})

test('Enter takes the highlighted option and closes up', async () => {
  render(<Host />)

  await userEvent.type(box(), 'ap')
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')

  expect(box()).toHaveValue('Apricot')
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('Escape closes it and takes nothing', async () => {
  render(<Host />)

  await userEvent.type(box(), 'ap')
  await userEvent.keyboard('{ArrowDown}{Escape}')

  expect(box()).toHaveValue('ap')
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('clicking an option takes it', async () => {
  render(<Host />)

  await userEvent.type(box(), 'a')
  await userEvent.click(screen.getByRole('option', { name: 'Avocado' }))

  expect(box()).toHaveValue('Avocado')
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('nothing is highlighted until an arrow is pressed', async () => {
  render(<Host />)

  await userEvent.type(box(), 'a')
  expect(box()).not.toHaveAttribute('aria-activedescendant')
  expect(options().every((o) => o.getAttribute('aria-selected') === 'false')).toBe(
    true,
  )
})

test('the highlight moves without the focus ever leaving the text box', async () => {
  render(<Host />)

  await userEvent.type(box(), 'a')
  await userEvent.keyboard('{ArrowDown}{ArrowDown}')

  expect(box()).toHaveFocus()
  expect(box()).toHaveAttribute('aria-activedescendant', options()[1].id)
  expect(options()[1]).toHaveAttribute('aria-selected', 'true')
  expect(options()[0]).toHaveAttribute('aria-selected', 'false')

  await userEvent.keyboard('p')
  expect(box()).toHaveValue('ap')
})
