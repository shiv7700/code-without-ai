/**
 * Wait for all of them and report what happened to each
 *
 * Topics: promises · settling · result shape
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
 *
 * @param {Iterable} items  promises, or plain values
 * @returns {Promise<Array>} one result per item, in input order
 *
 * Rules:
 *  1. The returned promise NEVER rejects. It resolves once everything has
 *     settled, however many of them failed.
 *  2. A success is `{ status: 'fulfilled', value }`, a failure is
 *     `{ status: 'rejected', reason }`.
 *  3. Those are the only keys. A fulfilled result has no `reason` key at all,
 *     not a `reason` of `undefined`.
 *  4. Order follows the input, not the order things settled.
 *  5. An item that is not a promise counts as already fulfilled.
 *  6. An empty list resolves immediately to an empty array.
 *
 * Rules 1 and 4 both fall out of one decision: whether each item is turned
 * into a promise that cannot fail BEFORE you wait on them together, or after.
 * Get it the wrong way round and the first rejection takes the whole thing
 * down. Rule 3 is the quieter one — `{ status, value, reason }` built in one
 * object literal passes every check on `.value` and still is not the shape the
 * real one returns.
 */
export function promiseAllSettled(items) {
  throw new Error('not implemented')
}
