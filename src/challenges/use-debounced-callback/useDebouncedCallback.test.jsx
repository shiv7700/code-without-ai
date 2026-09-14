import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import { useDebouncedCallback } from './useDebouncedCallback'

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

function Probe({ timer, onCall, delay = 200 }) {
  const [n, bump] = useState(0)
  const save = useDebouncedCallback((text) => onCall(`${text}@${n}`), delay, timer)
  handed.push(save)
  return (
    <div>
      <button onClick={() => save('a')}>a</button>
      <button onClick={() => save('b')}>b</button>
      <button onClick={() => bump((v) => v + 1)}>bump</button>
    </div>
  )
}

const press = (name) => userEvent.click(screen.getByRole('button', { name }))

function mount(props) {
  handed = []
  render(<Probe {...props} />)
}

test('calling it schedules the timer and does not run the function yet', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a')

  expect(onCall).not.toHaveBeenCalled()
  expect(timer.delays()).toEqual([200])
})

test('calls in quick succession collapse into one pending timer', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a')
  await press('b')
  await press('a')

  expect(timer.size()).toBe(1)
})

test('when it fires it runs once, with the last arguments', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a')
  await press('b')
  await timer.fire()

  expect(onCall).toHaveBeenCalledTimes(1)
  expect(onCall).toHaveBeenCalledWith('b@0')
})

test('unmounting cancels what was pending', async () => {
  const timer = clock()
  const onCall = vi.fn()
  handed = []
  const view = render(<Probe timer={timer} onCall={onCall} />)

  await press('a')
  view.unmount()

  expect(timer.size()).toBe(0)
})

test('a re-render keeps the identity, and the pending call runs the newest function', async () => {
  const timer = clock()
  const onCall = vi.fn()
  mount({ timer, onCall })

  await press('a') // scheduled while n was 0
  await press('bump') // n is 1 now, and the timer must still be the same one
  await press('bump') // n is 2

  expect(timer.size()).toBe(1)
  for (const save of handed) expect(save).toBe(handed[0])

  await timer.fire()
  expect(onCall).toHaveBeenCalledTimes(1)
  expect(onCall).toHaveBeenCalledWith('a@2')
})
