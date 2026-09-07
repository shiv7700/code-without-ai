/**
 * LEVEL 68 — a bounded counter with a name
 *
 * Topics: clamping · useCallback · stable identities
 * Read:   https://react.dev/reference/react/useCallback
 * Read:   https://react.dev/reference/react/useMemo
 *
 * @param {number} total  how many steps there are
 * @returns {{step, next, prev, goTo, reset, isFirst, isLast}}
 *
 * Rules:
 *  1. `step` is 1-based and starts at 1.
 *  2. `next` stops at `total`; `prev` stops at 1. Neither wraps.
 *  3. `goTo(n)` jumps, and ignores anything outside 1…total.
 *  4. `isFirst` and `isLast` are derived, not stored. With `total: 1` both are
 *     true at once.
 *  5. `reset` returns to 1.
 *  6. `next`, `prev`, `goTo` and `reset` keep the SAME identity across renders.
 *     A component receiving them in props must not re-render because the step
 *     changed.
 *
 * Rule 6 is the point of this one. It is also why `next` reads the current step
 * through the updater form rather than closing over `step` — closing over it
 * would force a new function every render.
 */
export function useStep(total) {
  throw new Error('not implemented')
}
