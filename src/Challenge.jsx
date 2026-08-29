import { useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
} from '@codesandbox/sandpack-react'

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

const note = (text) => `export default () => (
  <p style={{ font: '14px system-ui', opacity: 0.6, padding: 16 }}>${text}</p>
)`

// Specs nest tests under describes; the ladder uses neither, but walking both
// costs three lines and survives a spec that does.
const allTests = (node) => [
  ...Object.values(node.tests ?? {}),
  ...Object.values(node.describes ?? {}).flatMap(allTests),
]

export default function Challenge({ challenge, onBack, onResult }) {
  const [view, setView] = useState('tests')
  const { name, title, stub, files, needsUi } = challenge

  const app = !needsUi
    ? note('No UI is required here — this one is a hook. Tests only.')
    : (files['/demo.jsx'] ??
      note('Add a demo.jsx to this challenge folder and it shows up here.'))

  const handleComplete = (specs) => {
    const tests = Object.values(specs ?? {}).flatMap(allTests)
    onResult(tests.length > 0 && tests.every((t) => t.status === 'pass'))
  }

  return (
    <>
      <header className="bar">
        <button onClick={onBack}>← all challenges</button>
        <strong>
          {String(challenge.level).padStart(2, '0')} — {title}
        </strong>
        <button onClick={() => setView(view === 'tests' ? 'preview' : 'tests')}>
          show {view === 'tests' ? 'UI' : 'tests'}
        </button>
        <span className="hint">first load takes ~20s — deps come from a CDN</span>
      </header>

      {/* ponytail: remounting per challenge re-installs deps (~20s). Swapping
          files in place would be instant, but the old challenge's spec would
          linger in the virtual FS and keep running. Fix that first if it bites. */}
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
          {/* Preview and Tests share one Sandpack client, so a failing
              assertion surfaces in the preview's error overlay. One at a
              time keeps them out of each other's way. */}
          {view === 'tests' ? (
            <SandpackTests
              watchMode
              verbose
              onComplete={handleComplete}
              style={{ height: '88vh' }}
            />
          ) : (
            <SandpackPreview style={{ height: '88vh' }} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </>
  )
}
