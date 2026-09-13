import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Wordle from './Wordle'

const setup = (answer = 'ERASE', maxGuesses = 6) => {
  const user = userEvent.setup()
  render(<Wordle answer={answer} maxGuesses={maxGuesses} />)

  return {
    user,
    guess: async (word) => {
      await user.type(screen.getByLabelText('Guess'), word)
      await user.click(screen.getByRole('button', { name: 'Submit' }))
    },
  }
}

const row = (n) => within(screen.getAllByTestId('row')[n])
const states = (n) => row(n).getAllByTestId('tile').map((t) => t.dataset.state)
const letters = (n) => row(n).getAllByTestId('tile').map((t) => t.textContent).join('')

test('starts with an empty grid of the right size', () => {
  setup('ERASE', 4)
  expect(screen.getAllByTestId('row')).toHaveLength(4)
  expect(screen.getAllByTestId('tile')).toHaveLength(20)
  expect(states(0)).toEqual(Array(5).fill('empty'))
})

test('a guess fills the first row', async () => {
  const { guess } = setup()
  await guess('CRANE')

  expect(letters(0)).toBe('CRANE')
  expect(letters(1)).toBe('')
})

test('a letter in the right place is correct', async () => {
  const { guess } = setup('ERASE')
  await guess('EAGER')

  expect(states(0)[0]).toBe('correct')
})

test('a letter in the word but the wrong place is present', async () => {
  const { guess } = setup('ERASE')
  await guess('SHOUT')

  expect(states(0)).toEqual(['present', 'absent', 'absent', 'absent', 'absent'])
})

test('a letter that is not there at all is absent', async () => {
  const { guess } = setup('ERASE')
  await guess('MUMPS')

  expect(states(0).slice(0, 4)).toEqual(['absent', 'absent', 'absent', 'absent'])
})

test('a repeated letter only counts as often as it appears', async () => {
  const { guess } = setup('ERASE')
  await guess('SPEED')

  expect(states(0)).toEqual(['present', 'absent', 'present', 'present', 'absent'])
})

test('a repeat lined up correctly claims its letter first', async () => {
  const { guess } = setup('ABBEY')
  await guess('BOBBY')

  expect(states(0)).toEqual(['present', 'absent', 'correct', 'absent', 'correct'])
})

test('a guess of the wrong length is rejected', async () => {
  const { guess } = setup()
  await guess('CAT')

  expect(screen.getByRole('alert')).toHaveTextContent('Guesses are 5 letters')
  expect(letters(0)).toBe('')
})

test('guessing the answer wins', async () => {
  const { guess } = setup('ERASE')
  await guess('ERASE')

  expect(screen.getByText('You win')).toBeInTheDocument()
  expect(states(0)).toEqual(Array(5).fill('correct'))
})

test('the game is over once it is won', async () => {
  const { guess } = setup('ERASE')
  await guess('ERASE')

  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
})

test('running out of guesses loses, and gives the answer away', async () => {
  const { guess } = setup('ERASE', 2)
  await guess('CRANE')
  await guess('SHOUT')

  expect(screen.getByText('You lose — it was ERASE')).toBeInTheDocument()
})

test('guesses stack up in order', async () => {
  const { guess } = setup('ERASE', 3)
  await guess('CRANE')
  await guess('SHOUT')

  expect(letters(0)).toBe('CRANE')
  expect(letters(1)).toBe('SHOUT')
  expect(letters(2)).toBe('')
})
