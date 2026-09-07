import { act, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { useRouter } from './useRouter'

beforeEach(() => window.history.replaceState(null, '', '/'))

function probe() {
  let api
  const Probe = () => {
    api = useRouter()
    return <p data-testid="path">{api.path}</p>
  }
  const view = render(<Probe />)
  return {
    ...view,
    get: () => api,
    shown: () => screen.getByTestId('path').textContent,
    call: (name, ...args) => act(() => api[name](...args)),
  }
}

// What the browser does when someone presses Back.
const popTo = (path) =>
  act(() => {
    window.history.replaceState(null, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })

test('starts at the current location', () => {
  window.history.replaceState(null, '', '/start')
  expect(probe().shown()).toBe('/start')
})

test('push changes the path', () => {
  const p = probe()
  p.call('push', '/about')

  expect(p.shown()).toBe('/about')
})

test('push changes the address bar too', () => {
  const p = probe()
  p.call('push', '/about')

  expect(window.location.pathname).toBe('/about')
})

test('push adds to the history', () => {
  const p = probe()
  const before = window.history.length
  p.call('push', '/about')

  expect(window.history.length).toBe(before + 1)
})

test('replace changes the path without adding to the history', () => {
  const p = probe()
  const before = window.history.length
  p.call('replace', '/login')

  expect(p.shown()).toBe('/login')
  expect(window.history.length).toBe(before)
})

test('going back updates the path', () => {
  const p = probe()
  p.call('push', '/about')
  popTo('/')

  expect(p.shown()).toBe('/')
})

test('a popstate the hook did not cause is still picked up', () => {
  const p = probe()
  popTo('/somewhere-else')

  expect(p.shown()).toBe('/somewhere-else')
})

test('push and replace keep their identity across renders', () => {
  const p = probe()
  const before = p.get()

  p.call('push', '/about')
  expect(p.get().push).toBe(before.push)
  expect(p.get().replace).toBe(before.replace)
})

test('two components stay in step', () => {
  let outer
  const Inner = () => <p data-testid="inner">{useRouter().path}</p>
  const Outer = () => {
    outer = useRouter()
    return <Inner />
  }
  render(<Outer />)

  act(() => outer.push('/shared'))
  expect(screen.getByTestId('inner')).toHaveTextContent('/shared')
})

test('the popstate listener is removed on unmount', () => {
  const p = probe()
  p.unmount()

  expect(() => popTo('/after')).not.toThrow()
})
