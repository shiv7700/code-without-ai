import { LADDER } from './ladder'

// Every challenge folder holds the stub, its spec, and optionally a demo.jsx.
// Pulled in as strings at build time, so adding a folder is all it takes.
const raw = import.meta.glob('./challenges/*/*.{js,jsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Hints live in their own file, not in the doc comment — the doc comment is open
// in the editor, and a hint you cannot avoid reading is not a hint. Globbed
// separately so it never reaches Sandpack's file system either.
const hintFiles = import.meta.glob('./challenges/*/hints.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const hintsFor = (name) =>
  (hintFiles[`./challenges/${name}/hints.md`] ?? '')
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())

const UNSORTED = {
  name: 'Unsorted',
  blurb: 'in the folder, not yet placed on the ladder',
}

const byName = {}
for (const [path, code] of Object.entries(raw)) {
  const [, name, file] = path.match(/\.\/challenges\/([^/]+)\/(.+)$/)
  byName[name] ??= { name, files: {} }
  byName[name].files['/' + file] = code
}

// Title, summary and topics all live in the stub's own doc comment — no second
// source of truth to keep in sync. The ladder file owns order and nothing else.
const build = (c, tier) => {
  // Everything in the folder that is neither the spec nor the preview's demo is
  // yours to write. Most folders hold one; a few hold a component and the hook
  // it leans on, and those are edited as a set and saved as a set.
  const sources = Object.keys(c.files)
    .filter((f) => !f.includes('.test.') && f !== '/demo.jsx')
    .sort()
  const stub = sources[0]
  const specName = Object.keys(c.files).find((f) => f.includes('.test.'))
  // A folder mid-write — a stub and no spec yet — used to throw here, at module
  // load, which takes down every route including the ones that would tell you
  // why. Half a challenge is not worth a white screen; it is dropped from the
  // list and `challenges.test.js` is what complains about it.
  if (!stub || !specName) return null

  const doc = c.files[stub]
  const spec = c.files[specName]
  const tests = [...spec.matchAll(/^\s*(?:test|it)\(\s*(['"`])(.*?)\1/gm)].map(
    (m) => m[2],
  )
  // The first line of the doc comment reads as a topic ("useState + event
  // handlers"), which makes a poor card heading, so it becomes the subtitle.
  const summary = doc.match(/\/\*\*\s*\n\s*\*\s+(.+)/)?.[1] ?? ''

  return {
    ...c,
    stub,
    sources,
    // The runner shows it in the editor, read-only. It was already in Sandpack's
    // file system; it just had nowhere to be seen.
    spec: specName,
    // The spec is the brief. Listing what it checks up front beats making
    // someone run the suite to find out what they are aiming at.
    tests,
    tier,
    // What you are actually building — Counter, useToggle, todoReducer.
    title: stub.replace(/^\/|\.jsx?$/g, ''),
    summary,
    topics: doc.match(/Topics:\s*(.+)/)?.[1].split(' · ') ?? [],
    hints: hintsFor(c.name),
    // A `.js` stub is a hook, a reducer or a plain function — nothing to
    // preview. Only `.jsx` renders something on its own.
    needsUi: stub.endsWith('.jsx'),
    hasDemo: '/demo.jsx' in c.files,
    search: '',
  }
}

const placed = []

for (const { name, blurb, challenges: slugs } of LADDER) {
  const tier = { name, blurb }
  for (const slug of slugs) {
    // A slug in the ladder with no folder behind it is a typo, not a challenge.
    if (byName[slug]) placed.push(build(byName[slug], tier))
  }
}

// Anything on disk the ladder does not mention. Listed rather than dropped, so
// a new folder is visible the moment it exists and a typo above is obvious.
const listed = new Set(placed.filter(Boolean).map((c) => c.name))
const unsorted = Object.values(byName)
  .filter((c) => !listed.has(c.name))
  .map((c) => build(c, UNSORTED))

// Numbered only once everything that could not be built has fallen out, so the
// positions stay 1, 2, 3 with no hole where a half-written folder used to be.
export const challenges = [...placed, ...unsorted]
  .filter(Boolean)
  .map((c, i) => ({
    ...c,
    // Where it sits in the ladder right now. Nothing is stored under this —
    // move a line in ladder.js and every number below it shifts up or down.
    level: i + 1,
    // One lowercased string to search against. The test names are in here too,
    // so "stale closure" or "wraps around" finds the challenge that drills it.
    search: [c.name, c.title, c.summary, ...c.topics, ...c.tests]
      .join(' ')
      .toLowerCase(),
  }))

// The same list, cut into sections for the home screen.
export const tiers = [...LADDER, UNSORTED]
  .map(({ name }) => {
    const inTier = challenges.filter((c) => c.tier.name === name)
    return { ...inTier[0]?.tier, challenges: inTier }
  })
  .filter((t) => t.challenges.length > 0)
