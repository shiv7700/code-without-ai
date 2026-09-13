/**
 * A Map in state, which is not at all the same as a Map you mutate
 *
 * Topics: Map · state identity · updater form
 * Read:   https://react.dev/learn/updating-objects-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 *
 * @param {Iterable} initial  anything `new Map()` takes, default empty
 * @returns {{map: Map, set: Function, remove: Function, clear: Function}}
 *
 * Rules:
 *  1. `map` is a real `Map` — `get`, `has` and `size` all work on it
 *  2. `set(key, value)`, `remove(key)` and `clear()` do the obvious things
 *  3. each of them replaces the Map rather than editing it, so the one you
 *     were holding a moment ago still says what it said
 *  4. the three functions keep their identity across re-renders
 *  5. `set('a', 1); set('b', 2);` in one handler lands both
 *
 * `map.set(k, v)` and then handing that same Map back is the trap, and it is
 * a quiet one. It is the object React already has, so it compares equal to
 * itself, no render happens, and the entry sits in state where nobody can see
 * it — until some unrelated render finally reveals it.
 */
export function useMap(initial) {
  throw new Error('not implemented')
}
