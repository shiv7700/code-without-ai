import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Wizard from './Wizard'

const name = () => screen.getByLabelText(/name/i)
const email = () => screen.getByLabelText(/email/i)
const btn = (label) => screen.getByRole('button', { name: label })
const progress = () => screen.getByTestId('progress')

async function fillToReview() {
  await userEvent.type(name(), 'Shivang')
  await userEvent.click(btn('Next'))
  await userEvent.type(email(), 'me@example.com')
  await userEvent.click(btn('Next'))
}

test('starts on step 1 with Back disabled', () => {
  render(<Wizard onComplete={() => {}} />)

  expect(progress()).toHaveTextContent('Step 1 of 3')
  expect(btn('Back')).toBeDisabled()
  expect(name()).toBeInTheDocument()
})

test('Next is disabled until the step is valid', async () => {
  render(<Wizard onComplete={() => {}} />)
  expect(btn('Next')).toBeDisabled()

  await userEvent.type(name(), 'Shivang')
  expect(btn('Next')).toBeEnabled()
})

test('only the current step is rendered', async () => {
  render(<Wizard onComplete={() => {}} />)
  expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()

  await userEvent.type(name(), 'Shivang')
  await userEvent.click(btn('Next'))

  expect(screen.queryByLabelText(/^name$/i)).not.toBeInTheDocument()
  expect(email()).toBeInTheDocument()
  expect(progress()).toHaveTextContent('Step 2 of 3')
})

test('email must contain @', async () => {
  render(<Wizard onComplete={() => {}} />)

  await userEvent.type(name(), 'Shivang')
  await userEvent.click(btn('Next'))

  await userEvent.type(email(), 'nope')
  expect(btn('Next')).toBeDisabled()

  await userEvent.type(email(), '@x.com')
  expect(btn('Next')).toBeEnabled()
})

test('going Back preserves what was typed', async () => {
  render(<Wizard onComplete={() => {}} />)

  await userEvent.type(name(), 'Shivang')
  await userEvent.click(btn('Next'))
  await userEvent.type(email(), 'me@example.com')
  await userEvent.click(btn('Back'))

  expect(name()).toHaveValue('Shivang')

  await userEvent.click(btn('Next'))
  expect(email()).toHaveValue('me@example.com')
})

test('the review step shows both values', async () => {
  render(<Wizard onComplete={() => {}} />)
  await fillToReview()

  expect(progress()).toHaveTextContent('Step 3 of 3')
  expect(screen.getByText(/Shivang/)).toBeInTheDocument()
  expect(screen.getByText(/me@example\.com/)).toBeInTheDocument()
})

test('editing an earlier step updates the review', async () => {
  render(<Wizard onComplete={() => {}} />)
  await fillToReview()

  await userEvent.click(btn('Back'))
  await userEvent.click(btn('Back'))
  await userEvent.clear(name())
  await userEvent.type(name(), 'Ramola')
  await userEvent.click(btn('Next'))
  await userEvent.click(btn('Next'))

  expect(screen.getByText(/Ramola/)).toBeInTheDocument()
  expect(screen.queryByText(/Shivang/)).not.toBeInTheDocument()
})

test('Submit replaces Next on the last step and reports the data once', async () => {
  const onComplete = vi.fn()
  render(<Wizard onComplete={onComplete} />)
  await fillToReview()

  expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()

  await userEvent.click(btn('Submit'))
  expect(onComplete).toHaveBeenCalledTimes(1)
  expect(onComplete).toHaveBeenCalledWith({
    name: 'Shivang',
    email: 'me@example.com',
  })
})
