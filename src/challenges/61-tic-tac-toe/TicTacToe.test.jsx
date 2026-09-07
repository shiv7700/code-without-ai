import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TicTacToe from './TicTacToe'

const setup = () => {
  const user = userEvent.setup()
  render(<TicTacToe />)
  return {
    user,
    play: (...cells) => cells.reduce(
      (chain, n) => chain.then(() => user.click(screen.getByRole('button', { name: `Cell ${n}` }))),
      Promise.resolve(),
    ),
    cell: (n) => screen.getByRole('button', { name: `Cell ${n}` }).textContent,
    status: () => screen.getByTestId('status').textContent,
  }
}

test('starts on an empty board with X to play', () => {
  const game = setup()
  expect(game.status()).toBe('X to play')
  expect([1, 2, 3, 4, 5, 6, 7, 8, 9].map(game.cell)).toEqual(Array(9).fill(''))
})

test('the first move is an X', async () => {
  const game = setup()
  await game.play(5)

  expect(game.cell(5)).toBe('X')
  expect(game.status()).toBe('O to play')
})

test('turns alternate', async () => {
  const game = setup()
  await game.play(1, 2, 3)

  expect(game.cell(1)).toBe('X')
  expect(game.cell(2)).toBe('O')
  expect(game.cell(3)).toBe('X')
})

test('a taken square cannot be overwritten', async () => {
  const game = setup()
  await game.play(1, 1)

  expect(game.cell(1)).toBe('X')
  expect(game.status()).toBe('O to play')
})

test('three in a row across wins', async () => {
  const game = setup()
  await game.play(1, 4, 2, 5, 3)

  expect(game.status()).toBe('X wins')
})

test('a column wins too', async () => {
  const game = setup()
  await game.play(1, 2, 4, 5, 7)

  expect(game.status()).toBe('X wins')
})

test('so does a diagonal', async () => {
  const game = setup()
  await game.play(3, 1, 5, 2, 7)

  expect(game.status()).toBe('X wins')
})

test('the game stops once it is won', async () => {
  const game = setup()
  await game.play(1, 4, 2, 5, 3)
  await game.play(9)

  expect(game.cell(9)).toBe('')
  expect(game.status()).toBe('X wins')
})

test('a full board with no line is a draw', async () => {
  const game = setup()
  await game.play(1, 2, 3, 5, 4, 6, 8, 7, 9)

  expect(game.status()).toBe('Draw')
})

test('reset clears the board and gives X the move', async () => {
  const game = setup()
  await game.play(1, 2)
  await game.user.click(screen.getByRole('button', { name: 'Reset' }))

  expect([1, 2, 3, 4, 5, 6, 7, 8, 9].map(game.cell)).toEqual(Array(9).fill(''))
  expect(game.status()).toBe('X to play')
})
