/**
 * LEVEL 48 — a worker pool in fifteen lines
 *
 * Topics: concurrency · promises · a queue without a queue library
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
 *
 * @param {Array} items
 * @param {number} limit  how many may be in flight at once
 * @param {(item: *, index: number) => Promise<*>} fn
 * @returns {Promise<Array>} results in input order
 *
 * Rules:
 *  1. Results are in INPUT order, whatever order they finished in.
 *  2. Never more than `limit` calls to `fn` outstanding at any moment. As one
 *     settles, the next queued item starts — not "in batches of `limit`".
 *  3. An empty list resolves with `[]`.
 *  4. A limit larger than the list is fine.
 *  5. The first rejection rejects the whole thing.
 *
 * Rule 2 is what separates this from `Promise.all(items.map(fn))`. Batching —
 * waiting for all of one group before starting the next — passes a naive test
 * and still leaves workers idle. Start ONE new task when ONE finishes.
 */
export function mapAsyncLimit(items, limit, fn) {
  throw new Error('not implemented')
}
