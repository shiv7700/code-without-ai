import { act, render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import Overview from './Overview'

// Nothing resolves until the test says so — the only way to check that one
// panel is still waiting while another has already answered.
function controllable() {
  let settle = {}
  let calls = 0
  const load = () => {
    calls += 1
    return new Promise((resolve, reject) => {
      settle = { resolve, reject }
    })
  }
  return {
    load,
    calls: () => calls,
    resolve: (value) => act(async () => settle.resolve(value)),
    reject: () => act(async () => settle.reject(new Error('nope'))),
  }
}

const three = () => {
  const users = controllable()
  const sales = controllable()
  const errors = controllable()
  return {
    users,
    sales,
    errors,
    load: { users: users.load, sales: sales.load, errors: errors.load },
  }
}

const panel = (name) => within(screen.getByRole('region', { name }))

test('all three regions are there', () => {
  const { load } = three()
  render(<Overview load={load} />)
  expect(screen.getAllByRole('region')).toHaveLength(3)
})

test('each panel waits on its own', () => {
  const { load } = three()
  render(<Overview load={load} />)
  expect(panel('Users').getByText('Loading…')).toBeInTheDocument()
  expect(panel('Sales').getByText('Loading…')).toBeInTheDocument()
  expect(panel('Errors').getByText('Loading…')).toBeInTheDocument()
})

test('all three start at once', () => {
  const t = three()
  render(<Overview load={t.load} />)
  expect(t.users.calls()).toBe(1)
  expect(t.sales.calls()).toBe(1)
  expect(t.errors.calls()).toBe(1)
})

test('one answering leaves the others waiting', async () => {
  const t = three()
  render(<Overview load={t.load} />)
  await t.sales.resolve('42')
  expect(panel('Sales').getByText('42')).toBeInTheDocument()
  expect(panel('Users').getByText('Loading…')).toBeInTheDocument()
})

test('a failure stays in its own panel', async () => {
  const t = three()
  render(<Overview load={t.load} />)
  await t.errors.reject()
  await t.users.resolve('7')
  expect(panel('Errors').getByText('Could not load')).toBeInTheDocument()
  expect(panel('Users').getByText('7')).toBeInTheDocument()
  expect(panel('Sales').getByText('Loading…')).toBeInTheDocument()
})

test('a sibling answering does not restart anyone', async () => {
  const t = three()
  render(<Overview load={t.load} />)
  await t.sales.resolve('42')
  await t.errors.reject()
  expect(t.users.calls()).toBe(1)
  expect(t.sales.calls()).toBe(1)
  expect(t.errors.calls()).toBe(1)
})
