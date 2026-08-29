import { useState } from 'react'
import { Link } from 'react-router'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
} from '@codesandbox/sandpack-react'
import { saveDone } from './store'

// The specs `import { test, expect, vi } from 'vitest'`, but Sandpack runs Jest.
// A virtual node_modules/vitest maps one onto the other so the spec files stay
// untouched. jest-dom registers its matchers on import.
const VITEST_SHIM = `
import '@testing-library/jest-dom'

export const describe = globalThis.describe
export const test = globalThis.test
export const it = globalThis.it
export const expect = globalThis.expect
export const beforeEach = globalThis.beforeEach
export const afterEach = globalThis.afterEach
export const vi = globalThis.jest
`

const SHIM_FILES = {
  '/node_modules/vitest/package.json': JSON.stringify({
    name: 'vitest',
    main: 'index.js',
  }),
  '/node_modules/vitest/index.js': VITEST_SHIM,
}

const DEPS = {
  '@testing-library/react': '^16.0.0',
  // peer dep of react/user-event — Sandpack will not pull it in on its own
  '@testing-library/dom': '^10.4.0',
  '@testing-library/user-event': '^14.5.0',
  '@testing-library/jest-dom': '^6.4.0',
}

const BTN = 'rounded-md border border-line bg-panel px-3 py-1 hover:border-dim'

const note = (text) => `export default () => (
  <p style={{ font: '14px system-ui', opacity: 0.6, padding: 16 }}>${text}</p>
)`

// Specs nest tests under describes; the ladder uses neither, but walking both
// costs three lines and survives a spec that does.
const allTests = (node) => [
  ...Object.values(node.tests ?? {}),
  ...Object.values(node.describes ?? {}).flatMap(allTests),
]

const MARK = { pass: '✓', fail: '✗' }
const MARK_COLOR = { pass: 'text-go', fail: 'text-red-400' }

export default function Challenge({ challenge }) {
  const [view, setView] = useState('tests')
  const [status, setStatus] = useState({})
  const { name, title, level, stub, files, needsUi, tests } = challenge

  const app = !needsUi
    ? note('No UI is required here — this one is a hook. Tests only.')
    : (files['/demo.jsx'] ??
      note('Add a demo.jsx to this challenge folder and it shows up here.'))

  const handleComplete = (specs) => {
    const ran = Object.values(specs ?? {}).flatMap(allTests)
    setStatus(Object.fromEntries(ran.map((t) => [t.name, t.status])))
    saveDone(name, ran.length > 0 && ran.every((t) => t.status === 'pass'))
  }

  const passed = tests.filter((t) => status[t] === 'pass').length

  return (
    <>
      <header className="flex items-center gap-4 px-4 py-2">
        <Link to="/" className={BTN}>
          ← all challenges
        </Link>
        <strong>
          {String(level).padStart(2, '0')} — {title}
        </strong>
        <button onClick={() => setView(view === 'tests' ? 'preview' : 'tests')} className={BTN}>
          show {view === 'tests' ? 'UI' : 'tests'}
        </button>
        <span className="ml-auto text-sm text-dim">
          first load takes ~20s — deps come from a CDN
        </span>
      </header>

      <SandpackProvider
        key={name}
        template="react"
        theme="dark"
        files={{ ...files, ...SHIM_FILES, '/App.js': app }}
        options={{ activeFile: stub, visibleFiles: [stub] }}
        customSetup={{ dependencies: DEPS }}
      >
        <SandpackLayout>
          <SandpackCodeEditor showLineNumbers style={{ height: '88vh' }} />

          <div className="flex flex-1 flex-col" style={{ height: '88vh' }}>
            {/* What the spec checks, readable before a single test has run. */}
            <div className="max-h-[35%] overflow-auto border-b border-line bg-panel px-4 py-3">
              <p className="mb-2 text-xs tracking-wide text-dim uppercase">
                what the tests check — {passed} of {tests.length} passing
              </p>
              <ul className="space-y-1 text-sm">
                {tests.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className={MARK_COLOR[status[t]] ?? 'text-dim'}>
                      {MARK[status[t]] ?? '○'}
                    </span>
                    <span className={status[t] === 'pass' ? 'text-dim' : ''}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview and Tests share one Sandpack client, so a failing
                assertion surfaces in the preview's error overlay. One at a
                time keeps them out of each other's way. */}
            <div className="min-h-0 flex-1">
              {view === 'tests' ? (
                <SandpackTests
                  watchMode
                  verbose
                  onComplete={handleComplete}
                  style={{ height: '100%' }}
                />
              ) : (
                <SandpackPreview style={{ height: '100%' }} />
              )}
            </div>
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </>
  )
}
