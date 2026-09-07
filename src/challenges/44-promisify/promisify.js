/**
 * LEVEL 44 — callbacks in, promises out
 *
 * Topics: higher-order functions · rest args · the error-first convention
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
 *
 * @param {Function} fn  takes any arguments, then a callback `(error, value)`
 * @returns {Function} the same function, returning a promise instead
 *
 * Rules:
 *  1. The wrapper takes the same arguments MINUS the callback, and appends the
 *     callback itself.
 *  2. `callback(null, value)` resolves with `value`.
 *  3. `callback(error)` rejects with `error`. A null or undefined first
 *     argument is success — only a truthy one is a failure.
 *  4. Nothing runs until the wrapper is called.
 *  5. The wrapper is reusable — calling it twice starts two independent runs,
 *     no shared state between them.
 *
 * Rule 5 is the trap: build the promise inside the wrapper, not next to it.
 */
export function promisify(fn) {
  throw new Error('not implemented')
}
