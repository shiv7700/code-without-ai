/**
 * One pass, two buckets
 *
 * Topics: reduce · predicates · one pass
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 *
 * @param {Array} list
 * @param {Function} predicate  called with (item, index)
 * @returns {[Array, Array]} the ones that passed, then the ones that did not
 *
 * Rules:
 *  1. Always returns two arrays, even for an empty list.
 *  2. Both halves keep the order the items had in the input.
 *  3. The predicate is called with the item and its index in the INPUT.
 *  4. The predicate runs exactly once per item.
 *  5. The input is never modified.
 *
 * Rule 4 is the trap, and `filter` twice — once with the predicate, once with
 * its negation — breaks it silently. The tests still pass; then someone hands
 * it a predicate that logs, counts or hits a cache, and every number is
 * doubled. Two filters also disagree about the index once you read it.
 */
export function partition(list, predicate) {
  throw new Error('not implemented')
}
