/**
 * LEVEL 41 — unwrap the nesting
 *
 * Topics: recursion · arrays · depth
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
 *
 * @param {Array} list
 * @param {number} [depth=Infinity]  how many levels to unwrap
 * @returns {Array} a new array
 *
 * Rules:
 *  1. By default, flatten all the way down, however deep it goes.
 *  2. `depth` limits how many levels are unwrapped. `depth: 1` leaves the
 *     third level alone.
 *  3. `depth: 0` still returns a NEW array — a shallow copy, not the input.
 *  4. Empty arrays contribute nothing.
 *  5. Anything that is not an array is a value, including objects and `null`.
 *  6. The input is never modified.
 *
 * `Array.prototype.flat` already does this. Write it yourself — the point is
 * the recursion carrying a decreasing depth, which comes back in tree walks.
 */
export function flatten(list, depth = Infinity) {
  throw new Error('not implemented')
}
