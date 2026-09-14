// The specs `import { test, expect, vi } from 'vitest'`, but Sandpack runs Jest.
// This is the virtual `node_modules/vitest` that maps one onto the other, so the
// spec files stay identical in both runners. It is a string rather than a module
// because it is written into Sandpack's own file system, never bundled with us.
const SOURCE = `
import '@testing-library/jest-dom'

// Chrome throttles setTimeout to ~1/s in Sandpack's hidden test iframe, and
// user-event awaits one per click — so a correct answer blew the 5s timeout.
if (!globalThis.__unthrottled) {
  globalThis.__unthrottled = true
  const nativeSetTimeout = globalThis.setTimeout
  const nativeClearTimeout = globalThis.clearTimeout
  const cancelled = new Set()
  let nextId = -1

  globalThis.setTimeout = function (fn, ms, ...args) {
    if (typeof fn !== 'function' || ms > 0) return nativeSetTimeout(fn, ms, ...args)
    const id = nextId--
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = () => {
      port1.close()
      if (!cancelled.delete(id)) fn(...args)
    }
    port2.postMessage(0)
    return id
  }

  globalThis.clearTimeout = (id) =>
    typeof id === 'number' && id < 0 ? cancelled.add(id) : nativeClearTimeout(id)
}

// Sandpack renders the DOM in one realm and runs the spec's globals in another:
// \`el.ownerDocument !== globalThis.document\`, and the ambient one is an empty
// page. user-event takes its window from an element it is handed, so click(el)
// and type(el) were fine — but keyboard(), tab() and setup() resolved the
// ambient document and typed into nothing, silently. Handing user-event the
// right document fixes every one of them, so that is all this does.
//
// globalThis.document cannot be reassigned (the property is not configurable),
// and the right document is reachable from no global — but Testing Library's
// render() returns a container that knows it, and both modules are writable.
{
  const rtl = require('@testing-library/react')
  const ueModule = require('@testing-library/user-event')
  const userEvent = ueModule.default ?? ueModule

  let rendered = null

  const originalRender = rtl.render
  rtl.render = (...args) => {
    const result = originalRender(...args)
    rendered = result?.container?.ownerDocument ?? rendered
    return result
  }

  // An element in the arguments is the best answer; the last thing rendered is
  // the fallback for the calls that take none — tab() and keyboard().
  const documentFor = (args) => {
    for (const arg of args) {
      if (arg && arg.ownerDocument) return arg.ownerDocument
    }
    return rendered ?? globalThis.document
  }

  const realSetup = userEvent.setup.bind(userEvent)

  userEvent.setup = (options = {}) => {
    if (options.document || rendered) {
      return realSetup({ document: rendered, ...options })
    }
    // setup() is routinely the first line of a test, before anything has
    // rendered. Bind the session on first use instead, by which time it has.
    let session = null
    return new Proxy(
      {},
      {
        get:
          (_, key) =>
          (...args) => {
            session ??= realSetup({ document: documentFor(args), ...options })
            return session[key](...args)
          },
      },
    )
  }

  // The direct API is a fresh session per call already — this only decides which
  // document that session gets.
  for (const name of [
    'click', 'dblClick', 'tripleClick', 'hover', 'unhover', 'tab', 'keyboard',
    'type', 'clear', 'selectOptions', 'deselectOptions', 'paste', 'pointer',
    'upload',
  ]) {
    if (typeof userEvent[name] !== 'function') continue
    userEvent[name] = (...args) =>
      realSetup({ document: documentFor(args) })[name](...args)
  }
}

// Sandpack's Jest answers to useFakeTimers() but ships none of the methods that
// move them — advanceTimersByTime is simply not there. Fourteen of the timer
// challenges were therefore unsolvable in the browser while passing in the
// terminal. This is a small clock of our own, installed over whatever Jest did.
const MAX_TURNS = 100000

function installClock() {
  const timers = new Map()
  const realDate = globalThis.Date
  const real = {
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    setInterval: globalThis.setInterval,
    clearInterval: globalThis.clearInterval,
  }
  let now = realDate.now()
  let seq = 0

  // Both Date.now() and a bare new Date() have to read the fake clock, or a
  // component that renders the current time never moves.
  class FakeDate extends realDate {
    constructor(...args) {
      if (args.length === 0) super(now)
      else super(...args)
    }
    static now() {
      return now
    }
  }
  globalThis.Date = FakeDate

  globalThis.setTimeout = (fn, ms, ...args) => {
    const id = ++seq
    timers.set(id, { fn, args, at: now + (ms || 0), every: 0 })
    return id
  }
  globalThis.setInterval = (fn, ms, ...args) => {
    const id = ++seq
    const every = Math.max(ms || 0, 1)
    timers.set(id, { fn, args, at: now + every, every })
    return id
  }
  globalThis.clearTimeout = (id) => timers.delete(id)
  globalThis.clearInterval = (id) => timers.delete(id)

  // The earliest timer due at or before \`until\`. Recomputed every turn, because
  // a callback is free to schedule another one inside the same window.
  const nextDue = (until) => {
    let found = null
    for (const entry of timers) {
      if (entry[1].at <= until && (!found || entry[1].at < found[1].at)) found = entry
    }
    return found
  }

  const fire = (entry) => {
    const [id, timer] = entry
    now = timer.at
    if (timer.every) timer.at = now + timer.every
    else timers.delete(id)
    timer.fn(...timer.args)
  }

  return {
    advance(ms) {
      const until = now + ms
      for (let turn = 0; turn < MAX_TURNS; turn++) {
        const entry = nextDue(until)
        if (!entry) break
        fire(entry)
      }
      now = until
    },
    async advanceAsync(ms) {
      const until = now + ms
      for (let turn = 0; turn < MAX_TURNS; turn++) {
        const entry = nextDue(until)
        if (!entry) break
        fire(entry)
        // Let any promise the callback settled run before the next timer.
        await Promise.resolve()
      }
      now = until
      await Promise.resolve()
    },
    setSystemTime(value) {
      now = value instanceof realDate ? value.getTime() : Number(value)
    },
    count: () => timers.size,
    uninstall() {
      globalThis.Date = realDate
      globalThis.setTimeout = real.setTimeout
      globalThis.clearTimeout = real.clearTimeout
      globalThis.setInterval = real.setInterval
      globalThis.clearInterval = real.clearInterval
    },
  }
}

let clock = null
const stubs = []

export const describe = globalThis.describe
export const test = globalThis.test
export const it = globalThis.it
export const expect = globalThis.expect
export const beforeEach = globalThis.beforeEach
export const afterEach = globalThis.afterEach
export const beforeAll = globalThis.beforeAll
export const afterAll = globalThis.afterAll

export const vi = {
  // Jest's own mocking is fine and is what vi.fn/spyOn are underneath.
  fn: (...args) => globalThis.jest.fn(...args),
  spyOn: (...args) => globalThis.jest.spyOn(...args),
  clearAllMocks: () => globalThis.jest.clearAllMocks(),
  resetAllMocks: () => globalThis.jest.resetAllMocks(),
  restoreAllMocks: () => globalThis.jest.restoreAllMocks(),

  useFakeTimers() {
    if (!clock) clock = installClock()
  },
  useRealTimers() {
    if (clock) clock.uninstall()
    clock = null
  },
  advanceTimersByTime(ms) {
    if (clock) clock.advance(ms)
  },
  async advanceTimersByTimeAsync(ms) {
    if (clock) await clock.advanceAsync(ms)
  },
  runAllTimers() {
    if (clock) clock.advance(Number.MAX_SAFE_INTEGER)
  },
  getTimerCount: () => (clock ? clock.count() : 0),
  setSystemTime(value) {
    if (clock) clock.setSystemTime(value)
  },

  stubGlobal(key, value) {
    stubs.push([key, key in globalThis, globalThis[key]])
    globalThis[key] = value
  },
  unstubAllGlobals() {
    while (stubs.length) {
      const [key, existed, previous] = stubs.pop()
      if (existed) globalThis[key] = previous
      else delete globalThis[key]
    }
  },
}
`

export const SHIM_FILES = {
  '/node_modules/vitest/package.json': JSON.stringify({
    name: 'vitest',
    main: 'index.js',
  }),
  '/node_modules/vitest/index.js': SOURCE,
}

// The other half of the browser runner's environment: what a spec is allowed to
// import that is not `vitest`, `react` or a relative path. Lives here rather
// than in Challenge.jsx so `Check.jsx` and `checks.test.js` read the same list
// instead of keeping a second copy that drifts.
export const DEPS = {
  '@testing-library/react': '^16.0.0',
  // peer dep of react/user-event — Sandpack will not pull it in on its own
  '@testing-library/dom': '^10.4.0',
  // pinned: 14.6.2+ hangs on click/type until the 5s jest timeout
  // https://github.com/testing-library/user-event/issues/1323
  '@testing-library/user-event': '14.6.1',
  '@testing-library/jest-dom': '^6.4.0',
}
