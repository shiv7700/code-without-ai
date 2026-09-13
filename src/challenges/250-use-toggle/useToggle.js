/**
 * LEVEL 4 — your first custom hook
 *
 * Topics: custom hooks · useCallback · updater form
 * Read:   https://react.dev/learn/reusing-logic-with-custom-hooks
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {boolean} initial  default false
 * @returns {[boolean, Function, Function]}  [on, toggle, setOn]
 *
 * Rules:
 *  1. `toggle()` flips the value
 *  2. `setOn(true|false)` sets it directly
 *  3. `toggle` and `setOn` have STABLE identity — same function across re-renders.
 *     (That is what lets them go into a dep array without causing loops.)
 *  4. `toggle()` must work when called twice in a row inside the same handler:
 *     toggle(); toggle();  → back where it started, not flipped once.
 *     Reading `on` from the closure will fail this. Read the docs for the
 *     "updater function" form of a state setter.
 */
export function useToggle(initial = false) {
  throw new Error('not implemented')
}
