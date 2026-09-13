/**
 * LEVEL 50 — the helper in every component you write
 *
 * Topics: variadic args · type checks · recursion
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 *
 * @param {...*} args
 * @returns {string} a class attribute
 *
 * Rules:
 *  1. Strings and truthy numbers are used as-is, joined by ONE space.
 *  2. Falsy values — `false`, `null`, `undefined`, `''`, `0` — contribute
 *     nothing, and must not leave a double space or a trailing space behind.
 *  3. An object contributes each key whose value is truthy.
 *  4. An array is flattened, and may hold anything this function accepts,
 *     nested as deep as it likes.
 *  5. No arguments gives `''`.
 *
 * You have imported this from a package a hundred times. It is thirteen lines,
 * and rule 4 makes it recursive.
 */
export function classNames(...args) {
  throw new Error('not implemented')
}
