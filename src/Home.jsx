import { challenges } from './challenges'

export default function Home({ user, done, onPick, onRename }) {
  return (
    <main className="home">
      <header className="hero">
        <h1>React practice ladder</h1>
        <p>
          {user ? `${user} — ` : ''}
          {done.size} of {challenges.length} done
          <button className="link" onClick={onRename}>
            {user ? 'change name' : 'set your name'}
          </button>
        </p>
        <div className="track">
          <span style={{ width: `${(done.size / challenges.length) * 100}%` }} />
        </div>
      </header>

      <ul className="grid">
        {challenges.map((c) => (
          <li key={c.name}>
            <button
              className={done.has(c.name) ? 'card done' : 'card'}
              onClick={() => onPick(c.name)}
            >
              <span className="level">
                {String(c.level).padStart(2, '0')}
                {done.has(c.name) && <span className="tick">✓</span>}
              </span>
              <span className="title">{c.title}</span>
              <span className="tags">
                {c.topics.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
                {!c.needsUi && <span className="tag muted">no UI</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
