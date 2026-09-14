import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import PausableToast from './PausableToast'

function clock(start = 1000) {
  const time = { at: start }
  return { now: () => time.at, pass: (ms) => (time.at += ms) }
}

function bookings() {
  const jobs = []
  return {
    schedule: (fn, ms) => {
      const job = { fn, ms, live: true }
      jobs.push(job)
      return () => {
        job.live = false
      }
    },
    waiting: () => jobs.filter((job) => job.live),
    run: () =>
      act(async () => {
        const job = jobs.filter((j) => j.live).at(-1)
        job.live = false
        job.fn()
      }),
  }
}

const toast = () => screen.getByRole('status')

function show(extra = {}) {
  const booked = bookings()
  const time = clock()
  const onDismiss = vi.fn()
  const result = render(
    <PausableToast
      message="Saved"
      onDismiss={onDismiss}
      now={time.now}
      schedule={booked.schedule}
      {...extra}
    />,
  )
  return { booked, time, onDismiss, ...result }
}

test('shows the message and books its own dismissal', () => {
  const { booked } = show()

  expect(toast()).toHaveTextContent('Saved')
  expect(booked.waiting()).toHaveLength(1)
  expect(booked.waiting()[0].ms).toBe(5000)
})

test('the booking running dismisses it, and so does the button', async () => {
  const { booked, onDismiss } = show()

  await booked.run()
  expect(onDismiss).toHaveBeenCalledTimes(1)

  await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
  expect(onDismiss).toHaveBeenCalledTimes(2)
})

test('pointing at it stops the countdown', async () => {
  const { booked } = show()

  await userEvent.hover(toast())
  expect(booked.waiting()).toHaveLength(0)
})

test('moving away books only what was left', async () => {
  const { booked, time } = show()

  time.pass(2000)
  await userEvent.hover(toast())
  time.pass(10000)
  await userEvent.unhover(toast())

  expect(booked.waiting()).toHaveLength(1)
  expect(booked.waiting()[0].ms).toBe(3000)
})

test('pausing again keeps taking the time off', async () => {
  const { booked, time } = show()

  for (let i = 0; i < 3; i++) {
    time.pass(1000)
    await userEvent.hover(toast())
    await userEvent.unhover(toast())
  }

  expect(booked.waiting()).toHaveLength(1)
  expect(booked.waiting()[0].ms).toBe(2000)
})

test('keyboard users pause it too', async () => {
  const { booked, time } = show()

  time.pass(1500)
  screen.getByRole('button', { name: 'Dismiss' }).focus()
  expect(booked.waiting()).toHaveLength(0)

  await userEvent.tab()
  expect(booked.waiting()).toHaveLength(1)
  expect(booked.waiting()[0].ms).toBe(3500)
})

test('unmounting cancels what is booked', () => {
  const { booked, unmount } = show()
  expect(booked.waiting()).toHaveLength(1)

  unmount()
  expect(booked.waiting()).toHaveLength(0)
})
