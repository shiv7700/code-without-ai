# React practice ladder

Challenges and somewhere to write them, so hand-writing React stays in the
fingers. Built for one user. No AI in the loop — that is the whole point.

105 of them today, being filled out towards 500. The low numbers are where the
new ones are going: props, destructuring, conditional rendering, keys, fetch.
Fundamentals first, because everything above them is easier once those are
automatic.

## How to use it

Sign in with GitHub, pick a challenge, write it in the editor, run the spec.
Your code and what you have solved are saved as you go, so the ladder follows
you to whatever machine you sit down at.

Each challenge is a stub with its rules in the doc comment and a spec beside it.
Read the rules, write the code, run the tests until they are green. Eight
sections, easiest first — work down, or jump to what you need. 421–500 need no
React at all, so they are the ones to do on a train.

```bash
npm run dev               # the app
npm run test:watch 030    # or run one challenge in the terminal, by folder name
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

Eight sections. Numbers are three digits with gaps left between them, so a new
challenge slots in beside the one it belongs next to and nothing is renumbered.

| Range | Section | What it is for |
|---|---|---|
| 001–080 | Describing the UI | props, destructuring, children, conditional rendering, lists and keys, purity — the half of a component that only reads |
| 081–160 | State & events | handlers, `useState`, the updater form, changing objects and arrays without mutating them |
| 161–240 | Async & data | `fetch`, loading and error and empty states, aborting, out-of-order responses, retries |
| 241–300 | Hooks | the custom hooks you rebuild in every project, and the closure traps inside them |
| 301–420 | Components | the widgets every app ships — and the same widget again, a notch harder |
| 421–500 | JS toolbox | no React. Closures, promises, data structures |
| 501–560 | Machine coding | interview-sized components, built from a spec you did not write |
| 561–600 | Hard | the ones worth sketching on paper first |

Every stub carries its own `Topics:` line and two `Read:` links, right under the
level heading. Read those before writing, not after failing. The app lists every
challenge with its topics and everything its spec checks, so there is no second
copy of that list in here to drift out of date.

## Concepts, and where they come back

Far fewer ideas than challenges. Each one turns up in several disguises, and
that repetition is the point. If a concept still feels new on its third
appearance, that is the one to go back and read about.

| Concept | Appears in |
|---|---|
| props, and destructuring them | 005, 010, 060 |
| conditional rendering, and the falsy traps | 025, 035, 045 |
| keys, and component identity | 030, 075, 310 |
| derived instead of stored | 040, 110, 115, 270, 325 |
| purity, and never mutating | 055, 130, 325 |
| stale closure → read the latest from a ref | 255, 265 |
| effect cleanup | 200, 255, 265, 315, 320 |
| stable identity (`useCallback`) | 150, 250, 265, 270, 275 |
| context + a provider guard | 140, 310, 320 |
| async races and rollback | 200, 220, 528, 567, 585 |
| a store that lives outside React | 487, 575, 593 |
| immutable updates, structurally shared | 484, 577 |
| recursion over a tree | 439, 445, 510, 519, 577, 579, 587 |
| timers you have to clean up | 433, 436, 463, 501, 504, 531, 534, 540, 581 |
| focus and keyboard handling | 280, 522, 546, 565 |

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
