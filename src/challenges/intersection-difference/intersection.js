/**
 * What both lists have, and what only the first one has
 *
 * Topics: Set · identity by key · optional arguments
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 *
 * @param {Array} list
 * @param {Array} other
 * @param {Function} [keyFor]  how to identify an item; without it, the item is its own key
 * @returns {Array} a new array
 *
 * Rules:
 *  1. Order comes from the first list, always.
 *  2. The items that come out are the first list's items — not the second's,
 *     even when they compare equal.
 *  3. A repeat in the first list appears at most once in the result.
 *  4. Items are matched by value. `NaN` matches `NaN`.
 *  5. With `keyFor`, BOTH lists are read through it.
 *  6. Neither input is modified.
 *
 * Rule 5 is the one that gets skipped. It is easy to compute keys for the list
 * you are looping over and then ask `other.includes(item)` — which compares
 * the raw objects, finds nothing, and hands back an empty intersection that
 * looks like a data problem rather than a bug. Rule 2 is how you tell the two
 * apart at a glance: check which array the surviving object came from.
 */
export function intersection(list, other, keyFor) {
  throw new Error('not implemented')
}

export function difference(list, other, keyFor) {
  throw new Error('not implemented')
}
