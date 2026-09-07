/**
 * LEVEL 73 — a Set that React notices
 *
 * Topics: immutable updates of a Set · useCallback · useMemo
 * Read:   https://react.dev/learn/updating-objects-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * @param {Iterable} [initial]
 * @returns {{set, size, has, add, remove, toggle, clear}}
 *
 * Rules:
 *  1. Starts holding whatever it was given, or nothing.
 *  2. `add`, `remove`, `toggle` and `clear` do what they say. Adding twice or
 *     removing something absent changes nothing.
 *  3. `has` and `size` reflect the current contents.
 *  4. Every change produces a NEW Set. `set.add(x)` on the state object mutates
 *     it in place, the reference does not change, and React does not re-render.
 *  5. The four action functions keep their identity across renders.
 *
 * Rule 4 is why this hook exists at all. Rule 5 is why the actions cannot close
 * over the current Set — they go through the updater form instead.
 */
export function useSet(initial) {
  throw new Error('not implemented')
}
