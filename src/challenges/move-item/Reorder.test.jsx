import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Reorder from './Reorder'

const ITEMS = ['alpha', 'beta', 'gamma']

const labels = () =>
  screen
    .queryAllByRole('listitem')
    .map((li) => li.textContent.replace(/Up .*/, ''))

const move = (dir, item) =>
  userEvent.click(screen.getByRole('button', { name: `${dir} ${item}` }))

test('renders the starting order', () => {
  render(<Reorder initial={ITEMS} />)
  expect(labels()).toEqual(['alpha', 'beta', 'gamma'])
})

test('Down swaps a row with the one below it', async () => {
  render(<Reorder initial={ITEMS} />)

  await move('Down', 'alpha')
  expect(labels()).toEqual(['beta', 'alpha', 'gamma'])
})

test('Up swaps a row with the one above it', async () => {
  render(<Reorder initial={ITEMS} />)

  await move('Up', 'gamma')
  expect(labels()).toEqual(['alpha', 'gamma', 'beta'])
})

test('the ends are disabled', () => {
  render(<Reorder initial={ITEMS} />)

  expect(screen.getByRole('button', { name: 'Up alpha' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Down gamma' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Down alpha' })).toBeEnabled()
})

test('a row can walk all the way down', async () => {
  render(<Reorder initial={ITEMS} />)

  await move('Down', 'alpha')
  await move('Down', 'alpha')

  expect(labels()).toEqual(['beta', 'gamma', 'alpha'])
  expect(screen.getByRole('button', { name: 'Down alpha' })).toBeDisabled()
})

test('the list moves, and the array it was handed does not', async () => {
  const initial = [...ITEMS]
  render(<Reorder initial={initial} />)

  await move('Down', 'alpha')

  expect(labels()).toEqual(['beta', 'alpha', 'gamma'])
  expect(initial).toEqual(ITEMS)
})
