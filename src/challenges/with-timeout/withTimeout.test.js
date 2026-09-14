import { expect, test } from 'vitest'
import { withTimeout } from './withTimeout'

function deferred() {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

test('the work finishing first wins', async () => {
  await expect(withTimeout(async () => 'done', 50)).resolves.toBe('done')
})

test('the clock winning rejects with a TimeoutError', async () => {
  const work = deferred()
  const promise = withTimeout(() => work.promise, 10, 'too slow')

  await expect(promise).rejects.toMatchObject({
    name: 'TimeoutError',
    message: 'too slow',
  })
  work.resolve('ignored')
})

test('the work failing on its own comes through untouched', async () => {
  const boom = new Error('boom')
  await expect(withTimeout(() => Promise.reject(boom), 50)).rejects.toBe(boom)
})

test('a value arriving after the timeout changes nothing', async () => {
  const work = deferred()
  const promise = withTimeout(() => work.promise, 10)
  const outcome = promise.then(
    () => 'resolved',
    (e) => e.name,
  )

  await expect(promise).rejects.toThrow()
  work.resolve('late')
  await sleep(20)

  expect(await outcome).toBe('TimeoutError')
})

test('the timeout aborts the signal it handed out', async () => {
  const work = deferred()
  let signal
  const promise = withTimeout((s) => {
    signal = s
    return work.promise
  }, 10)

  expect(signal.aborted).toBe(false)
  await expect(promise).rejects.toThrow()
  expect(signal.aborted).toBe(true)
  work.resolve('ignored')
})

test('a success leaves no timer behind to abort the signal later', async () => {
  let signal
  await withTimeout((s) => {
    signal = s
    return Promise.resolve('done')
  }, 10)

  await sleep(60)
  expect(signal.aborted).toBe(false)
})
