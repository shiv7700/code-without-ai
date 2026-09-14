/**
 * Where it is, or where it would have gone
 *
 * Topics: binary search · lower bound · encoding two answers in one number
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
 *
 * @param {Array} sorted   already in ascending order
 * @param {*} target
 * @param {(a, b) => number} [compare]  defaults to comparing with < and >
 * @returns {number} the index, or a negative encoding of the insertion point
 *
 * Rules:
 *  1. Found: the index of the FIRST element that compares equal, even when
 *     several do.
 *  2. Not found: `-insertionPoint - 1`, where the insertion point is the index
 *     the target would sit at to keep the array sorted. So `~result` reads it
 *     back, and any negative answer means "not here".
 *  3. An empty array gives -1. A target below everything gives -1 too — those
 *     are the same answer, insertion point 0.
 *  4. A custom `compare` is used for every comparison, including the equality
 *     check.
 *  5. It halves the range. On 1024 elements it compares a dozen times, not a
 *     thousand — the spec counts.
 *  6. The array is never modified.
 *
 * Rule 1 is where the textbook version comes apart. The middle of a run of
 * equal values is a legitimate hit, so the moment you return on equality you
 * return whichever duplicate the halving happened to land on. Narrowing until
 * the range is empty, rather than stopping at the first match, answers both
 * rules 1 and 2 with the same variable.
 */
export function binarySearch(sorted, target, compare) {
  throw new Error('not implemented')
}
