# React practice ladder — read this before helping

A ladder of challenges, a browser runner, GitHub sign-in, code saved per
challenge. Set up 2026-08-29; being built out as a product since 2026-09-19.

The premise is that reading a solution teaches you nothing and writing one
teaches you everything, so the product withholds answers on purpose: paste is
blocked in the editor, there are no solutions in the repo, and the hints never
name the API.

**The rep is the deliverable, not the working code.** That is why the app
exists, and why you do not write the solutions in it either.

## Your job here

**Give hints. Do not write the solution.**

- One concept at a time. Point at the one wrong line — do not fix it.
- Running the tests and reporting pass/fail is welcome and useful.
- Reading the code and diagnosing the bug in words is welcome.
- Asked to "kar ke dikhao" / "just show me", do **only** the specific piece
  asked about. Leave the rest.
- The house rule is ten minutes stuck before asking. Reminding once is fair;
  nagging is not.

**Never edit `src/challenges/**/*.test.*`.** Those files are the spec. If a test
looks wrong, say so and explain — do not quietly change it. (One genuine test bug
was found and fixed during setup, so it can happen — just surface it first.)

Solutions are deliberately not in this repo. Writing one out to compare against,
after a challenge is finished, is fine.

**The app around the challenges is normal work.** `Challenge.jsx`, `Home.jsx`,
auth, the store, the styling — write that yourself, fully, like any other repo.
Hints-only applies to `src/challenges/**` and nothing else.

## Comments

**Two lines, and only when the code cannot say it itself.** Write the why — the
non-obvious constraint, the reason for the odd choice. Never restate the code.
If the explanation needs more than two lines, it belongs in the commit message
or in your reply, not in the file.

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
  Thing.jsx        ← stub, rules in the doc comment. You write this.
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

311 challenges today, being filled out towards 500. Eight sections:

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
passed is not a spec. All 2,073 challenge tests were verified that way, so if
something looks unsolvable it is far more likely a misread of the doc comment
than a broken test.

31 of the challenge tests pass against an empty stub — negative assertions
(`renders nothing when closed` and similar). Not a bug, not progress. The other
22 green tests in a full run are the app's own suites, not challenges.

Progress is not a file. A challenge flips to solved in Supabase the moment its
suite goes green in the browser, and the home screen reads that.

Growth goes into the front of the list first. The gap was never the hard end of
the ladder; it was that `counter` had nothing underneath it.

## What the ladder is aimed at

Syntax is the floor. The thing the harder challenges are built around is
**spotting which code runs once versus on every render or call** — closure
layers, stale closures, effect cleanup. `fetch-user`, `use-interval`,
`theme-context`, `memo-list`, `dashboard-panels`, `dependent-selects` and
`autosave-status` all turn on it, and `debounce`, `throttle`, `memoize`,
`map-async-limit`, `use-controllable-state`, `imperative-player` and
`use-resizable` are the same idea in plain JS or with a ref holding the latest
value.

Each of those passes the obvious implementation and fails its last test. That
is deliberate; do not soften it.

When something works, the useful follow-up is *why* it works — not a list of
further improvements.

## Language

Replies in Hinglish. Match it. Keep answers short.
