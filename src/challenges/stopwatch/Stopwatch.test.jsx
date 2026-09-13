import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import Stopwatch from './Stopwatch'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const elapsed = () => screen.getByTestId('elapsed').textContent
const click = (name) => fireEvent.click(screen.getByRole('button', { name }))

test('starts at zero', () => {
  render(<Stopwatch />)
  expect(elapsed()).toBe('0.0')
})

test('does not run until you start it', () => {
  render(<Stopwatch />)
  advance(5000)
  expect(elapsed()).toBe('0.0')
})

test('counts up while running', () => {
  render(<Stopwatch />)
  click('Start')
  advance(1500)
  expect(elapsed()).toBe('1.5')
})

test('the start button becomes a stop button', () => {
  render(<Stopwatch />)
  click('Start')
  expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument()
})

test('stopping freezes the display', () => {
  render(<Stopwatch />)
  click('Start')
  advance(1000)
  click('Stop')
  advance(5000)

  expect(elapsed()).toBe('1.0')
})

test('starting again resumes rather than restarting', () => {
  render(<Stopwatch />)
  click('Start')
  advance(1000)
  click('Stop')
  click('Start')
  advance(500)

  expect(elapsed()).toBe('1.5')
})

test('reset goes back to zero', () => {
  render(<Stopwatch />)
  click('Start')
  advance(2000)
  click('Reset')

  expect(elapsed()).toBe('0.0')
})

test('reset also stops it', () => {
  render(<Stopwatch />)
  click('Start')
  advance(2000)
  click('Reset')
  advance(2000)

  expect(elapsed()).toBe('0.0')
  expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
})

test('unmounting while running does not leave a timer behind', () => {
  const view = render(<Stopwatch />)
  click('Start')
  view.unmount()

  expect(() => advance(5000)).not.toThrow()
})
