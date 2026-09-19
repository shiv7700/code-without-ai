#!/usr/bin/env node
// Opens /check in headless Chrome and waits for the verdict the page leaves on
// `window.__CHECK__`. The point is that a spec green under Vitest proves nothing
// about Sandpack's Jest — this drives the real runner.
//
//   npm run check                                    # builds, then serves it
//   npm run check -- https://reactwithoutai.vercel.app
//   npm run check -- http://localhost:5173           # your own server, if you have one
//   npm run check -- --all
//   npm run check -- https://... --all
//
// With no URL this builds the app and serves the build. It used to point at the
// dev server, and under Vite's dev server Sandpack's suite never finishes — so
// the documented default reported a broken runner on a runner that was fine.
import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'

const PREVIEW_PORT = 4173
const VITE = new URL('../node_modules/.bin/vite', import.meta.url).pathname

const sh = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(VITE, args, { stdio: 'inherit' })
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`vite ${args[0]} failed`)),
    )
  })

const reachable = async (url) => {
  try {
    return (await fetch(url)).ok
  } catch {
    return false
  }
}

async function servePreview() {
  console.log('→ building')
  await sh(['build', '--logLevel', 'warn'])

  const server = spawn(
    VITE,
    ['preview', '--port', String(PREVIEW_PORT), '--strictPort'],
    { stdio: 'ignore' },
  )
  const base = `http://localhost:${PREVIEW_PORT}`

  for (let i = 0; i < 40; i++) {
    if (await reachable(base)) return { base, stop: () => server.kill() }
    await new Promise((r) => setTimeout(r, 250))
  }
  server.kill()
  throw new Error(`the preview server never came up on ${base}`)
}

const args = process.argv.slice(2)
const all = args.includes('--all')
const given = args.find((a) => !a.startsWith('-'))

const served = given ? null : await servePreview()
const base = given ?? served.base
const stopServer = () => served?.stop()
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
  stopServer()
  console.error(`\nFAIL — no verdict from ${url}`)
  console.error(error.message.split('\n')[0])
  process.exit(1)
}

clearInterval(ticker)
await browser.close()
stopServer()

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
