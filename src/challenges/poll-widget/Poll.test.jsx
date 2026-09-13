import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Poll from './Poll'

const OPTIONS = [
  { id: 'yes', label: 'Yes', votes: 2 },
  { id: 'no', label: 'No', votes: 1 },
  { id: 'maybe', label: 'Maybe', votes: 1 },
]

const setup = () => ({
  user: userEvent.setup(),
  ...render(<Poll question="Ship it?" options={OPTIONS} />),
})

const results = () =>
  screen.queryAllByTestId('result').map((r) => r.textContent.replace(/\s+/g, ' ').trim())
const total = () => screen.getByTestId('total').textContent

test('shows the question', () => {
  setup()
  expect(screen.getByRole('heading', { name: 'Ship it?' })).toBeInTheDocument()
})

test('offers every option as a button', () => {
  setup()
  expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
    'Yes',
    'No',
    'Maybe',
  ])
})

test('hides the results until you vote', () => {
  setup()
  expect(results()).toEqual([])
})

test('shows the running total before voting', () => {
  setup()
  expect(total()).toBe('4 votes')
})

test('voting reveals the results', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Yes' }))

  expect(results()).toEqual(['Yes 60%', 'No 20%', 'Maybe 20%'])
})

test('your own vote is counted', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'No' }))

  expect(total()).toBe('5 votes')
})

test('percentages are rounded to whole numbers', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Maybe' }))

  expect(results()).toEqual(['Yes 40%', 'No 20%', 'Maybe 40%'])
})

test('your choice is marked, and it is the only one', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'No' }))

  const chosen = screen.getAllByTestId('result').filter((r) => r.dataset.chosen === 'true')
  expect(chosen).toHaveLength(1)
  expect(chosen[0].textContent).toContain('No')
})

test('you cannot vote twice', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Yes' }))

  expect(screen.queryAllByRole('button')).toEqual([])
})
