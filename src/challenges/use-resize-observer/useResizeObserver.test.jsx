import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import { useResizeObserver } from './useResizeObserver'

// Stands in for ResizeObserver. The test decides what changed size.
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
    report: (node, width, height) =>
      act(() =>
        made[0].callback([{ target: node, contentRect: { width, height } }]),
      ),
  }
}

function Probe({ createObserver }) {
  const [which, swap] = useState('a')
  const [ref, size] = useResizeObserver(createObserver)
  return (
    <div>
      <output>{size ? `${size.width}x${size.height}` : 'none'}</output>
      <button onClick={() => swap('b')}>swap</button>
      <p key={which} ref={ref} data-testid={which}>
        {which}
      </p>
    </div>
  )
}

const out = () => screen.getByRole('status').textContent

test('the size is null until something is reported', () => {
  const io = observers()
  render(<Probe createObserver={io.create} />)
  expect(out()).toBe('none')
})

test('the element is observed as soon as it attaches', () => {
  const io = observers()
  render(<Probe createObserver={io.create} />)
  expect(io.only().observed).toEqual([screen.getByTestId('a')])
})

test('an entry sets the size from its contentRect', async () => {
  const io = observers()
  render(<Probe createObserver={io.create} />)

  await io.report(screen.getByTestId('a'), 120, 40)

  expect(out()).toBe('120x40')
})

test('unmounting disconnects the observer', () => {
  const io = observers()
  const view = render(<Probe createObserver={io.create} />)

  view.unmount()

  expect(io.only().disconnected).toBe(true)
})

test('swapping the element unobserves the old one and observes the new one', async () => {
  const io = observers()
  render(<Probe createObserver={io.create} />)
  const first = screen.getByTestId('a')

  await userEvent.click(screen.getByRole('button', { name: 'swap' }))
  const second = screen.getByTestId('b')

  expect(io.made).toHaveLength(1)
  expect(io.only().unobserved).toEqual([first])
  expect(io.only().observed).toEqual([first, second])
})
