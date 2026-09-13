/**
 * Numbers up and down, and the functions that do it staying put
 *
 * Topics: useState · useCallback · updater form
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {number} initial  default 0
 * @returns {{count: number, inc: Function, dec: Function, reset: Function}}
 *
 * Rules:
 *  1. `inc()` adds one, `dec()` takes one off, `reset()` goes back to `initial`
 *  2. `inc`, `dec` and `reset` keep the same identity across every re-render
 *  3. `inc(); inc();` in one handler lands on +2, not +1
 *  4. nothing is clamped — it goes negative
 *
 * Rules 2 and 3 pull against each other the moment you reach for the closure.
 * A function that reads `count` needs `count` in its dep array to stay correct,
 * and once it is in there the stable identity is gone.
 */
export function useCounter(initial = 0) {
  throw new Error('not implemented')
}
