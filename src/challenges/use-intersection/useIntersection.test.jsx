import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import { useIntersection } from './useIntersection'

// Stands in for IntersectionObserver. The test decides what is on screen.
function observers() {
  const made = []
  const create = (callback) => {
    const instance = {
      callback,
      observed: [],
      unobserved: [],
      disconnected: false,
      observe: (node) => instance.observed.push(node),
      unobserve: (node) => instance.unobserved.push(node),
      disconnect: () => {
        instance.disconnected = true
      },
    }
    made.push(instance)
    return instance
  }
  return {
    create,
    made,
    only: () => made[0],
    report: (node, isIntersecting) =>
      act(() => made[0].callback([{ target: node, isIntersecting }])),
  }
}

function Probe({ createObserver, startShown = true }) {
  const [shown, show] = useState(startShown)
  const [ref, visible] = useIntersection(createObserver)
  return (
    <div>
      <output>{String(visible)}</output>
      <button onClick={() => show(true)}>show</button>
      {shown && (
        <p ref={ref} data-testid="target">
          target
        </p>
      )}
    </div>
  )
}

const out = () => screen.getByRole('status').textContent

test('it reports false before anything has been seen', () => {
  const io = observers()
  render(<Probe createObserver={io.create} />)
  expect(out()).toBe('false')
})

test('the element is observed as soon as it attaches', () => {
  const io = observers()
  render(<Probe createObserver={io.create} />)
  expect(io.only().observed).toEqual([screen.getByTestId('target')])
})

test('an entry from the observer flips the flag', async () => {
  const io = observers()
  render(<Probe createObserver={io.create} />)
  const node = screen.getByTestId('target')

  await io.report(node, true)
  expect(out()).toBe('true')

  await io.report(node, false)
  expect(out()).toBe('false')
})

test('unmounting disconnects the observer', () => {
  const io = observers()
  const view = render(<Probe createObserver={io.create} />)

  view.unmount()

  expect(io.only().disconnected).toBe(true)
})

test('an element that only appears later is observed too', async () => {
  const io = observers()
  render(<Probe createObserver={io.create} startShown={false} />)

  expect(io.made).toHaveLength(1)
  expect(io.only().observed).toEqual([])

  await userEvent.click(screen.getByRole('button', { name: 'show' }))

  const node = screen.getByTestId('target')
  expect(io.made).toHaveLength(1)
  expect(io.only().observed).toEqual([node])

  await io.report(node, true)
  expect(out()).toBe('true')
})
