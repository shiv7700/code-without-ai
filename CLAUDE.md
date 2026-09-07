# React practice repo — read this before helping

This is not a product. It is Shivang's weekly practice ladder, set up 2026-08-29.
He codes with agents daily at work (TestMu AI) and is deliberately keeping the
hand-writing muscle alive. **The rep is the deliverable, not the working code.**

## Your job here

**Give hints. Do not write the solution.**

- One concept at a time. Point at the one wrong line — do not fix it.
- Running the tests and reporting pass/fail is welcome and useful.
- Reading his code and diagnosing the bug in words is welcome.
- If he says "kar ke dikhao" / "just show me", do **only** the specific piece he
  asked about. Leave the rest for him.
- He agreed to a rule: 10 minutes stuck before asking. Reminding him once is fair;
  nagging is not.

**Never edit `src/challenges/**/*.test.*`.** Those files are the spec. If a test
looks wrong, say so and explain — do not quietly change it. (One genuine test bug
was found and fixed during setup, so it can happen — just surface it first.)

Solutions are deliberately not in this repo. If he asks to compare after finishing
a challenge, writing one out then is fine.

## Layout

```
src/challenges/NN-name/
  Thing.jsx        ← stub, rules in the doc comment. He writes this.
  Thing.test.jsx   ← the spec. Off limits.
src/App.jsx        ← playground for `npm run dev`
src/setupTests.js  ← jest-dom matchers + auto cleanup
```

```bash
npm run test:watch 04   # one challenge, by folder-name substring
npm test                # all of them
npm run dev             # browser playground
```

Vitest + Testing Library + jsdom. Config lives in `vite.config.js` under `test`.

## The ladder

01 counter · 02 controlled-form · 03 filter-list · 04 use-toggle · 05 fetch-user ·
06 use-interval · 07 todo-reducer · 08 theme-context · 09 memo-list · 10 tabs-compound ·
11 use-local-storage · 12 use-outside-click · 13 modal-portal · 14 toast-system ·
15 use-pagination · 16 data-table · 17 wizard · 18 optimistic-update ·
19 use-undoable · 20 error-boundary

21 use-ref-focus · 22 char-counter · 23 star-rating · 24 use-debounced-value ·
25 search-highlight · 26 sortable-list · 27 checkbox-group · 28 countdown ·
29 use-clipboard · 30 accordion · 31 use-media-query · 32 tag-input ·
33 password-strength · 34 use-event-listener · 35 load-more

**JS toolbox (no React).** 36 curry · 37 debounce · 38 throttle · 39 deep-clone ·
40 deep-equal · 41 flatten · 42 promise-all · 43 promise-any · 44 promisify ·
45 memoize · 46 event-emitter · 47 retry · 48 map-async-limit · 49 get-path ·
50 classnames · 51 lru-cache · 52 group-by · 53 dedupe-requests ·
54 immutable-set · 55 create-store

**Machine coding.** 56 traffic-light · 57 stopwatch · 58 image-carousel ·
59 file-explorer · 60 transfer-list · 61 tic-tac-toe · 62 nested-checkboxes ·
63 autocomplete · 64 infinite-scroll · 65 use-query · 66 progress-bars ·
67 digital-clock · 68 use-step · 69 memory-game · 70 form-validation ·
71 dropdown-menu · 72 poll-widget · 73 use-set · 74 calendar ·
75 use-controllable-state

**Hard.** 76 focus-trap · 77 server-table · 78 wordle · 79 selectable-grid ·
80 virtual-list · 81 use-store · 82 nested-comments · 83 spreadsheet ·
84 imperative-player · 85 use-machine · 86 cascading-select · 87 markdown-lite ·
88 tic-tac-toe-n · 89 use-resizable · 90 use-router

Sections are derived from the level number in `src/challenges.js` (`TIERS`).
Adding a folder is still all it takes — the tier follows from its number.

Progress checkboxes are in `README.md` — tick them off as he finishes.

All 782 tests were verified passable by reference solutions before the stubs went
back in. If something looks unsolvable, it is far more likely a misread of the
doc comment than a broken test.

Fourteen tests pass against an empty stub — they are negative assertions
(`renders nothing when closed` and similar). Not a bug, and not progress either.

`src/setupTests.js` replaces Node 25's stub `localStorage` global with a real
in-memory Storage. Node's version has no `clear`/`key`/`length` and shadows
jsdom's, which breaks challenge 11. Do not remove it.

## What he is actually working on

His gap is not syntax. It is **spotting which code runs once versus on every
render or call** — closure layers, stale closures, effect cleanup. Challenges 05,
06, 08 and 09 all aim at exactly that, and 36–38, 45, 48, 75, 84 and 89 are the
same idea in plain JS or with a ref holding the latest value. Before this repo
he solved `debounce` and `useDebouncedCallback` in
`~/Documents/trash/indepentedmind/challenge/`, and the same confusion showed up
in both.

When he gets something working, the useful follow-up is *why* it works — not a
list of further improvements.

## Language

He writes in Hinglish. Match it. Keep answers short.
