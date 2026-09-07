/**
 * LEVEL 45 — remember what you already worked out
 *
 * Topics: closures · Map · cache keys
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
 *
 * @param {Function} fn
 * @param {Function} [keyFor]  turns the arguments into a cache key
 * @returns {Function} the same function, called at most once per distinct key
 *
 * Rules:
 *  1. Same arguments — the underlying function runs once, the second call is
 *     served from the cache.
 *  2. Different arguments run it again. Argument order is part of the key:
 *     `(1, 2)` and `(2, 1)` are different calls.
 *  3. Objects are compared by CONTENTS, not identity — two separately built
 *     `{ name: 'ada' }` are the same call. Default `keyFor` handles that.
 *  4. A cached `undefined` is still a hit. `if (cache[key])` gets this wrong,
 *     and so does `if (cache.get(key))`.
 *  5. Each memoized function owns its own cache.
 *  6. A caller-supplied `keyFor` overrides how the key is built.
 *
 * Rule 4 is why the cache wants a `Map` and a `.has()` check. Rule 5 is why the
 * cache is created inside `memoize`, not at module scope.
 */
export function memoize(fn, keyFor) {
  throw new Error('not implemented')
}
