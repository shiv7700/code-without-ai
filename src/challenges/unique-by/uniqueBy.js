/**
 * Deduplicate by something other than the item itself
 *
 * Topics: Set · SameValueZero · NaN
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
 *
 * @param {Array} list
 * @param {Function} keyFor  called with the item, returns its identity
 * @returns {Array} a new array
 *
 * Rules:
 *  1. Of any group sharing a key, the FIRST one survives.
 *  2. The survivors keep their input order.
 *  3. Keys are compared by value, not coerced. `1` and `'1'` are two keys.
 *  4. Two items both keyed `NaN` are duplicates — only one comes out.
 *  5. The input is never modified.
 *
 * Rule 4 is the one to look at. `NaN === NaN` is false, so `indexOf`,
 * `includes` and a hand-rolled `some(k => k === key)` do not all agree about
 * it — one of those three is the odd one out. Rule 3 then rules out the other
 * obvious store, since object keys are strings before you ever read them back.
 */
export function uniqueBy(list, keyFor) {
  throw new Error('not implemented')
}
