/**
 * How many of each
 *
 * Topics: reduce · object keys · prototype pollution
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
 *
 * @param {Array} list
 * @param {Function} keyFor  called with the item, returns the bucket name
 * @returns {object} key → how many items had it
 *
 * Rules:
 *  1. Every count is a number, and the counts add up to the length of the list.
 *  2. A key nothing landed on is absent — never a `0`.
 *  3. An empty list gives an object with no keys.
 *  4. A key of `'constructor'`, `'toString'` or `'__proto__'` counts like any
 *     other key.
 *  5. The input is never modified.
 *
 * Rule 4 is the exercise, and it fails differently from the same bug in
 * `groupBy`. `out[key] = (out[key] || 0) + 1` reads `Object.prototype`'s own
 * `constructor` — a function — so the `||` never fires and the count comes out
 * `NaN` rather than wrong-by-one. Nothing throws; the number is just not a number.
 */
export function countBy(list, keyFor) {
  throw new Error('not implemented')
}
