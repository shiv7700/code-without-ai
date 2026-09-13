/**
 * Layer one config on top of another
 *
 * Topics: recursion · immutability · plain objects
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 *
 * @param {object} target  the defaults
 * @param {object} source  the overrides
 * @returns {object} a new object
 *
 * Rules:
 *  1. Two objects at the same key are merged, one level further down.
 *  2. Anything else at the same key is replaced by the source's value.
 *  3. Arrays are values. `['a','b']` under `['c']` gives `['c']`.
 *  4. A source value of `undefined` is a key that was never set — the target's
 *     value stays.
 *  5. A source value of `null` is a decision, and it replaces.
 *  6. Neither input is modified, at any depth.
 *
 * Rules 3 and 4 are the two a five-line version gets wrong, and both come from
 * the same test. `typeof value === 'object'` is true for an array, which is
 * how `tags` ends up merged index-by-index; and the shortcut that skips falsy
 * source values cannot tell rule 4 from rule 5. Rule 6 is the third: recursing
 * into `target[key]` and writing to it merges into the caller's defaults, so
 * the second call sees the first call's overrides.
 */
export function deepMerge(target, source) {
  throw new Error('not implemented')
}
