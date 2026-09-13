import { expect, test, vi } from 'vitest'
import { promisify } from './promisify'

const readFile = (name, callback) =>
  setTimeout(() => {
    if (name === 'missing.txt') callback(new Error('ENOENT'))
    else callback(null, `contents of ${name}`)
  }, 1)

test('resolves with the callback value', async () => {
  await expect(promisify(readFile)('a.txt')).resolves.toBe('contents of a.txt')
})

test('rejects with the callback error', async () => {
  await expect(promisify(readFile)('missing.txt')).rejects.toThrow('ENOENT')
})

test('a null error is a success, not a failure', async () => {
  const fn = (callback) => callback(null, 'ok')
  await expect(promisify(fn)()).resolves.toBe('ok')
})

test('passes every argument through, then the callback', async () => {
  const spy = vi.fn((a, b, callback) => callback(null, a + b))
  await promisify(spy)(1, 2)

  expect(spy.mock.calls[0][0]).toBe(1)
  expect(spy.mock.calls[0][1]).toBe(2)
  expect(typeof spy.mock.calls[0][2]).toBe('function')
})

test('does not call the function until the wrapper is called', () => {
  const spy = vi.fn()
  promisify(spy)
  expect(spy).not.toHaveBeenCalled()
})

test('the wrapper can be called more than once', async () => {
  const wrapped = promisify(readFile)
  await expect(Promise.all([wrapped('a.txt'), wrapped('b.txt')])).resolves.toEqual([
    'contents of a.txt',
    'contents of b.txt',
  ])
})
