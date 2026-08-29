// Every challenge folder holds the stub, its spec, and optionally a demo.jsx.
// Pulled in as strings at build time, so adding a folder is all it takes.
const raw = import.meta.glob('./challenges/*/*.{js,jsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Hooks and reducers render nothing on their own, so there is no UI to preview.
const NO_UI = [
  '04-use-toggle',
  '06-use-interval',
  '07-todo-reducer',
  '11-use-local-storage',
  '12-use-outside-click',
  '15-use-pagination',
  '19-use-undoable',
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
    const spec = c.files[Object.keys(c.files).find((f) => f.includes('.test.'))]
    return {
      ...c,
      stub,
      // The spec is the brief. Listing what it checks up front beats making
      // someone run the suite to find out what they are aiming at.
      tests: [...spec.matchAll(/^\s*(?:test|it)\(\s*(['"`])(.*?)\1/gm)].map(
        (m) => m[2],
      ),
      level: Number(c.name.slice(0, 2)),
      title: doc.match(/LEVEL \d+ — (.+)/)?.[1] ?? c.name,
      topics: doc.match(/Topics:\s*(.+)/)?.[1].split(' · ') ?? [],
      needsUi: !NO_UI.includes(c.name),
      hasDemo: '/demo.jsx' in c.files,
    }
  })
  .sort((a, b) => a.level - b.level)
