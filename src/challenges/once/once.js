/**
 * Runs the first time and never again
 *
 * Topics: closures · caching a result · try/catch
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
 *
 * @param {Function} fn
 * @returns {Function} the same signature, but `fn` runs at most once
 *
 * Rules:
 *  1. The first call runs `fn` with whatever arguments it was given.
 *  2. Every later call returns the first result. `fn` is not called again —
 *     not even with different arguments.
 *  3. A first result of `undefined`, `0`, `''` or `false` is a result. It is
 *     remembered like any other.
 *  4. If the first call throws, that error is thrown again by every later
 *     call, and `fn` is still never called a second time.
 *
 * Rules 3 and 4 are the two ways this goes wrong, and they are the same
 * mistake: using the stored result to decide whether the call has happened.
 * `if (!result)` runs `fn` again forever when it returns `undefined`, and a
 * `throw` that escapes before you set anything leaves the wrapper looking
 * untouched — so the "run once" guarantee quietly becomes "retry on failure".
 */
export function once(fn) {
  throw new Error('not implemented')
}
