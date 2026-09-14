import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { SandpackProvider, SandpackTests } from '@codesandbox/sandpack-react'
import { challenges } from './challenges'
import { DEPS, SHIM_FILES } from './sandpackVitestShim'
import { ENVIRONMENT_FILES } from './environmentSpec'

// A spec green under Vitest proves nothing about Sandpack's Jest — that is how
// the fake-timer gap shipped. This page runs the environment spec inside the
// real browser runner, and `scripts/check.mjs` drives it headless. It holds no
// user data, so it lives outside the login gate.

const SETUP = { dependencies: DEPS }

// What separates "the runner is missing something" from "the stub is empty".
// Under ?all=1 an assertion failure is the expected result; a missing global is
// not.
//
// `is not defined` and the rest stay broad — an empty stub yields undefined
// values, not ReferenceErrors. `is not a function` cannot: a stub that returns
// nothing makes every helper destructured off it one, and on the first full
// sweep that was all 56 of the hits. So it only counts against a name the
// runner itself is meant to supply.
const RUNNER =
  '(?:vi|expect|screen|render|renderHook|act|fireEvent|within|waitFor|userEvent|localStorage|sessionStorage|structuredClone|queueMicrotask|AbortController|Date|setTimeout|setInterval|clearTimeout|clearInterval|MessageChannel|IntersectionObserver|ResizeObserver|matchMedia|jest)'

// Sandpack renders the DOM in one realm and runs the spec's globals in another,
// so an element from Testing Library is not an instance of the spec's `Element`.
// user-event takes its window from whatever element it is handed — click(el) and
// type(el) are fine — but these resolve the ambient globals instead and find an
// empty page. Characterised, not yet fixed; see project-context.md.
const KNOWN_GAPS = [
  'user-event › setup()',
  'user-event › selectOptions',
  'user-event › dblClick',
  'user-event › keyboard',
  'user-event › tab',
  'user-event › hover and unhover',
]

const ENV_ERROR = new RegExp(
  [
    'is not defined',
    'Cannot find module',
    'ReferenceError',
    'SyntaxError',
    'timed out',
    'timeout',
    `\\b${RUNNER}[\\w.]* is not a function`,
  ].join('|'),
  'i',
)

// Generous: the first bundle pulls four packages off a CDN.
const TIMEOUT_MS = 150000

const flatten = (node) => [
  ...Object.values(node.tests ?? {}),
  ...Object.values(node.describes ?? {}).flatMap(flatten),
]

const messageOf = (test) =>
  (test.errors ?? [])
    .map((e) => e?.message ?? e?.name ?? String(e))
    .join('\n')
    .trim() || 'failed with no message'

const readSpecs = (specs) => {
  const list = Object.values(specs ?? {})
  // A spec that would not compile reports no tests at all — the loudest
  // environment failure there is, so it must not read as zero work done.
  const broken = list
    .filter((s) => s.error)
    .map((s) => ({
      name: `${s.name} (did not compile)`,
      status: 'fail',
      message: s.error.message ?? String(s.error),
    }))
  const tests = list.flatMap(flatten).map((t) => ({
    name: [...(t.blocks ?? []), t.name].join(' › '),
    status: t.status,
    message: t.status === 'pass' ? '' : messageOf(t),
  }))
  return [...broken, ...tests]
}

// Remounted per job. SandpackTests captures `onComplete` in an effect whose deps
// do not include it, so a provider that outlived its callback would report every
// challenge under the first one's name.
function Run({ job, onDone }) {
  useEffect(() => {
    const id = setTimeout(
      () =>
        onDone([
          {
            name: 'the suite never finished',
            status: 'fail',
            message: 'timed out',
          },
        ]),
      TIMEOUT_MS,
    )
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <SandpackProvider template="react" files={job.files} customSetup={SETUP}>
      <div className="mt-6 h-64 overflow-hidden rounded border border-border">
        <SandpackTests
          verbose
          onComplete={(specs) => onDone(readSpecs(specs))}
          style={{ height: '100%' }}
        />
      </div>
    </SandpackProvider>
  )
}

export default function Check() {
  const [params] = useSearchParams()
  const all = params.get('all') === '1'

  const jobs = useMemo(
    () =>
      all
        ? challenges.map((c) => ({
            label: c.name,
            files: { ...c.files, ...SHIM_FILES },
          }))
        : [
            {
              label: 'environment',
              files: { ...SHIM_FILES, ...ENVIRONMENT_FILES },
            },
          ],
    [all],
  )

  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([])
  const recorded = useRef(-1)

  const job = jobs[index]
  const finished = index >= jobs.length

  // watchMode reruns the suite on every bundle, so one job can complete twice.
  const onDone = useMemo(() => {
    return (tests) => {
      if (recorded.current >= index) return
      recorded.current = index
      setResults((prev) => [...prev, { label: job.label, tests }])
      setIndex(index + 1)
    }
  }, [index, job])

  const summary = useMemo(() => {
    const failures = []
    const known = []
    let total = 0

    for (const { label, tests } of results) {
      for (const test of tests) {
        total += 1
        if (test.status === 'pass') continue
        if (all && !ENV_ERROR.test(test.message)) continue
        const failure = {
          name: `${label} › ${test.name}`,
          message: test.message,
        }
        ;(KNOWN_GAPS.some((gap) => failure.name.includes(gap))
          ? known
          : failures
        ).push(failure)
      }
    }

    return {
      // Known gaps do not turn it red. A gate that is red every single run gets
      // ignored within a week, and then the next real break is invisible too.
      // They are still printed, every time, so nobody gets to forget them.
      ok: failures.length === 0,
      total,
      passed: total - failures.length - known.length,
      failures,
      known,
    }
  }, [results, all])

  useEffect(() => {
    window.__CHECK_PROGRESS__ = {
      done: results.length,
      total: jobs.length,
      label: job?.label ?? 'done',
    }
    if (finished) window.__CHECK__ = summary
  }, [results.length, jobs.length, job, finished, summary])

  return (
    <main className="min-h-dvh p-6 font-mono text-sm">
      <h1 className="text-base font-semibold">
        browser runner check — {all ? 'every challenge' : 'environment spec'}
      </h1>

      <p className="mt-2 text-muted-foreground">
        {finished
          ? `${summary.total} tests · ${summary.passed} ok · ${summary.known.length} known gaps · ${summary.failures.length} broken`
          : `${index + 1}/${jobs.length} — running ${job.label}…`}
      </p>

      {finished && (
        <p
          data-testid="verdict"
          className={`mt-4 text-lg font-bold ${
            summary.ok ? 'text-primary' : 'text-destructive'
          }`}
        >
          {summary.ok ? 'PASS' : 'FAIL'}
        </p>
      )}

      {finished && summary.known.length > 0 && (
        <div className="mt-6 max-w-4xl">
          <p className="text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase">
            known gaps — characterised, not regressions
          </p>
          <ul className="mt-2 space-y-1">
            {summary.known.map((f) => (
              <li key={f.name} className="text-xs text-muted-foreground">
                {f.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {finished && summary.failures.length > 0 && (
        <ul className="mt-4 max-w-4xl space-y-3">
          {summary.failures.map((f) => (
            <li key={f.name}>
              <p className="text-destructive">{f.name}</p>
              <pre className="mt-1 text-xs whitespace-pre-wrap text-muted-foreground">
                {f.message}
              </pre>
            </li>
          ))}
        </ul>
      )}

      {!finished && <Run key={job.label} job={job} onDone={onDone} />}
    </main>
  )
}
