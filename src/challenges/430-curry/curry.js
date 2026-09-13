/**
 * LEVEL 36 — a function that collects its arguments before it runs
 *
 * Topics: closures · rest args · recursion
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length
 *
 * @param {Function} fn
 * @returns {Function} the same function, but it may be fed in instalments
 *
 * Rules:
 *  1. `curry(add3)(1, 2, 3)`, `curry(add3)(1)(2)(3)` and `curry(add3)(1, 2)(3)`
 *     all return the same thing.
 *  2. "Enough arguments" means `fn.length` of them — that is how many named
 *     parameters the function declares.
 *  3. A partial application is a value. Handing it around and calling it twice
 *     with different arguments must not leak one call's arguments into the other.
 *  4. A function declaring no parameters runs on the first call.
 *
 * Rule 3 is the whole exercise. If you collect arguments by pushing into one
 * array that lives outside the returned function, two branches share it.
 */
export function curry(fn) {
  throw new Error('not implemented')
}
