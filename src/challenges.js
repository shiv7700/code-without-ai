// Every challenge folder holds the stub, its spec, and optionally a demo.jsx.
// Pulled in as strings at build time, so adding a folder is all it takes.
const raw = import.meta.glob('./challenges/*/*.{js,jsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Sections of the ladder, by level. A challenge belongs to the last tier whose
// `from` it clears. Each tier owns a wide number range and the folders inside it
// are spaced out, so a new challenge slots in beside the one it belongs next to
// without renumbering anything.
const TIERS = [
  { from: 1, name: 'Describing the UI', blurb: 'props, JSX, lists — the parts that only read' },
  { from: 81, name: 'State & events', blurb: 'events, state, and changing it without mutating' },
  { from: 161, name: 'Async & data', blurb: 'fetch, loading, errors, races' },
  { from: 241, name: 'Hooks', blurb: 'the ones you rebuild in every project' },
  { from: 301, name: 'Components', blurb: 'widgets, and the same widget one notch harder' },
  { from: 421, name: 'JS toolbox', blurb: 'no React — closures, promises, data' },
  { from: 501, name: 'Machine coding', blurb: 'interview-sized components' },
  { from: 561, name: 'Hard', blurb: 'the ones that need a plan first' },
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
    const level = Number(c.name.match(/^\d+/))
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
