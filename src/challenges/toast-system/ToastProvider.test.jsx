import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { ToastProvider, useToast } from './ToastProvider'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms) => act(() => vi.advanceTimersByTime(ms))

// Grabs the context so tests can call show/dismiss directly.
function setup(providerProps = {}) {
  const box = {}
  function Grab() {
    Object.assign(box, useToast())
    return null
  }
  const view = render(
    <ToastProvider {...providerProps}>
      <Grab />
    </ToastProvider>,
  )
  return { box, ...view }
}

test('show() puts the message on screen', () => {
  const { box } = setup()

  act(() => box.show('Saved'))
  expect(screen.getByText('Saved')).toBeInTheDocument()
  expect(screen.getByRole('status')).toBeInTheDocument()
})

test('show() returns a unique id even for identical messages', () => {
  const { box } = setup()

  let a, b
  act(() => {
    a = box.show('same')
    b = box.show('same')
  })

  expect(a).not.toBe(b)
  expect(box.toasts).toHaveLength(2)
})

test('auto-dismisses after the default duration', () => {
  const { box } = setup({ defaultDuration: 3000 })

  act(() => box.show('Bye'))
  advance(2999)
  expect(screen.getByText('Bye')).toBeInTheDocument()

  advance(2)
  expect(screen.queryByText('Bye')).not.toBeInTheDocument()
})

test('options.duration overrides the default', () => {
  const { box } = setup({ defaultDuration: 3000 })

  act(() => box.show('Quick', { duration: 500 }))
  advance(600)

  expect(screen.queryByText('Quick')).not.toBeInTheDocument()
})

test('duration null means it stays forever', () => {
  const { box } = setup()

  act(() => box.show('Sticky', { duration: null }))
  advance(60_000)

  expect(screen.getByText('Sticky')).toBeInTheDocument()
})

test('several toasts stack, oldest first', () => {
  const { box } = setup()

  act(() => {
    box.show('one')
    box.show('two')
    box.show('three')
  })

  expect(box.toasts.map((t) => t.message)).toEqual(['one', 'two', 'three'])
})

test('dismiss removes just that toast', () => {
  const { box } = setup()

  let second
  act(() => {
    box.show('one')
    second = box.show('two')
    box.show('three')
  })

  act(() => box.dismiss(second))
  expect(box.toasts.map((t) => t.message)).toEqual(['one', 'three'])
})

test('a dismissed toast’s timer does not fire later and eat another toast', () => {
  const { box } = setup({ defaultDuration: 1000 })

  let first
  act(() => {
    first = box.show('first')
  })

  advance(500)
  act(() => box.dismiss(first))
  act(() => box.show('second', { duration: null }))

  advance(2000) // first's original timer would have fired around here
  expect(screen.getByText('second')).toBeInTheDocument()
})

test('the Dismiss button removes a toast', async () => {
  const { box } = setup()

  act(() => box.show('closeme'))
  act(() => screen.getByRole('button', { name: /dismiss/i }).click())

  expect(screen.queryByText('closeme')).not.toBeInTheDocument()
})

test('unmounting clears pending timers', () => {
  const { box, unmount } = setup({ defaultDuration: 1000 })

  act(() => box.show('x'))
  unmount()

  expect(() => advance(5000)).not.toThrow()
})

test('useToast outside a provider throws, naming ToastProvider', () => {
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
  function Naked() {
    useToast()
    return null
  }

  expect(() => render(<Naked />)).toThrow(/ToastProvider/)
  quiet.mockRestore()
})
