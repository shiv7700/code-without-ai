/**
 * Freeze everything reachable, and come back from the ones that point at you
 *
 * Topics: Object.freeze · recursion · cycles · WeakSet
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
 *
 * @param {*} value
 * @returns {*} the same value, frozen through
 *
 * Rules:
 *  1. Returns the value it was given, not a copy.
 *  2. The object, and every object and array reachable from it, comes back
 *     frozen.
 *  3. Primitives, null and undefined pass straight through.
 *  4. A cycle must not hang it — an object holding itself is fine.
 *  5. A Map or a Set is frozen, and so is everything inside it. Its contents
 *     are not properties, so the walk you wrote for objects does not find them.
 *  6. Two objects pointing at the same third object do not visit it twice.
 *
 * Rules 4 and 6 are one problem. Recursion with no memory of where it has been
 * either loops forever or re-walks a shared branch once per route into it, and
 * a real state tree has plenty of both. Rule 5 is the other half: `Object.freeze`
 * on a Map returns happily and freezes nothing that matters, so a collection
 * needs a branch of its own before the property walk.
 */
export function deepFreeze(value) {
  throw new Error('not implemented')
}
