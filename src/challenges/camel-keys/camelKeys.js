/**
 * Rename every key in a payload, all the way down
 *
 * Topics: recursion · typeof null · arrays are objects
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 *
 * @param {*} value  an object, an array, or anything else
 * @returns {*} a new structure with converted keys
 *
 * Rules:
 *  1. `camelKeys` turns `user_name` into `userName`; `snakeKeys` reverses it.
 *  2. Nested objects are converted at every depth.
 *  3. An array stays an array. The objects inside it are converted; the array's
 *     own indices are not keys.
 *  4. Only keys are touched. A value of `'in_progress'` stays `'in_progress'`.
 *  5. Anything that is not a plain object or an array is a value and comes back
 *     by reference — a `Date`, a `null`, a number.
 *  6. Neither input is modified.
 *
 * Rules 3 and 5 are the same bug wearing two hats: `typeof value === 'object'`
 * is true for an array AND true for `null`. Run `Object.entries` over an array
 * and rebuild with `{}` and the list comes back as `{ '0': …, '1': … }` —
 * which survives `JSON.stringify` looking almost right and breaks `.map` three
 * components later. Check what it actually is before you recurse into it.
 */
export function camelKeys(value) {
  throw new Error('not implemented')
}

export function snakeKeys(value) {
  throw new Error('not implemented')
}
