import { expect, test } from 'vitest'
import { promiseAny } from './promiseAny'

const after = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms))
const failAfter = (ms, error) =>
  new Promise((_, reject) => setTimeout(() => reject(error), ms))

test('resolves with the first value to arrive', async () => {
  await expect(promiseAny([after(30, 'slow'), after(1, 'fast')])).resolves.toBe('fast')
})

test('a rejection does not sink it while others are still running', async () => {
  await expect(promiseAny([Promise.reject(new Error('no')), after(5, 'yes')])).resolves.toBe(
    'yes',
  )
})

test('a later rejection cannot undo the win', async () => {
  const result = promiseAny([after(1, 'yes'), failAfter(20, new Error('too late'))])
  await expect(result).resolves.toBe('yes')
})

test('rejects with an AggregateError once every one has failed', async () => {
  const promise = promiseAny([Promise.reject(new Error('a')), Promise.reject(new Error('b'))])
  await expect(promise).rejects.toBeInstanceOf(AggregateError)
})

test('the AggregateError carries the reasons in input order', async () => {
  const a = new Error('a')
  const b = new Error('b')

  await promiseAny([failAfter(20, a), failAfter(1, b)]).then(
    () => expect.unreachable(),
    (error) => expect(error.errors).toEqual([a, b]),
  )
})

test('an empty input rejects rather than hanging', async () => {
  await expect(promiseAny([])).rejects.toBeInstanceOf(AggregateError)
})
