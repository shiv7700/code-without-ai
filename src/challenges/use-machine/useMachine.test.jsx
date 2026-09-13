import { act, render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useMachine } from './useMachine'

const FETCHER = {
  initial: 'idle',
  context: { retries: 0, data: null },
  states: {
    idle: { on: { FETCH: 'loading' } },
    loading: {
      on: {
        RESOLVE: {
          target: 'success',
          action: (context, event) => ({ ...context, data: event.data }),
        },
        REJECT: {
          target: 'failure',
          action: (context) => ({ ...context, retries: context.retries + 1 }),
        },
      },
    },
    success: { on: { FETCH: 'loading' } },
    failure: {
      on: {
        RETRY: { target: 'loading', guard: (context) => context.retries < 2 },
      },
    },
  },
}

function probe(machine = FETCHER) {
  let api
  const Probe = () => {
    api = useMachine(machine)
    return null
  }
  render(<Probe />)
  return {
    state: () => api[0],
    send: (event) => act(() => api[1](event)),
    sender: () => api[1],
  }
}

test('starts in the initial state', () => {
  expect(probe().state().value).toBe('idle')
})

test('starts with the initial context', () => {
  expect(probe().state().context).toEqual({ retries: 0, data: null })
})

test('a known event moves to its target', () => {
  const p = probe()
  p.send('FETCH')

  expect(p.state().value).toBe('loading')
})

test('an event the current state does not handle is ignored', () => {
  const p = probe()
  p.send('RESOLVE')

  expect(p.state().value).toBe('idle')
})

test('an event handled by ANOTHER state is still ignored here', () => {
  const p = probe()
  p.send('RETRY')

  expect(p.state().value).toBe('idle')
})

test('matches answers what state it is in', () => {
  const p = probe()
  expect(p.state().matches('idle')).toBe(true)
  expect(p.state().matches('loading')).toBe(false)
})

test('a transition can be a bare target string', () => {
  const p = probe()
  p.send('FETCH')
  p.send('RESOLVE')

  expect(p.state().value).toBe('success')
})

test('an action updates the context', () => {
  const p = probe()
  p.send('FETCH')
  p.send({ type: 'RESOLVE', data: 'hello' })

  expect(p.state().context.data).toBe('hello')
})

test('the event payload reaches the action', () => {
  const p = probe()
  p.send('FETCH')
  p.send({ type: 'REJECT' })

  expect(p.state().context.retries).toBe(1)
})

test('a transition without an action leaves the context alone', () => {
  const p = probe()
  const before = p.state().context
  p.send('FETCH')

  expect(p.state().context).toEqual(before)
})

test('a guard that passes lets the transition through', () => {
  const p = probe()
  p.send('FETCH')
  p.send('REJECT')
  p.send('RETRY')

  expect(p.state().value).toBe('loading')
})

test('a guard that fails blocks it, and nothing else changes', () => {
  const p = probe()
  p.send('FETCH')
  p.send('REJECT')
  p.send('RETRY')
  p.send('REJECT')
  expect(p.state().context.retries).toBe(2)

  // The guard only allows two retries.
  p.send('RETRY')
  expect(p.state().value).toBe('failure')
  expect(p.state().context.retries).toBe(2)
})

test('the machine can cycle back round', () => {
  const p = probe()
  p.send('FETCH')
  p.send('RESOLVE')
  p.send('FETCH')

  expect(p.state().value).toBe('loading')
})

test('send keeps its identity across renders', () => {
  const p = probe()
  const before = p.sender()
  p.send('FETCH')

  expect(p.sender()).toBe(before)
})
