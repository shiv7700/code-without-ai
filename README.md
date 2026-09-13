# React practice ladder

Ninety challenges and somewhere to write them, so hand-writing React stays in
the fingers. Built for one user. No AI in the loop — that is the whole point.

## How to use it

Sign in with GitHub, pick a challenge, write it in the editor, run the spec.
Your code and what you have solved are saved as you go, so the ladder follows
you to whatever machine you sit down at.

Each challenge is a stub with its rules in the doc comment and a spec beside it.
Read the rules, write the code, run the tests until they are green. Five
sections, easiest first — work down, or jump to what you need. 36–55 need no
React at all, so they are the ones to do on a train.

```bash
npm run dev               # the app
npm run test:watch 04     # or run one challenge in the terminal, by folder name
npm test                  # everything
```

`npm run dev` wants `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in
`.env.local` — it says so rather than failing later. The terminal runner needs
neither.

## Rules

1. **Never edit a `.test.jsx` file.** That is the spec.
2. **10 minutes stuck before asking.** Write something wrong, run it, read the
   failure. A wrong attempt teaches more than a correct answer handed over.
3. **Read the failure message before changing anything.** Most of the time it
   already says what is wrong.
4. One challenge per week is enough. Consistency beats volume.

## The ladder

| # | Challenge | What it drills |
|---|-----------|----------------|
| 01 | `counter` | `useState`, event handlers, updater form |
| 02 | `controlled-form` | controlled inputs, derived state (no redundant state) |
| 03 | `filter-list` | lists, keys, deriving during render instead of `useEffect` |
| 04 | `use-toggle` | your first custom hook, stable identities |
| 05 | `fetch-user` | `useEffect` + async, and the out-of-order response race |
| 06 | `use-interval` | effect cleanup + the stale closure (the classic) |
| 07 | `todo-reducer` | `useReducer`, purity, never mutating state |
| 08 | `theme-context` | context, provider guards, memoising the value |
| 09 | `memo-list` | `memo` + `useCallback`, proven with render counts |
| 10 | `tabs-compound` | compound components, context instead of prop drilling |
| 11 | `use-local-storage` | persistence, lazy init, surviving corrupt data |
| 12 | `use-outside-click` | refs + real DOM listeners + cleanup |
| 13 | `modal-portal` | portals, Escape, backdrop, body scroll lock |
| 14 | `toast-system` | context + a queue + timers you have to clean up |
| 15 | `use-pagination` | derived state that has to stay in range when data shrinks |
| 16 | `data-table` | sort + filter composing, and the `.sort()` mutation bug |
| 17 | `wizard` | multi-step state that survives going backwards |
| 18 | `optimistic-update` | update now, roll back on failure |
| 19 | `use-undoable` | undo/redo, and dropping the abandoned branch |
| 20 | `error-boundary` | the one thing hooks still cannot do |

Roughly: 01–03 fundamentals, 04–06 hooks and effects, 07–08 state architecture,
09–10 component-library patterns, 11–15 the hooks you rebuild in every project,
16–20 the screens and edge cases real apps actually ship.

### 21–35 · Everyday components

The widgets every app ships. Same ideas as 01–20, fewer training wheels.

`use-ref-focus` · `char-counter` · `star-rating` · `use-debounced-value` ·
`search-highlight` · `sortable-list` · `checkbox-group` · `countdown` ·
`use-clipboard` · `accordion` · `use-media-query` · `tag-input` ·
`password-strength` · `use-event-listener` · `load-more`

### 36–55 · JS toolbox

No React at all. The utilities you have imported a hundred times, written out.

| # | Challenge | What it drills |
|---|-----------|----------------|
| 36 | `curry` | closures that must not share their collected arguments |
| 37 | `debounce` | timers, and the leading/trailing edge options |
| 38 | `throttle` | the same tools, the opposite behaviour |
| 39 | `deepClone` | recursion, and the cycle that hangs your tab |
| 40 | `deepEqual` | `Object.is`, key sets, `{a:1}` vs `{a:1,b:undefined}` |
| 41 | `flatten` | recursion carrying a decreasing depth |
| 42 | `promiseAll` | input order vs finishing order |
| 43 | `promiseAny` | the same counter, inverted, plus `AggregateError` |
| 44 | `promisify` | one wrapper, reusable, nothing shared between calls |
| 45 | `memoize` | cache keys, and why a cached `undefined` is a hit |
| 46 | `EventEmitter` | iterating a list a listener is removing itself from |
| 47 | `retry` | `await` inside `try`, and backoff between attempts |
| 48 | `mapAsyncLimit` | a worker pool — start one when one finishes |
| 49 | `get` | path parsing, and `null` being a hit but `undefined` a miss |
| 50 | `classNames` | variadic args, nested arrays, no double spaces |
| 51 | `LRUCache` | Map insertion order as the whole algorithm |
| 52 | `groupBy` | the `'toString'` key that breaks a plain `{}` |
| 53 | `dedupe` | one in-flight request, however many callers |
| 54 | `set` | immutable nested write with structural sharing |
| 55 | `createStore` | Redux, minus the package |

### 56–75 · Machine coding

Interview-sized components, built from a spec you did not write.

| # | Challenge | What it drills |
|---|-----------|----------------|
| 56 | `TrafficLight` | one timeout re-armed per state, not one interval |
| 57 | `Stopwatch` | start/stop/resume, and where the state boundary is |
| 58 | `Carousel` | index state and wrapping in both directions |
| 59 | `FileTree` | a component that renders itself, open state per node |
| 60 | `TransferList` | selection as a Set, derived enabled/disabled |
| 61 | `TicTacToe` | the winner is derived, not stored |
| 62 | `NestedCheckboxes` | `indeterminate`, and state derived from the leaves |
| 63 | `Autocomplete` | filtered list plus keyboard, the combobox pattern |
| 64 | `InfiniteScroll` | IntersectionObserver, and not double-loading |
| 65 | `useQuery` | a cache outside React, plus the state-reset pattern |
| 66 | `ProgressBars` | one interval driving a queue with a concurrency limit |
| 67 | `Clock` | lazy initial state, so the first paint is right |
| 68 | `useStep` | clamping, and callbacks that keep their identity |
| 69 | `MemoryGame` | a timer driven by state, and locking input |
| 70 | `SignupForm` | touched state, validation as a pure function |
| 71 | `DropdownMenu` | focus management and the menu keyboard pattern |
| 72 | `Poll` | two views of one state, percentages derived |
| 73 | `useSet` | why mutating a Set in state renders nothing |
| 74 | `Calendar` | date arithmetic, Monday-first weeks, month rollover |
| 75 | `useControllableState` | controlled vs uncontrolled, the library hook |

### 76–90 · Hard

The ones worth sketching on paper first.

| # | Challenge | What it drills |
|---|-----------|----------------|
| 76 | `FocusTrap` | tab wrapping, portals, giving focus back |
| 77 | `ServerTable` | server-side sort and paging, selection across pages |
| 78 | `Wordle` | the duplicate-letter marking rule, in two passes |
| 79 | `SelectableGrid` | anchor plus selection, shift and ctrl clicks |
| 80 | `VirtualList` | windowing maths, and rows positioned by real index |
| 81 | `useStore` | `useSyncExternalStore`, selectors, snapshot identity |
| 82 | `CommentThread` | immutable tree insert and remove |
| 83 | `Spreadsheet` | recursive evaluation and cycle detection |
| 84 | `Player` | `useImperativeHandle`, and the stale getter |
| 85 | `useMachine` | states, guards, and why value and context are one |
| 86 | `CascadingSelect` | dependent fetches, clearing downstream, races |
| 87 | `Markdown` | a recursive parser that returns React elements |
| 88 | `TicTacToeN` | generalised win detection plus time travel |
| 89 | `useResizable` | document listeners, drag origin, cleanup |
| 90 | `useRouter` | the History API, and sharing state between instances |

Every stub carries its own `Topics:` line and two `Read:` links to react.dev,
right under the level heading. Read those before writing, not after failing.

## Concepts, and where they come back

Twenty challenges, but not twenty ideas. Seven core ones, each in 3–5 disguises —
that repetition is the point. If a concept still feels new on its third
appearance, that is the one to go back and read about.

| Concept | Appears in |
|---|---|
| stale closure → read the latest value from a ref | 06, 12 |
| effect cleanup | 05, 06, 12, 13, 14 |
| stable identity (`useCallback`) | 04, 09, 12, 15, 19 |
| derived state instead of stored state | 02, 03, 15, 16 |
| context + a provider guard | 08, 10, 14 |
| never mutating state | 07, 16 |
| async races and rollback | 05, 18, 65, 77, 86 |
| a store that lives outside React | 55, 81, 90 |
| immutable updates, structurally shared | 54, 82 |
| recursion over a tree | 39, 41, 59, 62, 82, 83, 87 |
| timers you have to clean up | 37, 38, 47, 56, 57, 66, 67, 69, 84 |
| focus and keyboard handling | 21, 63, 71, 76 |

## Progress

Kept in the app, not in this file. A challenge counts as solved the moment its
spec goes green in the browser, and the home screen shows where you are in each
section. Nothing to tick off by hand.

## Later

**Public shareable solution pages.** A read-only URL per solved challenge, so a
solution can be linked to someone. Parked on 2026-09-13 while adding Supabase.

Worth writing down because it is the one feature on the list that would change
the stack: shareable pages want SEO and OG previews, which is the only real
argument for moving off the Vite SPA to Next.js. Everything else — GitHub login,
saving code and progress — the SPA does fine with `supabase-js` and RLS. So if
this gets built, revisit the Next.js question then, not before.

Needs a public-read RLS policy alongside the owner-only one, and a per-row
`is_public` flag. Nothing in the current schema blocks it.

## How it is built

Vite SPA on React 19, Tailwind and shadcn/ui, deployed to Vercel. The editor and
runner are Sandpack. GitHub OAuth and one Supabase table — a row per user per
challenge holding the code and whether it passes — keep the work off any one
laptop; RLS keeps each user to their own rows.

Adding a challenge is still just adding a folder. `src/challenges.js` globs them
in and reads the title, topics, section and spec list out of the files
themselves, so there is no list anywhere to update.

## Notes

Every challenge has been verified solvable — reference solutions pass all 782
tests. They are deliberately not in this repo.

Fourteen tests pass against an empty stub (`renders nothing when closed` and
friends). They are negative assertions, so nothing can make them fail early —
ignore them as a progress signal.

The same spec files run in two places. In the terminal it is Vitest + Testing
Library + jsdom, set up in `vite.config.js` and `src/setupTests.js`; in the
browser it is Jest inside Sandpack, with a virtual `vitest` module mapping one
onto the other. A spec has to stay green in both.

`setupTests.js` also replaces Node 25's stub `localStorage` global with a real
in-memory one — without that, challenge 11 cannot work.
