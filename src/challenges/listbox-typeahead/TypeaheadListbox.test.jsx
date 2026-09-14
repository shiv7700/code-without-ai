import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import TypeaheadListbox from './TypeaheadListbox'

const OPTIONS = ['Apple', 'Avocado', 'Banana', 'Blackberry', 'Cherry']

function clock(start = 1000) {
  const time = { at: start }
  return { now: () => time.at, pass: (ms) => (time.at += ms) }
}

function Host({ now, initial = 'Apple' }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <TypeaheadListbox
        options={OPTIONS}
        value={value}
        onChange={setValue}
        now={now}
        timeout={500}
      />
      <button type="button">After</button>
    </>
  )
}

const option = (name) => screen.getByRole('option', { name })
const chosen = () => screen.getByRole('option', { selected: true }).textContent

test('a named listbox with the chosen option marked', () => {
  render(<Host now={clock().now} />)

  expect(screen.getByRole('listbox')).toHaveAccessibleName('Fruit')
  expect(screen.getAllByRole('option')).toHaveLength(5)
  expect(chosen()).toBe('Apple')
})

test('the whole list is one tab stop', async () => {
  render(<Host now={clock().now} initial="Banana" />)

  await userEvent.tab()
  expect(option('Banana')).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
})

test('arrows move one at a time and stop at the ends', async () => {
  render(<Host now={clock().now} />)
  option('Apple').focus()

  await userEvent.keyboard('{ArrowUp}')
  expect(chosen()).toBe('Apple')

  await userEvent.keyboard('{ArrowDown}{ArrowDown}')
  expect(chosen()).toBe('Banana')
  expect(option('Banana')).toHaveFocus()

  await userEvent.keyboard('{End}')
  expect(chosen()).toBe('Cherry')

  await userEvent.keyboard('{ArrowDown}')
  expect(chosen()).toBe('Cherry')
})

test('a letter jumps to the first option that starts with it', async () => {
  render(<Host now={clock().now} />)
  option('Apple').focus()

  await userEvent.keyboard('c')
  expect(chosen()).toBe('Cherry')

  await userEvent.keyboard('z')
  expect(chosen()).toBe('Cherry')
})

test('letters typed together build one search', async () => {
  const time = clock()
  render(<Host now={time.now} />)
  option('Apple').focus()

  await userEvent.keyboard('bl')
  expect(chosen()).toBe('Blackberry')

  time.pass(600)
  await userEvent.keyboard('av')
  expect(chosen()).toBe('Avocado')
})

test('a pause starts the search again', async () => {
  const time = clock()
  render(<Host now={time.now} />)
  option('Apple').focus()

  await userEvent.keyboard('a')
  expect(chosen()).toBe('Apple')

  time.pass(600)
  await userEvent.keyboard('b')
  expect(chosen()).toBe('Banana')
})
