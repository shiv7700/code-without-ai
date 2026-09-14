import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLayoutEffect, useState } from 'react'
import { expect, test } from 'vitest'
import { useOnlineStatus } from './useOnlineStatus'

function connection(start = true) {
  let up = start
  const listeners = new Set()
  return {
    isOnline: () => up,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    count: () => listeners.size,
    flip: (next) =>
      act(() => {
        up = next
        listeners.forEach((l) => l())
      }),
    // A change nobody was told about, because nobody was listening yet.
    flipQuietly: (next) => {
      up = next
    },
  }
}

function Probe({ net }) {
  const [n, bump] = useState(0)
  const online = useOnlineStatus(net)
  return (
    <button onClick={() => bump(n + 1)}>
      {online ? 'online' : 'offline'}:{n}
    </button>
  )
}

const label = () => screen.getByRole('button').textContent

test('the first render already reports the right answer', () => {
  render(<Probe net={connection(false)} />)
  expect(label()).toBe('offline:0')
})

test('a change re-renders with the new value', async () => {
  const net = connection(true)
  render(<Probe net={net} />)

  await net.flip(false)
  expect(label()).toBe('offline:0')

  await net.flip(true)
  expect(label()).toBe('online:0')
})

test('it subscribes once however many times the component renders', async () => {
  const net = connection(true)
  render(<Probe net={net} />)

  await userEvent.click(screen.getByRole('button'))
  await userEvent.click(screen.getByRole('button'))

  expect(label()).toBe('online:2')
  expect(net.count()).toBe(1)
})

test('unmounting unsubscribes', () => {
  const net = connection(true)
  const view = render(<Probe net={net} />)

  view.unmount()

  expect(net.count()).toBe(0)
})

test('a change landing before the subscription is in place is not missed', () => {
  const net = connection(true)

  // Layout effects run after the child has rendered and read the value, but
  // before any passive effect has had the chance to subscribe.
  function Host() {
    useLayoutEffect(() => {
      net.flipQuietly(false)
    }, [])
    return <Probe net={net} />
  }

  render(<Host />)

  expect(label()).toBe('offline:0')
})
