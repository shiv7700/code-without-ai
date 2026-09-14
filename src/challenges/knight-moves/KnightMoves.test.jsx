import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import KnightMoves from './KnightMoves'

const setup = () => ({ user: userEvent.setup(), ...render(<KnightMoves />) })

const squares = () => screen.getAllByRole('button')
const square = (name) => screen.getByRole('button', { name })
const moves = () =>
  squares()
    .filter((b) => b.dataset.move === 'true')
    .map((b) => b.getAttribute('aria-label'))
    .sort()

test('renders the whole board, a8 in the corner it belongs in', () => {
  setup()
  const all = squares()
  expect(all).toHaveLength(64)
  expect(all[0]).toHaveAttribute('aria-label', 'a8')
  expect(all[63]).toHaveAttribute('aria-label', 'h1')
})

test('nothing is highlighted before a square is chosen', () => {
  setup()
  expect(moves()).toEqual([])
  expect(squares().filter((b) => b.dataset.knight === 'true')).toHaveLength(0)
})

test('a knight in the middle of the board has eight', async () => {
  const { user } = setup()
  await user.click(square('d4'))

  expect(square('d4')).toHaveAttribute('data-knight', 'true')
  expect(moves()).toEqual(['b3', 'b5', 'c2', 'c6', 'e2', 'e6', 'f3', 'f5'])
})

test('the square it stands on is not somewhere it can go', async () => {
  const { user } = setup()
  await user.click(square('d4'))

  expect(square('d4')).not.toHaveAttribute('data-move', 'true')
})

test('choosing another square picks the knight up', async () => {
  const { user } = setup()
  await user.click(square('d4'))
  await user.click(square('b1'))

  expect(square('d4')).not.toHaveAttribute('data-knight', 'true')
  expect(moves()).toEqual(['a3', 'c3', 'd2'])
})

test('a knight in the corner has two, and neither is across the board', async () => {
  const { user } = setup()
  await user.click(square('h1'))

  expect(moves()).toEqual(['f2', 'g3'])
})
