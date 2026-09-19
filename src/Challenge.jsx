import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { Link } from 'react-router'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackTests,
  useLoadingOverlayState,
  useSandpackConsole,
  useSandpack,
  useSandpackPreviewProgress,
} from '@codesandbox/sandpack-react'
import { codeFolding, foldEffect } from '@codemirror/language'
import { EditorView, ViewPlugin } from '@codemirror/view'
import { toast } from 'sonner'
import {
  decodeFiles,
  encodeFiles,
  loadSolution,
  saveCode,
  saveDone,
  saveSolution,
} from './store'
import { DEPS, SHIM_FILES } from './sandpackVitestShim'
import { sandpackThemes } from './sandpackTheme'
import { challenges } from './challenges'
import { useTheme } from './theme'
import { useSession } from './auth'
import { ThemeToggle } from './ThemeToggle'
import { Hints } from './Hints'
import { Jump } from './Jump'
import { Kbd, MOD } from './Kbd'
import { NoPaste } from './NoPaste'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/ui/loading'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const SETUP = { dependencies: DEPS }

// The doc comment is the brief and it is long — on a bigger stub the code
// started below the fold, and the rules read twice now that the spec panel
// lists them. So it opens folded: the first line still shows, and the arrow in
// the gutter puts it back. Nothing is removed from the file.
const foldTheBrief = ViewPlugin.define((view) => {
  const text = view.state.doc.toString()
  const close = text.indexOf('*/')
  if (text.startsWith('/**') && close > 0) {
    const from = view.state.doc.line(1).to
    // Dispatching inside the constructor is not allowed; this is the first
    // moment after the view exists.
    if (close + 2 > from)
      queueMicrotask(() =>
        view.dispatch({ effects: foldEffect.of({ from, to: close + 2 }) }),
      )
  }
  return {}
})

// Wrapped, because a one-line solution scrolled sideways and the tail of it
// was simply not on screen.
const EDITOR_EXTENSIONS = [codeFolding(), foldTheBrief, EditorView.lineWrapping]

// An editor, a spec list and a test runner do not fit on a phone, and pretending
// otherwise gave a header that overlapped itself and two panes side by side at
// 390px. Say so instead — and do not mount Sandpack, which would pull a bundle
// from a CDN for a screen that cannot use it.
const NARROW = '(max-width: 767px)'

const useNarrow = () => {
  const mq = useMemo(() => window.matchMedia(NARROW), [])
  return useSyncExternalStore(
    (notify) => {
      mq.addEventListener('change', notify)
      return () => mq.removeEventListener('change', notify)
    },
    () => mq.matches,
  )
}

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

// The header is h-14; the panes take the rest, or a gap opens under them.
const PANE = 'calc(100dvh - 3.5rem)'

// Only one folder ships a demo.jsx, so fifty components had no preview at all.
// Mount the default export bare: most render fine, and the ones that need
// props (or export no default) hit the boundary and say so instead of blanking.
const autoMount = (stub) => `import React from 'react'
import Subject from '.${stub}'

class Boundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div style={{ font: '13px ui-sans-serif, system-ui, sans-serif', color: '#6b6b74', lineHeight: 1.6, maxWidth: 420, padding: 24 }}>
        This one needs props before it will render. Add a <code>demo.jsx</code> next
        to <code>${stub.slice(1)}</code> that mounts it with some, and it shows up here.
      </div>
    )
  }
}

export default function App() {
  return (
    <Boundary>
      <Subject />
    </Boundary>
  )
}
`

// Sandpack's react template renders App inside StrictMode, which double-invokes
// every render and re-runs every effect — so one console.log printed twice and
// the console pane could not be believed. Correctness is the spec's job; the
// preview only has to be honest about how many times something ran.
const ENTRY = `import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')).render(<App />)
`

// The button lives beside the results it produces, but hands stay on the
// keyboard while solving — so the shortcut is the real control, and it is
// printed on the button rather than left to be discovered.
function RunTests({ consoleRef, onRun }) {
  const { dispatch } = useSandpack()

  // A run's logs have to answer for that run alone. Kept across runs, four
  // lines read as eight and the pane stops meaning anything.
  // Runs from the Preview side too, so it pulls the Tests pane up first —
  // otherwise the results land behind whatever you were looking at.
  const run = useCallback(() => {
    onRun?.()
    consoleRef.current?.reset()
    dispatch({ type: 'run-all-tests' })
  }, [consoleRef, dispatch, onRun])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Enter' || !(e.metaKey || e.ctrlKey)) return
      // Capture, or CodeMirror has already inserted the newline by the time
      // this runs and preventDefault has nothing left to prevent.
      e.preventDefault()
      e.stopPropagation()
      run()
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [run])

  return (
    <Button size="sm" onClick={run}>
      Run tests
      <Kbd>{MOD}↵</Kbd>
    </Button>
  )
}

// The editable set is listed, never inferred. Sandpack's own file system also
// holds the template's /App.jsx, /index.jsx, /package.json and /index.html, and
// a rule that tried to exclude those would save them the day the template
// changed — so the app only ever tracks the paths it put there itself.
const STYLES = '/styles.css'

// The preview is an iframe with its own page, and a white one glares out of a
// dark app. It cannot see our theme toggle, so it follows the OS instead — and
// it is your stylesheet, so change it if you would rather it did not.
const DEFAULT_CSS = `:root {
  color-scheme: light dark;
}

body {
  margin: 0;
  padding: 24px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  line-height: 1.5;
  background: #ffffff;
  color: #16161a;
}

@media (prefers-color-scheme: dark) {
  body {
    background: #16161a;
    color: #d9d9e0;
  }
}
`

const blank = (path) => (path === STYLES ? DEFAULT_CSS : '')

// A file the challenge did not ship and you have not deleted. Sandpack's own
// explorer only draws the tree — creating and removing is not in it — and its
// closable tabs close a tab rather than delete a file.
function FileBar({ extras, tabs, onAdd, onDelete }) {
  const { sandpack } = useSandpack()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  const active = sandpack.activeFile
  const own = extras.includes(active)

  const create = (e) => {
    e.preventDefault()
    const trimmed = name.trim().replace(/^\/+/, '')
    if (!trimmed) return setAdding(false)
    const path = `/${trimmed}${/\.\w+$/.test(trimmed) ? '' : '.jsx'}`
    if (sandpack.files[path]) {
      toast.error(`${path} is already here.`)
      return
    }
    sandpack.addFile(path, '')
    onAdd(path)
    // Not opened for you: addFile is a state update, and openFile in the same
    // tick — or in an effect after it — is asked for a file Sandpack does not
    // have yet and quietly does nothing. The tab is there; click it.
    setName('')
    setAdding(false)
  }

  const remove = () => {
    sandpack.deleteFile(active)
    onDelete(active)
  }

  return (
    <div className="flex items-center gap-2 border-b border-border bg-card px-3 py-1.5">
      {adding ? (
        <form onSubmit={create} className="flex items-center gap-2">
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setAdding(false)}
            onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
            placeholder="Card.jsx"
            aria-label="New file name"
            className="h-6 w-44 font-mono text-micro"
          />
        </form>
      ) : (
        <Button variant="ghost" size="xs" onClick={() => setAdding(true)}>
          + file
        </Button>
      )}

      {own && (
        <Button
          variant="ghost"
          size="xs"
          className="text-destructive"
          onClick={remove}
        >
          delete {active}
        </Button>
      )}

      <span className="ml-auto label text-muted-foreground">
        {tabs} files
      </span>
    </div>
  )
}

// Renders nothing — it is here for the effect, which needs to sit inside the
// provider to see the editor's code.
// Reads the source files by path, never the active file. With the spec open in
// a second tab, useActiveCode() returns the spec — and this would have saved
// the test file over the solution the moment you looked at it.
function SaveCode({ name, editable, defaults }) {
  const { sandpack } = useSandpack()
  // Every editable file, not just the ones the challenge shipped — a file you
  // added is work too. A string, so the effect compares by content rather than
  // by a fresh object every render.
  const snapshot = JSON.stringify(
    Object.fromEntries(
      editable.map((p) => [p, sandpack.files[p]?.code ?? '']),
    ),
  )

  useEffect(() => {
    const files = JSON.parse(snapshot)
    const paths = Object.keys(files)
    // Trimmed, or a stray newline makes the stub look like work and overwrites
    // a real solution with it. That has already cost one.
    const untouched =
      paths.length === Object.keys(defaults).length &&
      paths.every((p) => (files[p] ?? '').trim() === (defaults[p] ?? '').trim())
    if (untouched) return

    const timer = setTimeout(
      () =>
        saveCode(name, files).catch((error) =>
          toast.error('Your code did not save', {
            description: error.message,
          }),
        ),
      1000,
    )
    return () => clearTimeout(timer)
  }, [name, snapshot, defaults])

  return null
}

// Closing is left to `reset` rather than to the button, so the dialog stays up
// until the write lands and a failure can still be shown against it.
function ResetToStub({ name, title, sources, stubFiles }) {
  const { sandpack } = useSandpack()
  const [open, setOpen] = useState(false)

  const reset = async () => {
    for (const path of sources) sandpack.updateFile(path, stubFiles[path])
    try {
      // SaveCode ignores files that match the stubs, so the row has to be
      // rewritten here — otherwise the old solution returns on the next load.
      await saveSolution(name, {
        code: encodeFiles(Object.fromEntries(sources.map((p) => [p, stubFiles[p]]))),
        passed: false,
      })
      toast.success(`${title} is back to the stub.`)
    } catch (error) {
      toast.error('Could not reset this challenge', {
        description: error.message,
      })
    }
    setOpen(false)
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Reset
      </Button>

      <Dialog open={open} onOpenChange={setOpen} className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Start {title} over?</DialogTitle>
          <DialogDescription>
            Your code goes back to the stub and the challenge stops counting as
            solved. There is no undo.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Keep my code
          </Button>
          <Button variant="destructive" size="sm" onClick={reset}>
            Reset to stub
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

// Sandpack's own console renders one row per console argument, so a single
// `console.log('%cx', 'font-weight:bold')` arrives as two lines — and React's
// devtools banner is exactly that shape, on every run. Ours joins the arguments
// back into one line, drops the banner, and collapses repeats.
const NOISE = [
  'Download the React DevTools',
  'React DevTools',
  'react-devtools',
]

const asText = (item) =>
  typeof item === 'string' ? item : JSON.stringify(item)

const format = (data) =>
  (data ?? [])
    .map(asText)
    // `%c` takes the next argument as CSS. Nothing here styles a log line, so
    // the directive goes and the style argument goes with it.
    .filter((s, i) => !(i > 0 && /^[a-z-]+\s*:/i.test(s)))
    .join(' ')
    .replace(/%[cs]/g, '')
    .trim()

// Four tests rendering the same component print the same line four times, which
// reads as a bug. Chrome collapses consecutive repeats with a count; so do we.
const collapse = (logs) => {
  const out = []
  for (const log of logs) {
    const text = format(log.data)
    if (!text || NOISE.some((n) => text.includes(n))) continue
    const last = out[out.length - 1]
    if (last && last.text === text && last.method === log.method) last.count++
    else out.push({ id: log.id, text, method: log.method, count: 1 })
  }
  return out
}

const LOG_COLOR = {
  error: 'text-destructive',
  warn: 'text-amber-400',
  warning: 'text-amber-400',
}

const ConsolePane = forwardRef(function ConsolePane({ onCount }, ref) {
  // No clientId: it listens to every client, so a log from the test run and one
  // from the preview both land here.
  const { logs, reset } = useSandpackConsole({ resetOnPreviewRestart: false })
  const rows = useMemo(() => collapse(logs), [logs])

  useImperativeHandle(ref, () => ({ reset }), [reset])

  useEffect(() => {
    onCount(rows.reduce((n, r) => n + r.count, 0))
  }, [rows, onCount])

  if (rows.length === 0) {
    return (
      <p className="flex h-full items-center justify-center px-6 text-center text-fine text-muted-foreground">
        Nothing logged yet. Put a{' '}
        <code className="mx-1 font-mono text-foreground">console.log()</code> in
        your code and run it.
      </p>
    )
  }

  return (
    <ul className="h-full overflow-auto font-mono text-micro">
      {rows.map((row) => (
        <li
          key={row.id}
          className={`flex gap-3 border-b border-border/60 px-4 py-1.5 ${LOG_COLOR[row.method] ?? 'text-subtle'}`}
        >
          {row.count > 1 && (
            <span className="shrink-0 rounded-xs bg-muted px-1.5 text-foreground tabular-nums">
              {row.count}×
            </span>
          )}
          <span className="break-all whitespace-pre-wrap">{row.text}</span>
        </li>
      ))}
    </ul>
  )
})

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
          Wake it up
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
      <Loading
        title="Starting the sandbox"
        hint={
          progress ??
          'First run pulls dependencies from a CDN — about 20 seconds.'
        }
      />
    </Veil>
  )
}

// The console takes its height from whatever is above it, so the handle sits on
// its top edge — drag up to grow, and the edge stays under the pointer.
// Pointer capture is what makes it work at all: without it the first move over
// the editor or the test iframe goes to that frame and the drag dies there.
function DragEdge({ onDrag, className = '' }) {
  const last = useRef(null)

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize the console"
      tabIndex={0}
      className={`h-1.5 shrink-0 cursor-row-resize bg-border transition-colors hover:bg-primary/50 focus-visible:bg-primary/50 focus-visible:outline-none ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        last.current = e.clientY
      }}
      onPointerMove={(e) => {
        if (last.current === null) return
        onDrag(last.current - e.clientY)
        last.current = e.clientY
      }}
      onPointerUp={() => {
        last.current = null
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') onDrag(24)
        else if (e.key === 'ArrowDown') onDrag(-24)
        else return
        e.preventDefault()
      }}
    />
  )
}

export default function Challenge({ challenge }) {
  const theme = useTheme()
  const session = useSession()
  const [view, setView] = useState('tests')
  const [logs, setLogs] = useState(false)
  const [logsHeight, setLogsHeight] = useState(220)
  // Counted even while the drawer is shut, so the toggle can say there is
  // something in there. Sandpack keeps the log list in its own state.
  const [logCount, setLogCount] = useState(0)
  const consoleRef = useRef(null)
  // Clamped here rather than in the handle: the drag reports a delta and has no
  // idea what is left above it.
  const resizeLogs = (by) =>
    setLogsHeight((h) =>
      Math.min(Math.max(h + by, 72), window.innerHeight * 0.7),
    )
  const narrow = useNarrow()
  const [status, setStatus] = useState({})
  // Set once the suite has run this visit. Until then a solved challenge is
  // solved on the ladder and 0/4 in here, which reads as lost work.
  const [ran, setRan] = useState(false)
  const {
    name, title, summary, level, stub, spec, sources,
    files, needsUi, tests, hints, rules,
  } = challenge

  // Capture, like every other chord here — CodeMirror owns the keyboard while
  // the editor has focus, and that is exactly when you want the log.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'j' || !(e.metaKey || e.ctrlKey)) return
      e.preventDefault()
      e.stopPropagation()
      setLogs((was) => !was)
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [])

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

  // Files you added, listed rather than inferred — the only way one appears is
  // through the bar below, and the only way one goes is the same button.
  const [added, setAdded] = useState([])
  const [removed, setRemoved] = useState([])

  // What the saved row alone says the file set is. Sandpack is handed this and
  // nothing else — rebuilding its files from the live set would re-seed a file
  // the moment you created it, wiping what you had just typed into it.
  const baseline = useMemo(() => {
    const mine = saved ? decodeFiles(saved.code, stub) : {}
    const kept = Object.keys(mine).filter(
      (p) => !sources.includes(p) && p !== spec && p !== STYLES,
    )
    // The stylesheet is always here: the entry imports it, and a component
    // challenge with no way to style anything is half a challenge.
    return [...sources, STYLES, ...kept].sort()
  }, [saved, stub, sources, spec])

  const extras = useMemo(
    () =>
      [...new Set([...baseline.filter((p) => !sources.includes(p) && p !== STYLES), ...added])]
        .filter((p) => !removed.includes(p)),
    [baseline, sources, added, removed],
  )

  const editable = useMemo(
    () => [...new Set([...baseline, ...added])].filter((p) => !removed.includes(p)).sort(),
    [baseline, added, removed],
  )

  // Sandpack treats a new `files` object as a file change and re-bundles. Built
  // inline it was a fresh object every render, so recording a test result
  // re-triggered the run that produced it — an endless rebuild loop.
  const sandpackFiles = useMemo(() => {
    if (saved === undefined) return null
    const app = files['/demo.jsx'] ?? autoMount(stub)
    // A row written before multi-file holds one source and decodes to the
    // primary path, so nothing saved until now needs migrating.
    const mine = saved ? decodeFiles(saved.code, stub) : {}
    const written = Object.fromEntries(
      baseline.map((p) => [p, mine[p] ?? files[p] ?? blank(p)]),
    )
    return {
      ...files,
      ...written,
      // Visible, and locked. The spec is the brief — reading it beats reading a
      // list of its titles — but editing it would be editing the exam.
      [spec]: { code: files[spec], readOnly: true },
      ...SHIM_FILES,
      '/App.js': app,
      '/index.js': ENTRY,
    }
  }, [files, saved, stub, spec, baseline])

  // The state a fresh challenge is in. The save guard compares against this,
  // so an untouched editor never writes and an added file always does.
  const defaults = useMemo(
    () => Object.fromEntries(baseline.map((p) => [p, files[p] ?? blank(p)])),
    [baseline, files],
  )

  // Built from the baseline, not the live set. Sandpack re-applies `activeFile`
  // whenever this object changes, so deriving it from a list that grew on every
  // add threw you back to the stub the instant you created a file.
  const options = useMemo(
    () => ({ activeFile: stub, visibleFiles: [...baseline, spec] }),
    [stub, spec, baseline],
  )

  // The untouched sources, for Reset.
  const stubFiles = useMemo(
    () => Object.fromEntries(sources.map((p) => [p, files[p]])),
    [files, sources],
  )

  const handleComplete = (specs) => {
    const ran = Object.values(specs ?? {}).flatMap(allTests)
    const next = Object.fromEntries(ran.map((t) => [t.name, t.status]))
    // watchMode reports after every rerun; only touch state on a real change.
    setRan(true)
    setStatus((prev) => (shallowEqual(prev, next) ? prev : next))
    saveDone(
      name,
      ran.length > 0 && ran.every((t) => t.status === 'pass'),
    ).catch((error) =>
      toast.error('Your progress did not save', {
        description: error.message,
      }),
    )
  }

  const passed = tests.filter((t) => status[t] === 'pass').length
  // The row records that every test passed, never which — so a remembered pass
  // fills them all in and says so, rather than claiming a run that never happened.
  const remembered = !ran && saved?.passed === true
  const solved = ran ? passed === tests.length && tests.length > 0 : remembered
  const next = challenges[challenges.findIndex((c) => c.name === name) + 1]

  if (narrow) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-8 text-center">
        <p className="label text-primary">{String(level).padStart(3, '0')} · {title}</p>
        <h1 className="text-head text-balance">This one needs a wider screen.</h1>
        <p className="max-w-xs text-body text-subtle">
          The editor, the spec and the test runner sit side by side. On a phone
          they would sit on top of each other, so they are not here at all.
        </p>
        <Button as={Link} to="/" variant="outline" size="sm" className="mt-2">
          ← back
        </Button>
      </main>
    )
  }

  if (!sandpackFiles) {
    return (
      <main className="min-h-dvh">
        <Loading
          title="Opening the challenge"
          hint="Pulling the code you last saved."
          className="min-h-dvh"
        />
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
      <header className="flex h-14 items-center gap-4 border-b border-border px-4">
        <Button
          variant="ghost"
          size="sm"
          as={Link}
          // Signed out, /ladder only bounces to the login.
          to={session ? '/ladder' : '/'}
          className="font-mono text-xs"
        >
          ← {session ? 'ladder' : 'back'}
        </Button>

        <Jump current={name} />

        <Separator orientation="vertical" className="h-5 self-center" />

        <span className="flex min-w-0 shrink items-baseline gap-2.5">
          <span className="font-mono text-sm text-muted-foreground tabular-nums">
            {String(level).padStart(3, '0')}
          </span>
          <span className="truncate font-mono text-sm font-medium">
            {title}
          </span>
          <span className="hidden truncate text-xs text-muted-foreground sm:block">
            {summary}
          </span>
        </span>

        <span className="ml-auto flex shrink-0 items-center gap-3">
          <span
            className={`font-mono text-xs tabular-nums ${
              solved ? 'text-primary' : 'text-muted-foreground'
            }`}
            title={remembered ? 'From your last run — run again to confirm' : undefined}
          >
            {remembered ? tests.length : passed}/{tests.length} passing
            {remembered && <span className="ml-1.5 text-muted-foreground">·  remembered</span>}
          </span>

          <Separator orientation="vertical" className="h-5 self-center" />

          {/* A hook has nothing to render, so it says so where the choice
              would have been — otherwise the gap reads as a missing feature.
              shadcn gives pressed and hover the same bg-muted, so the selected
              mode needs the accent as a tint to read at all. */}
          {!needsUi && (
            <>
              <span className="font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
                no ui
              </span>

              <Separator orientation="vertical" className="h-5 self-center" />
            </>
          )}

          {needsUi && (
            <>
              <ToggleGroup value={view} onValueChange={setView}>
                {[
                  ['tests', 'Tests'],
                  ['preview', 'Preview'],
                ].map(([value, label]) => (
                  <ToggleGroupItem key={value} value={value} className="min-w-20">
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <Separator orientation="vertical" className="h-5 self-center" />
            </>
          )}

          {/* Not in the Tests/Preview group: the console is not a third view,
              it opens underneath whichever one is up — and a hook challenge,
              which has no Preview toggle at all, needs it most. The count is
              what makes it discoverable; a bare toggle gives no reason to press. */}
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={logs}
            aria-expanded={logs}
            onClick={() => setLogs((was) => !was)}
            className="aria-pressed:font-semibold aria-pressed:text-primary"
          >
            Console
            {logCount > 0 && (
              <span className="rounded-xs bg-muted px-1.5 font-mono text-[0.6875rem] text-foreground tabular-nums">
                {logCount}
              </span>
            )}
            <Kbd>{MOD}J</Kbd>
          </Button>

          <Hints title={title} hints={hints} />

          {/* The first challenge runs signed out, and every write silently does
              nothing until there is a session. Say so rather than letting an
              hour of work quietly fail to save. */}
          {session ? (
            /* Destructive, so it sits away from Run rather than beside it. */
            <ResetToStub
              name={name}
              title={title}
              sources={sources}
              stubFiles={stubFiles}
            />
          ) : (
            <Button
              as={Link}
              to={`/login?next=${encodeURIComponent(`/${name}`)}`}
              variant="outline"
              size="sm"
            >
              Sign in to keep this
            </Button>
          )}

          <ThemeToggle size="sm" />
        </span>
      </header>

      <SaveCode name={name} editable={editable} defaults={defaults} />
      <NoPaste />

      <SandpackLayout>
        <div className="flex min-w-0 flex-1 flex-col" style={{ height: PANE }}>
          <FileBar
            extras={extras}
            tabs={options.visibleFiles.length}
            onAdd={(p) => setAdded((list) => [...list, p])}
            onDelete={(p) => setRemoved((list) => [...list, p])}
          />
          <SandpackCodeEditor
            showLineNumbers
            extensions={EDITOR_EXTENSIONS}
            style={{ height: '100%' }}
          />
        </div>

        <div
          className="flex flex-1 flex-col border-l border-border"
          style={{ height: PANE }}
        >
          {/* What the spec checks, readable before a single test has run. */}
          <div className="max-h-[35%] overflow-auto border-b border-border bg-card px-4 py-3.5">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <p className="font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
                the spec
              </p>
              <RunTests
                consoleRef={consoleRef}
                onRun={() => setView('tests')}
              />
            </div>
            {/* On a long stub the code starts below the fold, so the rules were
                only readable by scrolling the editor past them. Native details,
                shut by default — the doc comment is still there for anyone who
                would rather read it in place. */}
            {rules.length > 0 && (
              <details className="mb-3 border-b border-border pb-3">
                <summary className="label cursor-pointer text-muted-foreground marker:text-muted-foreground/50 hover:text-foreground">
                  the rules · {rules.length}
                </summary>
                <ol className="mt-3 space-y-1.5">
                  {rules.map((rule, i) => (
                    <li key={rule} className="flex items-baseline gap-2.5 text-fine">
                      <span className="font-mono text-label text-muted-foreground tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-subtle">{rule}</span>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <ul className="space-y-1.5">
              {tests.map((t, i) => {
                // A remembered pass fills every tick, because the row only ever
                // said all of them passed — not which.
                const mark = remembered ? 'pass' : status[t]
                return (
                <li key={t} className="flex items-baseline gap-2.5 text-sm">
                  <span className="font-mono text-[0.625rem] text-muted-foreground tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`w-3 shrink-0 font-mono ${MARK_COLOR[mark] ?? 'text-muted-foreground'}`}
                  >
                    {MARK[mark] ?? '·'}
                  </span>
                  <span
                    className={mark === 'pass' ? 'text-muted-foreground' : ''}
                  >
                    {t}
                  </span>
                </li>
                )
              })}
            </ul>

            {/* #6: the counter ticking over was the only thing that marked a
                solve. This is the moment, and the way on. */}
            {solved && (
              <div className="mt-4 flex items-center gap-3 rounded-sm bg-success/10 px-3 py-2">
                <span className="label text-success">solved</span>
                {next && (
                  <Button
                    as={Link}
                    to={`/${next.name}`}
                    variant="ghost"
                    size="xs"
                    className="ml-auto text-success hover:bg-success/15"
                  >
                    next · {next.title} →
                  </Button>
                )}
              </div>
            )}
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
            {/* Mounted only while visible. Kept alive but hidden, the iframe
                is display:none, and Chrome throttles a hidden cross-origin
                frame — it fell an edit behind. A fresh client on every switch
                always compiles what is in the editor right now.
                The error overlay reads the provider's error state, which every
                client feeds — so a failed assertion showed up here as if the
                preview had crashed. Failures belong in the Tests panel. */}
            {view === 'preview' && (
              <SandpackPreview
                showSandpackErrorOverlay={false}
                // It ships the code to codesandbox.io, where pasting an answer
                // in is one keystroke. The whole product is the other way round.
                showOpenInCodeSandbox={false}
                style={{ height: '100%' }}
              />
            )}
            <Booting />
          </div>

          {/* Not standalone, so it registers no client of its own and listens
              to all of them — a log from the test run and one from the preview
              both land here. resetOnPreviewRestart would wipe the test run's
              logs every time the preview remounts, so it stays off. */}
          {/* Sandpack's own header is gated behind `isNodeEnvironment`, so on a
              react template it never renders whatever showHeader says — the
              drawer arrived as an unlabelled box. This is that header.
              Hidden rather than unmounted: the log list lives in Sandpack's own
              state, so closing used to throw away the run you were reading. */}
          <>
            <DragEdge onDrag={resizeLogs} className={logs ? '' : 'hidden'} />
            <div
              className={`flex min-h-0 shrink-0 flex-col border-t border-border bg-card ${logs ? '' : 'hidden'}`}
              style={{ height: logsHeight }}
            >
              <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-2">
                <span className="label text-muted-foreground">console</span>
                <span className="font-mono text-fine text-muted-foreground tabular-nums">
                  {logCount}
                </span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="ml-auto"
                  onClick={() => consoleRef.current?.reset()}
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Close the console"
                  onClick={() => setLogs(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="min-h-0 flex-1">
                <ConsolePane ref={consoleRef} onCount={setLogCount} />
              </div>
            </div>
          </>
        </div>
      </SandpackLayout>
    </SandpackProvider>
  )
}
