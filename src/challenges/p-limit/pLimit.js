/**
 * A limiter you keep, not a batch you run
 *
 * Topics: concurrency · queues · finally
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
 *
 * @param {number} concurrency  how many may run at once
 * @returns {(fn: Function, ...args: *) => Promise<*>} submit a job, get its result
 *
 * Rules:
 *  1. `pLimit(2)` returns a function. Calling it queues a job and hands back a
 *     promise for that job's result.
 *  2. A job starts the moment there is a free slot — immediately if one is
 *     free, otherwise when one is released.
 *  3. Never more than `concurrency` jobs in flight.
 *  4. Jobs start in the order they were submitted, whichever slot frees first.
 *  5. A job that rejects rejects its own promise, and frees its slot.
 *  6. The same limiter is used again and again, by callers that know nothing
 *     about each other. A run that ends must leave it exactly as it found it.
 *  7. A concurrency that is not a positive integer throws a TypeError.
 *
 * Rules 5 and 6 are the same bug found a week apart. Release the slot where the
 * success is handled and one failed job leaks a slot for the lifetime of the
 * process: the limiter of 4 quietly becomes a limiter of 3, then 2, and the
 * page that used to load in a second takes ten. It only shows up in the second
 * batch, which is why a limiter that is created per batch never reveals it.
 */
export function pLimit(concurrency) {
  throw new Error('not implemented')
}
