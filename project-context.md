# How this thing is put together

Written for whoever touches it next, including me in six months. CLAUDE.md says
what to do; this says how it works.

## The one idea

Three things used to be the same string, and they change for different reasons:

| | What it is | When it changes |
|---|---|---|
| **Identity** | which challenge this is | never |
| **Order** | where it sits on the ladder | whenever the ladder is rearranged |
| **Position** | the number you see, 1, 2, 3 | every time anything above it moves |

So they are three separate things now:

```
identity → the folder name          src/challenges/list-keys/
order    → a line in a list         src/ladder.js
position → computed at load         challenges.js, ++level while walking
```

**The rule that falls out of it:** whatever is stored must never change, and
whatever changes must never be stored. The folder name is stored — Supabase
saves your code under it, and it is the URL — so it is never renamed. The
position is stored nowhere, so it is free to move.

## The ladder is not finished, and that is normal

208 challenges today, heading towards roughly 500. **Expect new folders to keep
arriving in large batches** — a commit adding eighty at once is the intended
rhythm, not a runaway script.

The sections are deliberately uneven. Growth goes in at the front, because the
gap was never the hard end of the ladder: it was that `counter` had nothing
underneath it. So Describing the UI, State & events, Async & data and Hooks
keep filling out, while Machine coding and Hard are still the originals and may
stay that way for a while.

None of this needs a migration or a rename. A batch is new folders plus lines in
`src/ladder.js`, and every number on screen is recalculated from that list. The
one thing a batch must not do is touch a folder that already exists.

## Adding a challenge

Two steps.

**1. A folder, named after the thing you build.** No number, no prefix.

```
src/challenges/use-throttle/
  useThrottle.js        the stub — doc comment, then a body that does nothing
  useThrottle.test.jsx  the spec
  demo.jsx              optional, only if the preview needs props
```

The stub's doc comment is the whole brief, and it is parsed:

```js
/**
 * Effect cleanup + the stale closure (Dan Abramov's classic)   ← summary
 *
 * Topics: useRef · effect cleanup · stale closure              ← topics, split on ·
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * Rules:
 *  1. ...
 */
```

First line after `/**` is the summary. `Topics:` becomes the tag list. There is
no level number in here — that used to be a second copy of the position, and it
went stale the first time anything moved.

**2. One line in `src/ladder.js`,** in the section it belongs to, at the spot it
belongs at:

```js
{
  name: 'Hooks',
  blurb: 'the ones you rebuild in every project',
  challenges: ['use-toggle', 'use-throttle', 'use-interval'],
}
```

That is the entire ordering mechanism. Move a line to reorder. Move it to
another array to change its section. Delete the line to drop it. Nothing is
renamed, so nothing loses its saved code.

Forget step 2 and the challenge still shows up, in an **Unsorted** section at
the bottom — visible, not silently missing. `src/challenges.test.js` fails on it.

### The bar for a new spec

Write the spec, write a reference solution, watch it go green, **then** put the
stub back. A spec that has never passed is not a spec. All 1,439 current challenge tests
were verified this way.

Mock nothing global. A challenge that needs data takes the async function as a
prop, and the spec hands it one it controls by hand:

```js
function controllable() {
  const pending = new Map()
  const load = (id) => new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
  return { load, resolve: (id, v) => act(async () => pending.get(id).resolve(v)) }
}
```

Nothing resolves until the test says so, which is the only way to write the
out-of-order and unmount cases at all. Where a challenge needs a delay, a tick
or a clock, that is a prop too.

The reason to inject rather than fake is that it cannot go wrong in either
runner. Fake timers do now work in the browser, but only because the shim
carries a clock of its own — see below. Injecting needs nothing. `vi.mock` is
not used anywhere and should stay that way.

### Working rhythm

**Batch the work, then commit once.** A section's worth of challenges is one
commit, not thirty. Same for a refactor: land the whole thing, verify, commit.
Committing after every file buries the one message that explains the change,
and none of it is any safer — nothing here is deployed by a commit.

## How a challenge reaches the screen

```
src/challenges/*/*            every file, as a raw string, at build time
      ↓  import.meta.glob('./challenges/*/*.{js,jsx}', { query: '?raw', eager: true })
byName['list-keys'].files     { '/ReorderableList.jsx': '…', '/ReorderableList.test.jsx': '…' }
      ↓  walk LADDER in order, ++level per entry
challenges[]                  { name, title, summary, topics, tests, level, tier, files, … }
      ↓
Home.jsx                      grouped by tier, searchable
Challenge.jsx                 one challenge, in Sandpack
```

`tests` is pulled straight out of the spec file by regex — every `test('…')`
title — so the challenge page can list what you are aiming at before you have
run anything.

## How your code is loaded and saved

One Supabase table, `solutions`. One row per user per challenge:

```
user_id      uuid        → auth.users
challenge    text        → the folder name. 'list-keys'
code         text        → whatever is in the editor
passed       boolean     → did the whole suite go green
updated_at   timestamptz
             unique (user_id, challenge)
```

RLS keeps each user to their own rows, which is why nothing in `store.js`
filters by user on read.

**Opening a challenge** — `Challenge.jsx` holds `saved` as `undefined` until the
row lands, and renders a spinner. Sandpack cannot be handed the stub first and
the real code second: that is a file change, and it re-bundles.

```
loadSolution('list-keys')  →  { code, passed } | null
files[stub] = saved?.code || files[stub]       ← saved code, else the stub
```

**Typing** — `SaveCode` debounces 1s, then upserts. It skips a write when the
code matches the stub (trimmed), so a stray newline cannot overwrite a real
solution with an empty one. That has already cost one.

**Running the tests** — `SandpackTests` calls `onComplete` with every spec
result. `passed` is true only when tests actually ran and all of them pass:

```js
saveDone(name, ran.length > 0 && ran.every((t) => t.status === 'pass'))
```

That is the only thing that marks a challenge solved. The home screen reads it
back via `loadProgress()`, which fetches names only — not ninety blobs of code.

**Reset** writes the stub *and* `passed: false` explicitly, because `SaveCode`
ignores a file that matches the stub and would otherwise leave the old row.

## The same spec runs in two places

| | Terminal | Browser |
|---|---|---|
| runner | Vitest | Jest, inside Sandpack |
| DOM | jsdom | a real iframe |
| setup | `vite.config.js` + `src/setupTests.js` | `src/sandpackVitestShim.js` |

The specs `import { test, expect, vi } from 'vitest'`, which Sandpack has no
idea about. A virtual `/node_modules/vitest` maps those onto Jest's globals, so
the spec files never need to know where they are running. **A change that helps
one must not break the other.**

Three things in that shim are load-bearing and non-obvious:

- Chrome throttles `setTimeout` to roughly 1/s in the hidden test iframe, and
  user-event awaits one per click. Correct answers were blowing the 5s timeout,
  so zero-delay timeouts get routed through a `MessageChannel` instead.
- `@testing-library/user-event` is pinned to 14.6.1. 14.6.2+ hangs on
  click/type until the Jest timeout.
- The fake-timer clock, which Sandpack's Jest does not provide. See below.

`setupTests.js` replaces Node 25's stub `localStorage` global with a real
in-memory Storage — Node's has no `clear`/`key`/`length` and shadows jsdom's,
which breaks `use-local-storage`.

## The preview pane

Only a couple of folders ship a `demo.jsx`. Everything else gets `autoMount()`,
which renders the default export bare inside an error boundary. Components that
need props hit the boundary and get told to add a `demo.jsx` — better than a
blank pane. A `.js` stub is a hook or a plain function, so it has no preview at
all and the toggle says "no ui" rather than leaving a gap.

The preview client is mounted only while visible. Kept alive but hidden, the
iframe is `display: none`, Chrome throttles it, and it falls an edit behind.

## Invariants, and what enforces them

`src/challenges.test.js` — not a challenge, edit it freely:

- every slug in `ladder.js` has a folder behind it
- every folder is placed on the ladder (nothing stuck in Unsorted)
- levels are 1, 2, 3 with no gaps and no duplicates
- every challenge has a summary, topics, and at least one test

Not enforced, but true:

- **the folder name is the URL and the database key.** `/list-keys` routes by it,
  `solutions.challenge` stores it. Renaming a folder orphans saved work and
  breaks every link to it. If it ever has to happen:
  `update solutions set challenge = 'new' where challenge = 'old';`
- 27 of the tests pass against an empty stub. They are negative assertions
  (`renders nothing when closed` and friends) — not a bug, and not progress.

## Fake timers, and why the shim has a clock in it

Fourteen of the older specs call `vi.useFakeTimers()` — `debounce`, `throttle`,
`retry`, `use-interval`, `use-debounced-value`, `use-clipboard`, `countdown`,
`digital-clock`, `stopwatch`, `traffic-light`, `progress-bars`, `memory-game`,
`toast-system`, `imperative-player`.

Sandpack's Jest answers to `useFakeTimers()` and then has nothing to move them
with: `advanceTimersByTime` is not on its `jest` object. So those fourteen
passed in the terminal and were **unsolvable in the browser**, which is the only
place the challenges are actually used. The failure was quiet — the spec got as
far as calling the stub, so it looked like an ordinary red run.

`src/sandpackVitestShim.js` now carries its own clock: a queue for
`setTimeout`/`setInterval`, a `Date` subclass so `Date.now()` and a bare
`new Date()` read the fake time, and `advanceTimersByTime`,
`advanceTimersByTimeAsync`, `runAllTimers`, `setSystemTime`, `stubGlobal` and
`unstubAllGlobals` on top. It installs over whatever Jest did and restores the
real ones on `useRealTimers()`.

Two things about it worth knowing:

- It layers on the `MessageChannel` patch above, not around it. Installing
  captures whatever `setTimeout` is current and puts it back on uninstall, so
  the throttle workaround survives.
- Advancing recomputes the next due timer every turn, because a callback may
  schedule another one inside the same window. `MAX_TURNS` is the backstop
  against a timer that reschedules itself at the same instant forever.

New specs should still inject their time rather than fake it. The clock makes
the old ones work; it does not make faking the better choice.

**This is the class of bug to watch for.** A spec green under Vitest proves
nothing about Sandpack. The only real check is opening the challenge in the app
and pressing Run.

## Stack

Vite SPA, React 19, Tailwind v4, shadcn/ui on Base UI, react-router, Sandpack
for the editor and runner, Supabase for auth and storage, Vercel for hosting
(`vercel.json` rewrites everything to `index.html` so deep links work).

Needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
`supabase.js` throws on boot without them rather than failing as a confusing
401 halfway through a save.
