import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import Player from './Player'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const setup = (duration = 5) => {
  const ref = createRef()
  const view = render(<Player duration={duration} ref={ref} />)
  return { ref, view, call: (name, ...args) => act(() => ref.current[name](...args)) }
}

const time = () => screen.getByTestId('time').textContent.replace(/\s+/g, ' ')
const state = () => screen.getByTestId('state').textContent

test('starts paused at zero', () => {
  setup()
  expect(time()).toBe('0 / 5')
  expect(state()).toBe('paused')
})

test('the ref exposes the controls', () => {
  const { ref } = setup()
  expect(Object.keys(ref.current).sort()).toEqual([
    'currentTime',
    'isPlaying',
    'pause',
    'play',
    'seek',
  ])
})

test('the ref does not expose the internals', () => {
  const { ref } = setup()
  expect(ref.current.setTime).toBe(undefined)
})

test('play starts the clock', () => {
  const { call } = setup()
  call('play')
  expect(state()).toBe('playing')

  advance(2000)
  expect(time()).toBe('2 / 5')
})

test('pause stops it where it is', () => {
  const { call } = setup()
  call('play')
  advance(2000)
  call('pause')
  advance(5000)

  expect(time()).toBe('2 / 5')
  expect(state()).toBe('paused')
})

test('playing again resumes', () => {
  const { call } = setup()
  call('play')
  advance(2000)
  call('pause')
  call('play')
  advance(1000)

  expect(time()).toBe('3 / 5')
})

test('seek jumps', () => {
  const { call } = setup()
  call('seek', 4)
  expect(time()).toBe('4 / 5')
})

test('seek clamps at both ends', () => {
  const { call } = setup()
  call('seek', -10)
  expect(time()).toBe('0 / 5')

  call('seek', 99)
  expect(time()).toBe('5 / 5')
})

test('seeking while playing keeps it playing', () => {
  const { call } = setup()
  call('play')
  call('seek', 1)
  advance(1000)

  expect(time()).toBe('2 / 5')
  expect(state()).toBe('playing')
})

test('it stops on its own at the end', () => {
  const { call } = setup(3)
  call('play')
  advance(5000)

  expect(time()).toBe('3 / 3')
  expect(state()).toBe('paused')
})

test('isPlaying and currentTime report the truth', () => {
  const { ref, call } = setup()
  expect(ref.current.isPlaying()).toBe(false)

  call('play')
  advance(2000)
  expect(ref.current.isPlaying()).toBe(true)
  expect(ref.current.currentTime()).toBe(2)
})

test('unmounting while playing leaves no interval behind', () => {
  const { call, view } = setup()
  call('play')
  view.unmount()

  expect(() => advance(5000)).not.toThrow()
})
