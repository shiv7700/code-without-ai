import { act, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useSelector } from './useSelector'

function makeStore(initial) {
  let state = initial
  let subscribes = 0
  const listeners = new Set()
  return {
    getState: () => state,
    subscribe: (listener) => {
      subscribes++
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    listeners: () => listeners.size,
    // Every subscribe ever, not just the ones still attached — resubscribing
    // leaves the count at one and is exactly what rule 4 forbids.
    subscribes: () => subscribes,
    set: (patch) =>
      act(() => {
        state = { ...state, ...patch }
        listeners.forEach((l) => l())
      }),
  }
}

const shallow = (a, b) =>
  a === b ||
  (!!a &&
    !!b &&
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every((k) => Object.is(a[k], b[k])))

let renders = 0

// The selector is written inline, the way it would be in real code — a new
// function every single render.
function Probe({ store, pick = 'count', isEqual }) {
  renders++
  const value = useSelector(store, (s) => s[pick], isEqual)
  return <output>{String(value)}</output>
}

const out = () => screen.getByRole('status').textContent

function mount(ui) {
  renders = 0
  return render(ui)
}

test('it returns the selected slice', () => {
  const store = makeStore({ count: 1, name: 'ada' })
  mount(<Probe store={store} />)
  expect(out()).toBe('1')
})

test('a change to the slice re-renders with the new value', async () => {
  const store = makeStore({ count: 1, name: 'ada' })
  mount(<Probe store={store} />)

  await store.set({ count: 2 })

  expect(out()).toBe('2')
})

test('a change to an unrelated slice renders nothing', async () => {
  const store = makeStore({ count: 1, name: 'ada' })
  mount(<Probe store={store} />)
  const before = renders

  await store.set({ name: 'grace' })

  expect(renders).toBe(before)
  expect(out()).toBe('1')
})

test('unmounting unsubscribes', () => {
  const store = makeStore({ count: 1, name: 'ada' })
  const view = mount(<Probe store={store} />)

  view.unmount()

  expect(store.listeners()).toBe(0)
})

test('a selector building a fresh object settles once isEqual says so', async () => {
  const store = makeStore({ count: 1, name: 'ada' })
  function Wrapper({ s }) {
    renders++
    const value = useSelector(s, (state) => ({ n: state.count }), shallow)
    return <output>{value.n}</output>
  }
  renders = 0
  render(<Wrapper s={store} />)
  const before = renders

  await store.set({ name: 'grace' })
  expect(renders).toBe(before)

  await store.set({ count: 5 })
  expect(out()).toBe('5')
})

test('one subscription survives new selectors, and the newest one is used', async () => {
  const store = makeStore({ count: 1, name: 'ada' })
  const view = mount(<Probe store={store} />)

  view.rerender(<Probe store={store} pick="name" />)
  expect(out()).toBe('ada')

  await store.set({ count: 99 })
  expect(out()).toBe('ada')

  await store.set({ name: 'grace' })
  expect(out()).toBe('grace')
  expect(store.listeners()).toBe(1)
  expect(store.subscribes()).toBe(1)
})
