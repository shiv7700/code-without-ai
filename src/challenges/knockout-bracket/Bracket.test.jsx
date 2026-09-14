import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Bracket from './Bracket'

const PLAYERS = ['Ada', 'Bob', 'Cid', 'Dee', 'Eve']

const setup = (players = PLAYERS) => ({
  user: userEvent.setup(),
  ...render(<Bracket players={players} />),
})

const inRound = (round) =>
  screen.getAllByTestId('match').filter((m) => m.dataset.round === String(round))
const matches = (round) =>
  inRound(round).map((m) =>
    [...m.children].map((seat) => seat.textContent.trim()).join(' '),
  )
const pick = (user, round, match, name) =>
  user.click(within(inRound(round)[match]).getByRole('button', { name }))
const champion = () => screen.queryByTestId('champion')?.textContent.trim()

test('the first round pairs them off in the order given', () => {
  setup()
  expect(matches(0).slice(0, 2)).toEqual(['Ada Bob', 'Cid Dee'])
})

test('the odd one out is through without playing', () => {
  setup()
  expect(matches(0)[2]).toBe('Eve bye')
  expect(matches(1)[1]).toBe('Eve bye')
})

test('a match nobody has played yet has two empty seats', () => {
  setup()
  expect(matches(1)[0]).toBe('TBD TBD')
})

test('choosing a winner sends them up a round', async () => {
  const { user } = setup()
  await pick(user, 0, 0, 'Ada')

  expect(matches(1)[0]).toBe('Ada TBD')
})

test('the rounds narrow down to one', () => {
  setup()
  expect(inRound(0)).toHaveLength(3)
  expect(inRound(1)).toHaveLength(2)
  expect(inRound(2)).toHaveLength(1)
  expect(champion()).toBeUndefined()
})

test('a bye carries on until there is somebody to play', async () => {
  const { user } = setup()
  await pick(user, 0, 0, 'Ada')
  await pick(user, 0, 1, 'Cid')
  await pick(user, 1, 0, 'Ada')

  expect(matches(2)[0]).toBe('Ada Eve')
})

test('the last one standing is the champion', async () => {
  const { user } = setup()
  await pick(user, 0, 0, 'Ada')
  await pick(user, 0, 1, 'Cid')
  await pick(user, 1, 0, 'Ada')
  await pick(user, 2, 0, 'Eve')

  expect(champion()).toBe('Eve')
})
