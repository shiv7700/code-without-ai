import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import DelayedCounter from './DelayedCounter'

// Nothing runs until the test says so — which is the only way to get three
// clicks in before the first callback fires.
function scheduler() {
  const queue = []
  return {
    schedule: (run) => queue.push(run),
    waiting: () => queue.length,
    flush: () =>
      act(async () => {
        queue.splice(0).forEach((run) => run())
      }),
  }
}

const count = () => screen.getByTestId('count')
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

test('starts at 0 and a click changes nothing yet', async () => {
  const timer = scheduler()
  render(<DelayedCounter schedule={timer.schedule} />)

  await click('+1 later')
  expect(count()).toHaveTextContent('0')
})

test('one click schedules exactly one callback', async () => {
  const timer = scheduler()
  render(<DelayedCounter schedule={timer.schedule} />)

  await click('+1 later')
  expect(timer.waiting()).toBe(1)
})

test('the count goes up when the callback finally runs', async () => {
  const timer = scheduler()
  render(<DelayedCounter schedule={timer.schedule} />)

  await click('+5 later')
  await timer.flush()

  expect(count()).toHaveTextContent('5')
})

test('three clicks before anything runs are worth three', async () => {
  const timer = scheduler()
  render(<DelayedCounter schedule={timer.schedule} />)

  await click('+1 later')
  await click('+1 later')
  await click('+1 later')
  await timer.flush()

  expect(count()).toHaveTextContent('3')
})

test('the two buttons mix', async () => {
  const timer = scheduler()
  render(<DelayedCounter schedule={timer.schedule} />)

  await click('+5 later')
  await click('+1 later')
  await click('+5 later')
  await timer.flush()

  expect(count()).toHaveTextContent('11')
})
