/**
 * State that refuses to hold nothing
 *
 * Topics: nullish vs falsy · useRef · stable setter
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 *
 * @param {*} defaultValue  what it falls back to
 * @param {*} initial       the starting value, treated like any other
 * @returns {[*, Function]}  [value, setValue]
 *
 * Rules:
 *  1. setting `null` or `undefined` gives `defaultValue` back instead
 *  2. every other value is kept as it is — `0`, `''` and `false` included
 *  3. `initial` goes through the same treatment
 *  4. `setValue` takes the updater form, and the updater is handed the value
 *     you can actually see, never the null underneath it
 *  5. `setValue` keeps its identity across re-renders, and still uses the
 *     newest `defaultValue` — a later fallback is the current one, not the
 *     one from the first render
 *
 * `||` and a default parameter both look like the answer and neither is: one
 * eats the falsy values rule 2 protects, the other never fires for `null` at
 * all. Then rules 4 and 5 leave the setter needing a value it cannot close
 * over without losing its identity.
 */
export function useDefault(defaultValue, initial) {
  throw new Error('not implemented')
}
