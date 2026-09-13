/**
 * Two halves of the same idea — keep these keys, or keep all the others
 *
 * Topics: own vs inherited keys · object copying · hasOwn
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 *
 * @param {object} source
 * @param {string[]} keys
 * @returns {object} a new object
 *
 * Rules:
 *  1. `pick` returns only the listed keys; `omit` returns everything except them.
 *  2. A listed key the source does not have is absent from the result — not
 *     present with a value of `undefined`.
 *  3. A key that IS there holding `undefined` is still picked.
 *  4. Only the source's own keys count. Anything reached through the prototype
 *     is neither picked nor copied.
 *  5. The source is never modified, and the result is always a new object.
 *
 * Rules 2, 3 and 4 all turn on the same question: what does "has this key"
 * mean. `source[key] !== undefined` gets rule 3 wrong, `key in source` gets
 * rule 4 wrong, and `for...in` walks the prototype chain on the way out. One
 * of them is the right check for both functions.
 */
export function pick(source, keys) {
  throw new Error('not implemented')
}

export function omit(source, keys) {
  throw new Error('not implemented')
}
