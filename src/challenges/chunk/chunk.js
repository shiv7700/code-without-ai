/**
 * Cut a list into fixed-size groups
 *
 * Topics: loops · slice · guarding an argument
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
 *
 * @param {Array} list
 * @param {number} [size=1]  how many items go in each group
 * @returns {Array[]} a new array of new arrays
 *
 * Rules:
 *  1. Items keep their order, and every item lands in exactly one group.
 *  2. The final group is short when the length does not divide evenly.
 *  3. A size bigger than the list gives a single group holding everything.
 *  4. A size below one — `0`, a negative, `NaN` — returns an empty array.
 *  5. The input is never modified, and no group is the input array itself.
 *
 * Rule 4 is the whole exercise. `for (i = 0; i < list.length; i += size)` with
 * a size of `0` never advances, and the tab is gone before the test reports.
 * Work out what the guard has to reject before you write the loop — `size < 1`
 * is not the same check as `!size`, and neither one catches `NaN` by accident.
 */
export function chunk(list, size = 1) {
  throw new Error('not implemented')
}
