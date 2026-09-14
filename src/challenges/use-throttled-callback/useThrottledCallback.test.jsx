import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import { useThrottledCallback } from './useThrottledCallback'

// A clock the test winds by hand. No real time passes.
function clock() {
  let nextId = 0
  const pending = new Map()
  return {
    set: (fn, ms) => {
      const id = ++nextId
      pending.set(id, { fn, ms })
      return id
    },
    clear: (id) => pending.delete(id),
    size: () => pending.size,
    delays: () => [...pending.values()].map((t) => t.ms),
    fire: () => {
      const due = [...pending.values()]
      pending.clear()
      return act(() => {
        due.forEach((t) => t.fn())
      })
    },
  }
}

let handed = []

function Probe({ timer, onCall, delay = 100 }) {
  const [n, bump] = useState(0)
  const send = useThrottledCallback((text) => onCall(`${text}@${n}`), delay, timer)
  handed.push(send)
  return (
    <div>
      <button onClick={() => send('a')}>a</button>
      <button onClick={() => send('b')}>b</button>
      <button onClick={() => send('c')}>c</button>
      <button onClick={() => bump((v) => v + 1)}>bump</button>
    </div>
  )
}

const press = (name) => userEvent.click(screen.getByRole('button', { name }))

function mount(props) {
  handed = []
  render(<Probe {...props} />)
}

test('the first call runs straight away', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a')

  expect(onCall).toHaveBeenCalledWith('a@0')
  expect(timer.delays()).toEqual([100])
})

test('calls inside the window do not run it', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a')
  await press('b')
  await press('c')

  expect(onCall).toHaveBeenCalledTimes(1)
})

test('closing the window runs it once more, with the last arguments', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a')
  await press('b')
  await press('c')
  await timer.fire()

  expect(onCall).toHaveBeenCalledTimes(2)
  expect(onCall).toHaveBeenLastCalledWith('c@0')
})

test('one call on its own does not fire twice', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a')
  await timer.fire()

  expect(onCall).toHaveBeenCalledTimes(1)
  expect(timer.size()).toBe(0)
})

test('a re-render keeps the identity, and the trailing call uses the newest function', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a') // leading edge, n is 0
  await press('b') // remembered
  await press('bump') // n is 1
  await press('c') // still inside the same window

  expect(timer.size()).toBe(1)
  for (const send of handed) expect(send).toBe(handed[0])

  await timer.fire()
  expect(onCall).toHaveBeenCalledTimes(2)
  expect(onCall).toHaveBeenNthCalledWith(1, 'a@0')
  expect(onCall).toHaveBeenNthCalledWith(2, 'c@1')
})
