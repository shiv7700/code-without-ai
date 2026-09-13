/**
 * LEVEL 38 — throttle, and how it differs from debounce
 *
 * Topics: timers · closures · rate limiting
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
 *
 * @param {Function} fn
 * @param {number} wait  the length of one window, in milliseconds
 * @param {{leading?: boolean, trailing?: boolean}} [options]
 * @returns {Function} throttled
 *
 * Rules:
 *  1. Defaults are `{ leading: true, trailing: true }`.
 *  2. The first call opens a window and fires immediately.
 *  3. Calls arriving inside an open window do not fire. Only the LAST of them
 *     is remembered, and it fires when the window closes.
 *  4. If nothing arrived during the window, nothing fires when it closes.
 *  5. `leading: false` skips the immediate call — the first one waits out the
 *     window like everyone else. `trailing: false` drops the remembered call.
 *
 * Debounce waits for quiet. Throttle fires on a schedule regardless of quiet.
 * A call every 10ms for a second: debounce fires once, throttle fires ten times
 * at a 100ms wait.
 */
export function throttle(fn, wait, options) {
  throw new Error('not implemented')
}
