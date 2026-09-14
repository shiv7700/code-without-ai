import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Minesweeper from './Minesweeper'

//  1 1 1 0
//  1 * 1 0
//  1 1 2 1
//  0 0 1 *
const BOARD = ['....', '.*..', '....', '...*']

const setup = (board = BOARD) => ({
  user: userEvent.setup(),
  ...render(<Minesweeper board={board} />),
})

const cell = (row, col) => screen.getByRole('button', { name: `${row},${col}` })
const open = () =>
  screen.getAllByRole('button').filter((b) => b.dataset.state === 'open')
const status = () => screen.getByTestId('status').textContent.trim()

test('every square starts face down', () => {
  setup()
  expect(screen.getAllByRole('button')).toHaveLength(16)
  expect(open()).toHaveLength(0)
  expect(status()).toBe('Playing')
})

test('a numbered square turns over on its own', async () => {
  const { user } = setup()
  await user.click(cell(0, 0))

  expect(cell(0, 0)).toHaveTextContent('1')
  expect(open()).toHaveLength(1)
})

test('a square with nothing next to it opens its whole neighbourhood', async () => {
  const { user } = setup()
  await user.click(cell(0, 3))

  expect(open()).toHaveLength(6)
  expect(cell(1, 3)).toHaveAttribute('data-state', 'open')
  expect(cell(2, 2)).toHaveTextContent('2')
})

test('the spread stops at the numbers instead of running past them', async () => {
  const { user } = setup()
  await user.click(cell(0, 3))

  expect(cell(0, 0)).toHaveAttribute('data-state', 'hidden')
  expect(cell(3, 0)).toHaveAttribute('data-state', 'hidden')
})

test('an empty square shows nothing at all', async () => {
  const { user } = setup()
  await user.click(cell(0, 3))

  expect(cell(0, 3)).toHaveTextContent('')
})

test('a mine ends it, and the board stops listening', async () => {
  const { user } = setup()
  await user.click(cell(1, 1))
  expect(status()).toBe('Boom')
  expect(cell(3, 3)).toHaveTextContent('*')

  await user.click(cell(0, 0))
  expect(cell(0, 0)).toHaveAttribute('data-state', 'hidden')
})

test('turning over every safe square clears the board', async () => {
  const { user } = setup()
  for (const [r, c] of [
    [0, 3],
    [3, 0],
    [0, 0],
    [0, 1],
    [1, 0],
  ])
    await user.click(cell(r, c))

  expect(open()).toHaveLength(14)
  expect(status()).toBe('Cleared')
})
