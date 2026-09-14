import { act, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useAsync } from './useAsync'

// Nothing settles until the test says so.
function controllable() {
  const pending = new Map()
  const load = (id) =>
    new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
  return {
    load,
    asked: () => [...pending.keys()],
    resolve: (id, v) => act(async () => pending.get(id).resolve(v)),
    reject: (id, e) => act(async () => pending.get(id).reject(e)),
  }
}

let handed = []

function Probe({ load, tag = '' }) {
  const { status, data, error, run } = useAsync((id) => load(id + tag))
  handed.push(run)
  return (
    <output>
      {status}:{String(data)}:{String(error?.message)}
    </output>
  )
}

const out = () => screen.getByRole('status').textContent
const run = (arg) =>
  act(async () => {
    handed.at(-1)(arg)
  })

function mount(api) {
  handed = []
  return render(<Probe load={api.load} />)
}

test('it starts idle, with nothing in it', () => {
  mount(controllable())
  expect(out()).toBe('idle:null:undefined')
})

test('running goes to pending, then success with the resolved value', async () => {
  const api = controllable()
  mount(api)

  await run('a')
  expect(out()).toBe('pending:null:undefined')

  await api.resolve('a', 'APPLE')
  expect(out()).toBe('success:APPLE:undefined')
})

test('a rejection lands as the error state', async () => {
  const api = controllable()
  mount(api)

  await run('a')
  await api.reject('a', new Error('nope'))

  expect(out()).toBe('error:null:nope')
})

test('it calls the function from the latest render, keeping one identity', async () => {
  const api = controllable()
  handed = []
  const view = render(<Probe load={api.load} />)
  const first = handed[0]

  view.rerender(<Probe load={api.load} tag="!" />)
  await run('a')

  expect(api.asked()).toEqual(['a!'])
  for (const fn of handed) expect(fn).toBe(first)
})

test('when two runs overlap, only the later one may set the state', async () => {
  const api = controllable()
  mount(api)

  await run('one')
  await run('two')

  await api.resolve('two', 'TWO')
  await api.resolve('one', 'ONE')

  expect(out()).toBe('success:TWO:undefined')
})

test('a run that settles after unmount does not blow up', async () => {
  const api = controllable()
  const view = mount(api)

  await run('a')
  view.unmount()

  await expect(api.resolve('a', 'APPLE')).resolves.toBe(undefined)
})
