/**
 * LEVEL 40 — structural equality
 *
 * Topics: recursion · Object.is · key sets
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 *
 * Rules:
 *  1. Primitives compare by value, but `NaN` equals `NaN` and `0` does NOT
 *     equal `-0`. There is exactly one built-in that already does both.
 *  2. Objects are equal when they have the same keys and every value is deeply
 *     equal. Key ORDER is irrelevant; the number of keys is not.
 *  3. `{ a: 1 }` and `{ a: 1, b: undefined }` are NOT equal. `b` exists.
 *  4. An array is never equal to a plain object, even with matching indices.
 *  5. Dates compare by their time value.
 *
 * Rule 3 is why `Object.keys(a).every(...)` alone is not enough — you have to
 * compare both key counts, and the presence of the key, not just its value.
 */
export function deepEqual(a, b) {
  throw new Error('not implemented')
}
