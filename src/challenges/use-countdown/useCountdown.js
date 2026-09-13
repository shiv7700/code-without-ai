/**
 * Counting down, with the clock handed in from outside
 *
 * Topics: updater form · clamping · useRef
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 * Read:   https://react.dev/reference/react/useRef
 *
 * @param {number} from  where the count starts
 * @returns {{left: number, done: boolean, tick: Function, reset: Function}}
 *
 * There is no timer in here. `tick()` is the clock, and whoever uses the hook
 * decides what drives it — a `setInterval`, a button, or a test.
 *
 * Rules:
 *  1. `left` starts at `from`, and `done` is true exactly when `left` is 0
 *  2. `tick()` takes one off
 *  3. it stops at 0 — no negative numbers, however many ticks turn up
 *  4. `reset()` goes back to `from` as it is NOW, not as it was on mount
 *  5. `tick` and `reset` keep their identity across re-renders
 *  6. three ticks in one handler take three off, and still stop at 0
 *
 * Rules 5 and 6 together rule out the version that reads `left` and subtracts.
 * Rule 4 rules out capturing `from` once and forgetting about it. One of them
 * wants the closure and the other refuses it, which is the same shape as
 * `useToggleWithReset` — with the answer going the other way.
 */
export function useCountdown(from) {
  throw new Error('not implemented')
}
