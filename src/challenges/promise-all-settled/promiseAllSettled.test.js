import { expect, test } from 'vitest'
import { promiseAllSettled } from './promiseAllSettled'

function deferred() {
  const box = {}
  box.promise = new Promise((resolve, reject) => {
    box.resolve = resolve
    box.reject = reject
  })
  return box
}

test('an empty list resolves to an empty array', async () => {
  await expect(promiseAllSettled([])).resolves.toEqual([])
})

test('a fulfilled entry carries the value', async () => {
  await expect(promiseAllSettled([Promise.resolve(1)])).resolves.toEqual([
    { status: 'fulfilled', value: 1 },
  ])
})

test('a rejection is reported, not thrown', async () => {
  const error = new Error('nope')

  await expect(promiseAllSettled([Promise.reject(error)])).resolves.toEqual([
    { status: 'rejected', reason: error },
  ])
})

test('one rejection does not stop the others being reported', async () => {
  const results = await promiseAllSettled([
    Promise.resolve('a'),
    Promise.reject('b'),
    Promise.resolve('c'),
  ])

  expect(results.map((r) => r.status)).toEqual([
    'fulfilled',
    'rejected',
    'fulfilled',
  ])
})

test('values that are not promises are fulfilled', async () => {
  await expect(promiseAllSettled([1, 'two'])).resolves.toEqual([
    { status: 'fulfilled', value: 1 },
    { status: 'fulfilled', value: 'two' },
  ])
})

test('the results are in input order, not the order they settled', async () => {
  const slow = deferred()
  const quick = deferred()
  const settled = promiseAllSettled([slow.promise, quick.promise])

  quick.resolve('second')
  await Promise.resolve()
  slow.resolve('first')

  expect(await settled).toEqual([
    { status: 'fulfilled', value: 'first' },
    { status: 'fulfilled', value: 'second' },
  ])
})

test('each result has exactly the keys its status calls for', async () => {
  const [ok, bad] = await promiseAllSettled([
    Promise.resolve(undefined),
    Promise.reject(new Error('x')),
  ])

  expect(Object.keys(ok).sort()).toEqual(['status', 'value'])
  expect(Object.keys(bad).sort()).toEqual(['reason', 'status'])
})
