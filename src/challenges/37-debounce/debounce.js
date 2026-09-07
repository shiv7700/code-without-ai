/**
 * LEVEL 37 — debounce, with both edges
 *
 * Topics: timers · closures · leading vs trailing
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
 *
 * @param {Function} fn
 * @param {number} wait  milliseconds of quiet needed
 * @param {{leading?: boolean, trailing?: boolean}} [options]
 * @returns {Function} debounced, and carrying a `.cancel()`
 *
 * Rules:
 *  1. Defaults are `{ leading: false, trailing: true }` — the plain debounce
 *     you already know: fire `wait` after the last call, with its arguments.
 *  2. Every call restarts the clock.
 *  3. `leading: true` fires on the call that opens a quiet-to-busy transition,
 *     immediately, before any waiting.
 *  4. With both edges on, a burst fires twice — first args, then last args.
 *     A SINGLE call fires once, not twice. This is the case people get wrong.
 *  5. `.cancel()` drops anything pending. Nothing fires afterwards.
 *
 * You already wrote the value version in level 24. This is the callback
 * version, which is where the edge options live.
 */
export function debounce(fn, wait, options) {
  throw new Error('not implemented')
}
