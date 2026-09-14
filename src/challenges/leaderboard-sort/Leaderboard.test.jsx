import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Leaderboard from './Leaderboard'

const PLAYERS = [
  { id: 1, name: 'Zoe', score: 30 },
  { id: 2, name: 'Ada', score: 50 },
  { id: 3, name: 'Bob', score: 30 },
  { id: 4, name: 'Cid', score: 10 },
]

const setup = (players = PLAYERS) => ({
  user: userEvent.setup(),
  ...render(<Leaderboard players={players} />),
})

const rows = () =>
  screen.getAllByTestId('row').map((li) => li.textContent.replace(/\s+/g, ' ').trim())
const byName = () => screen.getByRole('button', { name: 'By name' })

test('the highest score is at the top', () => {
  setup()
  expect(rows()[0]).toBe('1 Ada 50')
})

test('equal scores are ordered by name', () => {
  setup()
  expect(rows()).toEqual(['1 Ada 50', '2 Bob 30', '2 Zoe 30', '4 Cid 10'])
})

test('the score order is the one you start on', () => {
  setup()
  expect(screen.getByRole('button', { name: 'By score' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('sorting by name reorders the rows', async () => {
  const { user } = setup()
  await user.click(byName())

  expect(rows().map((r) => r.split(' ')[1])).toEqual(['Ada', 'Bob', 'Cid', 'Zoe'])
})

test('a rank is earned once and travels with the player', async () => {
  const { user } = setup()
  await user.click(byName())

  expect(rows()).toEqual(['1 Ada 50', '2 Bob 30', '4 Cid 10', '2 Zoe 30'])
})

test('one player alone is first', () => {
  setup([{ id: 9, name: 'Solo', score: 7 }])
  expect(rows()).toEqual(['1 Solo 7'])
})

test('the players you were handed are left exactly as they were', async () => {
  const original = PLAYERS.map((p) => ({ ...p }))
  const { user } = setup()
  await user.click(byName())

  expect(PLAYERS).toEqual(original)
})
