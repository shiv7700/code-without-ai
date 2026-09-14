import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import SnakeGrid from './SnakeGrid'

const setup = ({ snake, food = [], size = 5 }) => {
  const user = userEvent.setup()
  const view = render(
    <SnakeGrid size={size} snake={snake} food={food} tick={0} />,
  )
  let tick = 0
  const step = (times = 1) => {
    for (let i = 0; i < times; i++)
      view.rerender(
        <SnakeGrid size={size} snake={snake} food={food} tick={++tick} />,
      )
  }
  return { user, step }
}

const kind = (row, col) => screen.getByTestId(`${row},${col}`).dataset.kind
const status = () => screen.getByTestId('status').textContent.trim()
const length = () =>
  screen.getAllByTestId(/,/).filter((c) => c.dataset.kind !== 'empty' && c.dataset.kind !== 'food')
    .length

test('the snake and the food are on the board', () => {
  setup({ snake: [[0, 1], [0, 0]], food: [[0, 3]] })

  expect(kind(0, 1)).toBe('head')
  expect(kind(0, 0)).toBe('snake')
  expect(kind(0, 3)).toBe('food')
  expect(kind(4, 4)).toBe('empty')
})

test('a tick moves the head on and lets the tail go', () => {
  const { step } = setup({ snake: [[0, 1], [0, 0]] })
  step()

  expect(kind(0, 2)).toBe('head')
  expect(kind(0, 1)).toBe('snake')
  expect(kind(0, 0)).toBe('empty')
})

test('an arrow key turns it', async () => {
  const { user, step } = setup({ snake: [[2, 1], [2, 0]] })
  await user.click(screen.getByLabelText('Board'))
  await user.keyboard('{ArrowDown}')
  step()

  expect(kind(3, 1)).toBe('head')
})

test('turning straight back on yourself is ignored', async () => {
  const { user, step } = setup({ snake: [[0, 2], [0, 1], [0, 0]] })
  await user.click(screen.getByLabelText('Board'))
  await user.keyboard('{ArrowLeft}')
  step()

  expect(kind(0, 3)).toBe('head')
})

test('eating grows the snake and clears the food away', () => {
  const { step } = setup({ snake: [[0, 1], [0, 0]], food: [[0, 2]] })
  step()

  expect(length()).toBe(3)
  expect(kind(0, 0)).toBe('snake')
  expect(kind(0, 2)).toBe('head')

  step()
  expect(length()).toBe(3)
})

test('a wall ends it, and the ticks after that do nothing', () => {
  const { step } = setup({ snake: [[0, 3], [0, 2]] })
  step(2)
  expect(status()).toBe('Game over')
  expect(kind(0, 4)).toBe('head')

  step()
  expect(kind(0, 4)).toBe('head')
})

test('running into your own body ends it', async () => {
  const { user, step } = setup({
    snake: [[1, 1], [1, 0], [0, 0], [0, 1], [0, 2]],
  })
  await user.click(screen.getByLabelText('Board'))
  await user.keyboard('{ArrowUp}')
  step()

  expect(status()).toBe('Game over')
})

test('the square the tail is leaving is not a square you crash into', () => {
  const { step } = setup({ snake: [[0, 0], [1, 0], [1, 1], [0, 1]] })
  step()

  expect(status()).toBe('')
  expect(kind(0, 1)).toBe('head')
  expect(kind(0, 0)).toBe('snake')
})
