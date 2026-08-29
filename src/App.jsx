import { useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
} from '@codesandbox/sandpack-react'

// Every challenge folder holds exactly two files: the stub and its spec.
// Pulled in as strings at build time, so adding a folder is all it takes.
const raw = import.meta.glob('./challenges/*/*.{js,jsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const challenges = {}
for (const [path, code] of Object.entries(raw)) {
  const [, folder, file] = path.match(/\.\/challenges\/([^/]+)\/(.+)$/)
  challenges[folder] ??= {}
  challenges[folder]['/' + file] = code
}

const names = Object.keys(challenges).sort()

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

// Hooks and reducers render nothing on their own, so there is no UI to preview.
// Everything not listed here is a component and gets a preview pane.
const NEEDS_UI = (name) =>
  ![
    '04-use-toggle',
    '06-use-interval',
    '07-todo-reducer',
    '11-use-local-storage',
    '12-use-outside-click',
    '15-use-pagination',
    '19-use-undoable',
  ].includes(name)

const note = (text) => `export default () => (
  <p style={{ font: '14px system-ui', opacity: 0.6, padding: 16 }}>${text}</p>
)`

const NO_UI = note('No UI is required here — this one is a hook. Tests only.')
const NO_DEMO = note(
  'Add a demo.jsx to this challenge folder and it shows up here.',
)

const DEPS = {
  '@testing-library/react': '^16.0.0',
  // peer dep of react/user-event — Sandpack will not pull it in on its own
  '@testing-library/dom': '^10.4.0',
  '@testing-library/user-event': '^14.5.0',
  '@testing-library/jest-dom': '^6.4.0',
}

export default function App() {
  const [name, setName] = useState(
    () => localStorage.getItem('challenge') ?? names[0],
  )
  const [view, setView] = useState('tests')

  const pick = (next) => {
    setName(next)
    localStorage.setItem('challenge', next)
  }

  const files = challenges[name]
  const stub = Object.keys(files).find(
    (f) => !f.includes('.test.') && f !== '/demo.jsx',
  )

  // A component challenge only previews if its folder has a demo.jsx saying how
  // to render it — props differ per challenge.
  const app = !NEEDS_UI(name) ? NO_UI : (files['/demo.jsx'] ?? NO_DEMO)

  return (
    <>
      <select
        value={name}
        onChange={(e) => pick(e.target.value)}
        style={{ font: 'inherit', padding: '0.5rem', margin: '0.5rem' }}
      >
        {names.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      {/* Preview and Tests share one Sandpack client, so a failing assertion
          surfaces in the preview's error overlay. Showing one at a time keeps
          them out of each other's way. */}
      <button onClick={() => setView(view === 'tests' ? 'preview' : 'tests')}>
        show {view === 'tests' ? 'UI' : 'tests'}
      </button>
      <span style={{ opacity: 0.6, marginLeft: '0.5rem' }}>
        first load takes ~20s — Sandpack installs deps from the CDN
      </span>

      {/* ponytail: remounting on every pick re-installs deps (~20s). Swapping
          files in place would be instant, but the old challenge's spec would
          linger in the virtual FS and keep running. Fix that first if the wait
          starts to bite. */}
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
          {view === 'tests' ? (
            <SandpackTests watchMode verbose style={{ height: '88vh' }} />
          ) : (
            <SandpackPreview style={{ height: '88vh' }} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </>
  )
}
