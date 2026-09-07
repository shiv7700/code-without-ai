// Every challenge folder holds the stub, its spec, and optionally a demo.jsx.
// Pulled in as strings at build time, so adding a folder is all it takes.
const raw = import.meta.glob('./challenges/*/*.{js,jsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Sections of the ladder, by level. A challenge belongs to the last tier whose
// `from` it clears.
const TIERS = [
  { from: 1, name: 'Fundamentals', blurb: 'state, effects, the core hooks' },
  { from: 21, name: 'Everyday components', blurb: 'the widgets every app ships' },
  { from: 36, name: 'JS toolbox', blurb: 'no React — closures, promises, data' },
  { from: 56, name: 'Machine coding', blurb: 'interview-sized components' },
  { from: 76, name: 'Hard', blurb: 'the ones that need a plan first' },
]

const byName = {}
for (const [path, code] of Object.entries(raw)) {
  const [, name, file] = path.match(/\.\/challenges\/([^/]+)\/(.+)$/)
  byName[name] ??= { name, files: {} }
  byName[name].files['/' + file] = code
}

// Title and topics already live in each stub's doc comment — no second source
// of truth to keep in sync.
export const challenges = Object.values(byName)
  .map((c) => {
    const stub = Object.keys(c.files).find(
      (f) => !f.includes('.test.') && f !== '/demo.jsx',
    )
    const doc = c.files[stub]
    const level = Number(c.name.slice(0, 2))
    const spec = c.files[Object.keys(c.files).find((f) => f.includes('.test.'))]
    const tests = [...spec.matchAll(/^\s*(?:test|it)\(\s*(['"`])(.*?)\1/gm)].map(
      (m) => m[2],
    )
    return {
      ...c,
      stub,
      // The spec is the brief. Listing what it checks up front beats making
      // someone run the suite to find out what they are aiming at.
      tests,
      level,
      tier: TIERS.findLast((t) => level >= t.from),
      // What you are actually building — Counter, useToggle, todoReducer. The
      // LEVEL line reads as a topic ("useState + event handlers"), which makes
      // a poor card heading, so it becomes the subtitle instead.
      title: stub.replace(/^\/|\.jsx?$/g, ''),
      summary: doc.match(/LEVEL \d+ — (.+)/)?.[1] ?? '',
      topics: doc.match(/Topics:\s*(.+)/)?.[1].split(' · ') ?? [],
      // A `.js` stub is a hook, a reducer or a plain function — nothing to
      // preview. Only `.jsx` renders something on its own.
      needsUi: stub.endsWith('.jsx'),
      hasDemo: '/demo.jsx' in c.files,
    }
  })
  .map((c) => ({
    // One lowercased string to search against. The test names are in here too,
    // so "stale closure" or "wraps around" finds the challenge that drills it.
    ...c,
    search: [c.name, c.title, c.summary, ...c.topics, ...c.tests]
      .join(' ')
      .toLowerCase(),
  }))
  .sort((a, b) => a.level - b.level)

// The same list, cut into sections for the home screen.
export const tiers = TIERS.map((tier) => ({
  ...tier,
  challenges: challenges.filter((c) => c.tier === tier),
}))
