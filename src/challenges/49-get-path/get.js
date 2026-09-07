/**
 * LEVEL 49 — read a nested value without exploding
 *
 * Topics: string parsing · loops over keys · undefined vs null
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
 *
 * @param {object} source
 * @param {string|Array} path   'user.name', 'list[0].id', or ['user', 'name']
 * @param {*} [fallback]
 * @returns {*}
 *
 * Rules:
 *  1. Dotted paths walk down the object.
 *  2. Bracket indices work, on their own or mixed in: `list[0].id`.
 *  3. An array path is taken as the already-split keys.
 *  4. A missing key returns `fallback` (which is `undefined` if not passed).
 *  5. Hitting `null` or `undefined` part-way down returns `fallback` — it must
 *     never throw.
 *  6. A value that IS `null` is a hit. `get(o, 'a.b')` where `b` is `null`
 *     returns `null`, NOT the fallback.
 *
 * Rule 6 is the one that separates this from `??`. Only `undefined` means
 * "not there".
 */
export function get(source, path, fallback) {
  throw new Error('not implemented')
}
