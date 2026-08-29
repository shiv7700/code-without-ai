import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import StarRating from './StarRating'

const star = (n) => screen.getByRole('button', { name: `Rate ${n}` })
const filled = () =>
  screen.getAllByRole('button').filter((b) => b.dataset.filled === 'true').length

test('renders five stars', () => {
  render(<StarRating />)
  expect(screen.getAllByRole('button')).toHaveLength(5)
})

test('fills as many stars as the value', () => {
  render(<StarRating value={3} />)
  expect(filled()).toBe(3)
  expect(star(4)).not.toHaveAttribute('data-filled')
})

test('a value of zero fills nothing', () => {
  render(<StarRating value={0} />)
  expect(filled()).toBe(0)
})

test('clicking a star reports its number', async () => {
  const onRate = vi.fn()
  render(<StarRating value={1} onRate={onRate} />)

  await userEvent.click(star(4))
  expect(onRate).toHaveBeenCalledTimes(1)
  expect(onRate).toHaveBeenCalledWith(4)
})

test('hovering previews without reporting', async () => {
  const onRate = vi.fn()
  render(<StarRating value={1} onRate={onRate} />)

  await userEvent.hover(star(5))
  expect(filled()).toBe(5)
  expect(onRate).not.toHaveBeenCalled()
})

test('leaving a star restores the committed value', async () => {
  render(<StarRating value={2} />)

  await userEvent.hover(star(5))
  await userEvent.unhover(star(5))
  expect(filled()).toBe(2)
})
