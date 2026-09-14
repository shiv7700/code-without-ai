/**
 * Everyone who asked gets an answer, and the answer comes from one call
 *
 * Topics: debounce · promises · collecting callers
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout
 *
 * @param {Function} fn    returns a value or a promise
 * @param {number} [wait]  quiet time before it runs
 * @returns {Function} the debounced version, which always returns a promise
 *
 * Rules:
 *  1. Calls made inside the quiet window collapse into ONE call of `fn`, and
 *     each new call restarts that window.
 *  2. `fn` is called with the arguments of the LAST call.
 *  3. Every caller that was waiting resolves with that single result. Nobody
 *     is left hanging and nobody is rejected for having been superseded.
 *  4. If that call rejects, every waiting caller gets the same rejection.
 *  5. Once it has run, the next call starts a fresh window and calls `fn` again.
 *  6. `fn` does not run before the window is up.
 *
 * Rule 3 is the trap, and it is a leak rather than a crash. The obvious version
 * makes a new promise per call and keeps only the newest pair of resolvers, so
 * the three components that asked first are awaiting something that will never
 * settle — no error, no rejection, no timeout, just three spinners that never
 * come down. What the window collects is not one caller, it is all of them.
 */
export function debouncePromise(fn, wait = 0) {
  throw new Error('not implemented')
}
