# React practice

Weekly reps so hand-writing React stays in the fingers.

## How to use it

Pick the next unfinished challenge. Open the stub, read the rules in the doc
comment, write the code yourself. Run the tests until they are green.

```bash
npm run test:watch 04     # watch one challenge (matches the folder name)
npm test                  # run everything
npm run dev               # play with it in the browser (src/App.jsx)
```

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
| async races and rollback | 05, 18 |

## Progress

- [ ] 01 counter
- [ ] 02 controlled-form
- [ ] 03 filter-list
- [ ] 04 use-toggle
- [ ] 05 fetch-user
- [ ] 06 use-interval
- [ ] 07 todo-reducer
- [ ] 08 theme-context
- [ ] 09 memo-list
- [ ] 10 tabs-compound
- [ ] 11 use-local-storage
- [ ] 12 use-outside-click
- [ ] 13 modal-portal
- [ ] 14 toast-system
- [ ] 15 use-pagination
- [ ] 16 data-table
- [ ] 17 wizard
- [ ] 18 optimistic-update
- [ ] 19 use-undoable
- [ ] 20 error-boundary

## Notes

Every challenge has been verified solvable — reference solutions pass all 135
tests. They are deliberately not in this repo.

Three tests pass against an empty stub (`renders nothing when closed` and
friends). They are negative assertions, so nothing can make them fail early —
ignore them as a progress signal.

Test setup lives in `vite.config.js` and `src/setupTests.js`. Vitest +
Testing Library + jsdom. `setupTests.js` also replaces Node 25's stub
`localStorage` global with a real in-memory one — without that, challenge 11
cannot work.
