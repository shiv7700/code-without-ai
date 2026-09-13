# React practice ladder

Challenges and somewhere to write them, so hand-writing React stays in the
fingers. Built for one user. No AI in the loop — that is the whole point.

105 of them today, being filled out towards 500. The front of the list is where
the new ones are going: props, destructuring, conditional rendering, keys, fetch.
Fundamentals first, because everything above them is easier once those are
automatic.

## How to use it

Sign in with GitHub, pick a challenge, write it in the editor, run the spec.
Your code and what you have solved are saved as you go, so the ladder follows
you to whatever machine you sit down at.

Each challenge is a stub with its rules in the doc comment and a spec beside it.
Read the rules, write the code, run the tests until they are green. Eight
sections, easiest first — work down, or jump to what you need. The JS toolbox
needs no React at all, so those are the ones to do on a train.

```bash
npm run dev               # the app
npm run test:watch keys   # or run one challenge in the terminal, by folder name
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

| Section | What it is for |
|---|---|
| Describing the UI | props, destructuring, children, conditional rendering, lists and keys, purity — the half of a component that only reads |
| State & events | handlers, `useState`, the updater form, changing objects and arrays without mutating them |
| Async & data | `fetch`, loading and error and empty states, aborting, out-of-order responses, retries |
| Hooks | the custom hooks you rebuild in every project, and the closure traps inside them |
| Components | the widgets every app ships — and the same widget again, a notch harder |
| JS toolbox | no React. Closures, promises, data structures |
| Machine coding | interview-sized components, built from a spec you did not write |
| Hard | the ones worth sketching on paper first |

The order is `src/ladder.js` — sections, each an ordered list of folder names.
Move a line to reorder, delete one to drop a challenge, insert anywhere. The
number you see on a card is that position, worked out at load time, so nothing
depends on it and nothing has to be renamed.

Folders are named after what you build, never numbered. That name is the key
the database saves your code under, which is the one thing here that must not
change.

Every stub carries its summary, a `Topics:` line and two `Read:` links in its
doc comment. Read those before writing, not after failing. The app lists every
challenge with its topics and everything its spec checks, so there is no second
copy of that list in here to drift out of date.

## Concepts, and where they come back

Far fewer ideas than challenges. Each one turns up in several disguises, and
that repetition is the point. If a concept still feels new on its third
appearance, that is the one to go back and read about.

| Concept | Appears in |
|---|---|
| props, and destructuring them | `greeting-props`, `destructure-props`, `nested-props` |
| conditional rendering, and the falsy traps | `conditional-badge`, `empty-state`, `fallback-values` |
| keys, and component identity | `list-keys`, `render-prop-list`, `tabs-compound` |
| derived instead of stored | `derived-total`, `controlled-form`, `filter-list`, `use-pagination`, `data-table` |
| purity, and never mutating | `pure-render`, `todo-reducer`, `data-table` |
| stale closure → read the latest from a ref | `use-interval`, `use-outside-click` |
| effect cleanup | `fetch-user`, `use-interval`, `use-outside-click`, `modal-portal`, `toast-system` |
| stable identity (`useCallback`) | `memo-list`, `use-toggle`, `use-pagination`, `use-undoable` |
| context + a provider guard | `theme-context`, `tabs-compound`, `toast-system` |
| async races and rollback | `fetch-user`, `optimistic-update`, `use-query`, `server-table`, `cascading-select` |
| a store that lives outside React | `create-store`, `use-store`, `use-router` |
| immutable updates, structurally shared | `immutable-set`, `nested-comments` |
| recursion over a tree | `deep-clone`, `flatten`, `file-explorer`, `nested-checkboxes`, `spreadsheet`, `markdown-lite` |
| timers you have to clean up | `debounce`, `throttle`, `retry`, `traffic-light`, `stopwatch`, `progress-bars`, `memory-game` |
| focus and keyboard handling | `use-ref-focus`, `autocomplete`, `dropdown-menu`, `focus-trap` |

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

A challenge is a folder plus one line in `src/ladder.js` saying where it sits.
Everything else is read out of the files themselves. **`project-context.md`**
has the rest: the data flow, the invariants, and the two test runners.

## Notes

Every challenge has been verified solvable — reference solutions pass all 865
tests. They are deliberately not in this repo.

24 tests pass against an empty stub (`renders nothing when closed` and friends).
They are negative assertions, so nothing can make them fail early — ignore them
as a progress signal.

The same spec files run in two places. In the terminal it is Vitest + Testing
Library + jsdom, set up in `vite.config.js` and `src/setupTests.js`; in the
browser it is Jest inside Sandpack, with a virtual `vitest` module mapping one
onto the other. A spec has to stay green in both.

`setupTests.js` also replaces Node 25's stub `localStorage` global with a real
in-memory one — without that, challenge 11 cannot work.
