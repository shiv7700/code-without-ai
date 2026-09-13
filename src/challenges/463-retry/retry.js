/**
 * LEVEL 47 — try again before giving up
 *
 * Topics: async/await · try/catch in a loop · backoff
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
 *
 * @param {(attempt: number) => Promise<*>} fn
 * @param {{retries?: number, delay?: number}} [options]
 * @returns {Promise<*>}
 *
 * Rules:
 *  1. Defaults are `{ retries: 3, delay: 0 }`.
 *  2. `retries` counts EXTRA attempts. `retries: 2` means up to 3 calls.
 *     `retries: 0` means exactly one call.
 *  3. The first success resolves and stops the loop.
 *  4. If every attempt fails, reject with the LAST error.
 *  5. Wait `delay` ms BETWEEN attempts — not before the first one.
 *  6. `fn` is called with the attempt number, starting at 0.
 *
 * `await` inside `try` is the whole trick — without the `await`, the `catch`
 * never sees a rejected promise and the loop exits on the first attempt.
 */
export async function retry(fn, options) {
  throw new Error('not implemented')
}
