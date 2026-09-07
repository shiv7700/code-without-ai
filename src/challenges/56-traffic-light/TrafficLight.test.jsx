import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import TrafficLight from './TrafficLight'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const lit = () =>
  screen.getAllByTestId('light').find((l) => l.dataset.active === 'true')?.dataset.color

test('renders all three lights', () => {
  render(<TrafficLight />)
  expect(screen.getAllByTestId('light').map((l) => l.dataset.color)).toEqual([
    'green',
    'yellow',
    'red',
  ])
})

test('starts on green', () => {
  render(<TrafficLight />)
  expect(lit()).toBe('green')
})

test('exactly one light is on at a time', () => {
  render(<TrafficLight />)
  advance(3000)
  expect(screen.getAllByTestId('light').filter((l) => l.dataset.active === 'true')).toHaveLength(1)
})

test('green holds for three seconds', () => {
  render(<TrafficLight />)
  advance(2999)
  expect(lit()).toBe('green')
})

test('green gives way to yellow', () => {
  render(<TrafficLight />)
  advance(3000)
  expect(lit()).toBe('yellow')
})

test('yellow is the short one', () => {
  render(<TrafficLight />)
  advance(3000)
  advance(499)
  expect(lit()).toBe('yellow')

  advance(1)
  expect(lit()).toBe('red')
})

test('red gives way back to green', () => {
  render(<TrafficLight />)
  advance(3000)
  advance(500)
  advance(2000)

  expect(lit()).toBe('green')
})

test('it keeps cycling', () => {
  render(<TrafficLight />)
  for (const ms of [3000, 500, 2000, 3000, 500, 2000]) advance(ms)

  expect(lit()).toBe('green')

  advance(3000)
  expect(lit()).toBe('yellow')
})

test('unmounting stops the clock', () => {
  const view = render(<TrafficLight />)
  view.unmount()
  expect(() => advance(10000)).not.toThrow()
})
