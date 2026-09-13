import { expect, test } from 'vitest'
import { camelKeys, snakeKeys } from './camelKeys'

test('renames the keys of a flat object', () => {
  expect(camelKeys({ user_name: 'ada', id: 1 })).toEqual({
    userName: 'ada',
    id: 1,
  })
})

test('snakeKeys goes the other way', () => {
  expect(snakeKeys({ userName: 'ada', createdAt: 2 })).toEqual({
    user_name: 'ada',
    created_at: 2,
  })
})

test('nested objects are renamed too', () => {
  expect(camelKeys({ outer_one: { inner_two: { deep_three: 1 } } })).toEqual({
    outerOne: { innerTwo: { deepThree: 1 } },
  })
})

test('an array stays an array, and the objects inside it are renamed', () => {
  const out = camelKeys({ test_runs: [{ run_id: 1 }, { run_id: 2 }] })

  expect(Array.isArray(out.testRuns)).toBe(true)
  expect(out.testRuns).toEqual([{ runId: 1 }, { runId: 2 }])
})

test('only keys change — string values are left exactly as they are', () => {
  expect(camelKeys({ status_name: 'in_progress' })).toEqual({
    statusName: 'in_progress',
  })
})

test('values that are not plain objects come through by reference', () => {
  const date = new Date(0)
  const out = camelKeys({ created_at: date, deleted_at: null })

  expect(out.createdAt).toBe(date)
  expect(out.deletedAt).toBe(null)
})

test('survives deep nesting and round-trips back', () => {
  let value = { leaf_node: 1 }
  for (let i = 0; i < 100; i++) value = { next_link: value }

  expect(snakeKeys(camelKeys(value))).toEqual(value)
})
