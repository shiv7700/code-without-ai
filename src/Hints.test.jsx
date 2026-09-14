import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { Hints } from './Hints'

const HINTS = ['first nudge', 'second nudge', 'third nudge']

const open = () => userEvent.click(screen.getByRole('button', { name: 'Hint' }))
const next = () =>
  userEvent.click(screen.getByRole('button', { name: /next hint/i }))
const shown = () => screen.queryAllByRole('listitem').map((li) => li.textContent)

test('no hints, no button — a challenge without a hints.md shows nothing', () => {
  render(<Hints title="thing" hints={[]} />)
  expect(screen.queryByRole('button', { name: 'Hint' })).not.toBeInTheDocument()
})

test('opens on the first hint only', async () => {
  render(<Hints title="thing" hints={HINTS} />)

  await open()
  expect(shown().join()).toContain('first nudge')
  expect(shown().join()).not.toContain('second nudge')
})

test('each click reveals exactly one more', async () => {
  render(<Hints title="thing" hints={HINTS} />)

  await open()
  await next()
  expect(shown()).toHaveLength(2)
  expect(shown().join()).not.toContain('third nudge')

  await next()
  expect(shown()).toHaveLength(3)
})

test('the button goes once they are all out', async () => {
  render(<Hints title="thing" hints={HINTS} />)

  await open()
  await next()
  await next()
  expect(
    screen.queryByRole('button', { name: /next hint/i }),
  ).not.toBeInTheDocument()
  expect(screen.getByText(/that is all of them/i)).toBeInTheDocument()
})

test('the counter tracks how much has been given away', async () => {
  render(<Hints title="thing" hints={HINTS} />)

  await open()
  expect(screen.getByText('1 / 3')).toBeInTheDocument()

  await next()
  expect(screen.getByText('2 / 3')).toBeInTheDocument()
})

// Otherwise coming back tomorrow starts you at the hint closest to the answer.
test('reopening starts from the first hint again', async () => {
  render(<Hints title="thing" hints={HINTS} />)

  await open()
  await next()
  await next()
  await userEvent.keyboard('{Escape}')

  await open()
  expect(shown()).toHaveLength(1)
  expect(screen.getByText('1 / 3')).toBeInTheDocument()
})
