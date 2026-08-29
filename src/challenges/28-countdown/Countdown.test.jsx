import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import Countdown from './Countdown'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const left = () => screen.getByTestId('left').textContent
const press = (name) => fireEvent.click(screen.getByRole('button', { name }))

test('starts at the given value', () => {
  render(<Countdown from={5} />)
  expect(left()).toBe('5')
})

test('does not tick before Start', () => {
  render(<Countdown from={5} />)

  advance(3000)
  expect(left()).toBe('5')
})

test('counts down once a second after Start', () => {
  render(<Countdown from={5} />)

  press(/start/i)
  advance(2000)
  expect(left()).toBe('3')
})

test('Pause stops it where it is', () => {
  render(<Countdown from={5} />)

  press(/start/i)
  advance(2000)
  press(/pause/i)
  advance(3000)
  expect(left()).toBe('3')
})

test('Start resumes from where it paused', () => {
  render(<Countdown from={5} />)

  press(/start/i)
  advance(1000)
  press(/pause/i)
  press(/start/i)
  advance(1000)
  expect(left()).toBe('3')
})

test('Reset goes back to the start and stops', () => {
  render(<Countdown from={5} />)

  press(/start/i)
  advance(2000)
  press(/reset/i)
  expect(left()).toBe('5')

  advance(3000)
  expect(left()).toBe('5')
})

test('stops at zero and never goes below', () => {
  render(<Countdown from={2} />)

  press(/start/i)
  advance(5000)
  expect(left()).toBe('0')
})

test('calls onDone exactly once', () => {
  const onDone = vi.fn()
  render(<Countdown from={2} onDone={onDone} />)

  press(/start/i)
  advance(5000)
  expect(onDone).toHaveBeenCalledTimes(1)
})

test('unmounting clears the interval', () => {
  const { unmount } = render(<Countdown from={5} />)

  press(/start/i)
  unmount()
  expect(() => advance(5000)).not.toThrow()
})
