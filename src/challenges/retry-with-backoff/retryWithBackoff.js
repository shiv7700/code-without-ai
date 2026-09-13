/**
 * Retrying politely — each wait twice as long as the one before
 *
 * Topics: async loops · backoff schedule · injected delays
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
 *
 * @param {() => Promise<*>} run
 * @param {{retries?: number, delay?: number, wait?: (ms: number) => Promise<void>}} [options]
 * @returns {Promise<*>}
 *
 * Rules:
 *  1. defaults are `{ retries: 3, delay: 100 }`
 *  2. the first resolve wins and stops everything
 *  3. after a failure, `await wait(d)` before the next attempt
 *  4. `d` starts at `delay` and doubles: 100, 200, 400
 *  5. `retries` counts EXTRA attempts — `retries: 0` is one call and no wait
 *  6. every attempt failing rejects with the LAST error
 *
 * There is no wait after the final attempt — nothing is going to use it. Sleep
 * unconditionally at the end of the loop body and the caller waits 400ms to be
 * told about a failure that was already decided.
 */
export async function retryWithBackoff(run, options) {
  throw new Error('not implemented')
}
