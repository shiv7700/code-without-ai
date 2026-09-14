import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import PlayerQueue from './PlayerQueue'

const TRACKS = [
  { id: 1, title: 'Alpha' },
  { id: 2, title: 'Beta' },
  { id: 3, title: 'Gamma' },
  { id: 4, title: 'Delta' },
]

const backwards = (list) => [...list].reverse()

const setup = () => {
  const user = userEvent.setup()
  render(<PlayerQueue tracks={TRACKS} shuffle={backwards} />)
  const press = (name) => user.click(screen.getByRole('button', { name }))
  return {
    user,
    press,
    next: async (times = 1) => {
      for (let i = 0; i < times; i++) await press('Next')
    },
  }
}

const now = () => screen.getByTestId('now').textContent.trim()

test('it starts at the top of the list', () => {
  setup()
  expect(now()).toBe('Alpha')
})

test('next walks the list and comes round again at the end', async () => {
  const { next } = setup()
  await next()
  expect(now()).toBe('Beta')

  await next(3)
  expect(now()).toBe('Alpha')
})

test('previous retraces what was actually played', async () => {
  const { press, next } = setup()
  await next(2)
  expect(now()).toBe('Gamma')

  await press('Previous')
  expect(now()).toBe('Beta')
  await press('Previous')
  expect(now()).toBe('Alpha')
  await press('Previous')
  expect(now()).toBe('Alpha')
})

test('shuffling deals out the rest in a new order', async () => {
  const { press, next } = setup()
  await press('Shuffle')
  expect(screen.getByRole('button', { name: 'Shuffle' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  await next()
  expect(now()).toBe('Delta')
  await next()
  expect(now()).toBe('Gamma')
})

test('nothing comes round a second time until everything has had a turn', async () => {
  const { press, next } = setup()
  await press('Shuffle')
  await next(3)

  expect(now()).toBe('Beta')
})

test('the track playing is never the one dealt next', async () => {
  const { press, next } = setup()
  await press('Shuffle')
  await next(4)

  expect(now()).toBe('Delta')
})

test('repeat one plays it again and leaves the queue where it was', async () => {
  const { press, next } = setup()
  await next()
  await press('Repeat one')
  await next()
  expect(now()).toBe('Beta')

  await press('Repeat one')
  await next()
  expect(now()).toBe('Gamma')
})
