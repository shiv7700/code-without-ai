/**
 * LEVEL 39 — a copy that shares nothing
 *
 * Topics: recursion · reference vs value · cycles
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 *
 * @param {*} value
 * @returns {*} a copy that shares no object with the original
 *
 * Rules:
 *  1. Primitives come back as they are.
 *  2. Plain objects and arrays are copied all the way down. Mutating the copy
 *     must never be visible in the original. An array must stay an array.
 *  3. A `Date` is copied into a new `Date` with the same time.
 *  4. Functions are shared, not cloned.
 *  5. A cycle (`obj.self = obj`) must not recurse forever — and the clone's
 *     `self` must point at the CLONE, not at the original.
 *  6. If the same object appears twice in the input, it must appear as the same
 *     single object twice in the output.
 *
 * Rules 5 and 6 are the same rule: remember what you have already cloned, keyed
 * by the original. Rule 6 is the one that catches people who only guard 5.
 */
export function deepClone(value) {
  throw new Error('not implemented')
}
