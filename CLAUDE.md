# React practice ladder — read this before helping

This is a product Shivang built for himself and uses: a ladder of challenges, a
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

**One commit per batch of work, not per file.** A section of new challenges is
one commit. A refactor is one commit, landed and verified first. Committing
after every step buries the message that explains the change.

## Layout

```
src/challenges/NN-name/
  Thing.jsx        ← stub, rules in the doc comment. He writes this.
  Thing.test.jsx   ← the spec. Off limits.
  demo.jsx         ← optional; mounts the stub with props for the preview pane
src/ladder.js      ← the order. Sections, each an ordered list of folder names.
src/challenges.js  ← globs the folders in as raw strings and walks the ladder.
                     Title, summary, topics and the test list come from the files.
src/challenges.test.js ← keeps those two honest. Not a challenge, editable.
src/Challenge.jsx  ← the runner: Sandpack editor, spec list, tests, preview
src/Home.jsx       ← the ladder — eight sections, searchable, progress per card
src/auth.jsx       ← GitHub OAuth, session gate in front of every route
src/store.js       ← Supabase: one row per user per challenge, `code` + `passed`
src/setupTests.js  ← `npm test` only. The browser runner has its own setup.
```

```bash
npm run dev             # the app — write and run challenges in the browser
npm run test:watch keys # one challenge in the terminal, by folder-name substring
npm test                # all of them
```

Needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`,
or it throws on boot. Deployed on Vercel.

**The same spec files run in two places** — Vitest + jsdom locally, Jest inside
Sandpack in the browser (`Challenge.jsx` ships a virtual `vitest` module that
maps one onto the other). A change that helps one must not break the other.

## The ladder

301 challenges today, being filled out towards 500. Eight sections:

Describing the UI · State & events · Async & data · Hooks · Components ·
JS toolbox · Machine coding · Hard

**`project-context.md` has the architecture** — how a challenge is added, how
saved code is loaded and written back, why the same spec runs under two test
runners. Read it before changing anything structural. What matters here:

**Never rename a challenge folder.** The name is its identity: Supabase keys the
saved code on it and the URL routes by it. To move a challenge, move its line in
`src/ladder.js` — that file owns order and sections, and the number on a card is
just a position worked out at load. Nothing is stored against a number.

**Every new spec gets a reference solution first.** Write the spec, write a
solution, watch it go green, then put the stub back. A spec that has never
passed is not a spec. All 2,022 current tests were verified that way, so if
something looks unsolvable it is far more likely a misread of the doc comment
than a broken test.

27 tests pass against an empty stub — negative assertions (`renders nothing when
closed` and similar). Not a bug, and not progress either.

Progress is not a file. A challenge flips to solved in Supabase the moment its
suite goes green in the browser, and the home screen reads that.

Growth goes into the front of the list first. The gap was never the hard end of
the ladder; it was that `counter` had nothing underneath it.

## What he is actually working on

Keeping the syntax in his fingers is why the app exists at all — but the thing
he actually gets wrong is **spotting which code runs once versus on every
render or call** — closure layers, stale closures, effect cleanup. `fetch-user`,
`use-interval`, `theme-context` and `memo-list` aim at exactly that, and
`debounce`, `throttle`, `memoize`, `map-async-limit`, `use-controllable-state`,
`imperative-player` and `use-resizable` are the same idea in plain JS or with a
ref holding the latest value. Before this
repo he solved `debounce` and `useDebouncedCallback` in
`~/Documents/trash/indepentedmind/challenge/`, and the same confusion showed up
in both.

When he gets something working, the useful follow-up is *why* it works — not a
list of further improvements.

## Language

He writes in Hinglish. Match it. Keep answers short.
