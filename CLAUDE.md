# React practice ladder — read this before helping

This is a product Shivang built for himself and uses: ninety challenges, a
browser runner, GitHub login, his code saved per challenge. Set up 2026-08-29.
He codes with agents daily at work (TestMu AI), so this is the one place he
still writes React by hand — syntax, hooks, all of it — without one.

**The rep is the deliverable, not the working code.** That is why the app
exists, and why you still do not write the solutions in it.

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

**The app around the challenges is normal work.** `Challenge.jsx`, `Home.jsx`,
auth, the store, the styling — write that yourself, fully, like any other repo.
Hints-only applies to `src/challenges/**` and nothing else.

## Comments

**Two lines, and only when the code cannot say it itself.** Write the why — the
non-obvious constraint, the reason for the odd choice. Never restate the code.
If the explanation needs more than two lines, it belongs in the commit message
or in your reply to him, not in the file.

## Git

**Commit straight to `main`. Never open a branch, and never ask.** This is a
solo repo with no reviewer, so a branch is a merge step for nobody's benefit.

This overrides both the global "never PR to `main`" rule — that one is about
the LambdaTest monorepos with their stage branches — and any default about
branching before committing to the default branch. Neither applies here.

Conventional commits, as everywhere else.

## Layout

```
src/challenges/NN-name/
  Thing.jsx        ← stub, rules in the doc comment. He writes this.
  Thing.test.jsx   ← the spec. Off limits.
  demo.jsx         ← optional; mounts the stub with props for the preview pane
src/challenges.js  ← globs those folders in as raw strings. Title, topics, tier
                     and the test list all come from the files themselves.
src/Challenge.jsx  ← the runner: Sandpack editor, spec list, tests, preview
src/Home.jsx       ← the ladder — five tiers, searchable, progress per card
src/auth.jsx       ← GitHub OAuth, session gate in front of every route
src/store.js       ← Supabase: one row per user per challenge, `code` + `passed`
src/setupTests.js  ← `npm test` only. The browser runner has its own setup.
```

```bash
npm run dev             # the app — write and run challenges in the browser
npm run test:watch 04   # one challenge in the terminal, by folder-name substring
npm test                # all of them
```

Needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`,
or it throws on boot. Deployed on Vercel.

**The same spec files run in two places** — Vitest + jsdom locally, Jest inside
Sandpack in the browser (`Challenge.jsx` ships a virtual `vitest` module that
maps one onto the other). A change that helps one must not break the other.

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

Progress is not a file. A challenge flips to solved in Supabase the moment its
suite goes green in the browser, and the home screen reads that. Nothing to tick
off by hand, and no list in the repo to keep in sync.

All 782 tests were verified passable by reference solutions before the stubs went
back in. If something looks unsolvable, it is far more likely a misread of the
doc comment than a broken test.

Fourteen tests pass against an empty stub — they are negative assertions
(`renders nothing when closed` and similar). Not a bug, and not progress either.

`src/setupTests.js` replaces Node 25's stub `localStorage` global with a real
in-memory Storage. Node's version has no `clear`/`key`/`length` and shadows
jsdom's, which breaks challenge 11. Do not remove it.

## What he is actually working on

Keeping the syntax in his fingers is why the app exists at all — but the thing
he actually gets wrong is **spotting which code runs once versus on every
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
