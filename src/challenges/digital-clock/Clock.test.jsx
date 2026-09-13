import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import Clock from './Clock'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const at = (...parts) => vi.setSystemTime(new Date(2026, ...parts))
const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const reading = () => screen.getByTestId('clock').textContent.replace(/\s+/g, '')

test('shows the current time', () => {
  at(0, 1, 14, 30, 15)
  render(<Clock />)
  expect(reading()).toBe('14:30:15')
})

test('pads single digits with a zero', () => {
  at(0, 1, 9, 5, 3)
  render(<Clock />)
  expect(reading()).toBe('09:05:03')
})

test('midnight reads as 00, not 24 or 12', () => {
  at(0, 1, 0, 0, 0)
  render(<Clock />)
  expect(reading()).toBe('00:00:00')
})

test('the afternoon uses 24-hour time', () => {
  at(0, 1, 23, 59, 59)
  render(<Clock />)
  expect(reading()).toBe('23:59:59')
})

test('it ticks every second', () => {
  at(0, 1, 10, 0, 0)
  render(<Clock />)

  advance(1000)
  expect(reading()).toBe('10:00:01')

  advance(1000)
  expect(reading()).toBe('10:00:02')
})

test('it rolls over the minute', () => {
  at(0, 1, 10, 0, 59)
  render(<Clock />)
  advance(1000)

  expect(reading()).toBe('10:01:00')
})

test('it rolls over midnight', () => {
  at(0, 1, 23, 59, 59)
  render(<Clock />)
  advance(1000)

  expect(reading()).toBe('00:00:00')
})

test('unmounting stops the clock', () => {
  at(0, 1, 10, 0, 0)
  const view = render(<Clock />)
  view.unmount()

  expect(() => advance(10000)).not.toThrow()
})
