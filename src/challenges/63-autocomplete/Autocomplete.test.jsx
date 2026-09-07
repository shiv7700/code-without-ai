import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Autocomplete from './Autocomplete'

const OPTIONS = ['Apple', 'Apricot', 'Banana', 'Cherry']

const setup = () => {
  const user = userEvent.setup()
  render(<Autocomplete options={OPTIONS} />)
  return { user, input: screen.getByRole('combobox') }
}

const shown = () => screen.queryAllByRole('option').map((o) => o.textContent)
const activeOption = () =>
  screen.queryAllByRole('option').find((o) => o.getAttribute('aria-selected') === 'true')
    ?.textContent

test('no list until you type', () => {
  setup()
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('typing opens the list', async () => {
  const { user, input } = setup()
  await user.type(input, 'a')

  expect(screen.getByRole('listbox')).toBeInTheDocument()
})

test('filters as a case-insensitive substring', async () => {
  const { user, input } = setup()
  await user.type(input, 'ap')

  expect(shown()).toEqual(['Apple', 'Apricot'])
})

test('a substring anywhere counts, not just the start', async () => {
  const { user, input } = setup()
  await user.type(input, 'an')

  expect(shown()).toEqual(['Banana'])
})

test('says so when nothing matches', async () => {
  const { user, input } = setup()
  await user.type(input, 'zzz')

  expect(screen.getByText('No results')).toBeInTheDocument()
  expect(screen.queryByRole('option')).not.toBeInTheDocument()
})

test('the first match starts active', async () => {
  const { user, input } = setup()
  await user.type(input, 'a')

  expect(activeOption()).toBe('Apple')
})

test('arrow down walks the list', async () => {
  const { user, input } = setup()
  await user.type(input, 'ap')
  await user.keyboard('{ArrowDown}')

  expect(activeOption()).toBe('Apricot')
})

test('arrow down wraps at the bottom, arrow up at the top', async () => {
  const { user, input } = setup()
  await user.type(input, 'ap')
  await user.keyboard('{ArrowDown}{ArrowDown}')
  expect(activeOption()).toBe('Apple')

  await user.keyboard('{ArrowUp}')
  expect(activeOption()).toBe('Apricot')
})

test('enter picks the active option and closes the list', async () => {
  const { user, input } = setup()
  await user.type(input, 'ap')
  await user.keyboard('{ArrowDown}{Enter}')

  expect(input).toHaveValue('Apricot')
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('clicking an option picks it', async () => {
  const { user, input } = setup()
  await user.type(input, 'a')
  await user.click(screen.getByRole('option', { name: 'Banana' }))

  expect(input).toHaveValue('Banana')
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
})

test('escape closes the list without changing the text', async () => {
  const { user, input } = setup()
  await user.type(input, 'ap')
  await user.keyboard('{Escape}')

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  expect(input).toHaveValue('ap')
})

test('typing again reopens it and resets the active option', async () => {
  const { user, input } = setup()
  await user.type(input, 'ap')
  await user.keyboard('{ArrowDown}{Escape}')
  await user.type(input, 'r')

  expect(shown()).toEqual(['Apricot'])
  expect(activeOption()).toBe('Apricot')
})
