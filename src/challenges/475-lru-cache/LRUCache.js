/**
 * LEVEL 51 — a cache that forgets the right thing
 *
 * Topics: Map insertion order · eviction · recency
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
 *
 * API:
 *   new LRUCache(capacity)
 *   get(key)          the value, or undefined
 *   put(key, value)   store, evicting if the cache is full
 *   size              how many entries are held
 *
 * Rules:
 *  1. `size` never exceeds `capacity`.
 *  2. When a `put` would overflow, drop the LEAST recently used entry.
 *  3. `get` counts as a use. So does `put` on a key that already exists.
 *  4. Overwriting an existing key updates it — it does not add a second entry.
 *  5. A missing key reads as `undefined`, and storing `undefined` is still a
 *     real entry that takes up space.
 *
 * A `Map` remembers insertion order and lets you delete by key. Delete-then-set
 * moves a key to the end. That is the entire algorithm — no linked list needed.
 */
export class LRUCache {
  constructor(capacity) {
    throw new Error('not implemented')
  }

  get(key) {
    throw new Error('not implemented')
  }

  put(key, value) {
    throw new Error('not implemented')
  }
}
