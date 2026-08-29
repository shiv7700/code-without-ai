import { challenges } from './challenges'

export default function Home({ user, done, onPick, onRename }) {
  const pct = (done.size / challenges.length) * 100

  return (
    <main className="mx-auto max-w-4xl px-6 pt-12 pb-16">
      <header>
        <h1 className="text-2xl font-semibold">React practice ladder</h1>

        <p className="mt-1 mb-4 text-dim">
          {/* The name doubles as a GitHub handle. Anything with a space in it
              is a display name, not a handle, so it stays plain text. */}
          {user &&
            (/^[\w-]+$/.test(user) ? (
              <a
                href={`https://github.com/${user}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-chalk underline-offset-4 hover:underline"
              >
                {user}
              </a>
            ) : (
              user
            ))}
          {user && ' — '}
          {done.size} of {challenges.length} done
          <button
            onClick={onRename}
            className="ml-3 underline underline-offset-4 hover:text-chalk"
          >
            {user ? 'change name' : 'set your name'}
          </button>
        </p>

        <div className="h-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-go transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>

      <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {challenges.map((c) => (
          <li key={c.name}>
            <button
              onClick={() => onPick(c.name)}
              className={`flex h-full w-full flex-col gap-2 rounded-xl border bg-panel p-4 text-left ${
                done.has(c.name)
                  ? 'border-go'
                  : 'border-line hover:border-dim'
              }`}
            >
              <span className="flex justify-between text-xs tabular-nums text-dim">
                {String(c.level).padStart(2, '0')}
                {done.has(c.name) && <span className="text-go">✓</span>}
              </span>

              <span className="font-semibold">{c.title}</span>

              <span className="mt-auto flex flex-wrap gap-1.5">
                {c.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line px-2 py-0.5 text-[0.72rem] text-dim"
                  >
                    {t}
                  </span>
                ))}
                {!c.needsUi && (
                  <span className="rounded-full border border-dashed border-line px-2 py-0.5 text-[0.72rem] text-dim">
                    no UI
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
