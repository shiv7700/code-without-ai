import { LADDER } from './ladder'

// Every challenge folder holds the stub, its spec, and optionally a demo.jsx.
// Pulled in as strings at build time, so adding a folder is all it takes.
const raw = import.meta.glob('./challenges/*/*.{js,jsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

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
const build = (c, tier, level) => {
  const stub = Object.keys(c.files).find(
    (f) => !f.includes('.test.') && f !== '/demo.jsx',
  )
  const doc = c.files[stub]
  const spec = c.files[Object.keys(c.files).find((f) => f.includes('.test.'))]
  const tests = [...spec.matchAll(/^\s*(?:test|it)\(\s*(['"`])(.*?)\1/gm)].map(
    (m) => m[2],
  )
  // The first line of the doc comment reads as a topic ("useState + event
  // handlers"), which makes a poor card heading, so it becomes the subtitle.
  const summary = doc.match(/\/\*\*\s*\n\s*\*\s+(.+)/)?.[1] ?? ''

  return {
    ...c,
    stub,
    // The spec is the brief. Listing what it checks up front beats making
    // someone run the suite to find out what they are aiming at.
    tests,
    // Where it sits in the ladder right now. Nothing is stored under this —
    // move a line in ladder.js and every number below it shifts up or down.
    level,
    tier,
    // What you are actually building — Counter, useToggle, todoReducer.
    title: stub.replace(/^\/|\.jsx?$/g, ''),
    summary,
    topics: doc.match(/Topics:\s*(.+)/)?.[1].split(' · ') ?? [],
    // A `.js` stub is a hook, a reducer or a plain function — nothing to
    // preview. Only `.jsx` renders something on its own.
    needsUi: stub.endsWith('.jsx'),
    hasDemo: '/demo.jsx' in c.files,
    search: '',
  }
}

const placed = []
let level = 0

for (const { name, blurb, challenges: slugs } of LADDER) {
  const tier = { name, blurb }
  for (const slug of slugs) {
    // A slug in the ladder with no folder behind it is a typo, not a challenge.
    if (byName[slug]) placed.push(build(byName[slug], tier, ++level))
  }
}

// Anything on disk the ladder does not mention. Listed rather than dropped, so
// a new folder is visible the moment it exists and a typo above is obvious.
const listed = new Set(placed.map((c) => c.name))
const unsorted = Object.values(byName)
  .filter((c) => !listed.has(c.name))
  .map((c) => build(c, UNSORTED, ++level))

export const challenges = [...placed, ...unsorted].map((c) => ({
  ...c,
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
