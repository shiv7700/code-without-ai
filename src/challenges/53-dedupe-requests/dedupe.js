/**
 * LEVEL 53 — one request, however many callers
 *
 * Topics: promise caching · in-flight state · cleanup
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
 *
 * @param {Function} fn  returns a promise
 * @param {Function} [keyFor]  arguments → a key
 * @returns {Function} the same function, sharing overlapping calls
 *
 * Rules:
 *  1. While a call is still running, another call with the same key gets the
 *     SAME promise back — the underlying function runs once.
 *  2. Different keys are different requests.
 *  3. Once a call settles, the entry is forgotten. The next call runs again —
 *     this is deduplication, not caching.
 *  4. A rejection reaches every waiting caller.
 *  5. A rejection is forgotten too, so the next call gets a fresh attempt.
 *
 * Three components mounting at once and all asking for `/me` is exactly this.
 * Rule 3 is why the cleanup belongs in `finally`, not in `then`.
 */
export function dedupe(fn, keyFor) {
  throw new Error('not implemented')
}
