import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
  useActiveCode,
  useLoadingOverlayState,
  useSandpack,
  useSandpackPreviewProgress,
} from '@codesandbox/sandpack-react'
import { toast } from 'sonner'
import { loadSolution, saveCode, saveDone, saveSolution } from './store'
import { sandpackThemes } from './sandpackTheme'
import { useTheme } from './theme'
import { ThemeToggle } from './ThemeToggle'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// The specs `import { test, expect, vi } from 'vitest'`, but Sandpack runs Jest.
// A virtual node_modules/vitest maps one onto the other so the spec files stay
// untouched. jest-dom registers its matchers on import.
const VITEST_SHIM = `
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
  // pinned: 14.6.2+ hangs on click/type until the 5s jest timeout
  // https://github.com/testing-library/user-event/issues/1323
  '@testing-library/user-event': '14.6.1',
  '@testing-library/jest-dom': '^6.4.0',
}

const SETUP = { dependencies: DEPS }

const note = (text) => `export default () => (
  <p style={{ font: '14px system-ui', opacity: 0.6, padding: 16 }}>${text}</p>
)`

// Specs nest tests under describes; the ladder uses neither, but walking both
// costs three lines and survives a spec that does.
const allTests = (node) => [
  ...Object.values(node.tests ?? {}),
  ...Object.values(node.describes ?? {}).flatMap(allTests),
]

const shallowEqual = (a, b) => {
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length && keys.every((k) => a[k] === b[k])
  )
}

const MARK = { pass: '✓', fail: '✗' }
const MARK_COLOR = { pass: 'text-primary', fail: 'text-destructive' }

// SandpackTests ships a run button, but it is an unlabelled ▶ in the panel
// corner. Same dispatch, with a name on it and up in the header.
function RunTests() {
  const { dispatch } = useSandpack()
  return (
    <Button size="sm" onClick={() => dispatch({ type: 'run-all-tests' })}>
      ▶ Run tests
    </Button>
  )
}

// Renders nothing — it is here for the effect, which needs to sit inside the
// provider to see the editor's code.
function SaveCode({ name, stubCode }) {
  const { code } = useActiveCode()

  useEffect(() => {
    if (code === stubCode) return // untouched stub, nothing worth a row
    const timer = setTimeout(
      () =>
        saveCode(name, code).catch((error) =>
          toast.error('Could not save your code', {
            description: error.message,
          }),
        ),
      1000,
    )
    return () => clearTimeout(timer)
  }, [name, code, stubCode])

  return null
}

// AlertDialogAction is a plain Button, not a Close — shadcn leaves closing to
// you so the action can be async. This one waits for the write to land.
function ResetToStub({ name, path, stubCode }) {
  const { sandpack } = useSandpack()
  const [open, setOpen] = useState(false)

  const reset = async () => {
    sandpack.updateFile(path, stubCode)
    try {
      // SaveCode ignores a file that matches the stub, so the row has to be
      // rewritten here — otherwise the old solution returns on the next load.
      await saveSolution(name, { code: stubCode, passed: false })
      toast.success('Back to the stub.')
    } catch (error) {
      toast.error('Could not reset', { description: error.message })
    }
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="ghost" size="sm" />}>
        reset
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start this challenge over?</AlertDialogTitle>
          <AlertDialogDescription>
            Your code for {name} goes back to the stub, and the challenge stops
            counting as done. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={reset}>
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const Veil = ({ children }) => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/90">
    {children}
  </div>
)

// Asleep and booting both showed only as a ▶ tucked into a panel corner, so a
// dead-looking panel was the whole signal. Say which one it is, over the panel.
function Booting() {
  const { sandpack } = useSandpack()
  const state = useLoadingOverlayState()
  const progress = useSandpackPreviewProgress()

  if (sandpack.status === 'idle') {
    return (
      <Veil>
        <p className="text-sm">The sandbox is asleep.</p>
        <Button size="sm" onClick={() => sandpack.runSandpack()}>
          Start it
        </Button>
      </Veil>
    )
  }

  if (state === 'TIMEOUT') {
    return (
      <Veil>
        <p className="text-sm">The bundler stopped responding.</p>
        <p className="text-xs text-muted-foreground">
          Reload the page to try again.
        </p>
      </Veil>
    )
  }

  if (state === 'HIDDEN') return null

  return (
    <Veil>
      <span className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      <p className="text-sm">Starting the sandbox…</p>
      <p className="text-xs text-muted-foreground">
        {progress ?? 'first load pulls deps from a CDN — about 20s'}
      </p>
    </Veil>
  )
}

export default function Challenge({ challenge }) {
  const theme = useTheme()
  const [view, setView] = useState('tests')
  const [status, setStatus] = useState({})
  const { name, title, summary, level, stub, files, needsUi, tests } = challenge

  // `undefined` until the saved row lands. Sandpack cannot be handed the stub
  // and then the real code — that is a file change, and it re-bundles.
  const [saved, setSaved] = useState(undefined)

  useEffect(() => {
    let live = true
    loadSolution(name).then((row) => live && setSaved(row ?? null))
    return () => {
      live = false
    }
  }, [name])

  // Sandpack treats a new `files` object as a file change and re-bundles. Built
  // inline it was a fresh object every render, so recording a test result
  // re-triggered the run that produced it — an endless rebuild loop.
  const sandpackFiles = useMemo(() => {
    if (saved === undefined) return null
    const app = !needsUi
      ? note('No UI is required here — this one is a hook. Tests only.')
      : (files['/demo.jsx'] ??
        note('Add a demo.jsx to this challenge folder and it shows up here.'))
    return {
      ...files,
      [stub]: saved?.code || files[stub],
      ...SHIM_FILES,
      '/App.js': app,
    }
  }, [files, needsUi, saved, stub])

  const options = useMemo(
    () => ({ activeFile: stub, visibleFiles: [stub] }),
    [stub],
  )

  const handleComplete = (specs) => {
    const ran = Object.values(specs ?? {}).flatMap(allTests)
    const next = Object.fromEntries(ran.map((t) => [t.name, t.status]))
    // watchMode reports after every rerun; only touch state on a real change.
    setStatus((prev) => (shallowEqual(prev, next) ? prev : next))
    saveDone(
      name,
      ran.length > 0 && ran.every((t) => t.status === 'pass'),
    ).catch((error) =>
      toast.error('Could not save your progress', {
        description: error.message,
      }),
    )
  }

  const passed = tests.filter((t) => status[t] === 'pass').length

  if (!sandpackFiles) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <span className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </main>
    )
  }

  return (
    <SandpackProvider
      key={name}
      template="react"
      theme={sandpackThemes[theme]}
      files={sandpackFiles}
      options={options}
      customSetup={SETUP}
    >
      {/* Three zones: where you are, how you are doing, what you can do. */}
      <header className="flex items-center gap-4 border-b border-border px-4 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          render={<Link to="/" />}
          className="font-mono text-xs"
        >
          ← ladder
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <span className="flex min-w-0 items-baseline gap-2.5">
          <span className="font-mono text-sm text-muted-foreground tabular-nums">
            {String(level).padStart(2, '0')}
          </span>
          <span className="truncate font-mono text-sm font-medium">
            {title}
          </span>
          <span className="hidden truncate text-xs text-muted-foreground sm:block">
            {summary}
          </span>
        </span>

        <span className="ml-auto flex items-center gap-3">
          <span
            className={`font-mono text-xs tabular-nums ${
              passed === tests.length ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {passed}/{tests.length} passing
          </span>

          <Separator orientation="vertical" className="h-5" />

          <Button
            variant="ghost"
            size="sm"
            className="font-mono text-xs"
            onClick={() => setView(view === 'tests' ? 'preview' : 'tests')}
          >
            {view === 'tests' ? 'UI' : 'tests'}
          </Button>

          <ResetToStub name={name} path={stub} stubCode={files[stub]} />

          <ThemeToggle size="sm" />

          {view === 'tests' && <RunTests />}
        </span>
      </header>

      <SaveCode name={name} stubCode={files[stub]} />

      <SandpackLayout>
        <SandpackCodeEditor showLineNumbers style={{ height: '88vh' }} />

        <div
          className="flex flex-1 flex-col border-l border-border"
          style={{ height: '88vh' }}
        >
          {/* What the spec checks, readable before a single test has run. */}
          <div className="max-h-[35%] overflow-auto border-b border-border bg-card px-4 py-3.5">
            <p className="mb-2.5 font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
              the spec
            </p>
            <ul className="space-y-1.5">
              {tests.map((t, i) => (
                <li key={t} className="flex items-baseline gap-2.5 text-sm">
                  <span className="font-mono text-[0.625rem] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`w-3 shrink-0 font-mono ${MARK_COLOR[status[t]] ?? 'text-muted-foreground'}`}
                  >
                    {MARK[status[t]] ?? '·'}
                  </span>
                  <span
                    className={
                      status[t] === 'pass' ? 'text-muted-foreground' : ''
                    }
                  >
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hidden, never unmounted: SandpackTests keeps its results in its own
              state, and a trip through "show UI" used to throw them away. */}
          {/* watchMode off: it reran the suite on every bundle, restarting it
              mid-keystroke. The panel's Watch toggle turns it back on. */}
          <div className="relative min-h-0 flex-1">
            <div className={view === 'tests' ? 'h-full' : 'hidden'}>
              <SandpackTests
                watchMode={false}
                verbose
                showVerboseButton={false}
                showWatchButton={false}
                onComplete={handleComplete}
                style={{ height: '100%' }}
              />
            </div>
            {view === 'preview' && <SandpackPreview style={{ height: '100%' }} />}
            <Booting />
          </div>
        </div>
      </SandpackLayout>
    </SandpackProvider>
  )
}
