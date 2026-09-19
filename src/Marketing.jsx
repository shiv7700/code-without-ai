import { Link } from 'react-router'
import { challenges, tiers } from './challenges'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'

// Counted from the ladder itself rather than typed in. A number on a landing
// page that drifts from the product is the one thing nobody forgives.
const SPEC_COUNT = challenges.reduce((n, c) => n + c.tests.length, 0)

// Everything in the shot is the real first challenge — its stub, its spec
// titles, its untouched state. A screenshot goes stale; this cannot.
const DEMO = challenges[0]
const FIRST = DEMO.name
const DEMO_CODE = DEMO.files[DEMO.stub].split('\n').slice(0, 12)

// The spec, verbatim and whole. Nobody in this category shows the test file,
// and it is the one artefact that proves the rest of the page at a glance.
const SPEC_PATH = Object.keys(DEMO.files).find((f) => f.includes('.test.'))
const SPEC_SOURCE = DEMO.files[SPEC_PATH].trim()

// 29 of the suite pass against an empty stub — negative assertions, not
// progress. Saying so first is cheaper than being caught counting them.
const FREEBIES = 29

const STEPS = [
  [
    'It gives you a spec, not a lesson',
    'A stub with the rules in a doc comment, and a test file beside it that says exactly what it expects. No video. No walkthrough. No worked example to skim instead of thinking.',
  ],
  [
    'You type every character',
    'Paste, copy and cut are off inside the editor. There is no reveal button and no solutions in the repo. When you are stuck at minute nine, there is nothing to click.',
  ],
  [
    'The tests decide, not you',
    'The same spec runs in a real runner in the page. It goes green or it does not, and it flips to solved the moment it does. Your code saves as you type.',
  ],
]

export default function Marketing() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-6">
          <span className="font-mono text-fine font-semibold tracking-tight">
            react<span className="text-primary">.</span>without.ai
          </span>
          <span className="ml-auto" />
          <ThemeToggle size="icon" />
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Sign in
          </Button>
        </nav>
      </header>

      {/* Evidence before argument. The inventory and the spec file are the two
          things that prove this is real; they used to sit behind 600 words. */}
      <main>
        <Hero />
        <Confession />
        <Ladder />
        <How />
        <Spec />
        <Close />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-8">
          <span className="label text-muted-foreground">react.without.ai</span>
          <span className="text-fine text-muted-foreground">
            {challenges.length} challenges · {SPEC_COUNT.toLocaleString()} specs
            · always free
          </span>
          <Link
            to="/login"
            className="ml-auto text-fine text-subtle transition-colors hover:text-foreground"
          >
            Sign in →
          </Link>
        </div>
      </footer>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="blueprint pointer-events-none absolute inset-0" aria-hidden />
      {/* Sat behind the headline and the shot, not in the middle of an empty
          viewport — the page has one light source and it has to be on something. */}
      <div
        className="glow pointer-events-none absolute inset-x-0 top-40 h-[46rem]"
        style={{ '--glow-x': '34%', '--glow-y': '55%' }}
        aria-hidden
      />

      {/* The product enters the fold and runs off the right edge. Stacked, the
          copy column left the right 45% of the first screen as empty grid —
          which is what made the page read as blocks rather than a composition. */}
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pt-16 pb-14 md:pt-24 md:pb-20 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-10 lg:pt-28 lg:pb-28">
        <div>
          <p className="label text-primary">No AI in the loop</p>

          <h1 className="mt-5 text-title text-balance md:text-display">
            You haven’t written a hook in six months.
          </h1>

          <p className="mt-6 max-w-lg text-sub text-subtle">
            {challenges.length} challenges where your agent cannot help you.
            Paste is off, and there are no solutions to find.
          </p>

          {/* One decision above the fold. The nav sign-in is for people who
              already have an account and are not deciding anything. */}
          <div className="mt-10">
            <Button as={Link} to={`/${FIRST}`} size="xl">
              Try challenge 001 →
            </Button>
          </div>

          <p className="mt-5 font-mono text-fine text-muted-foreground tabular-nums">
            Always free, no account
            <span className="mx-2.5 text-muted-foreground/40">·</span>
            {challenges.length} challenges
            <span className="mx-2.5 text-muted-foreground/40">·</span>
            <span className="text-foreground">0</span> written for you
          </p>
        </div>

        <div className="lg:-mr-24 xl:-mr-44">
          <Shot />
        </div>
      </div>
    </section>
  )
}

// The product, not a picture of it. Shown untouched — the stub returns null, so
// nothing passes. A half-green shot over a stub is a fabricated screenshot, on
// the one page whose whole argument is that nothing here is faked.
function Shot() {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-pop">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="font-mono text-fine text-subtle">
          001 · {DEMO.title}
        </span>
        <span className="ml-auto font-mono text-fine text-muted-foreground">
          ⌘↵ to run
        </span>
      </div>

      <div className="grid md:grid-cols-[1.35fr_1fr]">
        <pre
          className="overflow-x-auto border-b border-border bg-well p-5 font-mono text-micro text-muted-foreground md:border-r md:border-b-0"
          // Long lines used to be hard-clipped with no scrollbar and no hint,
          // so a phone showed a URL guillotined mid-path.
          style={{
            maskImage:
              'linear-gradient(to right, black calc(100% - 2rem), transparent)',
          }}
        >
          {DEMO_CODE.map((line, i) => (
            <div key={i} className="flex gap-4">
              <span className="w-4 shrink-0 text-right text-muted-foreground/70 tabular-nums select-none">
                {i + 1}
              </span>
              <span
                className={
                  line.trim().startsWith('*') || line.trim().startsWith('/*')
                    ? ''
                    : 'text-foreground'
                }
              >
                {line || ' '}
              </span>
            </div>
          ))}
          <div className="flex gap-4">
            <span className="w-4 shrink-0 text-right text-muted-foreground/70 tabular-nums select-none">
              {DEMO_CODE.length + 1}
            </span>
            <span className="animate-pulse text-primary">▍</span>
          </div>
        </pre>

        <div className="p-5">
          <p className="label mb-4 text-muted-foreground">the spec</p>
          <ul className="space-y-3">
            {DEMO.tests.map((t) => (
              <li key={t} className="flex items-baseline gap-3 text-fine">
                <span className="w-3 shrink-0 font-mono text-muted-foreground">
                  ·
                </span>
                <span className="text-subtle">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-border pt-4">
            <span className="label text-muted-foreground tabular-nums">
              0 / {DEMO.tests.length} passing
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Confession() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[1.1fr_1fr] md:gap-20 md:py-20 lg:py-24">
        <h2 className="text-head text-balance md:text-title">
          You can read a solution, understand every line, and still not be able
          to write it.
        </h2>

        <div className="space-y-5 text-body text-subtle">
          <p>
            Understanding is free now. What is not free is sitting in front of
            an empty file with your hands already knowing — which closure runs
            once, which one runs on every render, where the cleanup goes.
          </p>
          <p className="text-foreground">
            That only ever came from writing it, getting it wrong, and writing
            it again.
          </p>
        </div>
      </div>
    </section>
  )
}

function How() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 md:py-20 lg:py-24">
      <p className="label text-muted-foreground">What it actually does</p>
      {/* Section three of five had an eleven-pixel eyebrow doing an h2's job,
          and it is the section that explains the product. */}
      <h2 className="mt-6 max-w-2xl text-head text-balance md:text-title">
        You could just turn Copilot off. This is the part that is harder to make
        yourself.
      </h2>

      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map(([title, body], i) => (
          <li
            key={title}
            className="rounded-lg bg-surface p-6 shadow-lift transition-transform duration-(--dur-base) ease-out-quick hover:-translate-y-px"
          >
            <span className="font-mono text-label text-primary tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-4 text-head text-balance">{title}</h3>
            <p className="mt-3 text-body leading-relaxed text-subtle">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Ladder() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 lg:py-24">
        <p className="label text-muted-foreground">The ladder</p>
        <h2 className="mt-6 max-w-2xl text-head text-balance md:text-title">
          It starts lower than you think.
        </h2>
        <p className="mt-5 max-w-xl text-body text-subtle">
          The gap was never the hard end. It was that the counter had nothing
          underneath it — so most of these live at the front of the list.
        </p>

        {/* Real challenge titles, not section names. The inventory is the
            argument, and a name you recognise does more than a count. */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <li
              key={tier.name}
              className="rung rounded-lg bg-surface-raised p-5 shadow-lift"
              style={{ '--i': i }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sub font-medium">{tier.name}</h3>
                <span className="font-mono text-fine text-muted-foreground tabular-nums">
                  {tier.challenges.length}
                </span>
              </div>
              {/* Two lines reserved: one-line blurbs otherwise pull their card's
                  rule 20px up and break the row's shared baseline. */}
              <p className="mt-1.5 min-h-[2lh] text-fine text-muted-foreground">
                {tier.blurb}
              </p>

              <ul className="mt-5 space-y-1.5 border-t border-border pt-4">
                {tier.challenges.slice(0, 4).map((c) => (
                  <li
                    key={c.name}
                    className="truncate font-mono text-micro text-subtle"
                  >
                    {c.title}
                  </li>
                ))}
                {tier.challenges.length > 4 && (
                  <li className="font-mono text-micro text-muted-foreground">
                    + {tier.challenges.length - 4} more
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// The strongest proof available to a product with no users: show the artefact.
function Spec() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20 lg:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="label text-muted-foreground">The whole spec</p>
            <h2 className="mt-6 text-head text-balance md:text-title">
              This is all you get. There is nothing else in the folder.
            </h2>
            <div className="mt-6 space-y-4 text-body text-subtle">
              <p>
                Every spec here was written solution-first — the spec, then a
                reference solution, then the stub goes back. A spec that has
                never passed is not a spec.
              </p>
              <p>
                The reference solutions are not in the repo, and there is no
                reveal button. {FREEBIES} of the {SPEC_COUNT.toLocaleString()}{' '}
                do pass against an empty stub; they are negative assertions —
                <em> renders nothing when closed</em> and friends — and they are
                not progress. Now you know before you count them.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-well shadow-lift">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span className="font-mono text-fine text-subtle">
                {SPEC_PATH.slice(1)}
              </span>
              <span className="label ml-auto text-muted-foreground">
                read-only
              </span>
            </div>
            <pre className="max-h-[26rem] overflow-auto p-5 font-mono text-micro text-subtle">
              {SPEC_SOURCE}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

function Close() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-6 py-20 text-center md:py-24">
        <h2 className="text-head text-balance md:text-title">
          Ten minutes. One challenge. Nobody helping.
        </h2>
        <p className="mt-5 text-body text-subtle">
          The first one needs no account. Sign in with GitHub when you want it
          kept — then your code and your progress follow you to whatever machine
          you sit down at.
        </p>
        <Button as={Link} to={`/${FIRST}`} size="xl" className="mt-9">
          Try challenge 001 →
        </Button>
        <p className="mt-5 label text-muted-foreground">
          Free, and staying free
        </p>

        {/* A page with no users and no name on it reads as a content farm. */}
        <p className="mx-auto mt-16 max-w-md border-t border-border pt-8 text-fine leading-relaxed text-muted-foreground">
          Built by Shivang, a frontend dev who ships with agents all day and
          noticed he had stopped writing React by hand.{' '}
          <a
            href="https://github.com/shivanglambdatest"
            target="_blank"
            rel="noopener noreferrer"
            className="text-subtle underline-offset-4 hover:text-foreground hover:underline"
          >
            github.com/shivanglambdatest
          </a>
        </p>
      </div>
    </section>
  )
}
