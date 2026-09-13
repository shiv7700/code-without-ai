/**
 * LEVEL 52 — bucket a list
 *
 * Topics: reduce · object keys · prototype pollution
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy
 *
 * @param {Array} list
 * @param {Function|string} keyFor  a function, or a property name
 * @returns {object} key → the items with that key
 *
 * Rules:
 *  1. `keyFor` may be a function called with the item, or a property name to
 *     read off it.
 *  2. Items keep their input order inside each group.
 *  3. An empty list gives an object with no keys.
 *  4. The grouped arrays are new — never the input array itself.
 *  5. A key of `'toString'` or `'constructor'` must group like any other.
 *
 * Rule 5 is the interesting one. `if (!out[key]) out[key] = []` looks correct
 * until a key collides with something on `Object.prototype`, which is already
 * there and already truthy. Either start from an object with no prototype, or
 * check for the key properly.
 */
export function groupBy(list, keyFor) {
  throw new Error('not implemented')
}
