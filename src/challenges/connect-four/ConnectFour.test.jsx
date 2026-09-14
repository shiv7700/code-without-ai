import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import ConnectFour from './ConnectFour'

const setup = (props = {}) => ({
  user: userEvent.setup(),
  ...render(<ConnectFour {...props} />),
})

const status = () => screen.getByTestId('status').textContent.trim()
const cells = () =>
  screen.getAllByTestId('cell').map((c) => c.dataset.player || '.')
const at = (row, col, cols = 7) => cells()[row * cols + col]
const drop = (user, col) =>
  user.click(screen.getByRole('button', { name: `Drop in column ${col}` }))

test('an empty board, red to play', () => {
  setup()
  expect(cells()).toHaveLength(42)
  expect(cells().every((c) => c === '.')).toBe(true)
  expect(status()).toBe("Red's turn")
})

test('a disc falls to the bottom of the column', async () => {
  const { user } = setup()
  await drop(user, 1)

  expect(at(5, 0)).toBe('red')
  expect(at(4, 0)).toBe('.')
  expect(status()).toBe("Yellow's turn")
})

test('the next disc stacks on the one below', async () => {
  const { user } = setup()
  await drop(user, 1)
  await drop(user, 1)

  expect(at(5, 0)).toBe('red')
  expect(at(4, 0)).toBe('yellow')
})

test('four in a column wins it', async () => {
  const { user } = setup()
  for (const col of [1, 2, 1, 2, 1, 2, 1]) await drop(user, col)

  expect(status()).toBe('Red wins')
})

test('four on a rising diagonal wins it too', async () => {
  const { user } = setup()
  for (const col of [1, 2, 2, 3, 4, 3, 3, 4, 5, 4]) await drop(user, col)
  expect(status()).toBe("Red's turn")

  await drop(user, 4)
  expect(status()).toBe('Red wins')
})

test('the board is closed once someone has won', async () => {
  const { user } = setup()
  for (const col of [1, 2, 1, 2, 1, 2, 1]) await drop(user, col)
  await drop(user, 5)

  expect(status()).toBe('Red wins')
  expect(at(5, 4)).toBe('.')
})

test('a drop into a full column is not a move', async () => {
  const { user } = setup({ rows: 2 })
  await drop(user, 1)
  await drop(user, 1)
  expect(status()).toBe("Red's turn")

  await drop(user, 1)
  expect(status()).toBe("Red's turn")
  expect(at(0, 0)).toBe('yellow')
})
