import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TicTacToeN from './TicTacToeN'

const setup = (size = 4, inARow = 3) => {
  const user = userEvent.setup()
  render(<TicTacToeN size={size} inARow={inARow} />)

  return {
    user,
    play: async (...cells) => {
      for (const cell of cells) {
        await user.click(screen.getByRole('button', { name: `Cell ${cell}` }))
      }
    },
    jump: (label) => user.click(screen.getByRole('button', { name: label })),
    cell: (name) => screen.getByRole('button', { name: `Cell ${name}` }).textContent,
    status: () => screen.getByTestId('status').textContent,
    moves: () =>
      screen
        .getAllByRole('button')
        .map((b) => b.textContent)
        .filter((t) => t.startsWith('Go to')),
  }
}

test('builds a board of the size it was given', () => {
  setup(5, 4)
  expect(screen.getAllByRole('button', { name: /^Cell/ })).toHaveLength(25)
})

test('X plays first and turns alternate', async () => {
  const game = setup()
  await game.play('0,0', '1,1')

  expect(game.cell('0,0')).toBe('X')
  expect(game.cell('1,1')).toBe('O')
})

test('three in a row across wins when that is the rule', async () => {
  const game = setup(4, 3)
  await game.play('0,0', '3,3', '0,1', '3,2', '0,2')

  expect(game.status()).toBe('X wins')
})

test('a run shorter than the rule is not a win', async () => {
  const game = setup(4, 4)
  await game.play('0,0', '3,3', '0,1', '3,2', '0,2')

  expect(game.status()).toBe('O to play')
})

test('a column counts', async () => {
  const game = setup(4, 3)
  await game.play('0,1', '3,3', '1,1', '3,2', '2,1')

  expect(game.status()).toBe('X wins')
})

test('a diagonal counts', async () => {
  const game = setup(4, 3)
  await game.play('0,0', '3,3', '1,1', '3,2', '2,2')

  expect(game.status()).toBe('X wins')
})

test('the other diagonal counts too', async () => {
  const game = setup(4, 3)
  await game.play('0,2', '3,3', '1,1', '3,2', '2,0')

  expect(game.status()).toBe('X wins')
})

test('a run anywhere on the board counts, not just from a corner', async () => {
  const game = setup(5, 3)
  await game.play('2,1', '4,4', '2,2', '4,3', '2,3')

  expect(game.status()).toBe('X wins')
})

test('a run broken by the board edge does not wrap around', async () => {
  const game = setup(3, 3)
  await game.play('0,2', '2,2', '1,0', '2,1', '1,1')

  expect(game.status()).toBe('O to play')
})

test('history lists every move so far', async () => {
  const game = setup()
  await game.play('0,0', '1,1')

  expect(game.moves()).toEqual(['Go to start', 'Go to move 1', 'Go to move 2'])
})

test('jumping back restores that board', async () => {
  const game = setup()
  await game.play('0,0', '1,1')
  await game.jump('Go to move 1')

  expect(game.cell('0,0')).toBe('X')
  expect(game.cell('1,1')).toBe('')
})

test('jumping back also restores whose turn it is', async () => {
  const game = setup()
  await game.play('0,0', '1,1')
  await game.jump('Go to move 1')

  expect(game.status()).toBe('O to play')
})

test('going to the start empties the board', async () => {
  const game = setup()
  await game.play('0,0', '1,1')
  await game.jump('Go to start')

  expect(game.cell('0,0')).toBe('')
  expect(game.status()).toBe('X to play')
})

test('playing after a jump drops the abandoned future', async () => {
  const game = setup()
  await game.play('0,0', '1,1', '2,2')
  await game.jump('Go to move 1')
  await game.play('3,3')

  expect(game.moves()).toEqual(['Go to start', 'Go to move 1', 'Go to move 2'])
  expect(game.cell('1,1')).toBe('')
  expect(game.cell('3,3')).toBe('O')
})

test('a won game accepts no more moves', async () => {
  const game = setup(4, 3)
  await game.play('0,0', '3,3', '0,1', '3,2', '0,2')
  await game.play('1,0')

  expect(game.cell('1,0')).toBe('')
})
