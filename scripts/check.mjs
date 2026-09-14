#!/usr/bin/env node
// Opens /check in headless Chrome and waits for the verdict the page leaves on
// `window.__CHECK__`. The point is that a spec green under Vitest proves nothing
// about Sandpack's Jest — this drives the real runner.
//
//   npm run check                                    # http://localhost:5173
//   npm run check -- https://reactwithoutai.vercel.app
//   npm run check -- --all
//   npm run check -- https://... --all
import { chromium } from 'playwright-core'

const args = process.argv.slice(2)
const all = args.includes('--all')
const base = args.find((a) => !a.startsWith('-')) ?? 'http://localhost:5173'
const url = `${base.replace(/\/$/, '')}/check${all ? '?all=1' : ''}`

// Sandpack pulls its dependencies from a CDN on the first bundle, and ?all=1 is
// one bundle per challenge — minutes, not seconds.
const TIMEOUT_MS = all ? 90 * 60_000 : 5 * 60_000

// The already-installed Chrome. Never `chromium` proper, which would download
// a ~150MB browser the first time anyone runs this.
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()

// A spec that rejects on purpose surfaces here as a page error, so these are
// only fatal before the page has started reporting — which is the case that
// matters: the app itself failing to boot, with no verdict ever coming.
let crash = null
page.on('pageerror', (error) => {
  crash ??= error.message
})

console.log(`→ ${url}`)
await page.goto(url, { waitUntil: 'domcontentloaded' })

let booted = false
let last = ''
const progressOf = () =>
  page.evaluate(() => window.__CHECK_PROGRESS__).catch(() => null)

const ticker = setInterval(async () => {
  const progress = await progressOf()
  if (!progress) return
  booted = true
  const line = `  ${progress.done}/${progress.total} — ${progress.label}`
  if (line !== last) console.log((last = line))
}, 1000)

const verdict = page.waitForFunction(
  () => window.__CHECK__ !== undefined,
  null,
  { timeout: TIMEOUT_MS },
)
const crashed = new Promise((_, reject) => {
  const id = setInterval(async () => {
    if (!crash || booted || (await progressOf())) return
    clearInterval(id)
    reject(new Error(`the page never booted: ${crash}`))
  }, 1000)
  id.unref?.()
})

let result
try {
  await Promise.race([verdict, crashed])
  result = await page.evaluate(() => window.__CHECK__)
} catch (error) {
  clearInterval(ticker)
  await browser.close()
  console.error(`\nFAIL — no verdict from ${url}`)
  console.error(error.message.split('\n')[0])
  process.exit(1)
}

clearInterval(ticker)
await browser.close()

console.log(
  `\n${result.total} tests · ${result.passed} ok · ${result.failures.length} broken`,
)

for (const gap of result.known ?? []) {
  console.log(`  known gap  ${gap.name}`)
}
if (result.known?.length) {
  console.log(
    `\n${result.known.length} known gaps — real, characterised, and not counted as a regression.`,
  )
}

for (const failure of result.failures) {
  console.log(`\n  ✗ ${failure.name}`)
  for (const line of failure.message.split('\n').slice(0, 12)) {
    console.log(`      ${line}`)
  }
}

console.log(`\n${result.ok ? 'PASS' : 'FAIL'} — ${url}`)
process.exit(result.ok ? 0 : 1)
