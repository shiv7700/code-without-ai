import { expect, test } from 'vitest'
import { DEPS } from './sandpackVitestShim'

// Vitest in the terminal has the whole of vitest; Sandpack has a hand-written
// shim over Jest. A spec that reaches past the shim is green here and quietly
// unsolvable in the browser — which is where the challenges are actually done.
// This is the cheap half of that check: read every spec, allow only what the
// browser runner can supply. `/check` is the expensive half.

// Comments out first, or a prose `from 'b'` reads as an import. Nothing here
// puts a URL and an import on the same line, so line-stripping is safe.
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')

const specs = Object.entries(
  import.meta.glob('./challenges/*/*.test.{js,jsx}', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
).map(([path, source]) => [path, stripComments(source)])

// Whatever the shim's `vi` object exports — parsed out of its source rather than
// imported, because the shim is a string that only ever runs inside Sandpack.
const shimSource = import.meta.glob('./sandpackVitestShim.js', {
  query: '?raw',
  import: 'default',
  eager: true,
})['./sandpackVitestShim.js']

const viBody = shimSource.slice(shimSource.indexOf('export const vi = {'))
const VI_METHODS = new Set(
  [...viBody.matchAll(/^ {2}(?:async )?([a-zA-Z]+)[(:]/gm)].map((m) => m[1]),
)

const ALLOWED_PACKAGES = new Set(['vitest', 'react', 'react-dom', ...Object.keys(DEPS)])

test('the shim really does export a vi object', () => {
  expect(VI_METHODS.has('fn')).toBe(true)
  expect(VI_METHODS.size).toBeGreaterThan(5)
})

test('every vi.* a spec uses exists on the browser shim', () => {
  const offenders = []

  for (const [path, source] of specs) {
    for (const [, method] of source.matchAll(/\bvi\.([a-zA-Z]+)/g)) {
      if (VI_METHODS.has(method)) continue
      offenders.push(
        `${path} uses vi.${method}, which src/sandpackVitestShim.js does not ` +
          `provide — the spec would pass in the terminal and fail in the browser.`,
      )
    }
  }

  expect(offenders).toEqual([])
})

test('every import a spec makes is one the browser runner can resolve', () => {
  const offenders = []

  for (const [path, source] of specs) {
    for (const [, module] of source.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)) {
      if (module.startsWith('.')) continue
      if (ALLOWED_PACKAGES.has(module)) continue
      offenders.push(
        `${path} imports '${module}', which is not in Sandpack's dependency ` +
          `list (src/sandpackVitestShim.js, DEPS) — it does not exist in the browser.`,
      )
    }
  }

  expect(offenders).toEqual([])
})
