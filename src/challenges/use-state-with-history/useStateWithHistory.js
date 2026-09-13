/**
 * Every value it has held, up to a point
 *
 * Topics: updater form · derived state · capped history
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
 *
 * @param {*} initial
 * @param {number} capacity  how many entries to keep, default 10
 * @returns {[*, Function, Array]}  [value, setValue, history]
 *
 * Rules:
 *  1. `history` starts as `[initial]`, oldest first, and the current value is
 *     always its last entry
 *  2. every `setValue` appends
 *  3. once there are `capacity` entries the oldest falls off the front
 *  4. `setValue` takes the updater form, and what gets recorded is whatever
 *     the updater returned
 *  5. `setValue` keeps its identity across re-renders, and respects the
 *     newest `capacity`
 *  6. two `setValue` calls in one handler record both
 *
 * Rule 6 is where the two-piece version comes apart. Value in one `useState`,
 * history in another, each call reading the `value` from this render — and the
 * second call records exactly what the first one did, then overwrites it.
 */
export function useStateWithHistory(initial, capacity = 10) {
  throw new Error('not implemented')
}
