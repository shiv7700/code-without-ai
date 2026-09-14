import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import BranchingForm from './BranchingForm'

const setup = () => {
  const user = userEvent.setup()
  render(<BranchingForm />)
  return {
    user,
    next: () => user.click(screen.getByRole('button', { name: 'Next' })),
    back: () => user.click(screen.getByRole('button', { name: 'Back' })),
  }
}

const step = () => screen.getByTestId('step').textContent.trim()
const answers = () =>
  screen.queryAllByTestId('answer').map((li) => li.textContent.replace(/\s+/g, ' ').trim())

test('it opens on the first question and will not move on', () => {
  setup()
  expect(step()).toBe('Step 1 of 4')
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
})

test('answering unlocks the way forward', async () => {
  const { user, next } = setup()
  await user.click(screen.getByLabelText('Work'))
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()

  await next()
  expect(step()).toBe('Step 2 of 4')
})

test('going back keeps what you put in', async () => {
  const { user, next, back } = setup()
  await user.click(screen.getByLabelText('Work'))
  await next()
  await user.type(screen.getByLabelText('Nights'), '3')
  await back()

  expect(screen.getByLabelText('Work')).toBeChecked()
  await next()
  expect(screen.getByLabelText('Nights')).toHaveValue(3)
})

test('the third question follows from the first', async () => {
  const { user, next } = setup()
  await user.click(screen.getByLabelText('Work'))
  await next()
  await user.type(screen.getByLabelText('Nights'), '3')
  await next()

  expect(screen.getByLabelText('Company name')).toBeInTheDocument()
  expect(screen.queryByLabelText('Who is coming')).not.toBeInTheDocument()
})

test('answer the first one differently and the third one changes', async () => {
  const { user, next } = setup()
  await user.click(screen.getByLabelText('Pleasure'))
  await next()
  await user.type(screen.getByLabelText('Nights'), '3')
  await next()

  expect(screen.getByLabelText('Who is coming')).toBeInTheDocument()
  expect(screen.queryByLabelText('Company name')).not.toBeInTheDocument()
})

test('the review lists exactly what was asked', async () => {
  const { user, next } = setup()
  await user.click(screen.getByLabelText('Work'))
  await next()
  await user.type(screen.getByLabelText('Nights'), '3')
  await next()
  await user.type(screen.getByLabelText('Company name'), 'Acme')
  await next()

  expect(step()).toBe('Step 4 of 4')
  expect(answers()).toEqual(['Purpose: Work', 'Nights: 3', 'Company: Acme'])
})

test('changing the first answer throws away what the old branch collected', async () => {
  const { user, next, back } = setup()
  await user.click(screen.getByLabelText('Work'))
  await next()
  await user.type(screen.getByLabelText('Nights'), '3')
  await next()
  await user.type(screen.getByLabelText('Company name'), 'Acme')

  await back()
  await back()
  await user.click(screen.getByLabelText('Pleasure'))
  await next()
  await next()
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()

  await user.selectOptions(screen.getByLabelText('Who is coming'), 'Family')
  await next()
  expect(answers()).toEqual(['Purpose: Pleasure', 'Nights: 3', 'Companions: Family'])
})
