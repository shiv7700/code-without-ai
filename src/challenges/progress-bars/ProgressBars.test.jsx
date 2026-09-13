import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import ProgressBars from './ProgressBars'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const add = (n = 1) => {
  for (let i = 0; i < n; i++) fireEvent.click(screen.getByRole('button', { name: 'Add bar' }))
}
const values = () =>
  screen.queryAllByRole('progressbar').map((bar) => Number(bar.getAttribute('aria-valuenow')))

test('starts with no bars', () => {
  render(<ProgressBars />)
  expect(values()).toEqual([])
})

test('the button adds a bar, starting at zero', () => {
  render(<ProgressBars />)
  add()
  expect(values()).toEqual([0])
})

test('a bar fills over time', () => {
  render(<ProgressBars />)
  add()
  advance(100)
  expect(values()).toEqual([5])
})

test('a bar reaches 100 after two seconds', () => {
  render(<ProgressBars />)
  add()
  advance(2000)
  expect(values()).toEqual([100])
})

test('a full bar does not overflow', () => {
  render(<ProgressBars />)
  add()
  advance(5000)
  expect(values()).toEqual([100])
})

test('up to three bars fill at once', () => {
  render(<ProgressBars />)
  add(3)
  advance(100)
  expect(values()).toEqual([5, 5, 5])
})

test('the fourth bar waits its turn', () => {
  render(<ProgressBars />)
  add(4)
  advance(100)
  expect(values()).toEqual([5, 5, 5, 0])
})

test('the fourth bar starts once one finishes', () => {
  render(<ProgressBars />)
  add(4)
  advance(2000)
  expect(values()).toEqual([100, 100, 100, 0])

  advance(100)
  expect(values()).toEqual([100, 100, 100, 5])
})

test('a bar added late joins the queue at the back', () => {
  render(<ProgressBars />)
  add(3)
  advance(500)
  add()

  expect(values()).toEqual([25, 25, 25, 0])
})

test('unmounting stops the ticking', () => {
  const view = render(<ProgressBars />)
  add()
  view.unmount()

  expect(() => advance(5000)).not.toThrow()
})
