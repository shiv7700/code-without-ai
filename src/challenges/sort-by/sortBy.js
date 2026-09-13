/**
 * Sort without wrecking the array you were handed
 *
 * Topics: comparators · stable sort · mutation
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
 *
 * @param {Array} list
 * @param {Function} keyFor  called with the item, returns the value to sort on
 * @returns {Array} a new sorted array
 *
 * Rules:
 *  1. The input is never modified. The result is a new array.
 *  2. Sorted ascending by the key. Numbers compare as numbers.
 *  3. Items whose keys are equal keep the order they had in the input.
 *  4. An item whose key is `undefined` sorts after everything else, however
 *     many of them there are.
 *
 * Rule 1 is the one that bites in React — `list.sort()` reorders the array in
 * state, so the next render compares it against itself and nothing updates.
 * Rule 2 is the other half of the same line: `sort()` with no comparator
 * stringifies, and `10` sorts before `9`. Rule 4 needs a real branch, because
 * `undefined < 2` and `undefined > 2` are both false and the pair never moves.
 */
export function sortBy(list, keyFor) {
  throw new Error('not implemented')
}
