import { act, render } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useEventListener } from './useEventListener'

// A target that counts subscriptions, so "did it reattach?" is observable.
const spyTarget = () => {
  const listeners = new Set()
  return {
    adds: 0,
    removes: 0,
    addEventListener(_, fn) {
      this.adds++
      listeners.add(fn)
    },
    removeEventListener(_, fn) {
      this.removes++
      listeners.delete(fn)
    },
    fire: (event) => listeners.forEach((fn) => fn(event)),
    get attached() {
      return listeners.size
    },
  }
}

function probe(type, handler, target) {
  const Probe = ({ t, h, g }) => {
    useEventListener(t, h, g)
    return null
  }
  const view = render(<Probe t={type} h={handler} g={target} />)
  return {
    ...view,
    set: (t, h, g) => act(() => view.rerender(<Probe t={t} h={h} g={g} />)),
  }
}

test('calls the handler when the event fires', () => {
  const target = spyTarget()
  const onKey = vi.fn()
  probe('keydown', onKey, target)

  act(() => target.fire({ key: 'a' }))
  expect(onKey).toHaveBeenCalledWith({ key: 'a' })
})

test('defaults to window', () => {
  const onKey = vi.fn()
  probe('keydown', onKey)

  act(() => window.dispatchEvent(new Event('keydown')))
  expect(onKey).toHaveBeenCalledTimes(1)
})

test('unmounting detaches', () => {
  const target = spyTarget()
  const p = probe('keydown', vi.fn(), target)

  p.unmount()
  expect(target.attached).toBe(0)
})

test('calls the latest handler, not the one from the first render', () => {
  const target = spyTarget()
  const first = vi.fn()
  const second = vi.fn()
  const p = probe('keydown', first, target)

  p.set('keydown', second, target)
  act(() => target.fire({ key: 'a' }))

  expect(first).not.toHaveBeenCalled()
  expect(second).toHaveBeenCalledTimes(1)
})

test('a fresh inline handler does not reattach', () => {
  const target = spyTarget()
  const p = probe('keydown', () => {}, target)

  p.set('keydown', () => {}, target)
  p.set('keydown', () => {}, target)

  expect(target.adds).toBe(1)
  expect(target.removes).toBe(0)
})

test('changing the event type resubscribes', () => {
  const target = spyTarget()
  const p = probe('keydown', vi.fn(), target)

  p.set('keyup', vi.fn(), target)
  expect(target.adds).toBe(2)
  expect(target.removes).toBe(1)
})

test('changing the target moves the listener across', () => {
  const a = spyTarget()
  const b = spyTarget()
  const p = probe('keydown', vi.fn(), a)

  p.set('keydown', vi.fn(), b)
  expect(a.attached).toBe(0)
  expect(b.attached).toBe(1)
})
