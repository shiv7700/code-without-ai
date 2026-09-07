/**
 * LEVEL 54 — write into a nested object without mutating it
 *
 * Topics: immutability · structural sharing · recursion
 * Read:   https://react.dev/learn/updating-objects-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 *
 * @param {object|Array} source
 * @param {string|Array} path   'a.b.c', 'list[0].id', or ['a', 'b']
 * @param {*} value
 * @returns {object|Array} a new structure with `path` set to `value`
 *
 * Rules:
 *  1. `source` is never modified.
 *  2. Every object ON the path is copied — the returned object, and each one
 *     below it, are new references.
 *  3. Everything OFF the path is shared, not copied. `next.other` must be the
 *     very same object as `source.other`.
 *  4. Arrays stay arrays.
 *  5. Missing objects along the path are created. A numeric key creates an
 *     array; anything else creates an object.
 *
 * Rules 2 and 3 together are structural sharing — the reason React can compare
 * by reference. Deep-cloning the whole thing satisfies rule 1 and fails rule 3,
 * and then `memo` re-renders everything.
 */
export function set(source, path, value) {
  throw new Error('not implemented')
}
