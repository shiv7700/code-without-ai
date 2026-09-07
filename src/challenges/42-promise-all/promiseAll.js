/**
 * LEVEL 42 — wait for all of them
 *
 * Topics: promises · counters · order vs timing
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise
 *
 * @param {Array} items  promises, plain values, or a mix
 * @returns {Promise<Array>}
 *
 * Rules:
 *  1. Resolves with the values in INPUT order — not the order they finished in.
 *  2. Plain values are allowed. Treat them as already-resolved promises.
 *  3. An empty input resolves with `[]` immediately.
 *  4. The first rejection rejects the whole thing, with that reason, without
 *     waiting for anything still running.
 *  5. Always returns a promise, even when the input holds no promises at all.
 *
 * Rule 1 is why `push` into a results array is wrong: `push` records finishing
 * order. Write to the index you were given. Rule 3 is why a plain counter
 * without an early return hangs forever on `[]`.
 */
export function promiseAll(items) {
  throw new Error('not implemented')
}
