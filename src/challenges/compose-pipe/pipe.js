/**
 * Glue functions together, in both directions
 *
 * Topics: reduce · higher-order functions · identity
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
 *
 * @param {...Function} fns
 * @returns {Function} one function that runs all of them
 *
 * Rules:
 *  1. `pipe(f, g)(x)` is `g(f(x))` — left to right, the reading order.
 *  2. `compose(f, g)(x)` is `f(g(x))` — right to left, the maths order.
 *  3. The FIRST function to run gets all the arguments. Every one after it
 *     gets exactly one: the previous return value.
 *  4. With no functions, the result is identity — the first argument, the same
 *     reference, comes back out.
 *  5. The returned function can be called any number of times.
 *
 * Rule 4 is the one that is quietly wrong everywhere. `fns.reduce((acc, fn) =>
 * fn(acc), x)` looks like it handles the empty case, and it does — but only
 * because you already had `x`; write it with no seed and the empty case
 * throws. Rule 3 is the other half: a seeded reduce has one argument to start
 * with, and the first function may want three. One of the two is the seed.
 */
export function pipe(...fns) {
  throw new Error('not implemented')
}

export function compose(...fns) {
  throw new Error('not implemented')
}
