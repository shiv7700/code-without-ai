import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { useStore } from './useStore'

// A store that knows nothing about React — exactly what the hook has to bridge.
function makeStore(initial) {
  let state = initial
  const listeners = new Set()

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setState: (next) => {
      state = { ...state, ...next }
      for (const listener of [...listeners]) listener()
    },
    listenerCount: () => listeners.size,
  }
}

const selectCount = (state) => state.count
const selectName = (state) => state.name

test('reads the selected value out of the store', () => {
  const store = makeStore({ count: 3, name: 'ada' })
  const Probe = () => <p>{useStore(store, selectCount)}</p>
  render(<Probe />)

  expect(screen.getByText('3')).toBeInTheDocument()
})

test('a store update re-renders the component', () => {
  const store = makeStore({ count: 0, name: 'ada' })
  const Probe = () => <p data-testid="out">{useStore(store, selectCount)}</p>
  render(<Probe />)

  act(() => store.setState({ count: 1 }))
  expect(screen.getByTestId('out')).toHaveTextContent('1')
})

test('it subscribes to the store', () => {
  const store = makeStore({ count: 0 })
  const Probe = () => <p>{useStore(store, selectCount)}</p>
  render(<Probe />)

  expect(store.listenerCount()).toBe(1)
})

test('it unsubscribes on unmount', () => {
  const store = makeStore({ count: 0 })
  const Probe = () => <p>{useStore(store, selectCount)}</p>
  const view = render(<Probe />)

  view.unmount()
  expect(store.listenerCount()).toBe(0)
})

test('an unrelated change does not re-render', () => {
  const store = makeStore({ count: 0, name: 'ada' })
  const renders = vi.fn()
  const Probe = () => {
    renders()
    return <p>{useStore(store, selectCount)}</p>
  }
  render(<Probe />)
  const before = renders.mock.calls.length

  act(() => store.setState({ name: 'grace' }))
  expect(renders.mock.calls.length).toBe(before)
})

test('a change to the selected value does re-render', () => {
  const store = makeStore({ count: 0, name: 'ada' })
  const renders = vi.fn()
  const Probe = () => {
    renders()
    return <p>{useStore(store, selectCount)}</p>
  }
  render(<Probe />)
  const before = renders.mock.calls.length

  act(() => store.setState({ count: 1 }))
  expect(renders.mock.calls.length).toBeGreaterThan(before)
})

test('setting the same value again does not re-render', () => {
  const store = makeStore({ count: 5 })
  const renders = vi.fn()
  const Probe = () => {
    renders()
    return <p>{useStore(store, selectCount)}</p>
  }
  render(<Probe />)
  const before = renders.mock.calls.length

  act(() => store.setState({ count: 5 }))
  expect(renders.mock.calls.length).toBe(before)
})

test('two components watch different slices of one store', () => {
  const store = makeStore({ count: 0, name: 'ada' })
  const Count = () => <p data-testid="count">{useStore(store, selectCount)}</p>
  const Name = () => <p data-testid="name">{useStore(store, selectName)}</p>
  render(
    <>
      <Count />
      <Name />
    </>,
  )

  act(() => store.setState({ count: 7 }))
  expect(screen.getByTestId('count')).toHaveTextContent('7')
  expect(screen.getByTestId('name')).toHaveTextContent('ada')
})

test('every subscriber sees the same update', () => {
  const store = makeStore({ count: 0 })
  const Probe = ({ id }) => <p data-testid={id}>{useStore(store, selectCount)}</p>
  render(
    <>
      <Probe id="a" />
      <Probe id="b" />
    </>,
  )

  act(() => store.setState({ count: 2 }))
  expect(screen.getByTestId('a')).toHaveTextContent('2')
  expect(screen.getByTestId('b')).toHaveTextContent('2')
})
