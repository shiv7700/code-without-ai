import { expect, test } from 'vitest'
import { challenges, tiers } from './challenges'
import { LADDER } from './ladder'

// The ladder file and the folders on disk drift apart silently otherwise: a
// typo puts a challenge in Unsorted, a rename loses its saved code.
test('every slug in the ladder has a folder behind it', () => {
  const onDisk = new Set(challenges.map((c) => c.name))
  const missing = LADDER.flatMap((s) => s.challenges).filter(
    (slug) => !onDisk.has(slug),
  )
  expect(missing).toEqual([])
})

test('every folder is placed on the ladder', () => {
  expect(challenges.filter((c) => c.tier.name === 'Unsorted')).toEqual([])
})

test('levels are positions — 1, 2, 3, with no gaps', () => {
  expect(challenges.map((c) => c.level)).toEqual(
    challenges.map((_, i) => i + 1),
  )
})

test('a challenge appears exactly once', () => {
  const names = challenges.map((c) => c.name)
  expect(new Set(names).size).toBe(names.length)
})

test('every challenge has a summary, topics and a spec', () => {
  for (const c of challenges) {
    expect(c.summary, c.name).not.toBe('')
    expect(c.topics.length, c.name).toBeGreaterThan(0)
    expect(c.tests.length, c.name).toBeGreaterThan(0)
  }
})

test('the sections add up to the whole list', () => {
  expect(tiers.flatMap((t) => t.challenges)).toHaveLength(challenges.length)
})

test('every challenge has three to five hints', () => {
  for (const c of challenges) {
    expect(c.hints.length, `${c.name} has ${c.hints.length} hints`).toBeGreaterThanOrEqual(3)
    expect(c.hints.length, `${c.name} has ${c.hints.length} hints`).toBeLessThanOrEqual(5)
  }
})

// A hint that names the hook is not a hint, it is the answer with extra steps.
// The whole repo exists to make him reach for the name himself.
const GIVEAWAYS = [
  /\buse(Ref|Callback|Memo|State|Effect|Reducer|Context|LayoutEffect)\b/,
  /\buse(SyncExternalStore|ImperativeHandle|Transition|DeferredValue)\b/,
  /\bPromise\.(all|any|race|allSettled)\b/,
  /\bAbortController\b/,
  /\bstructuredClone\b/,
  /\bspread operator\b/,
  /```/,
  /=>/,
]

test('no hint names the API or writes the code', () => {
  for (const c of challenges) {
    for (const hint of c.hints) {
      for (const pattern of GIVEAWAYS) {
        expect(hint, `${c.name}: ${hint}`).not.toMatch(pattern)
      }
    }
  }
})
