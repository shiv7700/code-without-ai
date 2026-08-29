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

const NO_DEMO = `export default () => (
  <p style={{ font: '14px system-ui', opacity: 0.6, padding: 16 }}>
    No preview for this one. Drop a <code>demo.jsx</code> in the challenge
    folder that renders it, and it shows up here.
  </p>
)`

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

  const pick = (next) => {
    setName(next)
    localStorage.setItem('challenge', next)
  }

  const files = challenges[name]
  const stub = Object.keys(files).find(
    (f) => !f.includes('.test.') && f !== '/demo.jsx',
  )

  // A challenge only previews if its folder has a demo.jsx saying how to render
  // it — props differ per challenge, and the hook ones have no UI of their own.
  const app = files['/demo.jsx'] ?? NO_DEMO

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
      <span style={{ opacity: 0.6 }}>
        tests take ~20s to appear — Sandpack installs deps from the CDN first
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
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <SandpackPreview style={{ height: '44vh' }} />
            <SandpackTests watchMode verbose style={{ height: '44vh' }} />
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </>
  )
}
