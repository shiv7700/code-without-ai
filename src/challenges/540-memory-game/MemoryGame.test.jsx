import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import MemoryGame from './MemoryGame'

// Fixed order, so the test is about the rules and not about shuffling.
const CARDS = ['A', 'B', 'A', 'B']

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const card = (n) => screen.getByRole('button', { name: `Card ${n}` })
const flip = (...ns) => ns.forEach((n) => fireEvent.click(card(n)))
const faces = () => [1, 2, 3, 4].map((n) => card(n).textContent)

test('every card starts face down', () => {
  render(<MemoryGame cards={CARDS} />)
  expect(faces()).toEqual(['', '', '', ''])
})

test('clicking a card turns it over', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1)
  expect(faces()).toEqual(['A', '', '', ''])
})

test('a second card turns over too', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1, 2)
  expect(faces()).toEqual(['A', 'B', '', ''])
})

test('a matching pair stays face up', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1, 3)
  advance(2000)

  expect(faces()).toEqual(['A', '', 'A', ''])
})

test('a wrong pair turns back over after a second', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1, 2)
  expect(faces()).toEqual(['A', 'B', '', ''])

  advance(1000)
  expect(faces()).toEqual(['', '', '', ''])
})

test('the wrong pair stays visible until the second is up', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1, 2)
  advance(999)

  expect(faces()).toEqual(['A', 'B', '', ''])
})

test('a third card is ignored while a wrong pair is showing', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1, 2, 3)

  expect(faces()).toEqual(['A', 'B', '', ''])
})

test('clicking the same card twice does not count as a pair', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1, 1)
  advance(2000)

  expect(faces()).toEqual(['A', '', '', ''])
})

test('a matched card cannot be flipped back', () => {
  render(<MemoryGame cards={CARDS} />)
  flip(1, 3)
  flip(1)

  expect(faces()).toEqual(['A', '', 'A', ''])
})

test('matching everything wins the game', () => {
  render(<MemoryGame cards={CARDS} />)
  expect(screen.queryByText('You win')).not.toBeInTheDocument()

  flip(1, 3)
  flip(2, 4)

  expect(screen.getByText('You win')).toBeInTheDocument()
})

test('unmounting mid-guess leaves no timer behind', () => {
  const view = render(<MemoryGame cards={CARDS} />)
  flip(1, 2)
  view.unmount()

  expect(() => advance(2000)).not.toThrow()
})
