import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Carousel from './Carousel'

const IMAGES = [
  { src: '/a.jpg', alt: 'a mountain' },
  { src: '/b.jpg', alt: 'a lake' },
  { src: '/c.jpg', alt: 'a forest' },
]

const setup = () => ({ user: userEvent.setup(), ...render(<Carousel images={IMAGES} />) })
const shown = () => screen.getByRole('img').getAttribute('alt')

test('shows the first image', () => {
  setup()
  expect(shown()).toBe('a mountain')
})

test('shows one image at a time', () => {
  setup()
  expect(screen.getAllByRole('img')).toHaveLength(1)
})

test('next moves forward', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Next' }))
  expect(shown()).toBe('a lake')
})

test('next wraps around at the end', async () => {
  const { user } = setup()
  const next = screen.getByRole('button', { name: 'Next' })

  await user.click(next)
  await user.click(next)
  await user.click(next)

  expect(shown()).toBe('a mountain')
})

test('previous wraps around at the start', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Previous' }))
  expect(shown()).toBe('a forest')
})

test('the position reads as one-based', async () => {
  const { user } = setup()
  expect(screen.getByTestId('position').textContent.replace(/\s+/g, ' ')).toBe('1 / 3')

  await user.click(screen.getByRole('button', { name: 'Next' }))
  expect(screen.getByTestId('position').textContent.replace(/\s+/g, ' ')).toBe('2 / 3')
})

test('there is a dot per image', () => {
  setup()
  expect(screen.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(3)
})

test('a dot jumps straight to its image', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Go to slide 3' }))
  expect(shown()).toBe('a forest')
})

test('the current dot is marked, and only that one', async () => {
  const { user } = setup()
  await user.click(screen.getByRole('button', { name: 'Go to slide 2' }))

  const marked = screen
    .getAllByRole('button', { name: /Go to slide/ })
    .filter((dot) => dot.getAttribute('aria-current') === 'true')

  expect(marked).toHaveLength(1)
  expect(marked[0]).toHaveAccessibleName('Go to slide 2')
})
