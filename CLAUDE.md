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

Progress checkboxes are in `README.md` — tick them off as he finishes.

All 243 tests were verified passable by reference solutions before the stubs went
back in. If something looks unsolvable, it is far more likely a misread of the
doc comment than a broken test.

Four tests pass against an empty stub — they are negative assertions
(`renders nothing when closed` and similar). Not a bug, and not progress either.

`src/setupTests.js` replaces Node 25's stub `localStorage` global with a real
in-memory Storage. Node's version has no `clear`/`key`/`length` and shadows
jsdom's, which breaks challenge 11. Do not remove it.

## What he is actually working on

His gap is not syntax. It is **spotting which code runs once versus on every
render or call** — closure layers, stale closures, effect cleanup. Challenges 05,
06, 08 and 09 all aim at exactly that. Before this repo he solved `debounce` and
`useDebouncedCallback` in `~/Documents/trash/indepentedmind/challenge/`, and the
same confusion showed up in both.

When he gets something working, the useful follow-up is *why* it works — not a
list of further improvements.

## Language

He writes in Hinglish. Match it. Keep answers short.
