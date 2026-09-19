import { expect, test } from 'vitest'
import { decodeFiles, encodeFiles } from './store'

// Not a challenge — edit this freely. It guards the one thing in store.js that
// could silently eat saved work: the row holds one text column, and what goes
// in has to be exactly what comes back out.
const STUB = '/Greeting.jsx'

test('one file is stored as its own source, not as JSON', () => {
  expect(encodeFiles({ [STUB]: 'export default () => null' })).toBe(
    'export default () => null',
  )
})

test('a row written before multi-file still loads', () => {
  expect(decodeFiles('export default () => null', STUB)).toEqual({
    [STUB]: 'export default () => null',
  })
})

test('several files round-trip', () => {
  const files = { [STUB]: 'a', '/useThing.js': 'b' }
  expect(decodeFiles(encodeFiles(files), STUB)).toEqual(files)
})

test('a solution that happens to start with a brace is one file', () => {
  const code = '{ "not": "a file map" }'
  expect(decodeFiles(code, STUB)).toEqual({ [STUB]: code })
})

test('JSON whose keys are not paths is one file', () => {
  const code = JSON.stringify({ name: 'Ada' })
  expect(decodeFiles(code, STUB)).toEqual({ [STUB]: code })
})

test('a missing row decodes to nothing usable rather than throwing', () => {
  expect(decodeFiles(null, STUB)).toEqual({})
})
