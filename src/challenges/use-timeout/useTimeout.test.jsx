import { act, render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useTimeout } from './useTimeout'

// A timer the test drives by hand — no real waiting, no fake timers.
function fakeTimer() {
  const jobs = new Map()
  let nextId = 0
  const set = vi.fn((fn, delay) => {
    jobs.set(++nextId, { fn, delay })
    return nextId
  })
  const clear = vi.fn((id) => jobs.delete(id))
  return {
    set,
    clear,
    pending: () => [...jobs.values()].map((job) => job.delay),
    fire: () =>
      act(() => {
        const [id, job] = [...jobs.entries()][0]
        jobs.delete(id)
        job.fn()
      }),
  }
}

function probe(callback, delay) {
  const timer = fakeTimer()
  function Probe(props) {
    useTimeout(props.callback, props.delay, timer)
    return null
  }
  const view = render(<Probe callback={callback} delay={delay} />)
  return {
    timer,
    view,
    update: (next) =>
      act(() =>
        view.rerender(<Probe callback={callback} delay={delay} {...next} />),
      ),
  }
}

test('mounting schedules one timer with the delay', () => {
  const p = probe(() => {}, 500)

  expect(p.timer.set).toHaveBeenCalledTimes(1)
  expect(p.timer.pending()).toEqual([500])
})

test('the callback runs when the timer fires', () => {
  const called = vi.fn()
  const p = probe(called, 500)

  p.timer.fire()

  expect(called).toHaveBeenCalledTimes(1)
})

test('a new delay clears the old timer and starts a fresh one', () => {
  const p = probe(() => {}, 500)

  p.update({ delay: 900 })

  expect(p.timer.clear).toHaveBeenCalledTimes(1)
  expect(p.timer.pending()).toEqual([900])
})

test('a null delay schedules nothing and cancels what is pending', () => {
  const never = vi.fn()

  const p = probe(never, null)
  expect(p.timer.set).not.toHaveBeenCalled()

  const q = probe(never, 500)
  q.update({ delay: null })
  expect(q.timer.pending()).toEqual([])
  expect(never).not.toHaveBeenCalled()
})

test('unmounting clears the pending timer', () => {
  const never = vi.fn()
  const p = probe(never, 500)

  p.view.unmount()

  expect(p.timer.clear).toHaveBeenCalledTimes(1)
  expect(p.timer.pending()).toEqual([])
})

test('a new callback does not restart the clock, and it is the one that fires', () => {
  const first = vi.fn()
  const second = vi.fn()
  const p = probe(first, 500)

  p.update({ callback: second })

  expect(p.timer.set).toHaveBeenCalledTimes(1)
  expect(p.timer.clear).not.toHaveBeenCalled()

  p.timer.fire()

  expect(first).not.toHaveBeenCalled()
  expect(second).toHaveBeenCalledTimes(1)
})
